import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Save, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { ModelSettings } from "../components/model-config";
import type { ModelConfig } from "../lib/model-config";

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});

/**
 * Renders the settings page by delegating to the page content component.
 *
 * @returns The React element that contains the settings page content.
 */
function SettingsPage() {
	return <SettingsPageContent />;
}

/**
 * Render the settings page UI with model configuration controls, status banners, informational content, and supported provider tiles.
 *
 * Displays a transient success banner for 3 seconds after a configuration is saved and shows an error banner when saving fails.
 *
 * @returns The JSX element for the full settings page.
 */
function SettingsPageContent() {
	const [isSaved, setIsSaved] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSave = (config: ModelConfig) => {
		try {
			// Save logic will be handled by ModelSettings component
			setIsSaved(true);
			setError(null);

			// Reset success message after 3 seconds
			setTimeout(() => setIsSaved(false), 3000);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save settings");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
			{/* Header Section */}
			<section className="relative py-12 px-6">
				<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
				<div className="relative max-w-4xl mx-auto">
					<div className="flex items-center gap-4 mb-4">
						<SettingsIcon className="w-10 h-10 text-cyan-400" />
						<h1 className="text-4xl font-bold text-white">Settings</h1>
					</div>
					<p className="text-gray-300 text-lg">
						Configure your AI model preferences and API keys
					</p>
				</div>
			</section>

			{/* Success/Error Messages */}
			{isSaved && (
				<div className="max-w-4xl mx-auto px-6 mb-4">
					<div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
						<Save className="w-5 h-5 text-green-400" />
						<span className="text-green-100">Settings saved successfully!</span>
					</div>
				</div>
			)}

			{error && (
				<div className="max-w-4xl mx-auto px-6 mb-4">
					<div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
						<AlertCircle className="w-5 h-5 text-red-400" />
						<span className="text-red-100">{error}</span>
					</div>
				</div>
			)}

			{/* Settings Content */}
			<section className="max-w-4xl mx-auto px-6 pb-12">
				<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
					<h2 className="text-2xl font-semibold text-white mb-6">
						Model Configuration
					</h2>

					<ModelSettings onSave={handleSave} />
				</div>

				{/* Information Section */}
				<div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-blue-200 mb-3 flex items-center gap-2">
						<AlertCircle className="w-5 h-5" />
						About Model Configuration
					</h3>
					<ul className="text-gray-300 space-y-2 text-sm">
						<li className="flex gap-2">
							<span className="text-cyan-400">•</span>
							<span>
								<strong>BYOK (Bring Your Own Key):</strong> Your API keys are
								stored locally in your browser and never sent to our servers
							</span>
						</li>
						<li className="flex gap-2">
							<span className="text-cyan-400">•</span>
							<span>
								<strong>Local Models:</strong> Use Ollama or LM Studio to run
								models on your own hardware without API keys
							</span>
						</li>
						<li className="flex gap-2">
							<span className="text-cyan-400">•</span>
							<span>
								<strong>Connection Testing:</strong> Test your configuration
								before saving to ensure it works correctly
							</span>
						</li>
						<li className="flex gap-2">
							<span className="text-cyan-400">•</span>
							<span>
								<strong>Multiple Configs:</strong> Save multiple configurations
								and switch between them easily
							</span>
						</li>
					</ul>
				</div>

				{/* Supported Providers */}
				<div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
					{[
						{ name: "OpenAI", icon: "🤖" },
						{ name: "Anthropic", icon: "🧠" },
						{ name: "Google", icon: "🔍" },
						{ name: "Ollama", icon: "🦙" },
						{ name: "LM Studio", icon: "💻" },
						{ name: "Azure", icon: "☁️" },
					].map((provider) => (
						<div
							key={provider.name}
							className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 text-center"
						>
							<div className="text-3xl mb-2">{provider.icon}</div>
							<div className="text-sm text-gray-300 font-medium">
								{provider.name}
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}