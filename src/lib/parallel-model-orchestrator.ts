/**
 * Parallel Model Orchestrator
 * 
 * Runs multiple models in parallel to compare/contrast responses.
 * Uses prompt chaining to refine outputs through multiple reasoning steps.
 * Supports ANY model provider (OpenAI, Anthropic, Google, Ollama, LM Studio, Azure)
 */

import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { ModelConfig } from "./model-config";
import { validateServerFetchUrl } from "./url-validation";

export interface ParallelModelConfig {
	name: string;
	config: ModelConfig;
	role: "validator" | "reasoner" | "synthesizer" | "orchestrator";
}

export interface ModelResponse {
	modelName: string;
	response: string;
	confidence: number;
	tokenCount: number;
	processingTime: number;
	reasoning?: string[];
	role?: "validator" | "reasoner" | "synthesizer" | "orchestrator";
}

/** Details about how consensus was reached across parallel model responses */
export interface ConsensusAnalysis {
	/** The merged consensus text */
	text: string;
	/** How much the models agreed (0–1). High = strong agreement */
	agreementScore: number;
	/** Key claims that multiple models agreed on */
	agreedClaims: string[];
	/** Claims where models contradicted each other */
	contradictions: string[];
	/** Which strategy produced the consensus */
	strategy: "unanimous" | "majority" | "weighted" | "best-single" | "none";
	/** Per-model contribution weights used */
	modelWeights: Record<string, number>;
}

export interface ParallelPromptResult {
	responses: ModelResponse[];
	consensus: string | null;
	consensusAnalysis: ConsensusAnalysis;
	confidenceScore: number;
	totalTokens: number;
	totalTime: number;
}

/**
 * Default parallel model configurations.
 * Empty by default - populated from the user's active model config.
 * Never hardcode model names here.
 */
export const DEFAULT_PARALLEL_MODELS: ParallelModelConfig[] = [];

export class ParallelModelOrchestrator {
	private modelConfigs: Map<string, ModelConfig> = new Map();
	private maxConcurrency: number;

	constructor(configs?: ParallelModelConfig[], maxConcurrency?: number) {
		// Initialize with provided configs or defaults
		const modelsToUse = configs || DEFAULT_PARALLEL_MODELS;
		for (const parallelConfig of modelsToUse) {
			this.modelConfigs.set(parallelConfig.name, parallelConfig.config);
		}
		// Default concurrency to number of configs, capped at 8 to avoid resource exhaustion
		this.maxConcurrency = maxConcurrency ?? Math.min(modelsToUse.length || 4, 8);
	}

	/**
	 * Check if a provider endpoint is reachable before executing.
	 * Returns true for cloud providers (always reachable if key present),
	 * and pings local providers to verify they're running.
	 */
	async checkModelHealth(config: ModelConfig): Promise<boolean> {
		const cloudProviders = ["openai", "anthropic", "google", "azure_openai", "deepseek", "moonshot", "kimi", "openrouter"];
		const localProviders = ["ollama", "lm_studio", "vllm", "gguf", "onnx"];

		if (cloudProviders.includes(config.provider)) {
			return !!config.apiKey;
		}

		if (!localProviders.includes(config.provider)) {
			// Custom / unknown providers: treat as cloud-like (check API key + baseUrl)
			return !!(config.apiKey && config.baseUrl);
		}

		// Local providers: ping the endpoint (with SSRF validation)
		try {
			const baseUrl = (config.baseUrl || "").replace(/\/v1\/?$/, "");
			validateServerFetchUrl(baseUrl);
			const response = await fetch(`${baseUrl}/api/tags`, {
				signal: AbortSignal.timeout(3000),
			});
			return response.ok;
		} catch {
			try {
				const v1Url = config.baseUrl?.endsWith("/v1")
					? `${config.baseUrl}/models`
					: `${config.baseUrl}/v1/models`;
				validateServerFetchUrl(v1Url!);
				const res = await fetch(v1Url!, { signal: AbortSignal.timeout(3000) });
				return res.ok;
			} catch {
				return false;
			}
		}
	}

	/**
	 * Create provider-specific model instance
	 */
	private createModelInstance(config: ModelConfig): any {
		switch (config.provider) {
			case "openai":
				return createOpenAI({
					baseURL: config.baseUrl,
					apiKey: config.apiKey,
				})(config.model);
			case "anthropic":
				return createAnthropic({
					baseURL: config.baseUrl,
					apiKey: config.apiKey,
				})(config.model);
			case "google":
				return createGoogleGenerativeAI({
					baseURL: config.baseUrl,
					apiKey: config.apiKey,
				})(config.model);
			case "ollama":
			case "lm_studio":
				// Use OpenAI-compatible API
				return createOpenAI({
					baseURL: config.baseUrl,
					apiKey: config.apiKey || "local", // Local models don't need real keys
				})(config.model);
			case "azure_openai":
				return createOpenAI({
					baseURL: config.baseUrl,
					apiKey: config.apiKey,
				})(config.model);
			default:
				// Custom / OpenAI-compatible providers (e.g., Z.AI, vLLM, etc.)
				return createOpenAI({
					baseURL: config.baseUrl,
					apiKey: config.apiKey,
				})(config.model);
		}
	}

	/**
	 * Run multiple models in parallel with the same prompt.
	 * Respects maxConcurrency to avoid resource exhaustion.
	 * Pre-checks health of local models and skips unreachable ones.
	 */
	async runParallel(
		prompt: string,
		models: ParallelModelConfig[] = DEFAULT_PARALLEL_MODELS,
	): Promise<ParallelPromptResult> {
		const startTime = Date.now();

		// Pre-check health: filter out unreachable models
		const healthChecks = await Promise.all(
			models.map(async (config) => ({
				config,
				healthy: await this.checkModelHealth(config.config),
			})),
		);

		const healthyModels = healthChecks.filter((h) => h.healthy).map((h) => h.config);
		const skippedModels = healthChecks.filter((h) => !h.healthy).map((h) => h.config);

		if (skippedModels.length > 0) {
			console.warn(
				`[ParallelOrchestrator] Skipping ${skippedModels.length} unreachable model(s):`,
				skippedModels.map((m) => m.name),
			);
		}

		if (healthyModels.length === 0) {
			console.error("[ParallelOrchestrator] No healthy models available for parallel execution");
			const emptyAnalysis: ConsensusAnalysis = {
				text: "",
				agreementScore: 0,
				agreedClaims: [],
				contradictions: [],
				strategy: "none",
				modelWeights: {},
			};
			return {
				responses: [],
				consensus: null,
				consensusAnalysis: emptyAnalysis,
				confidenceScore: 0,
				totalTokens: 0,
				totalTime: Date.now() - startTime,
			};
		}

		console.log(
			`[ParallelOrchestrator] Executing ${healthyModels.length} model(s) in parallel (max concurrency: ${this.maxConcurrency})`,
		);

		// Execute with concurrency control
		const responses = await this.executeWithConcurrency(
			healthyModels,
			(config) => this.executeModel(prompt, config),
			this.maxConcurrency,
		);

		// Build intelligent consensus
		const consensusAnalysis = this.buildConsensus(responses, healthyModels);
		const confidenceScore = this.calculateOverallConfidence(responses, consensusAnalysis);

		const totalTokens = responses.reduce(
			(sum, r) => sum + r.tokenCount,
			0,
		);
		const totalTime = Date.now() - startTime;

		console.log(
			`[ParallelOrchestrator] Consensus: strategy=${consensusAnalysis.strategy}, ` +
			`agreement=${(consensusAnalysis.agreementScore * 100).toFixed(0)}%, ` +
			`agreed=${consensusAnalysis.agreedClaims.length} claims, ` +
			`contradictions=${consensusAnalysis.contradictions.length}`,
		);

		return {
			responses,
			consensus: consensusAnalysis.text || null,
			consensusAnalysis,
			confidenceScore,
			totalTokens,
			totalTime,
		};
	}

	/**
	 * Execute tasks with a concurrency limit.
	 * Processes up to `limit` tasks at a time, queuing the rest.
	 */
	private async executeWithConcurrency<T, R>(
		items: T[],
		fn: (item: T) => Promise<R>,
		limit: number,
	): Promise<R[]> {
		const results: R[] = [];
		const executing: Set<Promise<void>> = new Set();

		for (const item of items) {
			const promise = fn(item).then((result) => {
				results.push(result);
			});
			const wrappedPromise = promise.then(() => {
				executing.delete(wrappedPromise);
			});
			executing.add(wrappedPromise);

			if (executing.size >= limit) {
				await Promise.race(executing);
			}
		}

		await Promise.all(executing);
		return results;
	}

	/**
	 * Chain prompts through multiple models sequentially
	 */
	async chainPrompts(
		initialPrompt: string,
		chain: ParallelModelConfig[],
	): Promise<ParallelPromptResult> {
		const responses: ModelResponse[] = [];
		let currentPrompt = initialPrompt;
		const startTime = Date.now();

		for (const config of chain) {
			const response = await this.executeModel(currentPrompt, config);
			responses.push(response);

			// Use the output as input for the next model in the chain
			currentPrompt = `Previous analysis: ${response.response}\n\nBuild upon this analysis to provide deeper insights.`;
		}

		const totalTokens = responses.reduce(
			(sum, r) => sum + r.tokenCount,
			0,
		);
		const totalTime = Date.now() - startTime;

		const consensusAnalysis: ConsensusAnalysis = {
			text: responses[responses.length - 1]?.response || "",
			agreementScore: 1.0, // Sequential chain produces a single refined result
			agreedClaims: [],
			contradictions: [],
			strategy: "unanimous",
			modelWeights: Object.fromEntries(responses.map((r, i) => [r.modelName, 1 / responses.length])),
		};

		return {
			responses,
			consensus: responses[responses.length - 1]?.response || null,
			consensusAnalysis,
			confidenceScore: this.calculateOverallConfidence(responses, consensusAnalysis),
			totalTokens,
			totalTime,
		};
	}

	/**
	 * Execute a single model
	 */
	private async executeModel(
		prompt: string,
		parallelConfig: ParallelModelConfig,
	): Promise<ModelResponse> {
		const startTime = Date.now();
		const config = parallelConfig.config;

		try {
			const modelInstance = this.createModelInstance(config);
			
			const result = await generateText({
				model: modelInstance,
				prompt,
				temperature: config.temperature,
				maxOutputTokens: config.maxTokens,
			});

			const processingTime = Date.now() - startTime;

			// Calculate confidence based on response length and coherence
			const confidence = this.estimateConfidence(result.text, parallelConfig.role);

			return {
				modelName: parallelConfig.name,
				response: result.text,
				confidence,
				tokenCount: result.usage?.totalTokens ?? 0,
				processingTime,
				role: parallelConfig.role,
			};
		} catch (error) {
			console.error(`Error executing model ${parallelConfig.name}:`, error);

			return {
				modelName: parallelConfig.name,
				response: `Error: Model ${parallelConfig.name} failed to respond`,
				confidence: 0,
				tokenCount: 0,
				processingTime: Date.now() - startTime,
				role: parallelConfig.role,
			};
		}
	}

	// ── Intelligent Consensus Engine ──────────────────────────────────────

	/**
	 * Build an intelligent consensus from parallel model responses.
	 *
	 * Pipeline:
	 *  1. Extract claims (sentence-level) from every response
	 *  2. Compute pairwise similarity between claims using n-gram overlap
	 *  3. Cluster claims into "agreed" (majority) and "contradicted"
	 *  4. Weight models by role (validators > reasoners > synthesizers)
	 *  5. Pick a strategy: unanimous / majority / weighted / best-single
	 *  6. Merge the agreed claims into a single consensus text
	 */
	private buildConsensus(
		responses: ModelResponse[],
		models: ParallelModelConfig[],
	): ConsensusAnalysis {
		if (responses.length === 0) {
			return { text: "", agreementScore: 0, agreedClaims: [], contradictions: [], strategy: "none", modelWeights: {} };
		}

		if (responses.length === 1) {
			const r = responses[0];
			return {
				text: r.response,
				agreementScore: 1.0,
				agreedClaims: this.extractClaims(r.response),
				contradictions: [],
				strategy: "best-single",
				modelWeights: { [r.modelName]: 1 },
			};
		}

		// 1. Role-based weights
		const roleWeights: Record<string, number> = {
			validator: 1.3,
			reasoner: 1.0,
			synthesizer: 0.9,
			orchestrator: 0.8,
		};
		const modelWeights: Record<string, number> = {};
		for (const r of responses) {
			const roleW = roleWeights[r.role ?? "reasoner"] ?? 1.0;
			const confW = r.confidence;
			modelWeights[r.modelName] = roleW * confW;
		}
		// Normalise weights so they sum to 1
		const weightSum = Object.values(modelWeights).reduce((a, b) => a + b, 0);
		if (weightSum > 0) {
			for (const k of Object.keys(modelWeights)) {
				modelWeights[k] /= weightSum;
			}
		}

		// 2. Extract claims per model
		const modelClaims: Map<string, string[]> = new Map();
		for (const r of responses) {
			modelClaims.set(r.modelName, this.extractClaims(r.response));
		}

		// 3. Pairwise claim agreement – a claim is "agreed" if a similar claim
		//    appears in at least ceil(n/2) models' outputs (majority threshold)
		const allClaims: Array<{ claim: string; model: string }> = [];
		for (const [model, claims] of modelClaims) {
			for (const c of claims) allClaims.push({ claim: c, model });
		}

		const majorityThreshold = Math.ceil(responses.length / 2);
		const agreedClaims: string[] = [];
		const contradictions: string[] = [];
		const seen = new Set<number>(); // indices already clustered

		for (let i = 0; i < allClaims.length; i++) {
			if (seen.has(i)) continue;
			const supportingModels = new Set<string>([allClaims[i].model]);
			const cluster = [i];

			for (let j = i + 1; j < allClaims.length; j++) {
				if (seen.has(j)) continue;
				// Skip same-model duplicate matching
				if (allClaims[j].model === allClaims[i].model) continue;
				const sim = this.claimSimilarity(allClaims[i].claim, allClaims[j].claim);
				if (sim >= 0.4) {
					supportingModels.add(allClaims[j].model);
					cluster.push(j);
				}
			}

			if (supportingModels.size >= majorityThreshold) {
				agreedClaims.push(allClaims[i].claim);
				for (const idx of cluster) seen.add(idx);
			}
		}

		// 4. Detect contradictions – claims from different models with negation overlap
		for (let i = 0; i < allClaims.length; i++) {
			for (let j = i + 1; j < allClaims.length; j++) {
				if (allClaims[i].model === allClaims[j].model) continue;
				if (this.detectContradiction(allClaims[i].claim, allClaims[j].claim)) {
					const label = `[${allClaims[i].model}] "${this.truncate(allClaims[i].claim, 80)}" vs [${allClaims[j].model}] "${this.truncate(allClaims[j].claim, 80)}"`;
					contradictions.push(label);
				}
			}
		}
		// Keep contradictions list manageable
		const cappedContradictions = contradictions.slice(0, 10);

		// 5. Agreement score
		const totalClaims = new Set(allClaims.map((_, i) => i)).size;
		const agreementScore = totalClaims > 0
			? Math.min(1, agreedClaims.length / Math.max(1, totalClaims / responses.length))
			: 0;

		// 6. Pick strategy
		let strategy: ConsensusAnalysis["strategy"];
		if (agreementScore >= 0.9 && cappedContradictions.length === 0) {
			strategy = "unanimous";
		} else if (agreementScore >= 0.5) {
			strategy = "majority";
		} else if (responses.length >= 2) {
			strategy = "weighted";
		} else {
			strategy = "best-single";
		}

		// 7. Build consensus text
		let text: string;
		if (strategy === "unanimous" || strategy === "majority") {
			// Use agreed claims as the consensus, ordered by first appearance
			text = agreedClaims.join(" ");
		} else if (strategy === "weighted") {
			// Pick the response with the highest weighted score
			let best = responses[0];
			let bestScore = 0;
			for (const r of responses) {
				const s = modelWeights[r.modelName] ?? 0;
				if (s > bestScore) { bestScore = s; best = r; }
			}
			text = best.response;
		} else {
			// best-single: highest confidence
			const sorted = [...responses].sort((a, b) => b.confidence - a.confidence);
			text = sorted[0].response;
		}

		return {
			text,
			agreementScore,
			agreedClaims,
			contradictions: cappedContradictions,
			strategy,
			modelWeights,
		};
	}

	/**
	 * Extract individual claims (sentences) from a response.
	 * Filters out very short fragments and boilerplate.
	 */
	private extractClaims(text: string): string[] {
		return text
			.split(/(?<=[.!?])\s+/)
			.map((s) => s.trim())
			.filter((s) => s.length > 20 && !s.startsWith("Error:"));
	}

	/**
	 * Compute similarity between two claims using word-level Jaccard overlap.
	 * Returns a value between 0 (no overlap) and 1 (identical word sets).
	 */
	private claimSimilarity(a: string, b: string): number {
		const wordsA = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
		const wordsB = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
		if (wordsA.size === 0 || wordsB.size === 0) return 0;
		let intersection = 0;
		for (const w of wordsA) {
			if (wordsB.has(w)) intersection++;
		}
		return intersection / (wordsA.size + wordsB.size - intersection);
	}

	/**
	 * Detect if two claims contradict each other.
	 * Heuristic: high word overlap *and* one contains a negation the other does not.
	 */
	private detectContradiction(a: string, b: string): boolean {
		const similarity = this.claimSimilarity(a, b);
		if (similarity < 0.25) return false; // Too different to be contradictory

		const negations = /\b(not|no|never|none|neither|nor|isn't|aren't|wasn't|weren't|don't|doesn't|didn't|won't|wouldn't|can't|cannot|shouldn't|couldn't)\b/i;
		const aNeg = negations.test(a);
		const bNeg = negations.test(b);

		// One negated, the other not → likely contradiction
		return aNeg !== bNeg;
	}

	/** Truncate a string to a max length, appending "…" if needed */
	private truncate(s: string, max: number): string {
		return s.length <= max ? s : `${s.slice(0, max)}…`;
	}

	// ── Confidence ────────────────────────────────────────────────────────

	/**
	 * Calculate overall confidence factoring in consensus analysis.
	 */
	private calculateOverallConfidence(
		responses: ModelResponse[],
		consensus: ConsensusAnalysis,
	): number {
		if (responses.length === 0) return 0;

		// Weighted average confidence (use consensus model weights)
		let weightedConf = 0;
		for (const r of responses) {
			const w = consensus.modelWeights[r.modelName] ?? (1 / responses.length);
			weightedConf += r.confidence * w;
		}

		// Agreement bonus: strong agreement across models → higher confidence
		const agreementBonus = consensus.agreementScore * 0.15;

		// Contradiction penalty: each contradiction reduces confidence
		const contradictionPenalty = Math.min(0.2, consensus.contradictions.length * 0.04);

		// Strategy bonus: unanimous > majority > weighted > best-single
		const strategyBonus: Record<string, number> = {
			unanimous: 0.1,
			majority: 0.05,
			weighted: 0,
			"best-single": -0.05,
			none: -0.1,
		};

		const raw = weightedConf + agreementBonus - contradictionPenalty + (strategyBonus[consensus.strategy] ?? 0);
		return Math.max(0, Math.min(1, raw));
	}

	/**
	 * Estimate confidence of a single response
	 */
	private estimateConfidence(response: string, role: string): number {
		let confidence = 0.5; // Base confidence

		// Longer, more detailed responses generally more confident
		const wordCount = response.split(/\s+/).length;
		if (wordCount > 50) confidence += 0.1;
		if (wordCount > 100) confidence += 0.1;

		// Presence of uncertainty markers reduces confidence
		const uncertaintyMarkers = [
			"maybe",
			"might",
			"possibly",
			"unclear",
			"uncertain",
		];
		const hasUncertainty = uncertaintyMarkers.some((marker) =>
			response.toLowerCase().includes(marker),
		);
		if (hasUncertainty) confidence -= 0.2;

		// Role-specific adjustments
		if (role === "validator" && response.includes("validated"))
			confidence += 0.1;
		if (role === "reasoner" && response.includes("because"))
			confidence += 0.1;
		if (role === "orchestrator" && response.includes("step"))
			confidence += 0.1;

		return Math.max(0, Math.min(1, confidence));
	}

	/**
	 * Calculate variance of an array of numbers
	 */
	private calculateVariance(numbers: number[]): number {
		if (numbers.length === 0) return 0;

		const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
		const squaredDiffs = numbers.map((n) => Math.pow(n - mean, 2));
		return (
			squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length
		);
	}
}
