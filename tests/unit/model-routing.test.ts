import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryComplexityAnalyzer } from "../../src/lib/model-routing/complexity";
import { CostTracker } from "../../src/lib/model-routing/cost-tracker";
import { ModelRouter } from "../../src/lib/model-routing/router";
import { EnsemblePredictor } from "../../src/lib/model-routing/ensemble";
import { getModelCapabilities, MODEL_REGISTRY } from "../../src/lib/model-routing/types";

describe("QueryComplexityAnalyzer", () => {
  let analyzer: QueryComplexityAnalyzer;

  beforeEach(() => {
    analyzer = new QueryComplexityAnalyzer();
  });

  describe("Complexity Classification", () => {
    it("should classify simple queries correctly", () => {
      const simpleQueries = [
        "What is 2 + 2?",
        "Hello",
        "Define apple",
        "What time is it?",
        "Hi there",
      ];

      for (const query of simpleQueries) {
        const result = analyzer.analyze(query);
        expect(["simple", "moderate"]).toContain(result.classification);
        expect(result.score).toBeLessThan(0.7);
      }
    });

    it("should classify complex queries correctly", () => {
      const complexQueries = [
        "First, analyze the architecture. Then, implement a TypeScript class. Finally, debug the code.",
        "Write a function in Python to implement a binary search algorithm, then test it step by step",
        "Compare and contrast the implications, then propose a strategy, and finally implement the solution",
      ];

      for (const query of complexQueries) {
        const result = analyzer.analyze(query);
        expect(["moderate", "complex"]).toContain(result.classification);
        expect(result.score).toBeGreaterThan(0.25);
      }
    });

    it("should detect multi-step reasoning", () => {
      const result = analyzer.analyze(
        "First, explain how databases work. Then, describe indexing strategies. Finally, compare B-trees vs hash indexes."
      );

      expect(result.factors.hasMultiStepReasoning).toBe(true);
    });

    it("should detect code generation requirements", () => {
      const codeQueries = [
        "Write a function to sort an array",
        "Implement a binary search algorithm in Python",
        "Debug this TypeScript code",
        "Create a React component for user authentication",
      ];

      for (const query of codeQueries) {
        const result = analyzer.analyze(query);
        expect(result.factors.hasCodeGeneration).toBe(true);
      }
    });

    it("should detect creative writing requirements", () => {
      const creativeQueries = [
        "Write a story about a dragon",
        "Create a poem about nature",
        "Brainstorm ideas for a sci-fi novel",
        "Compose a song about friendship",
      ];

      for (const query of creativeQueries) {
        const result = analyzer.analyze(query);
        expect(result.factors.hasCreativeWriting).toBe(true);
      }
    });

    it("should count technical terms", () => {
      const result = analyzer.analyze(
        "Explain kubernetes docker container orchestration with microservices architecture and load balancing"
      );

      expect(result.factors.technicalTerms).toBeGreaterThan(0.3);
    });

    it("should return confidence score", () => {
      const result = analyzer.analyze("What is the capital of France?");
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it("should allow custom indicators", () => {
      analyzer.addCodeIndicator("foobar");
      const result = analyzer.analyze("Please foobar this for me");
      expect(result.factors.hasCodeGeneration).toBe(true);
    });
  });

  describe("Helper Methods", () => {
    it("should identify simple queries", () => {
      expect(analyzer.isSimpleQuery("What is 2+2?")).toBe(true);
    });

    it("should identify complex queries", () => {
      const complexQuery = "First analyze the code, then implement a TypeScript class, and finally debug the algorithm step by step";
      const result = analyzer.analyze(complexQuery);
      expect(["moderate", "complex"]).toContain(result.classification);
      expect(result.factors.hasMultiStepReasoning).toBe(true);
      expect(result.factors.hasCodeGeneration).toBe(true);
    });

    it("should recommend model tier", () => {
      const simpleAnalysis = analyzer.analyze("Hi");
      const moderateAnalysis = analyzer.analyze(
        "Write a function to sort an array, then optimize it, and finally test the code"
      );
      const complexAnalysis = analyzer.analyze(
        "First analyze the code, then implement a TypeScript class, and finally debug the algorithm step by step"
      );

      expect(analyzer.getRecommendedModelTier(simpleAnalysis)).toBe("local");
      expect(analyzer.getRecommendedModelTier(moderateAnalysis)).toBe("cheap");
      expect(["cheap", "capable"]).toContain(
        analyzer.getRecommendedModelTier(complexAnalysis)
      );
    });
  });
});

describe("ModelRouter", () => {
  let router: ModelRouter;
  let costTracker: CostTracker;

  beforeEach(() => {
    costTracker = new CostTracker({ dailyLimit: 100, hourlyLimit: 20 });
    router = new ModelRouter(costTracker, { preferLocal: true }, {});
  });

  describe("Routing Decisions", () => {
    it("should route queries and return decision", () => {
      router.updateAvailableModels("ollama", ["llama3.2"]);
      const decision = router.route("What is 2 + 2?");

      expect(decision).toHaveProperty("model");
      expect(decision).toHaveProperty("provider");
      expect(decision).toHaveProperty("reason");
      expect(decision).toHaveProperty("estimatedCost");
      expect(decision).toHaveProperty("confidence");
      expect(decision).toHaveProperty("complexity");
      expect(decision).toHaveProperty("fallbackChain");
    });

    it("should prefer local models when available", () => {
      router.updateAvailableModels("ollama", ["llama3.2"]);
      const decision = router.route("Simple question");

      expect(["ollama", "lm_studio"]).toContain(decision.provider);
    });

    it("should respect manual override", () => {
      router.setManualOverride("gpt-4o", "openai");
      const decision = router.route("Any query");

      expect(decision.model).toBe("gpt-4o");
      expect(decision.provider).toBe("openai");
      expect(decision.reason).toContain("Manual override");
    });

    it("should clear manual override", () => {
      router.setManualOverride("gpt-4o", "openai");
      router.clearManualOverride();
      router.updateAvailableModels("ollama", ["llama3.2"]);

      const decision = router.route("Simple query");
      expect(decision.reason).not.toContain("Manual override");
    });

    it("should generate fallback chain", () => {
      const decision = router.route("Complex analysis query");
      expect(decision.fallbackChain.length).toBeGreaterThan(0);
    });

    it("should log routing decisions", () => {
      router.route("Test query");
      const history = router.getHistory();

      expect(history.length).toBeGreaterThan(0);
      expect(history[0].query).toBe("Test query");
    });
  });

  describe("Fallback Behavior", () => {
    it("should return fallback chain for complexity level", () => {
      const simpleChain = router.getFallbackChain("simple");
      const complexChain = router.getFallbackChain("complex");

      expect(simpleChain.models.length).toBeGreaterThan(0);
      expect(complexChain.models.length).toBeGreaterThan(0);
    });
  });

  describe("Statistics", () => {
    it("should track routing statistics", () => {
      router.updateAvailableModels("ollama", ["llama3.2"]);
      router.route("Simple query 1");
      router.route("Complex analysis of distributed systems");
      router.route("Another simple question");

      const stats = router.getStats();

      expect(stats.totalRouted).toBe(3);
      expect(stats.byComplexity).toBeDefined();
      expect(stats.byProvider).toBeDefined();
    });
  });

  describe("Feedback", () => {
    it("should record feedback for routing decisions", () => {
      router.route("Test query");
      router.recordFeedback("Test query", true, 0.9);

      const history = router.getHistory();
      const entry = history.find((h) => h.query === "Test query");

      expect(entry?.success).toBe(true);
      expect(entry?.feedbackScore).toBe(0.9);
    });
  });
});

describe("CostTracker", () => {
  let tracker: CostTracker;

  beforeEach(() => {
    tracker = new CostTracker({
      dailyLimit: 10,
      hourlyLimit: 2,
    });
  });

  describe("Cost Estimation", () => {
    it("should estimate cost for a query", () => {
      const estimate = tracker.estimateCost(
        "What is the meaning of life?",
        "gpt-4o",
        "openai"
      );

      expect(estimate.inputTokens).toBeGreaterThan(0);
      expect(estimate.outputTokens).toBeGreaterThan(0);
      expect(estimate.totalEstimatedCost).toBeGreaterThan(0);
    });

    it("should estimate zero cost for local models", () => {
      const estimate = tracker.estimateCost(
        "Any query",
        "llama3.2",
        "ollama"
      );

      expect(estimate.totalEstimatedCost).toBe(0);
    });

    it("should estimate higher cost for longer queries", () => {
      const shortEstimate = tracker.estimateCost("Hi", "gpt-4o", "openai");
      const longEstimate = tracker.estimateCost(
        "A".repeat(1000),
        "gpt-4o",
        "openai"
      );

      expect(longEstimate.totalEstimatedCost).toBeGreaterThan(
        shortEstimate.totalEstimatedCost
      );
    });
  });

  describe("Budget Management", () => {
    it("should check if cost is affordable", () => {
      expect(tracker.canAfford(0.01)).toBe(true);
      expect(tracker.canAfford(100)).toBe(false);
    });

    it("should track actual costs", () => {
      tracker.trackActualCost({
        query: "Test query",
        decision: {
          model: "gpt-4o",
          provider: "openai",
          reason: "Test",
          estimatedCost: 0.05,
          confidence: 0.9,
          complexity: "simple",
          fallbackChain: [],
          timestamp: Date.now(),
        },
        actualCost: 0.05,
        timestamp: Date.now(),
      });

      const budget = tracker.getBudget();
      expect(budget.dailySpent).toBe(0.05);
    });

    it("should respect daily budget", () => {
      const budget = tracker.getBudget();
      expect(budget.dailyLimit).toBe(10);
    });

    it("should respect hourly budget", () => {
      const budget = tracker.getBudget();
      expect(budget.hourlyLimit).toBe(2);
    });

    it("should allow updating limits", () => {
      tracker.setDailyLimit(50);
      tracker.setHourlyLimit(10);

      const budget = tracker.getBudget();
      expect(budget.dailyLimit).toBe(50);
      expect(budget.hourlyLimit).toBe(10);
    });
  });

  describe("Cost Reporting", () => {
    it("should generate cost report", () => {
      tracker.trackActualCost({
        query: "Query 1",
        decision: {
          model: "gpt-4o",
          provider: "openai",
          reason: "Test",
          estimatedCost: 0.05,
          confidence: 0.9,
          complexity: "simple",
          fallbackChain: [],
          timestamp: Date.now(),
        },
        actualCost: 0.05,
        timestamp: Date.now(),
      });

      const report = tracker.getReport();

      expect(report.totalSpent).toBe(0.05);
      expect(report.dailySpent).toBe(0.05);
      expect(report.budgetStatus.daily.percentage).toBeGreaterThan(0);
    });

    it("should track savings from local models", () => {
      tracker.recordLocalSavings(0.10);
      tracker.recordLocalSavings(0.15);

      const report = tracker.getReport();
      expect(report.savingsFromLocal).toBe(0.25);
    });

    it("should track savings from caching", () => {
      tracker.recordCacheSavings(0.05);
      tracker.recordCacheSavings(0.03);

      const report = tracker.getReport();
      expect(report.savingsFromCaching).toBe(0.08);
    });

    it("should find cheapest model", () => {
      const models = [
        { model: "gpt-4o", provider: "openai" },
        { model: "gpt-4o-mini", provider: "openai" },
        { model: "claude-3-5-sonnet", provider: "anthropic" },
      ];

      const cheapest = tracker.getCheapestModel(models);
      expect(cheapest).not.toBeNull();
      expect(cheapest?.model).toBe("gpt-4o-mini");
    });
  });

  describe("History", () => {
    it("should return history with limit", () => {
      for (let i = 0; i < 20; i++) {
        tracker.trackActualCost({
          query: `Query ${i}`,
          decision: {
            model: "gpt-4o",
            provider: "openai",
            reason: "Test",
            estimatedCost: 0.01,
            confidence: 0.9,
            complexity: "simple",
            fallbackChain: [],
            timestamp: Date.now(),
          },
          timestamp: Date.now(),
        });
      }

      const history = tracker.getHistory(5);
      expect(history.length).toBe(5);
    });

    it("should clear history", () => {
      tracker.trackActualCost({
        query: "Test",
        decision: {
          model: "gpt-4o",
          provider: "openai",
          reason: "Test",
          estimatedCost: 0.01,
          confidence: 0.9,
          complexity: "simple",
          fallbackChain: [],
          timestamp: Date.now(),
        },
        timestamp: Date.now(),
      });

      tracker.clearHistory();
      const history = tracker.getHistory();

      expect(history.length).toBe(0);
    });
  });
});

describe("EnsemblePredictor", () => {
  let predictor: EnsemblePredictor;
  let costTracker: CostTracker;

  beforeEach(() => {
    costTracker = new CostTracker();
    predictor = new EnsemblePredictor(costTracker, {
      models: [
        { model: "gpt-4o", provider: "openai" },
        { model: "claude-3-5-sonnet", provider: "anthropic" },
      ],
      timeoutMs: 5000,
      minAgreement: 0.6,
    });
  });

  describe("Configuration", () => {
    it("should have configurable timeout", () => {
      predictor.setTimeout(10000);
      const config = predictor.getConfig();
      expect(config.timeoutMs).toBe(10000);
    });

    it("should have configurable minimum agreement", () => {
      predictor.setMinAgreement(0.8);
      const config = predictor.getConfig();
      expect(config.minAgreement).toBe(0.8);
    });

    it("should support different aggregation strategies", () => {
      predictor.setAggregationStrategy("voting");
      const config = predictor.getConfig();
      expect(config.aggregationStrategy).toBe("voting");
    });

    it("should allow adding models", () => {
      predictor.addModel("gemini-2.5-pro", "google");
      const models = predictor.getModels();

      expect(models.length).toBe(3);
      expect(models.some((m) => m.model === "gemini-2.5-pro")).toBe(true);
    });

    it("should allow removing models", () => {
      predictor.removeModel("claude-3-5-sonnet", "anthropic");
      const models = predictor.getModels();

      expect(models.length).toBe(1);
      expect(models.every((m) => m.model !== "claude-3-5-sonnet")).toBe(true);
    });
  });

  describe("Prediction", () => {
    it("should throw error without executor", async () => {
      await expect(predictor.predict("Test query")).rejects.toThrow(
        "No model executor set"
      );
    });

    it("should execute models and return results", async () => {
      predictor.setExecutor(async (query, model, provider) => {
        return {
          response: `Response from ${provider}:${model} for "${query}"`,
          confidence: 0.9,
        };
      });

      const result = await predictor.predict("Test query");

      expect(result.responses.length).toBe(2);
      expect(result.aggregatedResponse).toContain("Response from");
      expect(result.agreementScore).toBeGreaterThanOrEqual(0);
      expect(result.totalCost).toBeGreaterThanOrEqual(0);
    });

    it("should timeout slow models", async () => {
      predictor.setTimeout(100);
      predictor.setExecutor(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { response: "Should not reach", confidence: 0.9 };
      });

      const result = await predictor.predict("Test query");

      expect(result.responses.every((r) => r.confidence === 0)).toBe(true);
    });

    it("should handle partial failures", async () => {
      let callCount = 0;
      predictor.setExecutor(async (_, model) => {
        callCount++;
        if (model === "gpt-4o") {
          throw new Error("API error");
        }
        return { response: "Valid response", confidence: 0.9 };
      });

      const result = await predictor.predict("Test query");

      expect(result.responses.some((r) => r.confidence > 0)).toBe(true);
    });
  });

  describe("Agreement Detection", () => {
    it("should detect agreement", () => {
      const results = [
        {
          model: "gpt-4o",
          provider: "openai",
          response: "The answer is 42",
          confidence: 0.9,
          latency: 100,
        },
        {
          model: "claude-3-5-sonnet",
          provider: "anthropic",
          response: "The answer is 42",
          confidence: 0.9,
          latency: 120,
        },
      ];

      const agreement = predictor.detectAgreement(results);
      expect(agreement.hasAgreement).toBe(true);
      expect(agreement.agreementScore).toBe(1);
    });

    it("should detect disagreement", () => {
      const results = [
        {
          model: "gpt-4o",
          provider: "openai",
          response: "The capital of France is Paris",
          confidence: 0.9,
          latency: 100,
        },
        {
          model: "claude-3-5-sonnet",
          provider: "anthropic",
          response: "The largest planet is Jupiter",
          confidence: 0.9,
          latency: 120,
        },
      ];

      const agreement = predictor.detectAgreement(results);
      expect(agreement.agreementScore).toBeLessThan(0.5);
    });
  });

  describe("Voting", () => {
    it("should determine consensus", async () => {
      predictor.setExecutor(async () => ({
        response: "Consensus answer",
        confidence: 0.95,
      }));

      const result = await predictor.predict("Test");
      expect(result.votingResult).toBe("consensus");
    });
  });
});

describe("Model Capabilities", () => {
  it("should return capabilities for known models", () => {
    const caps = getModelCapabilities("gpt-4o", "openai");

    expect(caps.supportsVision).toBe(true);
    expect(caps.supportsTools).toBe(true);
    expect(caps.maxTokens).toBeGreaterThan(0);
    expect(caps.isLocal).toBe(false);
  });

  it("should return capabilities for local models", () => {
    const caps = getModelCapabilities("llama3.2", "ollama");

    expect(caps.isLocal).toBe(true);
    expect(caps.costPer1kInputTokens).toBe(0);
    expect(caps.costPer1kOutputTokens).toBe(0);
  });

  it("should return default capabilities for unknown models", () => {
    const caps = getModelCapabilities("unknown-model", "unknown-provider");

    expect(caps.maxTokens).toBe(4096);
    expect(caps.qualityScore).toBe(0.7);
  });

  it("should have MODEL_REGISTRY with all providers", () => {
    expect(MODEL_REGISTRY["openai:gpt-4o"]).toBeDefined();
    expect(MODEL_REGISTRY["anthropic:claude-3-5-sonnet"]).toBeDefined();
    expect(MODEL_REGISTRY["google:gemini-2.5-pro"]).toBeDefined();
  });
});

describe("Integration Tests", () => {
  it("should integrate router with cost tracker", () => {
    const tracker = new CostTracker({ dailyLimit: 5, hourlyLimit: 1 });
    const router = new ModelRouter(tracker, { preferLocal: false });

    const decision = router.route("Complex query about AI");
    tracker.trackActualCost({
      query: "Complex query about AI",
      decision,
      actualCost: decision.estimatedCost,
      timestamp: Date.now(),
    });

    const report = tracker.getReport();
    expect(report.totalSpent).toBe(decision.estimatedCost);
  });

  it("should respect budget constraints in routing", () => {
    const tracker = new CostTracker({ dailyLimit: 0.001, hourlyLimit: 0.001 });
    const router = new ModelRouter(tracker, { preferLocal: false });

    router.updateAvailableModels("ollama", ["llama3.2"]);

    const decision = router.route("Test query");

    expect(decision.provider).toBe("ollama");
  });

  it("should work end-to-end with all components", () => {
    const tracker = new CostTracker({ dailyLimit: 100, hourlyLimit: 20 });
    const analyzer = new QueryComplexityAnalyzer();
    const router = new ModelRouter(tracker);

    const query = "First implement a distributed caching system with TypeScript, then test it step by step";
    const analysis = analyzer.analyze(query);
    const decision = router.route(query);

    expect(analysis.factors.hasCodeGeneration).toBe(true);
    expect(analysis.factors.hasMultiStepReasoning).toBe(true);
    expect(["moderate", "complex"]).toContain(analysis.classification);
    expect(decision.complexity).toBe(analysis.classification);

    tracker.trackActualCost({
      query,
      decision,
      timestamp: Date.now(),
    });

    const stats = router.getStats();
    expect(stats.totalRouted).toBe(1);
  });
});
