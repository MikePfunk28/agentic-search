import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createOllama } from "ollama-ai-provider";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import {
	createCsrfErrorResponse,
	validateCsrfRequest,
} from "@/lib/csrf-protection";
import { ModelConfigManager, ModelProvider } from "@/lib/model-config";

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
				// CSRF Protection - properly enabled
				const validation = validateCsrfRequest(request);
				if (!validation.valid) {
					console.error("[CSRF] Validation failed:", validation.error);
					return createCsrfErrorResponse(validation.error || "CSRF validation failed");
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
							// Use native Ollama provider for proper endpoint support
							const ollamaBaseUrl = (modelConfig.baseUrl || "http://localhost:11434/v1").replace('/v1', '');
							const ollamaProvider = createOllama({
								baseURL: ollamaBaseUrl,
							});
							model = ollamaProvider(modelConfig.model);
							console.log(`[ChatAPI] Using Ollama at ${ollamaBaseUrl} with model ${modelConfig.model}`);
							break;
						case ModelProvider.LM_STUDIO:
							// LM Studio uses OpenAI-compatible API
							const lmStudioProvider = createOpenAI({
								apiKey: "lm-studio", // LM Studio doesn't require a real key
								baseURL: modelConfig.baseUrl || "http://localhost:1234/v1",
							});
							model = lmStudioProvider(modelConfig.model);
							console.log(`[ChatAPI] Using LM Studio at ${modelConfig.baseUrl || "http://localhost:1234/v1"}`);
							break;
						case ModelProvider.DEEPSEEK:
							// DeepSeek API - OpenAI-compatible
							const deepseekProvider = createOpenAICompatible({
								name: "deepseek",
								apiKey: modelConfig.apiKey || process.env.DEEPSEEK_API_KEY,
								baseURL: modelConfig.baseUrl || "https://api.deepseek.com/v1",
							});
							model = deepseekProvider(modelConfig.model);
							console.log(`[ChatAPI] Using DeepSeek API with model ${modelConfig.model}`);
							break;
						case ModelProvider.MOONSHOT:
							// Moonshot AI - OpenAI-compatible
							const moonshotProvider = createOpenAICompatible({
								name: "moonshot",
								apiKey: modelConfig.apiKey || process.env.MOONSHOT_API_KEY,
								baseURL: modelConfig.baseUrl || "https://api.moonshot.cn/v1",
							});
							model = moonshotProvider(modelConfig.model);
							console.log(`[ChatAPI] Using Moonshot AI with model ${modelConfig.model}`);
							break;
						case ModelProvider.KIMI:
							// Kimi K2 - OpenAI-compatible (uses Moonshot infrastructure)
							const kimiProvider = createOpenAICompatible({
								name: "kimi",
								apiKey: modelConfig.apiKey || process.env.KIMI_API_KEY,
								baseURL: modelConfig.baseUrl || "https://api.moonshot.cn/v1",
							});
							model = kimiProvider(modelConfig.model);
							console.log(`[ChatAPI] Using Kimi K2 with model ${modelConfig.model}`);
							break;
						case ModelProvider.VLLM:
							// vLLM - OpenAI-compatible local server
							const vllmProvider = createOpenAICompatible({
								name: "vllm",
								apiKey: "vllm", // vLLM doesn't require a real key
								baseURL: modelConfig.baseUrl || "http://localhost:8000/v1",
							});
							model = vllmProvider(modelConfig.model);
							console.log(`[ChatAPI] Using vLLM at ${modelConfig.baseUrl || "http://localhost:8000/v1"}`);
							break;
						case ModelProvider.GGUF:
							// GGUF loader - OpenAI-compatible local server
							const ggufProvider = createOpenAICompatible({
								name: "gguf",
								apiKey: "gguf", // GGUF doesn't require a real key
								baseURL: modelConfig.baseUrl || "http://localhost:8080/v1",
							});
							model = ggufProvider(modelConfig.model);
							console.log(`[ChatAPI] Using GGUF loader at ${modelConfig.baseUrl || "http://localhost:8080/v1"}`);
							break;
						case ModelProvider.ONNX:
							// ONNX runtime - OpenAI-compatible local server
							const onnxProvider = createOpenAICompatible({
								name: "onnx",
								apiKey: "onnx", // ONNX doesn't require a real key
								baseURL: modelConfig.baseUrl || "http://localhost:8081/v1",
							});
							model = onnxProvider(modelConfig.model);
							console.log(`[ChatAPI] Using ONNX runtime at ${modelConfig.baseUrl || "http://localhost:8081/v1"}`);
							break;
						default:
							console.error(`Unsupported provider: ${modelConfig.provider}`);
							return new Response(
								JSON.stringify({
									error: `Unsupported model provider: ${modelConfig.provider}`,
									details: "Please configure a valid model provider (OpenAI, Anthropic, Google, DeepSeek, Moonshot, Kimi, Ollama, LM Studio, vLLM, GGUF, ONNX)"
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
