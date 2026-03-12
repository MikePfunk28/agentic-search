/**
 * Parallel Model Orchestrator
 *
 * Runs multiple models in parallel to compare/contrast responses.
 * Uses prompt chaining to refine outputs through multiple reasoning steps.
 * Supports ANY model provider (OpenAI, Anthropic, Google, Ollama, LM Studio, Azure)
 */

import { generateText } from "ai";
import {
	type ModelConfig,
} from "./model-config";
import { createAIModelInstance } from "./ai/unified-provider";
import {
	buildEvidenceVerificationPrompt,
	type SearchEvidenceBundle,
} from "./search/evidence";
import { validateServerFetchUrlAsync } from "./url-validation";

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
	verdict?: "supported" | "mixed" | "insufficient" | "error";
	supportedResultIds?: string[];
	agreedClaims?: string[];
	contradictions?: string[];
	openQuestions?: string[];
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
	verificationMode?: "raw_query" | "evidence";
	supportedResultIds?: string[];
	evidenceCoverage?: number;
}

/**
 * Default parallel model configurations.
 * Empty by default - populated from the user's active model config.
 * Never hardcode model names here.
 */
export const DEFAULT_PARALLEL_MODELS: ParallelModelConfig[] = [];

export class ParallelModelOrchestrator {
	private modelConfigs: Map<string, ModelConfig> = new Map();
	private parallelConfigs: ParallelModelConfig[];
	private maxConcurrency: number;

	constructor(configs?: ParallelModelConfig[], maxConcurrency?: number) {
		// Initialize with provided configs or defaults
		const modelsToUse = configs || DEFAULT_PARALLEL_MODELS;
		this.parallelConfigs = modelsToUse;
		for (const parallelConfig of modelsToUse) {
			this.modelConfigs.set(parallelConfig.name, parallelConfig.config);
		}
		// Default concurrency to number of configs, capped at 8 to avoid resource exhaustion
		this.maxConcurrency =
			maxConcurrency ?? Math.min(modelsToUse.length || 4, 8);
	}

	/**
	 * Check if a provider endpoint is reachable before executing.
	 * Returns true for cloud providers (always reachable if key present),
	 * and pings local providers to verify they're running.
	 */
	async checkModelHealth(config: ModelConfig): Promise<boolean> {
		const cloudProviders = [
			"openai",
			"anthropic",
			"google",
			"azure_openai",
			"deepseek",
			"moonshot",
			"kimi",
			"openrouter",
		];
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
			await validateServerFetchUrlAsync(baseUrl);
			const response = await fetch(`${baseUrl}/api/tags`, {
				signal: AbortSignal.timeout(3000),
			});
			return response.ok;
		} catch {
			try {
				if (!config.baseUrl) return false;
				const v1Url = config.baseUrl.endsWith("/v1")
					? `${config.baseUrl}/models`
					: `${config.baseUrl}/v1/models`;
				await validateServerFetchUrlAsync(v1Url);
				const res = await fetch(v1Url, { signal: AbortSignal.timeout(3000) });
				return res.ok;
			} catch {
				return false;
			}
		}
	}

	/**
	 * Create provider-specific model instance via unified adapter.
	 */
	private async createModelInstance(config: ModelConfig): Promise<any> {
		return createAIModelInstance(config);
	}

	/**
	 * Run multiple models in parallel with the same prompt.
	 * Respects maxConcurrency to avoid resource exhaustion.
	 * Pre-checks health of local models and skips unreachable ones.
	 */
	async runParallel(
		prompt: string,
		models?: ParallelModelConfig[],
	): Promise<ParallelPromptResult> {
		const modelsToRun = models ?? this.parallelConfigs;
		const startTime = Date.now();

		// Pre-check health: filter out unreachable models
		const healthChecks = await Promise.all(
			modelsToRun.map(async (config) => ({
				config,
				healthy: await this.checkModelHealth(config.config),
			})),
		);

		const healthyModels = healthChecks
			.filter((h) => h.healthy)
			.map((h) => h.config);
		const skippedModels = healthChecks
			.filter((h) => !h.healthy)
			.map((h) => h.config);

		if (skippedModels.length > 0) {
			console.warn(
				`[ParallelOrchestrator] Skipping ${skippedModels.length} unreachable model(s):`,
				skippedModels.map((m) => m.name),
			);
		}

		if (healthyModels.length === 0) {
			console.error(
				"[ParallelOrchestrator] No healthy models available for parallel execution",
			);
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
		const confidenceScore = this.calculateOverallConfidence(
			responses,
			consensusAnalysis,
		);

		const totalTokens = responses.reduce((sum, r) => sum + r.tokenCount, 0);
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
			verificationMode: "raw_query",
		};
	}

	async runEvidenceVerification(
		query: string,
		evidence: SearchEvidenceBundle,
		models?: ParallelModelConfig[],
	): Promise<ParallelPromptResult> {
		const modelsToRun = models ?? this.parallelConfigs;
		const startTime = Date.now();

		const healthChecks = await Promise.all(
			modelsToRun.map(async (config) => ({
				config,
				healthy: await this.checkModelHealth(config.config),
			})),
		);

		const healthyModels = healthChecks
			.filter((check) => check.healthy)
			.map((check) => check.config);
		const skippedModels = healthChecks
			.filter((check) => !check.healthy)
			.map((check) => check.config);

		if (skippedModels.length > 0) {
			console.warn(
				`[ParallelOrchestrator] Skipping ${skippedModels.length} unreachable model(s):`,
				skippedModels.map((model) => model.name),
			);
		}

		if (healthyModels.length === 0) {
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
				verificationMode: "evidence",
				supportedResultIds: [],
				evidenceCoverage: 0,
			};
		}

		console.log(
			`[ParallelOrchestrator] Executing evidence-grounded verification across ${healthyModels.length} model(s)`,
		);

		const responses = await this.executeWithConcurrency(
			healthyModels,
			(config) => this.executeEvidenceModel(query, evidence, config),
			this.maxConcurrency,
		);

		const consensusAnalysis = this.buildConsensus(responses, healthyModels);
		const confidenceScore = this.calculateOverallConfidence(
			responses,
			consensusAnalysis,
		);
		const supportedResultIds = [
			...new Set(
				responses.flatMap((response) => response.supportedResultIds || []),
			),
		];
		const evidenceCoverage =
			evidence.items.length > 0
				? supportedResultIds.length / evidence.items.length
				: 0;
		const totalTokens = responses.reduce(
			(sum, response) => sum + response.tokenCount,
			0,
		);
		const totalTime = Date.now() - startTime;

		console.log(
			`[ParallelOrchestrator] Evidence verification: agreement=${(consensusAnalysis.agreementScore * 100).toFixed(0)}%, ` +
				`coverage=${(evidenceCoverage * 100).toFixed(0)}%, supported=${supportedResultIds.length}`,
		);

		return {
			responses,
			consensus: consensusAnalysis.text || null,
			consensusAnalysis,
			confidenceScore,
			totalTokens,
			totalTime,
			verificationMode: "evidence",
			supportedResultIds,
			evidenceCoverage,
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
		const results: R[] = new Array(items.length);
		const executing: Set<Promise<void>> = new Set();

		for (let idx = 0; idx < items.length; idx++) {
			const currentIdx = idx;
			const promise = fn(items[currentIdx]).then((result) => {
				results[currentIdx] = result;
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

		const totalTokens = responses.reduce((sum, r) => sum + r.tokenCount, 0);
		const totalTime = Date.now() - startTime;

		const consensusAnalysis: ConsensusAnalysis = {
			text: responses[responses.length - 1]?.response || "",
			agreementScore: 1.0, // Sequential chain produces a single refined result
			agreedClaims: [],
			contradictions: [],
			strategy: "unanimous",
			modelWeights: Object.fromEntries(
				responses.map((r, _i) => [r.modelName, 1 / responses.length]),
			),
		};

		return {
			responses,
			consensus: responses[responses.length - 1]?.response || null,
			consensusAnalysis,
			confidenceScore: this.calculateOverallConfidence(
				responses,
				consensusAnalysis,
			),
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
			const modelInstance = await this.createModelInstance(config);

			const result = await generateText({
				model: modelInstance,
				prompt,
				temperature: config.temperature,
				maxOutputTokens: config.maxTokens,
			});

			const processingTime = Date.now() - startTime;

			// Calculate confidence based on response length and coherence
			const confidence = this.estimateConfidence(
				result.text,
				parallelConfig.role,
			);

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

	private async executeEvidenceModel(
		query: string,
		evidence: SearchEvidenceBundle,
		parallelConfig: ParallelModelConfig,
	): Promise<ModelResponse> {
		const prompt = buildEvidenceVerificationPrompt(
			query,
			evidence,
			parallelConfig.role,
		);
		const baseResponse = await this.executeModel(prompt, parallelConfig);
		if (baseResponse.response.startsWith("Error:")) {
			return {
				...baseResponse,
				verdict: "error",
				supportedResultIds: [],
				agreedClaims: [],
				contradictions: [],
				openQuestions: ["Model failed to respond"],
			};
		}

		const parsed = this.parseEvidenceResponse(baseResponse.response);
		if (!parsed) {
			return {
				...baseResponse,
				verdict: "insufficient",
				supportedResultIds: [],
				agreedClaims: this.extractClaims(baseResponse.response),
				contradictions: [],
				openQuestions: ["Model returned unstructured verification output"],
			};
		}

		return {
			...baseResponse,
			response: parsed.answer || baseResponse.response,
			verdict: parsed.verdict,
			supportedResultIds: parsed.supportedResultIds,
			agreedClaims: parsed.agreedClaims.map((claim) => claim.claim),
			contradictions: parsed.contradictions.map((claim) => claim.claim),
			openQuestions: parsed.openQuestions,
		};
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
		_models: ParallelModelConfig[],
	): ConsensusAnalysis {
		if (responses.length === 0) {
			return {
				text: "",
				agreementScore: 0,
				agreedClaims: [],
				contradictions: [],
				strategy: "none",
				modelWeights: {},
			};
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
			const claims =
				r.agreedClaims && r.agreedClaims.length > 0
					? r.agreedClaims
					: this.extractClaims(r.response);
			modelClaims.set(r.modelName, claims);
		}

		// 3. Pairwise claim agreement – a claim is "agreed" if a similar claim
		//    appears in at least ceil(n/2) models' outputs (majority threshold)
		const allClaims: Array<{ claim: string; model: string }> = [];
		for (const [model, claims] of modelClaims) {
			for (const c of claims) allClaims.push({ claim: c, model });
		}

		// Strict majority: more than half, so a tie never counts as agreement
		const majorityThreshold = Math.floor(responses.length / 2) + 1;
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
				const sim = this.claimSimilarity(
					allClaims[i].claim,
					allClaims[j].claim,
				);
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
		const structuredContradictions = responses.flatMap(
			(response) => response.contradictions || [],
		);
		const cappedContradictions = [
			...new Set([...contradictions, ...structuredContradictions]),
		].slice(0, 10);

		// 5. Agreement score – ratio of agreed claims to total models
		// Each agreed claim already required strict majority support above.
		// Score = how many claims the models agree on relative to the model count.
		const agreementScore =
			responses.length > 0
				? Math.min(1, agreedClaims.length / responses.length)
				: 0;

		// 6. Pick strategy
		// Unanimous requires perfect agreement (score === 1) AND zero contradictions.
		// This prevents partial agreement from being promoted to unanimous.
		let strategy: ConsensusAnalysis["strategy"];
		if (agreementScore === 1 && cappedContradictions.length === 0) {
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
				if (s > bestScore) {
					bestScore = s;
					best = r;
				}
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

		const negations =
			/\b(not|no|never|none|neither|nor|isn't|aren't|wasn't|weren't|don't|doesn't|didn't|won't|wouldn't|can't|cannot|shouldn't|couldn't)\b/i;
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
			const w = consensus.modelWeights[r.modelName] ?? 1 / responses.length;
			weightedConf += r.confidence * w;
		}

		// Agreement bonus: strong agreement across models → higher confidence
		const agreementBonus = consensus.agreementScore * 0.15;

		// Contradiction penalty: each contradiction reduces confidence
		const contradictionPenalty = Math.min(
			0.2,
			consensus.contradictions.length * 0.04,
		);

		// Strategy bonus: unanimous > majority > weighted > best-single
		const strategyBonus: Record<string, number> = {
			unanimous: 0.1,
			majority: 0.05,
			weighted: 0,
			"best-single": -0.05,
			none: -0.1,
		};

		const raw =
			weightedConf +
			agreementBonus -
			contradictionPenalty +
			(strategyBonus[consensus.strategy] ?? 0);
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
		if (role === "reasoner" && response.includes("because")) confidence += 0.1;
		if (role === "orchestrator" && response.includes("step")) confidence += 0.1;

		return Math.max(0, Math.min(1, confidence));
	}

	private parseEvidenceResponse(text: string): {
		answer: string;
		verdict: "supported" | "mixed" | "insufficient";
		supportedResultIds: string[];
		agreedClaims: Array<{ claim: string; resultIds: string[] }>;
		contradictions: Array<{ claim: string; resultIds: string[] }>;
		openQuestions: string[];
	} | null {
		const jsonText = this.extractJsonObject(text);
		if (!jsonText) return null;

		try {
			const parsed = JSON.parse(jsonText);
			const verdict =
				parsed?.verdict === "supported" ||
				parsed?.verdict === "mixed" ||
				parsed?.verdict === "insufficient"
					? parsed.verdict
					: "insufficient";
			const supportedResultIds = Array.isArray(parsed?.supportedResultIds)
				? parsed.supportedResultIds.filter(
						(id: unknown): id is string => typeof id === "string",
					)
				: [];
			const agreedClaims = Array.isArray(parsed?.agreedClaims)
				? parsed.agreedClaims
						.map((claim: unknown) => this.normalizeClaimObject(claim))
						.filter(Boolean)
				: [];
			const contradictions = Array.isArray(parsed?.contradictions)
				? parsed.contradictions
						.map((claim: unknown) => this.normalizeClaimObject(claim))
						.filter(Boolean)
				: [];
			const openQuestions = Array.isArray(parsed?.openQuestions)
				? parsed.openQuestions.filter(
						(item: unknown): item is string => typeof item === "string",
					)
				: [];

			return {
				answer: typeof parsed?.answer === "string" ? parsed.answer.trim() : "",
				verdict,
				supportedResultIds,
				agreedClaims,
				contradictions,
				openQuestions,
			};
		} catch {
			return null;
		}
	}

	private normalizeClaimObject(
		claim: unknown,
	): { claim: string; resultIds: string[] } | null {
		if (!claim || typeof claim !== "object") return null;
		const normalizedClaim = claim as {
			claim?: unknown;
			resultIds?: unknown;
		};
		if (typeof normalizedClaim.claim !== "string") return null;

		return {
			claim: normalizedClaim.claim.trim(),
			resultIds: Array.isArray(normalizedClaim.resultIds)
				? normalizedClaim.resultIds.filter(
						(id: unknown): id is string => typeof id === "string",
					)
				: [],
		};
	}

	private extractJsonObject(text: string): string | null {
		const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
		const candidate = fenced?.[1] || text;
		const start = candidate.indexOf("{");
		const end = candidate.lastIndexOf("}");
		if (start === -1 || end === -1 || end <= start) return null;
		return candidate.slice(start, end + 1);
	}
}
