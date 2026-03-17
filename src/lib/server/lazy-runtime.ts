/**
 * Route-level lazy loaders for server-only modules.
 *
 * Cloudflare's Vite worker bootstrap evaluates route modules up front to
 * discover exports. Keeping the heavy AI/search stack behind dynamic imports
 * prevents worker startup from pulling Node-hostile modules into that phase.
 */

export async function loadSearchApiRuntime() {
	const [
		modelConfigModule,
		resultsStorageModule,
		searchProvidersModule,
		unifiedSearchModule,
	] = await Promise.all([
		import("@/lib/model-config"),
		import("@/lib/results-storage"),
		import("@/lib/search-providers"),
		import("@/lib/unified-search-orchestrator"),
	]);

	return {
		buildModelConfigFromClient: modelConfigModule.buildModelConfigFromClient,
		researchStorage: resultsStorageModule.researchStorage,
		getAvailableProviders: searchProvidersModule.getAvailableProviders,
		unifiedSearchOrchestrator: unifiedSearchModule.unifiedSearchOrchestrator,
	};
}

export async function loadChatApiRuntime() {
	const [
		anthropicModule,
		openAIModule,
		openAICompatibleModule,
		aiModule,
		modelConfigModule,
	] = await Promise.all([
		import("@ai-sdk/anthropic"),
		import("@ai-sdk/openai"),
		import("@ai-sdk/openai-compatible"),
		import("ai"),
		import("@/lib/model-config"),
	]);

	return {
		createAnthropic: anthropicModule.createAnthropic,
		createOpenAI: openAIModule.createOpenAI,
		createOpenAICompatible: openAICompatibleModule.createOpenAICompatible,
		convertToModelMessages: aiModule.convertToModelMessages,
		stepCountIs: aiModule.stepCountIs,
		streamText: aiModule.streamText,
		ModelConfigManager: modelConfigModule.ModelConfigManager,
		ModelProvider: modelConfigModule.ModelProvider,
		normalizeAnthropicBaseUrl: modelConfigModule.normalizeAnthropicBaseUrl,
	};
}

export async function loadOpenAIFineTuneRuntime() {
	return import("@/lib/openai-fine-tuning");
}
