import type { ModelConfig } from "../model-config";

export type SearchExecutionMode =
	| "retrieval_only"
	| "single_model"
	| "dual_model"
	| "swarm";
export type SearchExecutionRole =
	| "validator"
	| "reasoner"
	| "synthesizer"
	| "orchestrator";

export interface SearchExecutionPolicy {
	mode: SearchExecutionMode;
	reason: string;
	modelCount: number;
	useParallelModels: boolean;
	useSegmentation: boolean;
	useInterleavedReasoning: boolean;
}

export interface SearchExecutionSummary {
	mode: SearchExecutionMode;
	reason: string;
	modelCount: number;
}

export interface RoleAssignedModelConfig {
	name: string;
	config: ModelConfig;
	role: SearchExecutionRole;
}

export function resolveSearchExecutionPolicy(params: {
	primaryModelConfig: ModelConfig | null | undefined;
	parallelModelConfigs?: ModelConfig[];
	requestedParallelModels?: boolean;
	requestedSegmentation?: boolean;
	requestedInterleavedReasoning?: boolean;
}): SearchExecutionPolicy {
	const {
		primaryModelConfig,
		parallelModelConfigs = [],
		requestedParallelModels = true,
		requestedSegmentation = false,
		requestedInterleavedReasoning = true,
	} = params;

	const configuredModelCount = primaryModelConfig
		? Math.max(1, parallelModelConfigs.length || 1)
		: 0;

	if (!primaryModelConfig) {
		return {
			mode: "retrieval_only",
			reason: "No model configured, using retrieval-only execution.",
			modelCount: 0,
			useParallelModels: false,
			useSegmentation: false,
			useInterleavedReasoning: false,
		};
	}

	if (!requestedParallelModels || configuredModelCount <= 1) {
		return {
			mode: "single_model",
			reason:
				configuredModelCount > 1
					? "Multiple models are configured, but parallel execution is disabled."
					: "One model available, using single-model assisted search.",
			modelCount: configuredModelCount,
			useParallelModels: false,
			useSegmentation: requestedSegmentation,
			useInterleavedReasoning: requestedInterleavedReasoning,
		};
	}

	if (configuredModelCount === 2) {
		return {
			mode: "dual_model",
			reason:
				"Two models available, using synthesizer plus validator execution.",
			modelCount: 2,
			useParallelModels: true,
			useSegmentation: requestedSegmentation,
			useInterleavedReasoning: requestedInterleavedReasoning,
		};
	}

	return {
		mode: "swarm",
		reason:
			"Three or more models available, enabling specialized parallel execution.",
		modelCount: configuredModelCount,
		useParallelModels: true,
		useSegmentation: requestedSegmentation,
		useInterleavedReasoning: requestedInterleavedReasoning,
	};
}

export function assignExecutionRoles(
	modelConfigs: ModelConfig[],
	mode: SearchExecutionMode,
): RoleAssignedModelConfig[] {
	return modelConfigs.map((config, index) => {
		let role: SearchExecutionRole = "reasoner";

		if (mode === "dual_model") {
			role = index === 0 ? "synthesizer" : "validator";
		} else if (mode === "swarm") {
			if (index === 0) role = "orchestrator";
			else if (index === 1) role = "synthesizer";
			else if (index === 2) role = "validator";
			else role = "reasoner";
		} else if (mode === "single_model") {
			role = "synthesizer";
		}

		return {
			name: `${config.provider}:${config.model}`,
			config,
			role,
		};
	});
}
