import { createFileRoute } from "@tanstack/react-router";
import {
	createCsrfErrorResponse,
	validateCsrfRequest,
} from "@/lib/csrf-protection";
import { chatRequestSchema } from "@/lib/api-schemas";
import { loadChatApiRuntime } from "@/lib/server/lazy-runtime";

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
					return createCsrfErrorResponse(
						validation.error || "CSRF validation failed",
					);
				}

				try {
					const rawBody = await request.json();
					const parsed = chatRequestSchema.safeParse(rawBody);
					if (!parsed.success) {
						return new Response(
							JSON.stringify({ error: "Invalid request", details: parsed.error.issues }),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// Keep messages as the raw body value so the AI SDK receives the
					// full UIMessage shape (including `parts`) that the client sends.
					// Zod validated the minimum required fields (role + content present,
					// array non-empty); the rest of the message shape is passed through.
					const messages = (rawBody as any).messages;
					const { modelProvider = "ollama", model: requestedModel } = parsed.data;
					const {
						createAnthropic,
						createOpenAI,
						createOpenAICompatible,
						convertToModelMessages,
						stepCountIs,
						streamText,
						ModelConfigManager,
						ModelProvider,
						normalizeAnthropicBaseUrl,
					} = await loadChatApiRuntime();

					// Get model configuration
					const modelManager = new ModelConfigManager();
					let modelConfig =
						modelManager.getConfig(modelProvider as any) ||
						modelManager.getActiveConfig();

					if (
						modelConfig &&
						typeof requestedModel === "string" &&
						requestedModel.length > 0
					) {
						modelConfig = { ...modelConfig, model: requestedModel };
					}

					if (!modelConfig) {
						return new Response(
							JSON.stringify({
								error:
									"No valid model configuration found. Please configure a model in Settings.",
							}),
							{
								status: 500,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// API keys should be configured in model config or environment
					if (
						!modelConfig.apiKey &&
						modelConfig.provider !== ModelProvider.OLLAMA &&
						modelConfig.provider !== ModelProvider.LM_STUDIO
					) {
						console.warn(
							`[ChatAPI] No API key found for ${modelProvider}. Configure in Settings or environment variables.`,
						);
					}

					// Create dynamic model instance based on provider
					let model:
						| ReturnType<ReturnType<typeof createAnthropic>>
						| ReturnType<ReturnType<typeof createOpenAI>>;
					switch (modelConfig.provider) {
						case ModelProvider.ANTHROPIC: {
							const anthropicProvider = createAnthropic({
								apiKey: modelConfig.apiKey || process.env.ANTHROPIC_API_KEY,
								baseURL:
									normalizeAnthropicBaseUrl(modelConfig.baseUrl) || undefined,
							});
							model = anthropicProvider(modelConfig.model);
							break;
						}
						case ModelProvider.OPENAI: {
							// Use createOpenAI for proper configuration
							const openaiProvider = createOpenAI({
								apiKey: modelConfig.apiKey || process.env.OPENAI_API_KEY,
								baseURL: modelConfig.baseUrl,
							});
							model = openaiProvider(modelConfig.model);
							break;
						}
						case ModelProvider.OLLAMA: {
							// Use OpenAI-compatible endpoint for AI SDK v2 model spec compatibility
							const ollamaProvider = createOpenAICompatible({
								name: "ollama",
								apiKey: "ollama", // ignored by Ollama, required by some clients
								baseURL: modelConfig.baseUrl || "http://localhost:11434/v1",
							});
							model = ollamaProvider(modelConfig.model);
							console.log(
								`[ChatAPI] Using Ollama at ${modelConfig.baseUrl || "http://localhost:11434/v1"} with model ${modelConfig.model}`,
							);
							break;
						}
						case ModelProvider.LM_STUDIO: {
							// LM Studio uses OpenAI-compatible API
							const lmStudioProvider = createOpenAI({
								apiKey: "lm-studio", // LM Studio doesn't require a real key
								baseURL: modelConfig.baseUrl || "http://localhost:1234/v1",
							});
							model = lmStudioProvider(modelConfig.model);
							console.log(
								`[ChatAPI] Using LM Studio at ${modelConfig.baseUrl || "http://localhost:1234/v1"}`,
							);
							break;
						}
						case ModelProvider.DEEPSEEK: {
							// DeepSeek API - OpenAI-compatible
							const deepseekProvider = createOpenAICompatible({
								name: "deepseek",
								apiKey: modelConfig.apiKey || process.env.DEEPSEEK_API_KEY,
								baseURL: modelConfig.baseUrl || "https://api.deepseek.com/v1",
							});
							model = deepseekProvider(modelConfig.model);
							console.log(
								`[ChatAPI] Using DeepSeek API with model ${modelConfig.model}`,
							);
							break;
						}
						case ModelProvider.MOONSHOT: {
							// Moonshot AI - OpenAI-compatible
							const moonshotProvider = createOpenAICompatible({
								name: "moonshot",
								apiKey: modelConfig.apiKey || process.env.MOONSHOT_API_KEY,
								baseURL: modelConfig.baseUrl || "https://api.moonshot.cn/v1",
							});
							model = moonshotProvider(modelConfig.model);
							console.log(
								`[ChatAPI] Using Moonshot AI with model ${modelConfig.model}`,
							);
							break;
						}
						case ModelProvider.KIMI: {
							// Kimi K2 - OpenAI-compatible (uses Moonshot infrastructure)
							const kimiProvider = createOpenAICompatible({
								name: "kimi",
								apiKey: modelConfig.apiKey || process.env.KIMI_API_KEY,
								baseURL: modelConfig.baseUrl || "https://api.moonshot.cn/v1",
							});
							model = kimiProvider(modelConfig.model);
							console.log(
								`[ChatAPI] Using Kimi K2 with model ${modelConfig.model}`,
							);
							break;
						}
						case ModelProvider.VLLM: {
							// vLLM - OpenAI-compatible local server
							const vllmProvider = createOpenAICompatible({
								name: "vllm",
								apiKey: "vllm", // vLLM doesn't require a real key
								baseURL: modelConfig.baseUrl || "http://localhost:8000/v1",
							});
							model = vllmProvider(modelConfig.model);
							console.log(
								`[ChatAPI] Using vLLM at ${modelConfig.baseUrl || "http://localhost:8000/v1"}`,
							);
							break;
						}
						case ModelProvider.GGUF: {
							// GGUF loader - OpenAI-compatible local server
							const ggufProvider = createOpenAICompatible({
								name: "gguf",
								apiKey: "gguf", // GGUF doesn't require a real key
								baseURL: modelConfig.baseUrl || "http://localhost:8080/v1",
							});
							model = ggufProvider(modelConfig.model);
							console.log(
								`[ChatAPI] Using GGUF loader at ${modelConfig.baseUrl || "http://localhost:8080/v1"}`,
							);
							break;
						}
						case ModelProvider.ONNX: {
							// ONNX runtime - OpenAI-compatible local server
							const onnxProvider = createOpenAICompatible({
								name: "onnx",
								apiKey: "onnx", // ONNX doesn't require a real key
								baseURL: modelConfig.baseUrl || "http://localhost:8081/v1",
							});
							model = onnxProvider(modelConfig.model);
							console.log(
								`[ChatAPI] Using ONNX runtime at ${modelConfig.baseUrl || "http://localhost:8081/v1"}`,
							);
							break;
						}
						default:
							console.error(`Unsupported provider: ${modelConfig.provider}`);
							return new Response(
								JSON.stringify({
									error: `Unsupported model provider: ${modelConfig.provider}`,
									details:
										"Please configure a valid model provider (OpenAI, Anthropic, Google, DeepSeek, Moonshot, Kimi, Ollama, LM Studio, vLLM, GGUF, ONNX)",
								}),
								{
									status: 400,
									headers: { "Content-Type": "application/json" },
								},
							);
					}

					console.log(
						`[ChatAPI] Using model: ${modelConfig.provider}:${modelConfig.model}`,
					);

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
