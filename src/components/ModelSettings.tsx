/**
 * ModelSettings Component
 * Full settings modal/panel for model configuration
 */

import { RotateCcw, Save, Settings as SettingsIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
	type ModelConfig,
	ModelProvider,
	ProviderDefaults,
} from "../lib/model-config";
import { ApiKeyInput } from "./ApiKeyInput";
import { ConnectionStatus } from "./ConnectionStatus";
import { ModelSelector } from "./ModelSelector";

interface ModelSettingsProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (config: ModelConfig) => void;
	initialConfig?: ModelConfig;
}

export function ModelSettings({
	isOpen,
	onClose,
	initialConfig,
	onSave,
}: ModelSettingsProps) {
	// Form state
	const [provider, setProvider] = useState<ModelProvider>(
		initialConfig?.provider || ModelProvider.ANTHROPIC,
	);
	const [apiKey, setApiKey] = useState(initialConfig?.apiKey || "");
	const [baseUrl, setBaseUrl] = useState(
		initialConfig?.baseUrl ||
			ProviderDefaults[ModelProvider.ANTHROPIC].baseUrl ||
			"",
	);
	const [model, setModel] = useState(
		initialConfig?.model ||
			ProviderDefaults[ModelProvider.ANTHROPIC].model ||
			"",
	);
	const [temperature, setTemperature] = useState(
		initialConfig?.temperature || 0.7,
	);
	const [maxTokens, setMaxTokens] = useState(initialConfig?.maxTokens || 4096);
	const [enableStreaming, setEnableStreaming] = useState(
		initialConfig?.enableStreaming || false,
	);

	// Connection test state
	const [isTestingConnection, setIsTestingConnection] = useState(false);
	const [connectionStatus, setConnectionStatus] = useState<boolean | null>(
		null,
	);
	const [connectionLatency, setConnectionLatency] = useState<
		number | undefined
	>();
	const [connectionError, setConnectionError] = useState<string | undefined>();

	// Update defaults when provider changes
	useEffect(() => {
		const defaults = ProviderDefaults[provider];
		setBaseUrl(defaults.baseUrl || "");
		setModel(defaults.model || "");
		setTemperature(defaults.temperature || 0.7);
		setMaxTokens(defaults.maxTokens || 4096);
	}, [provider]);

	const handleReset = () => {
		const defaults = ProviderDefaults[provider];
		setApiKey("");
		setBaseUrl(defaults.baseUrl || "");
		setModel(defaults.model || "");
		setTemperature(defaults.temperature || 0.7);
		setMaxTokens(defaults.maxTokens || 4096);
		setEnableStreaming(false);
		setConnectionStatus(null);
		setConnectionLatency(undefined);
		setConnectionError(undefined);
	};

	const handleTestConnection = async () => {
		setIsTestingConnection(true);
		setConnectionError(undefined);

		try {
			const startTime = Date.now();

			// Simulate connection test (replace with actual API call)
			await new Promise((resolve) =>
				setTimeout(resolve, 1000 + Math.random() * 1000),
			);

			const latency = Date.now() - startTime;

			// For demo purposes, succeed if API key is provided
			if (apiKey.length > 10) {
				setConnectionStatus(true);
				setConnectionLatency(latency);
			} else {
				setConnectionStatus(false);
				setConnectionError("Invalid API key");
			}
		} catch (error) {
			setConnectionStatus(false);
			setConnectionError(
				error instanceof Error ? error.message : "Connection test failed",
			);
		} finally {
			setIsTestingConnection(false);
		}
	};

	const handleSave = () => {
		const config: ModelConfig = {
			provider,
			apiKey,
			baseUrl,
			model,
			temperature,
			maxTokens,
			timeout: 60000,
			enableStreaming,
		};

		onSave(config);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Modal */}
			<div className="fixed inset-0 z-50 overflow-y-auto">
				<div className="flex min-h-full items-center justify-center p-4">
					<div
						className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl
                       transform transition-all"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
							<div className="flex items-center gap-3">
								<SettingsIcon className="w-6 h-6 text-primary-600" />
								<h2 className="text-2xl font-bold text-gray-900">
									Model Settings
								</h2>
							</div>
							<button
								onClick={onClose}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
								aria-label="Close settings"
							>
								<X className="w-6 h-6 text-gray-500" />
							</button>
						</div>

						{/* Content */}
						<div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
							{/* Provider Selection */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									AI Provider
								</label>
								<ModelSelector value={provider} onChange={setProvider} />
							</div>

							{/* API Key */}
							<ApiKeyInput
								value={apiKey}
								onChange={setApiKey}
								provider={provider}
								isValid={connectionStatus === true ? true : undefined}
								error={connectionError}
							/>

							{/* Connection Test */}
							<ConnectionStatus
								isConnected={connectionStatus}
								latency={connectionLatency}
								error={connectionError}
								provider={provider}
								onTest={handleTestConnection}
								isTesting={isTestingConnection}
							/>

							{/* Advanced Settings */}
							<div className="space-y-4 pt-4 border-t border-gray-200">
								<h3 className="text-lg font-semibold text-gray-900">
									Advanced Settings
								</h3>

								{/* Base URL */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Base URL
									</label>
									<input
										type="text"
										value={baseUrl}
										onChange={(e) => setBaseUrl(e.target.value)}
										className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg
                               focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                               transition-all duration-200 outline-none"
										placeholder="https://api.example.com"
									/>
								</div>

								{/* Model Name */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Model Name
									</label>
									<input
										type="text"
										value={model}
										onChange={(e) => setModel(e.target.value)}
										className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg
                               focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                               transition-all duration-200 outline-none"
										placeholder="claude-3-5-sonnet-20241022"
									/>
								</div>

								{/* Temperature */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Temperature: {temperature.toFixed(2)}
									</label>
									<input
										type="range"
										min="0"
										max="2"
										step="0.1"
										value={temperature}
										onChange={(e) =>
											setTemperature(Number.parseFloat(e.target.value))
										}
										className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                               accent-primary-600"
									/>
									<div className="flex justify-between text-xs text-gray-500 mt-1">
										<span>Focused (0)</span>
										<span>Balanced (1)</span>
										<span>Creative (2)</span>
									</div>
								</div>

								{/* Max Tokens */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Max Tokens
									</label>
									<input
										type="number"
										value={maxTokens}
										onChange={(e) =>
											setMaxTokens(Number.parseInt(e.target.value))
										}
										min="1"
										max="100000"
										className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg
                               focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                               transition-all duration-200 outline-none"
									/>
								</div>

								{/* Enable Streaming */}
								<div className="flex items-center gap-3">
									<input
										type="checkbox"
										id="streaming"
										checked={enableStreaming}
										onChange={(e) => setEnableStreaming(e.target.checked)}
										className="w-4 h-4 text-primary-600 border-gray-300 rounded
                               focus:ring-2 focus:ring-primary-500"
									/>
									<label
										htmlFor="streaming"
										className="text-sm font-medium text-gray-700"
									>
										Enable streaming responses
									</label>
								</div>
							</div>
						</div>

						{/* Footer */}
						<div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
							<button
								onClick={handleReset}
								className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border-2 border-gray-300 rounded-lg
                           hover:bg-gray-50 active:bg-gray-100
                           transition-colors duration-200 font-medium"
							>
								<RotateCcw className="w-4 h-4" />
								Reset to Defaults
							</button>

							<div className="flex items-center gap-3">
								<button
									onClick={onClose}
									className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg
                             transition-colors duration-200 font-medium"
								>
									Cancel
								</button>
								<button
									onClick={handleSave}
									disabled={!apiKey || !model}
									className="flex items-center gap-2 px-6 py-2 text-white bg-primary-600 rounded-lg
                             hover:bg-primary-700 active:bg-primary-800
                             disabled:bg-gray-300 disabled:cursor-not-allowed
                             transition-colors duration-200 font-medium"
								>
									<Save className="w-4 h-4" />
									Save Settings
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
