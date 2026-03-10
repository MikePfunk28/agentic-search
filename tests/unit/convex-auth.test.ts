/**
 * Unit Tests for Convex Auth Configuration
 *
 * Verifies auth.ts exports and provider configuration.
 */

import { describe, expect, it } from "vitest";

describe("Convex Auth Configuration", () => {
  it("should export auth functions from convex/auth.ts", async () => {
    const authModule = await import("../../convex/auth");
    expect(authModule.auth).toBeDefined();
    expect(authModule.signIn).toBeDefined();
    expect(authModule.signOut).toBeDefined();
    expect(authModule.store).toBeDefined();
    expect(authModule.isAuthenticated).toBeDefined();
  });

  it("should export user queries from convex/users.ts", async () => {
    const usersModule = await import("../../convex/users");
    expect(usersModule.currentUser).toBeDefined();
    expect(usersModule.updateProfile).toBeDefined();
  });

  it("should export preferences CRUD from convex/userPreferences.ts", async () => {
    const prefsModule = await import("../../convex/userPreferences");
    expect(prefsModule.getPreferences).toBeDefined();
    expect(prefsModule.updatePreferences).toBeDefined();
  });

  it("should export secure API key functions from convex/secureApiKeys.ts", async () => {
    const keysModule = await import("../../convex/secureApiKeys");
    expect(keysModule.saveApiKey).toBeDefined();
    expect(keysModule.getApiKey).toBeDefined();
    expect(keysModule.deleteApiKey).toBeDefined();
    expect(keysModule.listApiKeys).toBeDefined();
  });

  it("should export external API tracking functions", async () => {
    const trackingModule = await import("../../convex/externalApiTracking");
    expect(trackingModule.trackExternalApiCall).toBeDefined();
    expect(trackingModule.getExternalApiStats).toBeDefined();
    expect(trackingModule.getExternalApiTimeSeries).toBeDefined();
  });

  it("should export cost estimation functions", async () => {
    const costModule = await import("../../convex/costEstimation");
    expect(costModule.PROVIDER_PRICING).toBeDefined();
    expect(costModule.estimateCost).toBeDefined();
    expect(costModule.getCostSummary).toBeDefined();
    expect(costModule.getPricingTable).toBeDefined();
  });

  it("should export session cleanup function", async () => {
    const cleanupModule = await import("../../convex/sessionCleanup");
    expect(cleanupModule.cleanupAnonymousData).toBeDefined();
  });
});

describe("Cost Estimation", () => {
  it("should calculate OpenAI costs correctly", async () => {
    const { estimateCost } = await import("../../convex/costEstimation");
    // 1M tokens with OpenAI: 0.7M input * $2.50 + 0.3M output * $10.00 = $1.75 + $3.00 = $4.75
    const cost = estimateCost("openai", 1_000_000);
    expect(cost).toBeCloseTo(4.75, 1);
  });

  it("should calculate zero cost for local models", async () => {
    const { estimateCost } = await import("../../convex/costEstimation");
    expect(estimateCost("ollama", 1_000_000)).toBe(0);
    expect(estimateCost("lmstudio", 1_000_000)).toBe(0);
  });

  it("should calculate per-request costs for search APIs", async () => {
    const { estimateCost } = await import("../../convex/costEstimation");
    // Firecrawl: $0.004 per request * 5 = $0.02
    expect(estimateCost("firecrawl", undefined, 5)).toBeCloseTo(0.02, 4);
    // Tavily: $0.001 per request * 10 = $0.01
    expect(estimateCost("tavily", undefined, 10)).toBeCloseTo(0.01, 4);
  });

  it("should return 0 for unknown providers", async () => {
    const { estimateCost } = await import("../../convex/costEstimation");
    expect(estimateCost("unknown_provider", 1000)).toBe(0);
  });

  it("should have pricing for all major providers", async () => {
    const { PROVIDER_PRICING } = await import("../../convex/costEstimation");
    const expectedProviders = [
      "openai", "anthropic", "google", "deepseek",
      "firecrawl", "tavily", "brave", "exa",
      "llamaparse", "deepseek_ocr", "paddleocr",
      "ollama", "lmstudio",
    ];
    for (const provider of expectedProviders) {
      expect(PROVIDER_PRICING[provider]).toBeDefined();
      expect(PROVIDER_PRICING[provider].displayName).toBeTruthy();
    }
  });
});

describe("Usage Tracker Client", () => {
  it("should export trackApiUsage and trackSearch functions", async () => {
    const tracker = await import("../../src/lib/usage-tracker");
    expect(tracker.trackApiUsage).toBeDefined();
    expect(tracker.trackSearch).toBeDefined();
    expect(typeof tracker.trackApiUsage).toBe("function");
    expect(typeof tracker.trackSearch).toBe("function");
  });
});
