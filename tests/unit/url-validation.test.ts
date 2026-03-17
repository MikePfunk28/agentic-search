import { afterEach, describe, expect, it } from "vitest";
import {
  validateServerFetchUrl,
  validateServerFetchUrlAsync,
} from "../../src/lib/url-validation";

const originalNodeEnv = process.env.NODE_ENV;
const originalAllowLocalModelHosts = process.env.ALLOW_LOCAL_MODEL_HOSTS;

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
  process.env.ALLOW_LOCAL_MODEL_HOSTS = originalAllowLocalModelHosts;
});

describe("validateServerFetchUrl (sync)", () => {
  describe("allowed URLs", () => {
    it("should allow known cloud hosts", () => {
      expect(() =>
        validateServerFetchUrl("https://api.openai.com/v1/chat"),
      ).not.toThrow();
      expect(() =>
        validateServerFetchUrl("https://api.anthropic.com/v1/messages"),
      ).not.toThrow();
      expect(() =>
        validateServerFetchUrl(
          "https://generativelanguage.googleapis.com/v1/models",
        ),
      ).not.toThrow();
      expect(() =>
        validateServerFetchUrl("https://api.z.ai/api/paas/v4"),
      ).not.toThrow();
    });

    it("should allow search provider hosts", () => {
      expect(() =>
        validateServerFetchUrl("https://api.tavily.com/search"),
      ).not.toThrow();
      expect(() =>
        validateServerFetchUrl("https://api.exa.ai/search"),
      ).not.toThrow();
      expect(() =>
        validateServerFetchUrl("https://api.search.brave.com/res/v1"),
      ).not.toThrow();
      expect(() =>
        validateServerFetchUrl("https://api.firecrawl.dev/v1/scrape"),
      ).not.toThrow();
    });

    it("should allow localhost for local models", () => {
      expect(() =>
        validateServerFetchUrl("http://localhost:11434/api/tags"),
      ).not.toThrow();
      expect(() =>
        validateServerFetchUrl("http://127.0.0.1:1234/v1/models"),
      ).not.toThrow();
    });

    it("should allow arbitrary public domains", () => {
      expect(() =>
        validateServerFetchUrl("https://custom-api.example.com/v1"),
      ).not.toThrow();
      expect(() =>
        validateServerFetchUrl("https://my-service.vercel.app/api"),
      ).not.toThrow();
    });
  });

  describe("blocked URLs", () => {
    it("should block cloud metadata endpoints", () => {
      expect(() =>
        validateServerFetchUrl("http://169.254.169.254/latest/meta-data/"),
      ).toThrow("Blocked: cloud metadata endpoint");
      expect(() =>
        validateServerFetchUrl("http://metadata.google.internal/"),
      ).toThrow("Blocked: cloud metadata endpoint");
    });

    it("should block private IPv4 addresses", () => {
      expect(() => validateServerFetchUrl("http://10.0.0.1/api")).toThrow(
        "private/internal IP",
      );
      expect(() => validateServerFetchUrl("http://172.16.0.1/api")).toThrow(
        "private/internal IP",
      );
      expect(() => validateServerFetchUrl("http://192.168.1.1/api")).toThrow(
        "private/internal IP",
      );
      expect(() =>
        validateServerFetchUrl("http://100.64.0.1/api"),
      ).toThrow("private/internal IP");
    });

    it("should block private IPv6 addresses", () => {
      expect(() =>
        validateServerFetchUrl("http://[fd00::1]/api"),
      ).toThrow("private IPv6");
      expect(() =>
        validateServerFetchUrl("http://[fe80::1]/api"),
      ).toThrow("private IPv6");
    });

    it("should block non-http protocols", () => {
      expect(() => validateServerFetchUrl("ftp://example.com/file")).toThrow(
        "Only http and https",
      );
      expect(() =>
        validateServerFetchUrl("file:///etc/passwd"),
      ).toThrow("Only http and https");
      expect(() =>
        validateServerFetchUrl("javascript:alert(1)"),
      ).toThrow();
    });

    it("should block invalid URLs", () => {
      expect(() => validateServerFetchUrl("not-a-url")).toThrow(
        "Invalid URL format",
      );
      expect(() => validateServerFetchUrl("")).toThrow("Invalid URL format");
    });

    it("should block localhost in production unless explicitly enabled", () => {
      process.env.NODE_ENV = "production";
      delete process.env.ALLOW_LOCAL_MODEL_HOSTS;

      expect(() =>
        validateServerFetchUrl("http://localhost:11434/api/tags"),
      ).toThrow("localhost URLs are disabled");

      process.env.ALLOW_LOCAL_MODEL_HOSTS = "true";

      expect(() =>
        validateServerFetchUrl("http://localhost:11434/api/tags"),
      ).not.toThrow();
    });
  });

  describe("edge cases", () => {
    it("should be case-insensitive for hostnames", () => {
      expect(() =>
        validateServerFetchUrl("https://API.OPENAI.COM/v1"),
      ).not.toThrow();
    });

    it("should handle URLs with ports", () => {
      expect(() =>
        validateServerFetchUrl("http://localhost:8080/api"),
      ).not.toThrow();
      expect(() =>
        validateServerFetchUrl("http://10.0.0.1:3000/api"),
      ).toThrow("private/internal IP");
    });

    it("should handle URLs with paths and query params", () => {
      expect(() =>
        validateServerFetchUrl(
          "https://api.openai.com/v1/chat/completions?stream=true",
        ),
      ).not.toThrow();
    });
  });
});

describe("validateServerFetchUrlAsync", () => {
  it("should pass all sync checks", async () => {
    await expect(
      validateServerFetchUrlAsync("https://api.openai.com/v1"),
    ).resolves.toBeUndefined();
  });

  it("should reject blocked hosts", async () => {
    await expect(
      validateServerFetchUrlAsync("http://169.254.169.254/"),
    ).rejects.toThrow("Blocked: cloud metadata endpoint");
  });

  it("should skip DNS for known cloud hosts", async () => {
    // Should resolve quickly without DNS lookup
    await expect(
      validateServerFetchUrlAsync("https://api.anthropic.com/v1"),
    ).resolves.toBeUndefined();
  });

  it("should skip DNS for localhost", async () => {
    await expect(
      validateServerFetchUrlAsync("http://localhost:11434/api/tags"),
    ).resolves.toBeUndefined();
  });

  it("should reject localhost in production when not explicitly enabled", async () => {
    process.env.NODE_ENV = "production";
    delete process.env.ALLOW_LOCAL_MODEL_HOSTS;

    await expect(
      validateServerFetchUrlAsync("http://localhost:11434/api/tags"),
    ).rejects.toThrow("localhost URLs are disabled");
  });
});
