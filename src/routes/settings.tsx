import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Settings as SettingsIcon } from "lucide-react";
import { ModelConfigPanel } from "../components/ModelConfigPanel";

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	return <SettingsPageContent />;
}

function SettingsPageContent() {

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


			{/* Settings Content */}
			<section className="max-w-4xl mx-auto px-6 pb-12">
				<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
					<ModelConfigPanel />
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
