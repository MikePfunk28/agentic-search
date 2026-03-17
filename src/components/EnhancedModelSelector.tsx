/**
 * Enhanced ModelSelector Component
 * Reads from the unified model store - shows only REAL detected/configured models.
 * No hardcoded model lists.
 */

import { Check, Globe, Sparkles, Wifi } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
	detectAndUpdateLocalModels,
	getModelStore,
	type ModelStore,
	setActiveModel,
	toggleActiveModel,
} from "../lib/model-store";

interface ModelOption {
	id: string;
	provider: string;
	model: string;
	label: string;
	description: string;
	isLocal: boolean;
	isAvailable: boolean;
}

interface ModelSelectorProps {
	selectedModels: string[];
	onChange: (modelIds: string[]) => void;
	disabled?: boolean;
	allowMultiple?: boolean;
}

export function EnhancedModelSelector({
	selectedModels,
	onChange,
	disabled = false,
	allowMultiple = true,
}: ModelSelectorProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [store, setStore] = useState<ModelStore>(getModelStore());

	// Refresh store when dropdown opens
	useEffect(() => {
		if (isOpen) {
			setStore(getModelStore());
			detectAndUpdateLocalModels()
				.then(() => setStore(getModelStore()))
				.catch((error) => {
					console.warn(
						"[EnhancedModelSelector] Failed to refresh local models:",
						error,
					);
				});
		}
	}, [isOpen]);

	// Listen for storage changes from SettingsModal
	useEffect(() => {
		const handleStorage = () => setStore(getModelStore());
		window.addEventListener("storage", handleStorage);
		// Poll for same-tab localStorage changes (storage event only fires cross-tab)
		const interval = setInterval(handleStorage, 2000);
		return () => {
			window.removeEventListener("storage", handleStorage);
			clearInterval(interval);
		};
	}, []);

	// Build model options from store
	const buildModelOptions = useCallback((): ModelOption[] => {
		const options: ModelOption[] = [];

		// Ollama models
		if (store.ollama && store.ollama.detectedModels.length > 0) {
			for (const model of store.ollama.detectedModels) {
				options.push({
					id: `ollama:${model}`,
					provider: "ollama",
					model,
					label: model,
					description: "Ollama (Local)",
					isLocal: true,
					isAvailable: true,
				});
			}
		}

		// LM Studio models
		if (store.lmstudio && store.lmstudio.detectedModels.length > 0) {
			for (const model of store.lmstudio.detectedModels) {
				options.push({
					id: `lmstudio:${model}`,
					provider: "lmstudio",
					model,
					label: model,
					description: "LM Studio (Local)",
					isLocal: true,
					isAvailable: true,
				});
			}
		}

		// Custom providers
		for (const custom of store.custom) {
			if (custom.models.length > 0) {
				for (const model of custom.models) {
					options.push({
						id: `${custom.id}:${model}`,
						provider: custom.id,
						model,
						label: model,
						description: custom.name,
						isLocal: false,
						isAvailable: !!custom.apiKey,
					});
				}
			} else if (custom.selectedModel) {
				options.push({
					id: `${custom.id}:${custom.selectedModel}`,
					provider: custom.id,
					model: custom.selectedModel,
					label: custom.selectedModel,
					description: custom.name,
					isLocal: false,
					isAvailable: !!custom.apiKey,
				});
			}
		}

		// Include active models that aren't already in the list
		// (e.g., LM Studio model selected previously but detection now failing)
		if (store.activeModels && store.activeModels.length > 0) {
			const existingIds = new Set(options.map((o) => o.id));
			for (const active of store.activeModels) {
				const id = `${active.provider}:${active.model}`;
				if (!existingIds.has(id)) {
					const isLocal = ["ollama", "lmstudio", "lm_studio"].includes(
						active.provider,
					);
					const providerLabel =
						active.provider === "ollama"
							? "Ollama"
							: active.provider === "lmstudio" ||
									active.provider === "lm_studio"
								? "LM Studio"
								: store.custom.find((c) => c.id === active.provider)?.name ||
									active.provider;
					options.push({
						id,
						provider: active.provider,
						model: active.model,
						label: active.model,
						description: `${providerLabel}${isLocal ? " (Local - offline)" : ""}`,
						isLocal,
						isAvailable: false, // Server not currently detected
					});
				}
			}
		}

		return options;
	}, [store]);

	const modelOptions = buildModelOptions();

	const toggleModel = (modelId: string) => {
		if (disabled) return;

		// Parse to update the unified store
		const [provider, ...modelParts] = modelId.split(":");
		const model = modelParts.join(":");

		if (provider && model) {
			if (allowMultiple) {
				toggleActiveModel(provider, model, "reasoner");
			} else {
				setActiveModel(provider, model);
			}
		}

		if (allowMultiple) {
			if (selectedModels.includes(modelId)) {
				onChange(selectedModels.filter((id) => id !== modelId));
			} else {
				onChange([...selectedModels, modelId]);
			}
		} else {
			onChange([modelId]);
			setIsOpen(false);
		}
	};

	const selectedOptions = modelOptions.filter((opt) =>
		selectedModels.includes(opt.id),
	);
	const localOptions = modelOptions.filter((opt) => opt.isLocal);
	const cloudOptions = modelOptions.filter((opt) => !opt.isLocal);

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => !disabled && setIsOpen(!isOpen)}
				disabled={disabled}
				className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 border-2 border-pink-500/50 rounded-lg
                   hover:border-pink-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20
                   disabled:bg-slate-800 disabled:cursor-not-allowed
                   transition-all duration-200 outline-none"
				aria-haspopup="listbox"
				aria-expanded={isOpen}
			>
				<div className="flex items-center gap-3">
					<Sparkles className="w-5 h-5 text-pink-500" />
					<div className="text-left">
						<div className="font-medium text-white">
							{selectedOptions.length > 0
								? `${selectedOptions.length} model${selectedOptions.length > 1 ? "s" : ""} selected`
								: modelOptions.length === 0
									? "No models configured"
									: "Select Models"}
						</div>
						<div className="text-sm text-gray-400">
							{selectedOptions.length > 0
								? selectedOptions.map((opt) => opt.label).join(", ")
								: modelOptions.length === 0
									? "Open Settings to configure"
									: allowMultiple
										? "Choose one or more models for parallel reasoning"
										: "Choose a model"}
						</div>
						<div className="text-xs text-slate-500">
							Search works without a model. Models improve planning, validation,
							and synthesis.
						</div>
					</div>
				</div>
			</button>

			{isOpen && (
				<>
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsOpen(false)}
						aria-hidden="true"
					/>

					<div
						className="absolute z-20 w-full mt-2 bg-slate-900 border-2 border-pink-500/30 rounded-lg shadow-xl
                       max-h-96 overflow-y-auto"
						role="listbox"
					>
						{modelOptions.length === 0 ? (
							<div className="p-4 text-center text-gray-400 text-sm">
								No models detected. Open Settings to add local or cloud models.
								You can mix multiple providers here.
							</div>
						) : (
							<>
								{localOptions.length > 0 && (
									<div className="p-2">
										<div className="px-3 py-2 text-xs font-semibold text-pink-500 uppercase tracking-wider">
											Local Models
										</div>
										{localOptions.map((option) => {
											const isSelected = selectedModels.includes(option.id);
											return (
												<button
													key={option.id}
													type="button"
													onClick={() => toggleModel(option.id)}
													className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left
                           hover:bg-pink-500/10 transition-colors
                           ${isSelected ? "bg-pink-500/20 border-l-4 border-pink-500" : ""}`}
													role="option"
													aria-selected={isSelected}
												>
													<Wifi className="w-4 h-4 text-green-500 flex-shrink-0" />
													<div className="flex-1 min-w-0">
														<div
															className={`font-medium text-sm ${isSelected ? "text-pink-300" : "text-white"}`}
														>
															{option.label}
														</div>
														<div className="text-xs text-gray-400">
															{option.description}
														</div>
													</div>
													{isSelected && (
														<Check className="w-5 h-5 text-pink-500 flex-shrink-0" />
													)}
												</button>
											);
										})}
									</div>
								)}

								{cloudOptions.length > 0 && (
									<div className="p-2 border-t border-slate-700">
										<div className="px-3 py-2 text-xs font-semibold text-cyan-500 uppercase tracking-wider">
											Cloud Models
										</div>
										{cloudOptions.map((option) => {
											const isSelected = selectedModels.includes(option.id);
											return (
												<button
													key={option.id}
													type="button"
													onClick={() => toggleModel(option.id)}
													className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left
                           hover:bg-cyan-500/10 transition-colors
                           ${isSelected ? "bg-cyan-500/20 border-l-4 border-cyan-500" : ""}`}
													role="option"
													aria-selected={isSelected}
												>
													<Globe
														className={`w-4 h-4 ${option.isAvailable ? "text-cyan-400" : "text-gray-500"} flex-shrink-0`}
													/>
													<div className="flex-1 min-w-0">
														<div
															className={`font-medium text-sm ${isSelected ? "text-cyan-300" : "text-white"}`}
														>
															{option.label}
														</div>
														<div className="text-xs text-gray-400">
															{option.description}
														</div>
													</div>
													{isSelected && (
														<Check className="w-5 h-5 text-cyan-500 flex-shrink-0" />
													)}
												</button>
											);
										})}
									</div>
								)}
							</>
						)}
					</div>
				</>
			)}
		</div>
	);
}
