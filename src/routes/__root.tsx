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
import * as Sentry from "@sentry/tanstackstart-react";
import Header from "../components/Header";

import ConvexProvider from "../integrations/convex/provider";
import WorkOSProvider from "../integrations/workos/provider";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import StoreDevtools from "../lib/demo-store-devtools";
import appCss from "../styles.css?url";
import { modelConfig } from "../lib/model-config";
import { detectOllamaModels, detectLMStudioModels } from "../lib/ai/model-detection";
import { initSentry } from "../lib/sentry";

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

/**
 * The top-level HTML document component that wraps the app UI and providers.
 *
 * Renders the full HTML structure (head and body), conditionally shows the header except on the root path, and on first mount initializes Sentry and performs local model detection/configuration.
 *
 * @param children - React nodes to render inside the document body within the app providers
 * @returns The complete HTML document element containing head, body, providers, and app content
 */
function RootDocument({ children }: { children: React.ReactNode }) {
	const location = useLocation();

	// Hide header on home page for clean chat experience
	const showHeader = location.pathname !== "/";

	// Initialize Sentry and model configurations on app startup
	useEffect(() => {
		// Initialize Sentry error tracking
		try {
			initSentry({
				enabled: import.meta.env.PROD, // Enable only in production
			});
			console.log("[Sentry] Initialized successfully");
		} catch (error) {
			console.error("[Sentry] Failed to initialize:", error);
		}

		async function initializeModels() {
			try {
				// NOTE: API keys are now stored securely in Convex, NOT localStorage!
				// Model configurations will be loaded from Convex via authenticated queries

				// Auto-detect local models (Ollama & LM Studio)
				const ollamaModels = await detectOllamaModels();
				const lmStudioModels = await detectLMStudioModels();

				if (ollamaModels.length > 0) {
					console.log("[App] Detected Ollama models:", ollamaModels.map(m => m.modelId));

					// Set first Ollama model as default (no API key needed for local models)
					const defaultOllamaConfig = {
						provider: "ollama" as const,
						model: ollamaModels[0].modelId,
						baseUrl: "http://localhost:11434/v1",
						temperature: 0.7,
						maxTokens: 32000,
						timeout: 60000,
						enableStreaming: false,
					};
					modelConfig.addConfig("ollama-default", defaultOllamaConfig);
					modelConfig.setActiveConfig("ollama-default");
					console.log("[App] Set Ollama as default provider");
				}

				if (lmStudioModels.length > 0) {
					console.log("[App] Detected LM Studio models:", lmStudioModels.map(m => m.modelId));
				}

				// Show status in console
				const configs = modelConfig.listConfigs();
				console.log("[App] Available model configurations:", configs.length);
				console.log("[Security] API keys are stored securely in Convex, not in browser localStorage");
			} catch (error) {
				console.error("[App] Failed to initialize model configurations:", error);
				Sentry.captureException(error);
			}
		}

		initializeModels();
	}, []);

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<Sentry.ErrorBoundary fallback={<div>An error occurred. Please refresh the page.</div>}>
					<ConvexProvider>
						<WorkOSProvider>
						{showHeader && <Header />}
						{children}
						</WorkOSProvider>
					</ConvexProvider>
				</Sentry.ErrorBoundary>
				<Scripts />
			</body>
		</html>
	);
}