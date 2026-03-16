/**
 * Settings Modal Component
 * Unified model configuration: auto-detect local models, add custom API providers, Firecrawl key.
 * Uses the unified model store (src/lib/model-store.ts) as single source of truth.
 */

import {
	BookOpen,
	Check,
	Eye,
	EyeOff,
	Globe,
	Key,
	Loader2,
	Plus,
	RefreshCw,
	Star,
	Trash2,
	Wifi,
	WifiOff,
	X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
	addCustomProvider,
	detectAndUpdateLocalModels,
	detectCustomProviderModels,
	getModelStore,
	getRagEmbeddingConfig,
	getRagLevel,
	isModelActive,
	type ModelStore,
	migrateFromOldStorage,
	type RagLevel,
	removeCustomProvider,
	setActiveModel,
	setModelStore,
	setRagEmbeddingConfig,
	setRagLevel,
	setSearchApiKey,
	toggleActiveModel,
} from "../lib/model-store";

interface SettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

type TabId = "local" | "cloud" | "search-keys" | "knowledge-base";

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
	const [store, setStoreState] = useState<ModelStore>(getModelStore());
	const [activeTab, setActiveTab] = useState<TabId>("local");
	const [detecting, setDetecting] = useState(false);
	const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

	// New custom provider form
	const [newProvider, setNewProvider] = useState({
		name: "",
		baseUrl: "",
		apiKey: "",
		protocol: "openai-compatible" as "openai-compatible" | "anthropic",
	});
	const [detectingCustom, setDetectingCustom] = useState(false);
	const [customDetectionError, setCustomDetectionError] = useState<string | null>(null);
	const [customDetectedModels, setCustomDetectedModels] = useState<string[]>(
		[],
	);
	const [customSelectedModel, setCustomSelectedModel] = useState<string>("");

	// RAG / Knowledge Base state
	const [currentRagLevel, setCurrentRagLevel] = useState<RagLevel>(
		getRagLevel(),
	);
	const [ragEmbedding, setRagEmbedding] = useState(getRagEmbeddingConfig());

	// Refresh store from localStorage
	const refreshStore = useCallback(() => {
		setStoreState(getModelStore());
	}, []);

	// Migrate old data and auto-detect on first open
	useEffect(() => {
		if (!isOpen) return;

		migrateFromOldStorage();
		refreshStore();

		// Auto-detect local models
		setDetecting(true);
		detectAndUpdateLocalModels()
			.then(() => refreshStore())
			.finally(() => setDetecting(false));
	}, [isOpen, refreshStore]);

	// Save store helper
	const saveStore = useCallback((updated: ModelStore) => {
		setModelStore(updated);
		setStoreState({ ...updated });
	}, []);

	// --- Local Models Tab ---

	const handleDetectLocal = async () => {
		setDetecting(true);
		try {
			await detectAndUpdateLocalModels();
			refreshStore();
		} finally {
			setDetecting(false);
		}
	};

	const handleToggleOllamaModel = (model: string) => {
		toggleActiveModel("ollama", model, "reasoner");
		refreshStore();
	};

	const handleToggleLMStudioModel = (model: string) => {
		toggleActiveModel("lmstudio", model, "reasoner");
		refreshStore();
	};

	const handleOllamaUrlChange = (url: string) => {
		const updated = { ...store };
		if (!updated.ollama) {
			updated.ollama = {
				baseUrl: url,
				detectedModels: [],
				selectedModel: null,
			};
		} else {
			updated.ollama.baseUrl = url;
		}
		saveStore(updated);
	};

	const handleOllamaApiKeyChange = (apiKey: string) => {
		const updated = { ...store };
		if (!updated.ollama) {
			updated.ollama = {
				baseUrl: "http://localhost:11434",
				detectedModels: [],
				selectedModel: null,
				apiKey,
			};
		} else {
			updated.ollama.apiKey = apiKey || undefined;
		}
		saveStore(updated);
	};

	const handleLMStudioUrlChange = (url: string) => {
		const updated = { ...store };
		if (!updated.lmstudio) {
			updated.lmstudio = {
				baseUrl: url,
				detectedModels: [],
				selectedModel: null,
			};
		} else {
			updated.lmstudio.baseUrl = url;
		}
		saveStore(updated);
	};

	const handleLMStudioApiKeyChange = (apiKey: string) => {
		const updated = { ...store };
		if (!updated.lmstudio) {
			updated.lmstudio = {
				baseUrl: "http://localhost:1234",
				detectedModels: [],
				selectedModel: null,
				apiKey,
			};
		} else {
			updated.lmstudio.apiKey = apiKey || undefined;
		}
		saveStore(updated);
	};

	// --- Cloud / Custom Tab ---

	const handleTestCustom = async () => {
		if (!newProvider.baseUrl) return;

		setDetectingCustom(true);
		setCustomDetectedModels([]);
		setCustomDetectionError(null);
		try {
			const { models, error } = await detectCustomProviderModels(
				newProvider.baseUrl,
				newProvider.apiKey || undefined,
				newProvider.protocol,
			);
			setCustomDetectedModels(models);
			setCustomDetectionError(error);
			if (models.length > 0) {
				setCustomSelectedModel(models[0]);
			}
		} finally {
			setDetectingCustom(false);
		}
	};

	const handleAddCustomProvider = () => {
		if (!newProvider.name || !newProvider.baseUrl) return;

		// Include manually typed model in the models list if not from detection
		const models =
			customDetectedModels.length > 0
				? customDetectedModels
				: customSelectedModel
					? [customSelectedModel]
					: [];

		addCustomProvider({
			name: newProvider.name,
			baseUrl: newProvider.baseUrl,
			apiKey: newProvider.apiKey || undefined,
			models,
			selectedModel: customSelectedModel || null,
			protocol: newProvider.protocol,
		});

		// Set as active if a model was selected
		if (customSelectedModel) {
			const updatedStore = getModelStore();
			const added = updatedStore.custom[updatedStore.custom.length - 1];
			if (added) {
				setActiveModel(added.id, customSelectedModel);
			}
		}

		// Reset form
		setNewProvider({
			name: "",
			baseUrl: "",
			apiKey: "",
			protocol: "openai-compatible",
		});
		setCustomDetectedModels([]);
		setCustomSelectedModel("");
		refreshStore();
	};

	const handleRemoveCustom = (id: string) => {
		removeCustomProvider(id);
		refreshStore();
	};

	const handleToggleCustomModel = (providerId: string, model: string) => {
		// Also update the provider's models list so the selector can see it
		const currentStore = getModelStore();
		const providerIdx = currentStore.custom.findIndex(
			(c) => c.id === providerId,
		);
		if (providerIdx !== -1) {
			const provider = currentStore.custom[providerIdx];
			if (!provider.models.includes(model)) {
				provider.models.push(model);
			}
			provider.selectedModel = model;
			setModelStore(currentStore);
		}
		toggleActiveModel(providerId, model, "reasoner");
		refreshStore();
	};

	// --- Search Keys Tab ---

	const handleSearchKeyChange = (
		provider: "firecrawl" | "tavily" | "exa" | "brave",
		key: string,
	) => {
		setSearchApiKey(provider, key);
		refreshStore();
	};

	if (!isOpen) return null;

	const ollamaModels = store.ollama?.detectedModels || [];
	const lmstudioModels = store.lmstudio?.detectedModels || [];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/80 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-slate-900 border-2 border-pink-500/50 rounded-xl shadow-2xl overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
					<h2 className="text-2xl font-bold text-white">Settings</h2>
					<div className="flex items-center gap-3">
						{/* Active model indicator */}
						{store.activeModels.length > 0 ? (
							<span className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
								{store.activeModels.length} model
								{store.activeModels.length !== 1 ? "s" : ""} active
							</span>
						) : store.activeProvider && store.activeModel ? (
							<span className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
								Active: {store.activeModel}
							</span>
						) : null}
						<button
							onClick={onClose}
							className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
						>
							<X className="w-5 h-5 text-gray-400" />
						</button>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex border-b border-slate-800">
					{[
						{ id: "local" as TabId, icon: Wifi, label: "Local Models" },
						{ id: "cloud" as TabId, icon: Globe, label: "Cloud / Custom" },
						{ id: "search-keys" as TabId, icon: Key, label: "Search APIs" },
						{
							id: "knowledge-base" as TabId,
							icon: BookOpen,
							label: "Knowledge Base",
						},
					].map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${
								activeTab === tab.id
									? "text-pink-500 border-b-2 border-pink-500"
									: "text-gray-400 hover:text-white"
							}`}
						>
							<tab.icon className="w-4 h-4 inline mr-2" />
							{tab.label}
						</button>
					))}
				</div>

				{/* Content */}
				<div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
					<div className="mb-6 rounded-lg border border-slate-700 bg-slate-950/60 p-4">
						<div className="text-sm font-medium text-white">Quick Start</div>
						<div className="mt-2 space-y-1 text-xs text-gray-300">
							<p>
								1. Search works out of the box with free providers (DuckDuckGo,
								Wikipedia, Semantic Scholar, arXiv).
							</p>
							<p>
								2. Add your own API keys in Search APIs tab to unlock premium
								providers (Tavily, Exa, Firecrawl, Brave).
							</p>
							<p>
								3. Add local or cloud models for AI-powered planning,
								validation, and synthesis.
							</p>
						</div>
						<p className="mt-2 text-xs text-gray-500">
							Models are optional. Free search providers are always active.
						</p>
					</div>

					{/* === LOCAL MODELS TAB === */}
					{activeTab === "local" && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<p className="text-sm text-gray-400">
									Auto-detect models running on your machine. Use this for
									Ollama and LM Studio. Toggle multiple models to enable
									parallel reasoning.
								</p>
								<button
									onClick={handleDetectLocal}
									disabled={detecting}
									className="flex items-center gap-2 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-700
											   text-white text-sm font-medium rounded-lg transition-colors"
								>
									{detecting ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<RefreshCw className="w-4 h-4" />
									)}
									Detect
								</button>
							</div>

							{/* Ollama Section */}
							<div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-medium text-white flex items-center gap-2">
										{ollamaModels.length > 0 ? (
											<Wifi className="w-4 h-4 text-green-500" />
										) : (
											<WifiOff className="w-4 h-4 text-red-500" />
										)}
										Ollama
									</h3>
									<span className="text-xs text-gray-500">
										{ollamaModels.length > 0
											? `${ollamaModels.length} model${ollamaModels.length !== 1 ? "s" : ""} detected`
											: "Not running"}
									</span>
								</div>

								<div>
									<label className="block text-xs text-gray-400 mb-1">
										Base URL
									</label>
									<input
										type="text"
										value={store.ollama?.baseUrl || "http://localhost:11434"}
										onChange={(e) => handleOllamaUrlChange(e.target.value)}
										placeholder="http://localhost:11434"
										className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm
												   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
									/>
								</div>

								<div>
									<label className="block text-xs text-gray-400 mb-1">
										API Key (optional)
									</label>
									<input
										type="password"
										value={store.ollama?.apiKey || ""}
										onChange={(e) => handleOllamaApiKeyChange(e.target.value)}
										placeholder="Leave empty for local Ollama"
										className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm
												   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
									/>
								</div>

								{ollamaModels.length > 0 ? (
									<div className="space-y-1">
										<label className="block text-xs text-gray-400">
											Toggle Models (select multiple)
										</label>
										{ollamaModels.map((model) => {
											const isActive = isModelActive("ollama", model);
											return (
												<button
													key={model}
													onClick={() => handleToggleOllamaModel(model)}
													className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-colors ${
														isActive
															? "bg-pink-500/20 border border-pink-500/50 text-pink-300"
															: "hover:bg-slate-700 text-white"
													}`}
												>
													<span>{model}</span>
													{isActive && (
														<Check className="w-4 h-4 text-pink-500" />
													)}
												</button>
											);
										})}
									</div>
								) : (
									<p className="text-xs text-gray-500">
										Start Ollama and pull a model to use it here. Run:{" "}
										<code className="text-pink-400">ollama pull llama3.2</code>
									</p>
								)}
							</div>

							{/* LM Studio Section */}
							<div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-medium text-white flex items-center gap-2">
										{lmstudioModels.length > 0 ? (
											<Wifi className="w-4 h-4 text-green-500" />
										) : (
											<WifiOff className="w-4 h-4 text-red-500" />
										)}
										LM Studio
									</h3>
									<span className="text-xs text-gray-500">
										{lmstudioModels.length > 0
											? `${lmstudioModels.length} model${lmstudioModels.length !== 1 ? "s" : ""} detected`
											: "Not running"}
									</span>
								</div>

								<div>
									<label className="block text-xs text-gray-400 mb-1">
										Base URL
									</label>
									<input
										type="text"
										value={store.lmstudio?.baseUrl || "http://localhost:1234"}
										onChange={(e) => handleLMStudioUrlChange(e.target.value)}
										placeholder="http://localhost:1234"
										className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm
												   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
									/>
								</div>

								<div>
									<label className="block text-xs text-gray-400 mb-1">
										API Key (optional)
									</label>
									<input
										type="password"
										value={store.lmstudio?.apiKey || ""}
										onChange={(e) => handleLMStudioApiKeyChange(e.target.value)}
										placeholder="Leave empty for local LM Studio"
										className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm
												   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
									/>
								</div>

								{lmstudioModels.length > 0 ? (
									<div className="space-y-1">
										<label className="block text-xs text-gray-400">
											Toggle Models (select multiple)
										</label>
										{lmstudioModels.map((model) => {
											const isActive = isModelActive("lmstudio", model);
											return (
												<button
													key={model}
													onClick={() => handleToggleLMStudioModel(model)}
													className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-colors ${
														isActive
															? "bg-pink-500/20 border border-pink-500/50 text-pink-300"
															: "hover:bg-slate-700 text-white"
													}`}
												>
													<span>{model}</span>
													{isActive && (
														<Check className="w-4 h-4 text-pink-500" />
													)}
												</button>
											);
										})}
									</div>
								) : (
									<p className="text-xs text-gray-500">
										Start LM Studio and load a model to use it here. Make sure
										the LM Studio local server is started and answering on{" "}
										<code className="text-pink-400">/v1/models</code>.
									</p>
								)}
							</div>
						</div>
					)}

					{/* === CLOUD / CUSTOM TAB === */}
					{activeTab === "cloud" && (
						<div className="space-y-6">
							<p className="text-sm text-gray-400">
								Add any OpenAI-compatible or Anthropic API. You can save
								multiple providers with different API keys and mix their models
								in parallel.
							</p>

							{/* Add Provider Form */}
							<div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-4">
								<h3 className="font-medium text-white">Add API Provider</h3>

								{/* Quick presets */}
								<div className="flex gap-2 flex-wrap">
									{[
										{
											name: "OpenAI",
											url: "https://api.openai.com/v1",
											proto: "openai-compatible" as const,
										},
										{
											name: "Anthropic",
											url: "https://api.anthropic.com",
											proto: "anthropic" as const,
										},
										{
											name: "DeepSeek",
											url: "https://api.deepseek.com/v1",
											proto: "openai-compatible" as const,
										},
										{
											name: "OpenRouter",
											url: "https://openrouter.ai/api/v1",
											proto: "openai-compatible" as const,
										},
									].map((preset) => (
										<button
											key={preset.name}
											onClick={() =>
												setNewProvider((prev) => ({
													...prev,
													name: preset.name,
													baseUrl: preset.url,
													protocol: preset.proto,
												}))
											}
											className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-full transition-colors"
										>
											{preset.name}
										</button>
									))}
								</div>

								<div className="space-y-3">
									<div>
										<label className="block text-xs text-gray-400 mb-1">
											Provider Name
										</label>
										<input
											type="text"
											value={newProvider.name}
											onChange={(e) =>
												setNewProvider((prev) => ({
													...prev,
													name: e.target.value,
												}))
											}
											placeholder="e.g., z.ai, OpenRouter, My API"
											className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm
													   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
										/>
									</div>

									<div>
										<label className="block text-xs text-gray-400 mb-1">
											API Base URL
										</label>
										<input
											type="text"
											value={newProvider.baseUrl}
											onChange={(e) =>
												setNewProvider((prev) => ({
													...prev,
													baseUrl: e.target.value,
												}))
											}
											placeholder="https://api.example.com/v1"
											className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm
													   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
										/>
									</div>

									<div>
										<label className="block text-xs text-gray-400 mb-1">
											API Key
										</label>
										<div className="relative">
											<input
												type={showKeys["new-provider"] ? "text" : "password"}
												value={newProvider.apiKey}
												onChange={(e) =>
													setNewProvider((prev) => ({
														...prev,
														apiKey: e.target.value,
													}))
												}
												placeholder="sk-..."
												className="w-full px-3 py-2 pr-10 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm
														   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
											/>
											<button
												type="button"
												onClick={() =>
													setShowKeys((prev) => ({
														...prev,
														"new-provider": !prev["new-provider"],
													}))
												}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
											>
												{showKeys["new-provider"] ? (
													<EyeOff className="w-4 h-4" />
												) : (
													<Eye className="w-4 h-4" />
												)}
											</button>
										</div>
									</div>

									<div>
										<label className="block text-xs text-gray-400 mb-1">
											Protocol
										</label>
										<select
											value={newProvider.protocol}
											onChange={(e) =>
												setNewProvider((prev) => ({
													...prev,
													protocol: e.target.value as
														| "openai-compatible"
														| "anthropic",
												}))
											}
											className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm
													   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
										>
											<option value="openai-compatible">
												OpenAI Compatible (most providers)
											</option>
											<option value="anthropic">Anthropic</option>
										</select>
									</div>
								</div>

								{/* Test & Detect */}
								<button
									onClick={handleTestCustom}
									disabled={!newProvider.baseUrl || detectingCustom}
									className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:text-gray-500
											   text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
								>
									{detectingCustom ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<RefreshCw className="w-4 h-4" />
									)}
									Test Connection &amp; Detect Models
								</button>

								{/* Detection error */}
								{customDetectionError && (
									<p className="text-xs text-red-400 mt-1">{customDetectionError}</p>
								)}

								{/* Detected models dropdown or manual entry */}
								{customDetectedModels.length > 0 ? (
									<div className="space-y-2">
										<label className="block text-xs text-green-400">
											{customDetectedModels.length} model
											{customDetectedModels.length !== 1 ? "s" : ""} detected
										</label>
										<select
											value={customSelectedModel}
											onChange={(e) => setCustomSelectedModel(e.target.value)}
											className="w-full px-3 py-2 bg-slate-900 border border-green-500/50 rounded-lg text-white text-sm
													   focus:border-green-500 outline-none"
										>
											{customDetectedModels.map((m) => (
												<option key={m} value={m}>
													{m}
												</option>
											))}
										</select>
									</div>
								) : (
									<div className="space-y-2">
										<label className="block text-xs text-gray-400">
											Model Name (type manually or detect above)
										</label>
										<input
											type="text"
											value={customSelectedModel}
											onChange={(e) => setCustomSelectedModel(e.target.value)}
											placeholder="e.g., gpt-4o, claude-sonnet-4, mistral-large"
											className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm
													   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
										/>
									</div>
								)}

								{/* Add button */}
								<button
									onClick={handleAddCustomProvider}
									disabled={!newProvider.name || !newProvider.baseUrl}
									className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-700 disabled:text-gray-500
											   text-white font-medium rounded-lg transition-colors"
								>
									<Plus className="w-4 h-4 inline mr-2" />
									Add Provider
								</button>
							</div>

							{/* Existing Custom Providers */}
							{store.custom.length > 0 && (
								<div className="space-y-2">
									<h3 className="font-medium text-white">Your Providers</h3>
									{store.custom.map((provider) => (
										<div
											key={provider.id}
											className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg"
										>
											<div className="flex items-center justify-between mb-2">
												<div>
													<div className="font-medium text-white">
														{provider.name}
													</div>
													<div className="text-xs text-gray-400">
														{provider.baseUrl}
													</div>
												</div>
												<button
													onClick={() => handleRemoveCustom(provider.id)}
													className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>

											{/* Model selection for this provider */}
											{provider.models.length > 0 ? (
												<div className="space-y-1">
													{provider.models.slice(0, 10).map((model) => {
														const isActive = isModelActive(provider.id, model);
														return (
															<button
																key={model}
																onClick={() =>
																	handleToggleCustomModel(provider.id, model)
																}
																className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-left text-xs transition-colors ${
																	isActive
																		? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-300"
																		: "hover:bg-slate-700 text-gray-300"
																}`}
															>
																<span>{model}</span>
																{isActive && (
																	<Check className="w-3 h-3 text-cyan-500" />
																)}
															</button>
														);
													})}
													{provider.models.length > 10 && (
														<p className="text-xs text-gray-500 px-3">
															+{provider.models.length - 10} more models
														</p>
													)}
												</div>
											) : (
												<div className="flex gap-2 items-center">
													<input
														type="text"
														defaultValue={provider.selectedModel || ""}
														placeholder="Type model name"
														onBlur={(e) => {
															const val = e.target.value.trim();
															if (val)
																handleToggleCustomModel(provider.id, val);
														}}
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																const val = (
																	e.target as HTMLInputElement
																).value.trim();
																if (val)
																	handleToggleCustomModel(provider.id, val);
															}
														}}
														className="flex-1 px-2 py-1.5 bg-slate-900 border border-slate-600 rounded text-white text-xs
																   focus:border-cyan-500 outline-none"
													/>
													{store.activeProvider === provider.id && (
														<Check className="w-3 h-3 text-cyan-500 flex-shrink-0" />
													)}
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{/* === SEARCH API KEYS TAB === */}
					{activeTab === "search-keys" && (
						<div className="space-y-6">
							{/* Free providers — always active */}
							<div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg space-y-2">
								<p className="text-sm font-medium text-green-300">
									Free Search Providers (always active)
								</p>
								<div className="grid grid-cols-2 gap-2 text-xs">
									<div className="flex items-center gap-2 text-green-200">
										<Check className="w-3 h-3 text-green-500 flex-shrink-0" />
										DuckDuckGo — Web search
									</div>
									<div className="flex items-center gap-2 text-green-200">
										<Check className="w-3 h-3 text-green-500 flex-shrink-0" />
										Wikipedia — Encyclopedia
									</div>
									<div className="flex items-center gap-2 text-green-200">
										<Check className="w-3 h-3 text-green-500 flex-shrink-0" />
										Semantic Scholar — Academic papers
									</div>
									<div className="flex items-center gap-2 text-green-200">
										<Check className="w-3 h-3 text-green-500 flex-shrink-0" />
										arXiv — Research preprints
									</div>
								</div>
								<p className="text-xs text-green-400/70 mt-1">
									These run automatically on every search with no API key
									needed.
								</p>
							</div>

							<p className="text-sm text-gray-400">
								Add your own API keys to unlock premium search providers. Each
								provider has a free tier — click the signup links below to get
								started. All configured providers run in parallel for better
								coverage.
							</p>

							{[
								{
									key: "tavily" as const,
									label: "Tavily",
									placeholder: "tvly-...",
									signupUrl: "https://app.tavily.com/sign-up",
									docsUrl: "https://tavily.com",
									description: "AI-optimized search with built-in extraction",
									freeTier: "1,000 free searches/month",
								},
								{
									key: "exa" as const,
									label: "Exa",
									placeholder: "UUID key",
									signupUrl: "https://dashboard.exa.ai/login",
									docsUrl: "https://exa.ai",
									description: "Neural search with semantic understanding",
									freeTier: "1,000 free searches/month",
								},
								{
									key: "firecrawl" as const,
									label: "Firecrawl",
									placeholder: "fc-...",
									signupUrl: "https://www.firecrawl.dev/signin/signup",
									docsUrl: "https://firecrawl.dev",
									description: "Search + scrape + markdown extraction",
									freeTier: "500 free credits",
								},
								{
									key: "brave" as const,
									label: "Brave Search",
									placeholder: "BSA...",
									signupUrl: "https://brave.com/search/api/",
									docsUrl: "https://brave.com/search/api/",
									description: "Fast web search with privacy focus",
									freeTier: "2,000 free queries/month",
								},
							].map((provider) => {
								const storeKeyMap = {
									tavily: "tavilyApiKey",
									exa: "exaApiKey",
									firecrawl: "firecrawlApiKey",
									brave: "braveApiKey",
								} as const;
								const value = store[storeKeyMap[provider.key]] || "";
								return (
									<div
										key={provider.key}
										className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-2"
									>
										<div className="flex items-center justify-between">
											<label className="text-sm font-medium text-white">
												{provider.label}
												{value && (
													<span className="ml-2 text-xs text-green-400">
														Active
													</span>
												)}
											</label>
											<span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
												{provider.freeTier}
											</span>
										</div>
										<p className="text-xs text-gray-500">
											{provider.description}
										</p>
										<div className="relative">
											<input
												type={showKeys[provider.key] ? "text" : "password"}
												value={value}
												onChange={(e) =>
													handleSearchKeyChange(provider.key, e.target.value)
												}
												placeholder={provider.placeholder}
												className="w-full px-4 py-2 pr-10 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm
														   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
											/>
											<button
												type="button"
												onClick={() =>
													setShowKeys((prev) => ({
														...prev,
														[provider.key]: !prev[provider.key],
													}))
												}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
											>
												{showKeys[provider.key] ? (
													<EyeOff className="w-4 h-4" />
												) : (
													<Eye className="w-4 h-4" />
												)}
											</button>
										</div>
										<div className="flex gap-3 text-xs">
											<a
												href={provider.signupUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="text-pink-400 hover:text-pink-300 font-medium"
											>
												Get your free API key &rarr;
											</a>
											<a
												href={provider.docsUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="text-gray-500 hover:text-gray-400"
											>
												Docs
											</a>
										</div>
									</div>
								);
							})}

							<div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
								<p className="text-sm text-blue-200">
									Your keys are stored locally in your browser and only sent to
									this app's server route. They are never shared with third
									parties or stored on any server.
								</p>
							</div>
						</div>
					)}

					{/* === KNOWLEDGE BASE TAB === */}
					{activeTab === "knowledge-base" && (
						<div className="space-y-6">
							<p className="text-sm text-gray-400">
								Configure RAG (Retrieval-Augmented Generation) to enhance search
								results with your own documents. Choose a level, then create a
								knowledge base and upload content.
							</p>

							{/* RAG Level Selector */}
							<div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-3">
								<h3 className="font-medium text-white">RAG Level</h3>
								<div className="grid grid-cols-2 gap-2">
									{[
										{
											value: "none" as RagLevel,
											label: "Off",
											desc: "Web search only",
										},
										{
											value: "minimal" as RagLevel,
											label: "Minimal",
											desc: "BM25 text search",
										},
										{
											value: "medium" as RagLevel,
											label: "Medium",
											desc: "BM25 + vector embeddings",
										},
										{
											value: "full" as RagLevel,
											label: "Full",
											desc: "BM25 + vector + domain boost",
										},
									].map((opt) => (
										<button
											key={opt.value}
											onClick={() => {
												setRagLevel(opt.value);
												setCurrentRagLevel(opt.value);
											}}
											className={`p-3 rounded-lg text-left transition-colors border ${
												currentRagLevel === opt.value
													? "bg-pink-500/20 border-pink-500/50 text-pink-300"
													: "bg-slate-800/50 border-slate-700 text-gray-300 hover:bg-slate-700"
											}`}
										>
											<div className="text-sm font-medium">{opt.label}</div>
											<div className="text-xs text-gray-500 mt-1">
												{opt.desc}
											</div>
										</button>
									))}
								</div>
							</div>

							{/* Embedding Config (medium / full only) */}
							{(currentRagLevel === "medium" || currentRagLevel === "full") && (
								<div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-3">
									<h3 className="font-medium text-white">Embedding Model</h3>
									<p className="text-xs text-gray-500">
										Vector search requires an embedding model. Use your local
										Ollama or any OpenAI-compatible endpoint.
									</p>
									<div className="grid grid-cols-2 gap-3">
										<div>
											<label className="block text-xs text-gray-400 mb-1">
												Provider
											</label>
											<select
												value={ragEmbedding.provider}
												onChange={(e) => {
													const provider = e.target.value;
													setRagEmbeddingConfig(ragEmbedding.model, provider);
													setRagEmbedding({
														model: ragEmbedding.model,
														provider,
													});
												}}
												className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm
														   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
											>
												<option value="ollama">Ollama (local)</option>
												<option value="openai-compatible">
													OpenAI-compatible
												</option>
											</select>
										</div>
										<div>
											<label className="block text-xs text-gray-400 mb-1">
												Model Name
											</label>
											<input
												type="text"
												value={ragEmbedding.model}
												onChange={(e) => {
													const model = e.target.value;
													setRagEmbeddingConfig(model, ragEmbedding.provider);
													setRagEmbedding({
														model,
														provider: ragEmbedding.provider,
													});
												}}
												placeholder="nomic-embed-text"
												className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm
														   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
											/>
										</div>
									</div>
								</div>
							)}

							{/* Knowledge Base Info */}
							{currentRagLevel !== "none" && (
								<div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-3">
									<h3 className="font-medium text-white">Knowledge Bases</h3>
									<p className="text-xs text-gray-500">
										Knowledge bases are managed from the search interface.
										Upload documents via the
										<span className="text-pink-400"> Knowledge Base </span>
										panel that appears when RAG is enabled. Results from your
										knowledge base will be blended with web search results and
										clearly labeled.
									</p>
									<div className="flex items-center gap-2 text-xs text-gray-400">
										<Star className="w-3 h-3 text-yellow-500" />
										After each search, you can rate whether RAG, web, or merged
										results were most useful. This data appears in the analytics
										summary.
									</div>
								</div>
							)}

							{/* Level descriptions */}
							<div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg space-y-2">
								<p className="text-sm font-medium text-blue-200">
									How RAG Levels Work
								</p>
								<ul className="text-xs text-blue-300 space-y-1 list-disc list-inside">
									<li>
										<strong>Minimal</strong> — Fast BM25 keyword search over
										your uploaded documents.
									</li>
									<li>
										<strong>Medium</strong> — Adds vector embedding similarity
										for semantic matching (requires an embedding model).
									</li>
									<li>
										<strong>Full</strong> — Adds domain/topic boosting and
										knowledge graph traversal for maximum relevance.
									</li>
								</ul>
								<p className="text-xs text-blue-400 mt-2">
									All levels blend results with web search and are tracked via
									analytics so you can compare effectiveness.
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
