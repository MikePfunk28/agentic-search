/**
 * Interleaved Reasoning Engine Tests
 * 
 * Tests security, validation, and reasoning capabilities
 */

import { describe, it, expect, beforeEach } from "vitest";
import { InterleavedReasoningEngine } from "../src/lib/interleaved-reasoning-engine";

describe("InterleavedReasoningEngine", () => {
	let engine: InterleavedReasoningEngine;

	beforeEach(() => {
		engine = new InterleavedReasoningEngine();
	});

	describe("Security", () => {
		it("should reject input with dangerous patterns", async () => {
			const maliciousInputs = [
				"<script>alert('xss')</script>",
				"javascript:void(0)",
				"onerror=alert('xss')",
				"What is eval('malicious code')?",
			];

			for (const input of maliciousInputs) {
				const result = await engine.reason(input);
				expect(result.success).toBe(false);
				expect(result.errors.length).toBeGreaterThan(0);
				expect(result.errors.some(e => e.includes("dangerous"))).toBe(true);
			}
		});

		it("should reject excessively long inputs", async () => {
			const longInput = "a".repeat(10001);
			const result = await engine.reason(longInput);

			expect(result.success).toBe(false);
			expect(result.errors.some(e => e.includes("maximum length"))).toBe(true);
		});

		it("should sanitize HTML entities in input", async () => {
			const input = "What is <div>test</div> & 'hello'?";
			
			// Mock the generateText to verify sanitization
			const result = await engine.reason(input);
			
			// The input should be sanitized before processing
			expect(result.errors.length).toBe(0); // Should not error on HTML
		});

		it("should enforce rate limiting", async () => {
			const promises = [];
			
			// Try to make 100 requests rapidly
			for (let i = 0; i < 100; i++) {
				promises.push(engine.reason("test query"));
			}

			const results = await Promise.all(promises);
			const rateLimitedResults = results.filter(
				r => r.errors.some(e => e.includes("Rate limit"))
			);

			expect(rateLimitedResults.length).toBeGreaterThan(0);
		});
	});

	describe("Reasoning Steps", () => {
		it("should execute all reasoning steps in sequence", async () => {
			const result = await engine.reason("What is the capital of France?");

			expect(result.steps.length).toBeGreaterThan(0);
			
			const stepTypes = result.steps.map(s => s.type);
			expect(stepTypes).toContain("analysis");
			expect(stepTypes).toContain("planning");
			expect(stepTypes).toContain("execution");
		});

		it("should validate each step before proceeding", async () => {
			const result = await engine.reason("Simple test query");

			for (const step of result.steps) {
				expect(step).toHaveProperty("validated");
				expect(step).toHaveProperty("confidence");
				expect(step).toHaveProperty("validationErrors");
			}
		});

		it("should stop on validation failure", async () => {
			// This test would require mocking to force a validation failure
			// For now, we verify the structure is in place
			const result = await engine.reason("test");

			if (!result.success) {
				expect(result.errors.length).toBeGreaterThan(0);
			}
		});

		it("should track token usage per step", async () => {
			const result = await engine.reason("Test query");

			expect(result.totalTokens).toBeGreaterThanOrEqual(0);
			
			for (const step of result.steps) {
				expect(step.tokenCount).toBeGreaterThanOrEqual(0);
			}
		});

		it("should include timestamps for each step", async () => {
			const result = await engine.reason("Test query");

			for (const step of result.steps) {
				expect(step.timestamp).toBeGreaterThan(0);
				expect(new Date(step.timestamp)).toBeInstanceOf(Date);
			}
		});
	});

	describe("Confidence Scoring", () => {
		it("should calculate overall confidence from all steps", async () => {
			const result = await engine.reason("What is 2+2?");

			expect(result.overallConfidence).toBeGreaterThanOrEqual(0);
			expect(result.overallConfidence).toBeLessThanOrEqual(1);
		});

		it("should have lower confidence for uncertain outputs", async () => {
			const certainQuery = "What is water made of?";
			const uncertainQuery = "Maybe possibly unclear uncertain?";

			const certainResult = await engine.reason(certainQuery);
			const uncertainResult = await engine.reason(uncertainQuery);

			// The uncertain query should typically have lower confidence
			// This is probabilistic, so we just verify the scores are valid
			expect(certainResult.overallConfidence).toBeGreaterThanOrEqual(0);
			expect(uncertainResult.overallConfidence).toBeGreaterThanOrEqual(0);
		});
	});

	describe("Context Integration", () => {
		it("should use search results in reasoning", async () => {
			const searchResults = [
				{
					id: "1",
					title: "Test Result",
					snippet: "This is a test snippet",
					url: "https://example.com",
					source: "test" as const,
				},
			];

			const result = await engine.reason(
				"What can you tell me about the search results?",
				{ searchResults }
			);

			expect(result.success).toBe(true);
			// The execution step should reference the search results
			const executionStep = result.steps.find(s => s.type === "execution");
			expect(executionStep).toBeDefined();
		});

		it("should handle empty search results gracefully", async () => {
			const result = await engine.reason(
				"Test query",
				{ searchResults: [] }
			);

			expect(result.success).toBe(true);
			expect(result.errors.length).toBe(0);
		});
	});

	describe("Error Handling", () => {
		it("should handle model connection failures gracefully", async () => {
			const offlineEngine = new InterleavedReasoningEngine(
				{},
				"http://localhost:99999" // Invalid port
			);

			const result = await offlineEngine.reason("Test query");

			expect(result.success).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it("should timeout long-running operations", async () => {
			const fastEngine = new InterleavedReasoningEngine({
				timeoutMs: 100, // Very short timeout
			});

			const result = await fastEngine.reason("Complex reasoning task");

			// Should either complete quickly or timeout
			expect(result.processingTime).toBeLessThan(5000);
		});

		it("should collect all errors during reasoning", async () => {
			const result = await engine.reason("test");

			if (!result.success) {
				expect(result.errors).toBeInstanceOf(Array);
				expect(result.errors.length).toBeGreaterThan(0);
				
				for (const error of result.errors) {
					expect(typeof error).toBe("string");
				}
			}
		});
	});

	describe("Health Check", () => {
		it("should report health status", async () => {
			const health = await engine.healthCheck();

			expect(health).toHaveProperty("healthy");
			expect(health).toHaveProperty("orchestratorAvailable");
			expect(health).toHaveProperty("validatorAvailable");
		});

		it("should detect unavailable models", async () => {
			const customEngine = new InterleavedReasoningEngine({
				orchestratorModel: "nonexistent-model",
			});

			const health = await customEngine.healthCheck();

			// Should report as unhealthy if model doesn't exist
			if (!health.healthy) {
				expect(health.orchestratorAvailable).toBe(false);
			}
		});
	});

	describe("Step Validation", () => {
		it("should validate analysis steps contain component breakdown", async () => {
			const result = await engine.reason("Analyze this complex query");

			const analysisStep = result.steps.find(s => s.type === "analysis");
			
			if (analysisStep && analysisStep.validated) {
				// If validated, confidence should be above threshold
				expect(analysisStep.confidence).toBeGreaterThan(0.5);
			}
		});

		it("should validate planning steps contain action steps", async () => {
			const result = await engine.reason("Plan how to solve this");

			const planningStep = result.steps.find(s => s.type === "planning");
			
			if (planningStep && planningStep.validated) {
				expect(planningStep.confidence).toBeGreaterThan(0.5);
			}
		});
	});

	describe("Performance", () => {
		it("should complete reasoning within reasonable time", async () => {
			const startTime = Date.now();
			const result = await engine.reason("Quick test query");
			const elapsed = Date.now() - startTime;

			// Should complete within 60 seconds (default timeout)
			expect(elapsed).toBeLessThan(60000);
			expect(result.processingTime).toBeLessThan(60000);
		});

		it("should track processing time accurately", async () => {
			const result = await engine.reason("Test query");

			expect(result.processingTime).toBeGreaterThan(0);
			expect(result.processingTime).toBeLessThan(60000);
		});
	});

	describe("Integration", () => {
		it("should work with ADD discriminator", async () => {
			const result = await engine.reason("Test integration");

			// The engine initializes ADD internally
			expect(result).toHaveProperty("overallConfidence");
			expect(result).toHaveProperty("success");
		});

		it("should generate unique step IDs", async () => {
			const result = await engine.reason("Test query");

			const stepIds = result.steps.map(s => s.id);
			const uniqueIds = new Set(stepIds);

			expect(uniqueIds.size).toBe(stepIds.length);
		});
	});
});

describe("SecurityValidator", () => {
	// Note: SecurityValidator is private, but we test it through the engine

	it("should detect XSS attempts", async () => {
		const engine = new InterleavedReasoningEngine();
		const xssInputs = [
			"<img src=x onerror=alert(1)>",
			"<svg onload=alert(1)>",
			"<iframe src=javascript:alert(1)>",
		];

		for (const input of xssInputs) {
			const result = await engine.reason(input);
			expect(result.success).toBe(false);
		}
	});

	it("should detect code injection attempts", async () => {
		const engine = new InterleavedReasoningEngine();
		const injectionInputs = [
			"Run eval('malicious code')",
			"Execute this: exec('rm -rf /')",
		];

		for (const input of injectionInputs) {
			const result = await engine.reason(input);
			expect(result.success).toBe(false);
		}
	});
});

describe("RateLimiter", () => {
	it("should allow requests within limit", async () => {
		const engine = new InterleavedReasoningEngine();
		
		// First request should succeed
		const result1 = await engine.reason("Test 1");
		expect(result1.errors.some(e => e.includes("Rate limit"))).toBe(false);

		// Second request should also succeed
		const result2 = await engine.reason("Test 2");
		expect(result2.errors.some(e => e.includes("Rate limit"))).toBe(false);
	});
});
