/**
 * Settings Modal Component
 * Configure API keys, custom models, and provider settings
 */

import { X, Key, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { ModelProvider } from "../lib/model-config";

interface CustomModel {
	id: string;
	provider: ModelProvider;
	name: string;
	baseUrl?: string;
}

interface ApiKeyConfig {
	provider: ModelProvider;
	apiKey: string;
	baseUrl?: string;
}

interface SettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
	const [apiKeys, setApiKeys] = useState<Record<string, ApiKeyConfig>>({});
	const [customModels, setCustomModels] = useState<CustomModel[]>([]);
	const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
	const [activeTab, setActiveTab] = useState<'api-keys' | 'custom-models'>('api-keys');

	// New model form state
	const [newModel, setNewModel] = useState({
		provider: ModelProvider.OLLAMA,
		name: '',
		baseUrl: '',
	});

	// Load from localStorage on mount
	useEffect(() => {
		try {
			const savedKeys = localStorage.getItem('agentic-search-api-keys');
			const savedModels = localStorage.getItem('agentic-search-custom-models');
			
			if (savedKeys) setApiKeys(JSON.parse(savedKeys));
			if (savedModels) setCustomModels(JSON.parse(savedModels));
		} catch (error) {
			console.error('Failed to load settings:', error);
		}
	}, []);

	const saveApiKey = (provider: ModelProvider, apiKey: string, baseUrl?: string) => {
		const updated = {
			...apiKeys,
			[provider]: { provider, apiKey, baseUrl },
		};
		setApiKeys(updated);
		localStorage.setItem('agentic-search-api-keys', JSON.stringify(updated));
	};

	const removeApiKey = (provider: ModelProvider) => {
		const updated = { ...apiKeys };
		delete updated[provider];
		setApiKeys(updated);
		localStorage.setItem('agentic-search-api-keys', JSON.stringify(updated));
	};

	const addCustomModel = () => {
		if (!newModel.name) return;

		const model: CustomModel = {
			id: `${newModel.provider}:${newModel.name}`,
			provider: newModel.provider as ModelProvider,
			name: newModel.name,
			baseUrl: newModel.baseUrl || undefined,
		};

		const updated = [...customModels, model];
		setCustomModels(updated);
		localStorage.setItem('agentic-search-custom-models', JSON.stringify(updated));

		// Reset form
		setNewModel({
			provider: ModelProvider.OLLAMA,
			name: '',
			baseUrl: '',
		});
	};

	const removeCustomModel = (id: string) => {
		const updated = customModels.filter(m => m.id !== id);
		setCustomModels(updated);
		localStorage.setItem('agentic-search-custom-models', JSON.stringify(updated));
	};

	if (!isOpen) return null;

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
					<button
						onClick={onClose}
						className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
					>
						<X className="w-5 h-5 text-gray-400" />
					</button>
				</div>

				{/* Tabs */}
				<div className="flex border-b border-slate-800">
					<button
						onClick={() => setActiveTab('api-keys')}
						className={`flex-1 px-6 py-3 font-medium transition-colors ${
							activeTab === 'api-keys'
								? 'text-pink-500 border-b-2 border-pink-500'
								: 'text-gray-400 hover:text-white'
						}`}
					>
						<Key className="w-4 h-4 inline mr-2" />
						API Keys
					</button>
					<button
						onClick={() => setActiveTab('custom-models')}
						className={`flex-1 px-6 py-3 font-medium transition-colors ${
							activeTab === 'custom-models'
								? 'text-pink-500 border-b-2 border-pink-500'
								: 'text-gray-400 hover:text-white'
						}`}
					>
						<Plus className="w-4 h-4 inline mr-2" />
						Custom Models
					</button>
				</div>

				{/* Content */}
				<div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
					{activeTab === 'api-keys' && (
						<div className="space-y-6">
							<p className="text-sm text-gray-400">
								Configure API keys for cloud providers. Keys are stored locally in your browser.
							</p>

							{/* OpenAI */}
							<div className="space-y-3">
								<label className="block text-sm font-medium text-white">
									OpenAI API Key
								</label>
								<div className="flex gap-2">
									<div className="relative flex-1">
										<input
											type={showKeys[ModelProvider.OPENAI] ? 'text' : 'password'}
											value={apiKeys[ModelProvider.OPENAI]?.apiKey || ''}
											onChange={(e) => saveApiKey(ModelProvider.OPENAI, e.target.value)}
											placeholder="sk-..."
											className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white
													   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
										/>
										<button
											type="button"
											onClick={() => setShowKeys(prev => ({ ...prev, [ModelProvider.OPENAI]: !prev[ModelProvider.OPENAI] }))}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
										>
											{showKeys[ModelProvider.OPENAI] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
										</button>
									</div>
									{apiKeys[ModelProvider.OPENAI]?.apiKey && (
										<button
											onClick={() => removeApiKey(ModelProvider.OPENAI)}
											className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									)}
								</div>
							</div>

							{/* Anthropic */}
							<div className="space-y-3">
								<label className="block text-sm font-medium text-white">
									Anthropic API Key
								</label>
								<div className="flex gap-2">
									<div className="relative flex-1">
										<input
											type={showKeys[ModelProvider.ANTHROPIC] ? 'text' : 'password'}
											value={apiKeys[ModelProvider.ANTHROPIC]?.apiKey || ''}
											onChange={(e) => saveApiKey(ModelProvider.ANTHROPIC, e.target.value)}
											placeholder="sk-ant-..."
											className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white
													   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
										/>
										<button
											type="button"
											onClick={() => setShowKeys(prev => ({ ...prev, [ModelProvider.ANTHROPIC]: !prev[ModelProvider.ANTHROPIC] }))}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
										>
											{showKeys[ModelProvider.ANTHROPIC] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
										</button>
									</div>
									{apiKeys[ModelProvider.ANTHROPIC]?.apiKey && (
										<button
											onClick={() => removeApiKey(ModelProvider.ANTHROPIC)}
											className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									)}
								</div>
							</div>

							{/* Custom Base URL for Ollama */}
							<div className="space-y-3">
								<label className="block text-sm font-medium text-white">
									Ollama Base URL (Optional)
								</label>
								<input
									type="text"
									value={apiKeys[ModelProvider.OLLAMA]?.baseUrl || ''}
									onChange={(e) => saveApiKey(ModelProvider.OLLAMA, 'ollama', e.target.value)}
									placeholder="http://localhost:11434"
									className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white
											   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
								/>
								<p className="text-xs text-gray-400">
									Default: http://localhost:11434/v1
								</p>
							</div>
						</div>
					)}

					{activeTab === 'custom-models' && (
						<div className="space-y-6">
							<p className="text-sm text-gray-400">
								Add custom models from any OpenAI-compatible endpoint.
							</p>

							{/* Add Model Form */}
							<div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-4">
								<h3 className="font-medium text-white">Add Custom Model</h3>
								
								<div className="space-y-3">
									<div>
										<label className="block text-sm font-medium text-white mb-2">
											Provider Type
										</label>
										<select
											value={newModel.provider}
											onChange={(e) => setNewModel(prev => ({ ...prev, provider: e.target.value as ModelProvider }))}
											className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white
													   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
										>
											<option value={ModelProvider.OLLAMA}>Ollama</option>
											<option value={ModelProvider.OPENAI}>OpenAI Compatible</option>
											<option value={ModelProvider.LM_STUDIO}>LM Studio</option>
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-white mb-2">
											Model Name
										</label>
										<input
											type="text"
											value={newModel.name}
											onChange={(e) => setNewModel(prev => ({ ...prev, name: e.target.value }))}
											placeholder="e.g., llama3.2:3b"
											className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white
													   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-white mb-2">
											Base URL (Optional)
										</label>
										<input
											type="text"
											value={newModel.baseUrl}
											onChange={(e) => setNewModel(prev => ({ ...prev, baseUrl: e.target.value }))}
											placeholder="http://localhost:1234/v1"
											className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white
													   focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
										/>
									</div>
								</div>

								<button
									onClick={addCustomModel}
									disabled={!newModel.name}
									className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-700 disabled:text-gray-500
											   text-white font-medium rounded-lg transition-colors"
								>
									<Plus className="w-4 h-4 inline mr-2" />
									Add Model
								</button>
							</div>

							{/* Custom Models List */}
							{customModels.length > 0 && (
								<div className="space-y-2">
									<h3 className="font-medium text-white">Your Custom Models</h3>
									{customModels.map((model) => (
										<div
											key={model.id}
											className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700 rounded-lg"
										>
											<div>
												<div className="font-medium text-white">{model.name}</div>
												<div className="text-sm text-gray-400">
													{model.provider} {model.baseUrl && `• ${model.baseUrl}`}
												</div>
											</div>
											<button
												onClick={() => removeCustomModel(model.id)}
												className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
