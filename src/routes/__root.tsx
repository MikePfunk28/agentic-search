import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import Header from "../components/Header";

import ConvexAuthProvider from "../integrations/convex/auth-provider";

import { detectAndUpdateLocalModels, getModelStore } from "../lib/model-store";
import appCss from "../styles.css?url";

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
				content:
					"Move beyond unsafe RAG systems. Agentic search uses multi-model reasoning, adversarial validation, and OCR compression for superior results with continuous learning.",
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
	notFoundComponent: () => (
		<div className="mx-auto max-w-2xl px-6 py-20 text-center">
			<h1 className="text-3xl font-bold text-white">Page not found</h1>
			<p className="mt-3 text-slate-300">
				The route you requested does not exist.
			</p>
		</div>
	),
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const initializedRef = useRef(false);

	// Initialize model configurations on app startup
	// Uses the unified model store (model-store.ts) as single source of truth
	useEffect(() => {
		if (initializedRef.current) return;
		initializedRef.current = true;

		const store = getModelStore();
		const hasConfiguredLocalPreference =
			Boolean(store.ollama?.selectedModel) ||
			Boolean(store.lmstudio?.selectedModel);
		const shouldProbeLocalModels =
			!store.activeProvider ||
			store.activeProvider === "ollama" ||
			store.activeProvider === "lmstudio" ||
			hasConfiguredLocalPreference;

		if (!shouldProbeLocalModels) {
			console.log(
				"[App] Skipping local model detection on startup; active provider is",
				store.activeProvider,
			);
			console.log(
				"[App] Active provider:",
				store.activeProvider,
				"| Active model:",
				store.activeModel,
			);
			return;
		}

		detectAndUpdateLocalModels()
			.then((store) => {
				const ollamaCount = store.ollama?.detectedModels.length ?? 0;
				const lmstudioCount = store.lmstudio?.detectedModels.length ?? 0;
				if (ollamaCount > 0) {
					console.log(
						"[App] Detected Ollama models:",
						store.ollama?.detectedModels,
					);
				}
				if (lmstudioCount > 0) {
					console.log(
						"[App] Detected LM Studio models:",
						store.lmstudio?.detectedModels,
					);
				}
				console.log(
					"[App] Active provider:",
					store.activeProvider,
					"| Active model:",
					store.activeModel,
				);
				console.log(
					"[Security] API keys are stored securely in Convex, not in browser localStorage",
				);
			})
			.catch((error) => {
				console.error(
					"[App] Failed to initialize model configurations:",
					error,
				);
			});
	}, []);

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<ConvexAuthProvider>
					<Header />
					{children}
				</ConvexAuthProvider>
				<Scripts />
			</body>
		</html>
	);
}
