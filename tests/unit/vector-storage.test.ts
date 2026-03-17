import { describe, expect, it, beforeEach } from "vitest";
import { VectorStorage } from "../../src/lib/vector-storage/storage";
import type { VectorDocument } from "../../src/lib/vector-storage/types";
import { DEFAULT_DIMENSION } from "../../src/lib/vector-storage/types";

function createTestEmbedding(seed = 0): number[] {
  const embedding: number[] = [];
  for (let i = 0; i < DEFAULT_DIMENSION; i++) {
    embedding.push(Math.sin(seed + i * 0.1) * 0.5 + 0.5);
  }
  return embedding;
}

function createTestDocument(
  id: string,
  content: string,
  embeddingSeed = 0,
  metadata: Record<string, unknown> = {},
): VectorDocument {
  return {
    id,
    content,
    embedding: createTestEmbedding(embeddingSeed),
    metadata,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

describe("VectorStorage", () => {
  let storage: VectorStorage;

  beforeEach(async () => {
    storage = new VectorStorage({
      persistPath: ":memory:",
    });
    await storage.initialize();
  });

  describe("initialization", () => {
    it("should initialize successfully", async () => {
      const stats = await storage.getStats();
      expect(stats.documentCount).toBe(0);
      expect(stats.dimension).toBe(DEFAULT_DIMENSION);
      expect(stats.backend).toBe("memory");
    });

    it("should throw error if not initialized", async () => {
      const uninitializedStorage = new VectorStorage();
      await expect(uninitializedStorage.insert(createTestDocument("1", "test"))).rejects.toThrow(
        "VectorStorage not initialized",
      );
    });
  });

  describe("insert", () => {
    it("should insert a single document", async () => {
      const doc = createTestDocument("doc1", "Hello world");
      await storage.insert(doc);

      const stats = await storage.getStats();
      expect(stats.documentCount).toBe(1);

      const retrieved = await storage.getById("doc1");
      expect(retrieved).not.toBeNull();
      expect(retrieved?.content).toBe("Hello world");
    });

    it("should reject document with wrong embedding dimension", async () => {
      const doc: VectorDocument = {
        id: "doc1",
        content: "Test",
        embedding: [1, 2, 3],
        metadata: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await expect(storage.insert(doc)).rejects.toThrow("Embedding dimension mismatch");
    });

    it("should auto-populate timestamps if not provided", async () => {
      const doc: VectorDocument = {
        id: "doc1",
        content: "Test",
        embedding: createTestEmbedding(),
        metadata: {},
        createdAt: undefined as unknown as number,
        updatedAt: undefined as unknown as number,
      };

      await storage.insert(doc);
      const retrieved = await storage.getById("doc1");
      expect(retrieved?.createdAt).toBeDefined();
      expect(retrieved?.updatedAt).toBeDefined();
    });
  });

  describe("insertBatch", () => {
    it("should insert multiple documents", async () => {
      const docs = [
        createTestDocument("doc1", "First document", 1),
        createTestDocument("doc2", "Second document", 2),
        createTestDocument("doc3", "Third document", 3),
      ];

      const result = await storage.insertBatch(docs);
      expect(result.success).toBe(true);
      expect(result.insertedCount).toBe(3);

      const stats = await storage.getStats();
      expect(stats.documentCount).toBe(3);
    });

    it("should report partial failures", async () => {
      const docs = [
        createTestDocument("doc1", "Valid document", 1),
        {
          id: "doc2",
          content: "Invalid document",
          embedding: [1, 2, 3],
          metadata: {},
          createdAt: Date.now(),
          updatedAt: Date.now(),
        } as VectorDocument,
        createTestDocument("doc3", "Another valid document", 3),
      ];

      const result = await storage.insertBatch(docs);
      expect(result.success).toBe(false);
      expect(result.insertedCount).toBe(2);
      expect(result.errors).toHaveLength(1);
      expect(result.errors?.[0].id).toBe("doc2");
    });
  });

  describe("search", () => {
    beforeEach(async () => {
      const docs = [
        createTestDocument("doc1", "Machine learning basics", 1, { category: "tech" }),
        createTestDocument("doc2", "Cooking recipes", 2, { category: "food" }),
        createTestDocument("doc3", "Deep learning fundamentals", 1.1, { category: "tech" }),
        createTestDocument("doc4", "Italian pasta dishes", 2.1, { category: "food" }),
      ];
      await storage.insertBatch(docs);
    });

    it("should return results sorted by similarity", async () => {
      const query = createTestEmbedding(1);
      const results = await storage.search(query, { k: 4 });

      expect(results.length).toBe(4);
      expect(results[0].document.id).toBe("doc1");
      expect(results[0].score).toBeGreaterThan(0.99);
    });

    it("should respect k parameter", async () => {
      const query = createTestEmbedding(1);
      const results = await storage.search(query, { k: 2 });

      expect(results.length).toBe(2);
    });

    it("should filter by metadata", async () => {
      const query = createTestEmbedding(1);
      const results = await storage.search(query, {
        k: 10,
        filter: { category: "tech" },
      });

      expect(results.length).toBe(2);
      results.forEach((r) => {
        expect(r.document.metadata.category).toBe("tech");
      });
    });

    it("should respect minScore parameter", async () => {
      const query = createTestEmbedding(100);
      const results = await storage.search(query, {
        k: 10,
        minScore: 0.5,
      });

      results.forEach((r) => {
        expect(r.score).toBeGreaterThanOrEqual(0.5);
      });
    });

    it("should reject query with wrong dimension", async () => {
      await expect(storage.search([1, 2, 3], {})).rejects.toThrow(
        "Query dimension mismatch",
      );
    });
  });

  describe("delete", () => {
    it("should delete an existing document", async () => {
      const doc = createTestDocument("doc1", "To be deleted");
      await storage.insert(doc);

      const deleted = await storage.delete("doc1");
      expect(deleted).toBe(true);

      const retrieved = await storage.getById("doc1");
      expect(retrieved).toBeNull();
    });

    it("should return false for non-existent document", async () => {
      const deleted = await storage.delete("nonexistent");
      expect(deleted).toBe(false);
    });
  });

  describe("update", () => {
    beforeEach(async () => {
      const doc = createTestDocument("doc1", "Original content", 1, {
        author: "Alice",
      });
      await storage.insert(doc);
    });

    it("should update document content", async () => {
      const updated = await storage.update("doc1", {
        content: "Updated content",
      });
      expect(updated).toBe(true);

      const doc = await storage.getById("doc1");
      expect(doc?.content).toBe("Updated content");
      expect(doc?.metadata.author).toBe("Alice");
    });

    it("should update document metadata", async () => {
      const updated = await storage.update("doc1", {
        metadata: { author: "Bob", year: 2024 },
      });
      expect(updated).toBe(true);

      const doc = await storage.getById("doc1");
      expect(doc?.metadata.author).toBe("Bob");
      expect(doc?.metadata.year).toBe(2024);
    });

    it("should update document embedding", async () => {
      const newEmbedding = createTestEmbedding(5);
      const updated = await storage.update("doc1", {
        embedding: newEmbedding,
      });
      expect(updated).toBe(true);

      const doc = await storage.getById("doc1");
      expect(doc?.embedding).toEqual(newEmbedding);
    });

    it("should return false for non-existent document", async () => {
      const updated = await storage.update("nonexistent", {
        content: "Updated",
      });
      expect(updated).toBe(false);
    });

    it("should reject wrong embedding dimension", async () => {
      await expect(
        storage.update("doc1", { embedding: [1, 2, 3] }),
      ).rejects.toThrow("Embedding dimension mismatch");
    });

    it("should update updatedAt timestamp", async () => {
      const original = await storage.getById("doc1");
      const originalUpdatedAt = original?.updatedAt;

      await new Promise((r) => setTimeout(r, 10));

      await storage.update("doc1", { content: "Updated" });

      const updated = await storage.getById("doc1");
      expect(updated?.updatedAt).toBeGreaterThan(originalUpdatedAt ?? 0);
    });
  });

  describe("getStats", () => {
    it("should return correct stats", async () => {
      await storage.insertBatch([
        createTestDocument("doc1", "One", 1),
        createTestDocument("doc2", "Two", 2),
      ]);

      const stats = await storage.getStats();
      expect(stats.documentCount).toBe(2);
      expect(stats.dimension).toBe(DEFAULT_DIMENSION);
      expect(stats.tableName).toBe("vectors");
      expect(stats.backend).toBe("memory");
    });
  });

  describe("clear", () => {
    it("should clear all documents", async () => {
      await storage.insertBatch([
        createTestDocument("doc1", "One", 1),
        createTestDocument("doc2", "Two", 2),
      ]);

      await storage.clear();

      const stats = await storage.getStats();
      expect(stats.documentCount).toBe(0);
    });
  });

  describe("error handling", () => {
    it("should handle operations after clear", async () => {
      await storage.insert(createTestDocument("doc1", "Test"));
      await storage.clear();

      const doc = await storage.getById("doc1");
      expect(doc).toBeNull();

      const stats = await storage.getStats();
      expect(stats.documentCount).toBe(0);
    });
  });
});

describe("cosine similarity", () => {
  it("should return 1 for identical vectors", async () => {
    const storage = new VectorStorage({ persistPath: ":memory:" });
    await storage.initialize();

    const embedding = createTestEmbedding(42);
    await storage.insert(createTestDocument("doc1", "Test", 42));

    const results = await storage.search(embedding, { k: 1 });
    expect(results[0].score).toBeGreaterThan(0.99);
  });

  it("should return lower scores for dissimilar vectors", async () => {
    const storage = new VectorStorage({ persistPath: ":memory:" });
    await storage.initialize();

    await storage.insertBatch([
      createTestDocument("similar", "Similar", 1),
      createTestDocument("different", "Different", 100),
    ]);

    const query = createTestEmbedding(1);
    const results = await storage.search(query, { k: 2 });

    expect(results[0].document.id).toBe("similar");
    expect(results[0].score).toBeGreaterThan(results[1].score);
  });
});
