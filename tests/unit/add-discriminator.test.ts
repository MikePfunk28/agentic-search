import { describe, expect, it, beforeEach } from "vitest";
import {
  AdversarialDifferentialDiscriminator,
  type ADDScore,
} from "../../src/lib/add-discriminator";
import type { SearchResult } from "../../src/lib/types";

function createResult(
  id: string,
  title: string,
  snippet: string,
  source: SearchResult["source"] = "web",
): SearchResult {
  return {
    id,
    title,
    snippet,
    url: `https://example.com/${id}`,
    source,
  };
}

describe("AdversarialDifferentialDiscriminator", () => {
  let add: AdversarialDifferentialDiscriminator;

  beforeEach(() => {
    add = new AdversarialDifferentialDiscriminator({
      minSamplesForAnalysis: 3,
      historicalWindow: 20,
    });
  });

  describe("scoreResults", () => {
    it("should return scores between 0 and 1", () => {
      const results = [
        createResult("1", "TypeScript guide", "Learn TypeScript basics"),
        createResult(
          "2",
          "TypeScript advanced",
          "Advanced TypeScript patterns",
          "brave",
        ),
      ];
      const score = add.scoreResults("typescript", results);
      expect(score.overallScore).toBeGreaterThanOrEqual(0);
      expect(score.overallScore).toBeLessThanOrEqual(1);
      expect(score.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(score.diversityScore).toBeGreaterThanOrEqual(0);
      expect(score.freshnessScore).toBeGreaterThanOrEqual(0);
      expect(score.consistencyScore).toBeGreaterThanOrEqual(0);
    });

    it("should return 0 relevance for empty results", () => {
      const score = add.scoreResults("query", []);
      expect(score.relevanceScore).toBe(0);
    });

    it("should score higher when query terms match content", () => {
      const matching = [
        createResult("1", "React hooks guide", "Learn React hooks patterns"),
      ];
      const nonMatching = [
        createResult("1", "Cooking pasta", "Italian recipes for dinner"),
      ];
      const matchScore = add.scoreResults("react hooks", matching);
      const nonMatchScore = add.scoreResults("react hooks", nonMatching);
      expect(matchScore.relevanceScore).toBeGreaterThan(
        nonMatchScore.relevanceScore,
      );
    });

    it("should give higher diversity for varied sources", () => {
      const diverse = [
        createResult("1", "Result A", "Content about topic A", "web"),
        createResult("2", "Result B", "Different content B", "brave"),
        createResult("3", "Result C", "Unique content about C", "wikipedia"),
      ];
      const homogeneous = [
        createResult("1", "Result A", "Content about topic A", "web"),
        createResult("2", "Result B", "Content about topic A again", "web"),
        createResult("3", "Result C", "Content about topic A more", "web"),
      ];
      const diverseScore = add.scoreResults("topic", diverse);
      const homoScore = add.scoreResults("topic", homogeneous);
      expect(diverseScore.diversityScore).toBeGreaterThan(
        homoScore.diversityScore,
      );
    });

    it("should adjust score based on user feedback rating", () => {
      const results = [
        createResult("1", "Test result", "Test content about query"),
      ];
      const withHighRating = add.scoreResults("query", results, {
        relevant: true,
        rating: 5,
      });
      const withLowRating = add.scoreResults("query", results, {
        relevant: false,
        rating: 1,
      });
      expect(withHighRating.overallScore).toBeGreaterThan(
        withLowRating.overallScore,
      );
    });

    it("should store scores in history", () => {
      const results = [createResult("1", "Test", "Test content")];
      add.scoreResults("query1", results);
      add.scoreResults("query2", results);
      const exported = add.exportHistoricalData();
      expect(exported).toHaveLength(2);
    });
  });

  describe("analyzeDrift", () => {
    it("should return no drift with insufficient data", () => {
      const drift = add.analyzeDrift();
      expect(drift.isDrifting).toBe(false);
      expect(drift.confidence).toBe(0);
      expect(drift.recommendation).toBe("maintain");
    });

    it("should detect stable performance", () => {
      const results = [
        createResult("1", "Test query result", "Test query content about test"),
      ];
      // Generate consistent scores
      for (let i = 0; i < 10; i++) {
        add.scoreResults("test query", results);
      }
      const drift = add.analyzeDrift();
      expect(drift.recommendation).toBe("maintain");
    });
  });

  describe("getMetrics", () => {
    it("should return default metrics when no data", () => {
      const metrics = add.getMetrics();
      expect(metrics.currentScore.overallScore).toBe(0);
      expect(metrics.historicalAverage).toBe(0);
      expect(metrics.recentTrend).toBe("stable");
      expect(metrics.driftDetected).toBe(false);
    });

    it("should return accurate metrics after scoring", () => {
      const results = [
        createResult("1", "Test result", "Test content about query"),
      ];
      add.scoreResults("query", results);
      const metrics = add.getMetrics();
      expect(metrics.currentScore.overallScore).toBeGreaterThan(0);
      expect(metrics.historicalAverage).toBeGreaterThan(0);
    });
  });

  describe("exportHistoricalData / importHistoricalData", () => {
    it("should export and import data correctly", () => {
      const results = [createResult("1", "Test", "Content")];
      add.scoreResults("q1", results);
      add.scoreResults("q2", results);

      const exported = add.exportHistoricalData();
      expect(exported).toHaveLength(2);

      const newAdd = new AdversarialDifferentialDiscriminator();
      newAdd.importHistoricalData(exported);
      const reExported = newAdd.exportHistoricalData();
      expect(reExported).toHaveLength(2);
      expect(reExported[0].overallScore).toBe(exported[0].overallScore);
    });

    it("should trim imported data to window size", () => {
      const scores: ADDScore[] = [];
      for (let i = 0; i < 50; i++) {
        scores.push({
          overallScore: 0.8,
          relevanceScore: 0.9,
          diversityScore: 0.7,
          freshnessScore: 0.8,
          consistencyScore: 0.8,
          timestamp: Date.now() + i,
        });
      }

      const smallWindow = new AdversarialDifferentialDiscriminator({
        historicalWindow: 10,
      });
      smallWindow.importHistoricalData(scores);
      const exported = smallWindow.exportHistoricalData();
      expect(exported.length).toBeLessThanOrEqual(10);
    });
  });

  describe("consistency score", () => {
    it("should give high score for complete results", () => {
      const complete = [
        createResult("1", "Has title", "Has snippet"),
        createResult("2", "Also titled", "Also has snippet"),
      ];
      const score = add.scoreResults("query", complete);
      expect(score.consistencyScore).toBe(1);
    });
  });
});
