import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
	useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import Header from "../components/Header";

import ConvexProvider from "../integrations/convex/provider";
import WorkOSProvider from "../integrations/workos/provider";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import StoreDevtools from "../lib/demo-store-devtools";
import appCss from "../styles.css?url";
import { modelConfig } from "../lib/model-config";
import { loadActiveConfig, initializeEncryptedStorage } from "../lib/model-storage";
import { detectOllamaModels, detectLMStudioModels } from "../lib/ai/model-detection";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Agentic Search - The Future of Intelligent Search",
			},
			{
				name: "description",
				content: "Move beyond unsafe RAG systems. Agentic search uses multi-model reasoning, adversarial validation, and OCR compression for superior results with continuous learning.",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const location = useLocation();

	// Hide header on home page for clean chat experience
	const showHeader = location.pathname !== "/";

	// Load model configurations on app startup
	useEffect(() => {
		async function initializeModels() {
			try {
				// Initialize encrypted storage for API keys
				await initializeEncryptedStorage();

				// Load active configuration from localStorage
				const active = await loadActiveConfig();
				if (active) {
					console.log("[App] Loaded active config:", active.id, active.config.provider);
					modelConfig.addConfig(active.id, active.config);
					modelConfig.setActiveConfig(active.id);
				}

				// Auto-detect local models (Ollama & LM Studio)
				const ollamaModels = await detectOllamaModels();
				const lmStudioModels = await detectLMStudioModels();

				if (ollamaModels.length > 0) {
					console.log("[App] Detected Ollama models:", ollamaModels.map(m => m.modelId));

					// If no active config, set Ollama as default
					if (!active) {
						const defaultOllamaConfig = {
							provider: "ollama" as const,
							model: ollamaModels[0].modelId,
							baseUrl: "http://localhost:11434/v1",
							temperature: 0.7,
							maxTokens: 32000,
							timeout: 60000,
							enableStreaming: false,
						};
						modelConfig.addConfig("ollama", defaultOllamaConfig);
						modelConfig.setActiveConfig("ollama");
						console.log("[App] Set Ollama as default provider");
					}
				}

				if (lmStudioModels.length > 0) {
					console.log("[App] Detected LM Studio models:", lmStudioModels.map(m => m.modelId));
				}

				// Show status in console
				const configs = modelConfig.listConfigs();
				console.log("[App] Available model configurations:", configs.length);
			} catch (error) {
				console.error("[App] Failed to initialize model configurations:", error);
			}
		}

		initializeModels();
	}, []);

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body suppressHydrationWarning>
				<ConvexProvider>
					<WorkOSProvider>
					{showHeader && <Header />}
					{children}
					</WorkOSProvider>
				</ConvexProvider>
				<Scripts />
			</body>
		</html>
	);
}
