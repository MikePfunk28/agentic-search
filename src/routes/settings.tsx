import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { SettingsModal } from "../components/SettingsModal";

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	const [showModal, setShowModal] = useState(true);

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
						Configure your AI model preferences, search providers, and API keys
					</p>
				</div>
			</section>

			{/* Settings Content */}
			<section className="max-w-4xl mx-auto px-6 pb-12">
				{!showModal && (
					<div className="text-center">
						<button
							type="button"
							onClick={() => setShowModal(true)}
							className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-medium transition-colors"
						>
							Open Settings
						</button>
					</div>
				)}
			</section>

			<SettingsModal isOpen={showModal} onClose={() => setShowModal(false)} />
		</div>
	);
}
