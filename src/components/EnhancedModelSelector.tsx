/**
 * Enhanced ModelSelector Component
 * Multi-select model picker with connection testing and 2025 latest models
 */

import { Check, Sparkles, Wifi, WifiOff, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { ModelProvider, AVAILABLE_MODELS } from "../lib/model-config";

interface ModelOption {
	id: string;
	provider: ModelProvider;
	model: string;
	label: string;
	description: string;
	isLocal: boolean;
}

interface ModelSelectorProps {
	selectedModels: string[];
	onChange: (modelIds: string[]) => void;
	disabled?: boolean;
	allowMultiple?: boolean;
}

/**
 * Renders a model selection UI with local (Ollama) and cloud models, showing per-model connection status and supporting single or multiple selection.
 *
 * @param selectedModels - Array of selected model IDs.
 * @param onChange - Callback invoked with the updated array of selected model IDs.
 * @param disabled - If true, disables user interaction and prevents selection changes.
 * @param allowMultiple - If true, allows multiple models to be selected; if false, selecting a model replaces the current selection.
 * @returns The model selector React element.
 */
export function EnhancedModelSelector({
	selectedModels,
	onChange,
	disabled = false,
	allowMultiple = true,
}: ModelSelectorProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [connectionStatus, setConnectionStatus] = useState<Record<string, 'connected' | 'disconnected' | 'testing'>>({});
	const hasDetected = useRef(false);

	// Define all available models with 2025 latest versions - memoize to prevent recreating
	const modelOptions: ModelOption[] = useMemo(() => [
		// Ollama local models
		...AVAILABLE_MODELS.Ollama.map(model => ({
			id: `ollama:${model}`,
			provider: ModelProvider.OLLAMA,
			model,
			label: model.toUpperCase().replace(':', ' '),
			description: "Local Ollama",
			isLocal: true,
		})),
		// OpenAI models
		...AVAILABLE_MODELS.OpenAI.map(model => ({
			id: `openai:${model}`,
			provider: ModelProvider.OPENAI,
			model,
			label: model.toUpperCase(),
			description: "OpenAI Cloud",
			isLocal: false,
		})),
		// Anthropic models
		...AVAILABLE_MODELS.Anthropic.map(model => ({
			id: `anthropic:${model}`,
			provider: ModelProvider.ANTHROPIC,
			model,
			label: model.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
			description: "Anthropic Cloud",
			isLocal: false,
		})),
	], []);

	// Test connection to a model
	const testConnection = async (option: ModelOption): Promise<boolean> => {
		setConnectionStatus(prev => ({ ...prev, [option.id]: 'testing' }));

		try {
			if (option.isLocal && option.provider === ModelProvider.OLLAMA) {
				// Test Ollama connection
				const response = await fetch('http://localhost:11434/api/tags', {
					signal: AbortSignal.timeout(5000),
				});

				if (!response.ok) {
					setConnectionStatus(prev => ({ ...prev, [option.id]: 'disconnected' }));
					return false;
				}

				const data = await response.json();
				const hasModel = data.models?.some((m: any) => m.name === option.model || m.name.startsWith(option.model));

				setConnectionStatus(prev => ({ 
					...prev, 
					[option.id]: hasModel ? 'connected' : 'disconnected' 
				}));
				return hasModel;
			}

			// For cloud models, just mark as connected (actual testing happens on first use)
			setConnectionStatus(prev => ({ ...prev, [option.id]: 'connected' }));
			return true;

		} catch (error) {
			console.error(`Failed to test connection to ${option.id}:`, error);
			setConnectionStatus(prev => ({ ...prev, [option.id]: 'disconnected' }));
			return false;
		}
	};

	// Auto-detect available Ollama models on mount - only once
	useEffect(() => {
		if (hasDetected.current) return;
		hasDetected.current = true;

		const detectOllamaModels = async () => {
			const ollamaOptions = modelOptions.filter(opt => opt.isLocal && opt.provider === ModelProvider.OLLAMA);
			
			for (const option of ollamaOptions) {
				await testConnection(option);
			}
		};

		detectOllamaModels();
	}, [modelOptions]);

	const toggleModel = (modelId: string) => {
		if (disabled) return;

		if (allowMultiple) {
			if (selectedModels.includes(modelId)) {
				onChange(selectedModels.filter(id => id !== modelId));
			} else {
				onChange([...selectedModels, modelId]);
			}
		} else {
			onChange([modelId]);
			setIsOpen(false);
		}
	};

	const getStatusIcon = (status: 'connected' | 'disconnected' | 'testing' | undefined) => {
		switch (status) {
			case 'connected':
				return <Wifi className="w-4 h-4 text-green-500" />;
			case 'disconnected':
				return <WifiOff className="w-4 h-4 text-red-500" />;
			case 'testing':
				return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
			default:
				return <AlertCircle className="w-4 h-4 text-gray-400" />;
		}
	};

	const selectedOptions = modelOptions.filter(opt => selectedModels.includes(opt.id));

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
								? `${selectedOptions.length} model${selectedOptions.length > 1 ? 's' : ''} selected`
								: "Select Models"}
						</div>
						<div className="text-sm text-gray-400">
							{selectedOptions.length > 0
								? selectedOptions.map(opt => opt.label).join(', ')
								: allowMultiple ? "Choose one or more models" : "Choose a model"}
						</div>
					</div>
				</div>
			</button>

			{/* Dropdown menu */}
			{isOpen && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsOpen(false)}
						aria-hidden="true"
					/>

					{/* Menu */}
					<div
						className="absolute z-20 w-full mt-2 bg-slate-900 border-2 border-pink-500/30 rounded-lg shadow-xl
                       max-h-96 overflow-y-auto"
						role="listbox"
					>
						{/* Local Models Section */}
						<div className="p-2">
							<div className="px-3 py-2 text-xs font-semibold text-pink-500 uppercase tracking-wider">
								Local Models (Ollama)
							</div>
							{modelOptions
								.filter(opt => opt.isLocal)
								.map((option) => {
									const isSelected = selectedModels.includes(option.id);
									const status = connectionStatus[option.id];

									return (
										<button
											key={option.id}
											type="button"
											onClick={() => toggleModel(option.id)}
											disabled={status === 'disconnected'}
											className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left
                           hover:bg-pink-500/10 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed
                           ${isSelected ? "bg-pink-500/20 border-l-4 border-pink-500" : ""}`}
											role="option"
											aria-selected={isSelected}
										>
											{/* Status icon */}
											<div className="flex-shrink-0">
												{getStatusIcon(status)}
											</div>

											{/* Model info */}
											<div className="flex-1 min-w-0">
												<div className={`font-medium text-sm ${isSelected ? "text-pink-300" : "text-white"}`}>
													{option.label}
												</div>
												<div className="text-xs text-gray-400">
													{option.description}
													{status === 'disconnected' && ' - Not available'}
													{status === 'testing' && ' - Testing...'}
												</div>
											</div>

											{/* Check icon */}
											{isSelected && (
												<Check className="w-5 h-5 text-pink-500 flex-shrink-0" />
											)}
										</button>
									);
								})}
						</div>

						{/* Cloud Models Section */}
						<div className="p-2 border-t border-slate-700">
							<div className="px-3 py-2 text-xs font-semibold text-cyan-500 uppercase tracking-wider">
								Cloud Models
							</div>
							{modelOptions
								.filter(opt => !opt.isLocal)
								.map((option) => {
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
											<Sparkles
												className={`w-4 h-4 ${isSelected ? "text-cyan-400" : "text-gray-500"}`}
											/>

											<div className="flex-1 min-w-0">
												<div className={`font-medium text-sm ${isSelected ? "text-cyan-300" : "text-white"}`}>
													{option.label}
												</div>
												<div className="text-xs text-gray-400">{option.description}</div>
											</div>

											{isSelected && (
												<Check className="w-5 h-5 text-cyan-500 flex-shrink-0" />
											)}
										</button>
									);
								})}
						</div>
					</div>
				</>
			)}
		</div>
	);
}