import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import {
	createCsrfErrorResponse,
	validateCsrfRequest,
} from "@/lib/csrf-protection.ts";
import { ModelConfigManager, ModelProvider } from "@/lib/model-config.ts";

const SYSTEM_PROMPT = `You are an intelligent AI assistant with access to agentic search capabilities. You can help users with:

1. **Conversational chat** - Answer questions and engage in discussion
2. **Agentic search** - When users ask questions requiring external information, you can perform intelligent searches
3. **Tool usage** - Access various tools and integrations

When users ask questions that might benefit from external information, suggest using the search functionality or offer to perform agentic searches on their behalf.

Be helpful, accurate, and transparent about your capabilities.`;

export const Route = createFileRoute("/api/chat")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				// CSRF Protection: POST method requires CSRF token validation
				const validation = validateCsrfRequest(request);
				if (!validation.valid) {
					console.warn(
						"[CSRF] Validation failed for /api/chat:",
						validation.error,
					);
					return createCsrfErrorResponse(validation.error!);
				}

				try {
					const { messages, modelProvider = "ollama" } = await request.json();

					if (!messages || !Array.isArray(messages)) {
						return new Response(
							JSON.stringify({ error: "Messages array is required" }),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// Get model configuration
					const modelManager = new ModelConfigManager();
					let modelConfig = modelManager.getConfig(modelProvider as ModelProvider) || modelManager.getActiveConfig();

					if (!modelConfig) {
						return new Response(
							JSON.stringify({ error: "No valid model configuration found. Please configure a model in Settings." }),
							{
								status: 500,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// API keys should be configured in model config or environment
					if (!modelConfig.apiKey && modelConfig.provider !== ModelProvider.OLLAMA && modelConfig.provider !== ModelProvider.LM_STUDIO) {
						console.warn(`[ChatAPI] No API key found for ${modelProvider}. Configure in Settings or environment variables.`);
					}

					// Create dynamic model instance based on provider
					let model;
					switch (modelConfig.provider) {
						case ModelProvider.ANTHROPIC:
							model = anthropic(modelConfig.model);
							break;
						case ModelProvider.OPENAI:
							// Use createOpenAI for proper configuration
							const openaiProvider = createOpenAI({
								apiKey: modelConfig.apiKey || process.env.OPENAI_API_KEY,
								baseURL: modelConfig.baseUrl,
							});
							model = openaiProvider(modelConfig.model);
							break;
						case ModelProvider.OLLAMA:
						case ModelProvider.LM_STUDIO:
							// Ollama and LM Studio are OpenAI-compatible
							const localProvider = createOpenAI({
								apiKey: "ollama", // Ollama doesn't require a real key
								baseURL: modelConfig.baseUrl || "http://localhost:11434/v1",
							});
							model = localProvider(modelConfig.model);
							console.log(`[ChatAPI] Using ${modelConfig.provider} at ${modelConfig.baseUrl}`);
							break;
						default:
							console.error(`Unsupported provider: ${modelConfig.provider}`);
							return new Response(
								JSON.stringify({
									error: `Unsupported model provider: ${modelConfig.provider}`,
									details: "Please configure a valid model provider (OpenAI, Anthropic, Ollama, or LM Studio)"
								}),
								{
									status: 400,
									headers: { "Content-Type": "application/json" },
								},
							);
					}

					console.log(`[ChatAPI] Using model: ${modelConfig.provider}:${modelConfig.model}`);

					const result = await streamText({
						model,
						messages: convertToModelMessages(messages),
						temperature: modelConfig.temperature,
						stopWhen: stepCountIs(5),
						system: SYSTEM_PROMPT,
					});

					return result.toUIMessageStreamResponse();

				} catch (error) {
					console.error("Chat API error:", error);
					return new Response(
						JSON.stringify({ error: "Failed to process chat request" }),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
		},
	},
});
