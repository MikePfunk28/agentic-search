import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Keyboard, Settings as SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { SettingsModal } from "../components/SettingsModal";

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	const [showModal, setShowModal] = useState(true);
	const [mounted, setMounted] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleClose = () => {
		setShowModal(false);
		navigate({ to: "/" });
	};

	// Keyboard shortcut: Escape goes back
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !showModal) {
				navigate({ to: "/" });
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [navigate, showModal]);

	return (
		<div className="min-h-screen bg-slate-950 relative overflow-hidden">
			{/* Ambient background glow */}
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(ellipse 80% 50% at 50% -10%, rgba(6,182,212,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(139,92,246,0.06) 0%, transparent 50%)",
				}}
			/>

			{/* Top navigation bar */}
			<nav
				className="relative z-10 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm"
				style={{
					opacity: mounted ? 1 : 0,
					transform: mounted ? "translateY(0)" : "translateY(-8px)",
					transition: "opacity 0.35s ease, transform 0.35s ease",
				}}
			>
				<div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
					<button
						type="button"
						onClick={() => navigate({ to: "/" })}
						className="group flex items-center gap-2.5 text-slate-400 hover:text-cyan-400 transition-colors duration-200"
					>
						<ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
						<span className="text-sm font-medium tracking-wide">
							Back to Search
						</span>
					</button>

					<div className="flex items-center gap-2 text-slate-600 text-xs">
						<Keyboard className="w-3.5 h-3.5" />
						<span>Esc to go back</span>
					</div>
				</div>
			</nav>

			{/* Page header */}
			<section
				className="relative z-10 pt-10 pb-8 px-6"
				style={{
					opacity: mounted ? 1 : 0,
					transform: mounted ? "translateY(0)" : "translateY(12px)",
					transition: "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s",
				}}
			>
				<div className="max-w-5xl mx-auto">
					<div className="flex items-center gap-4 mb-3">
						<div className="flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
							<SettingsIcon className="w-5 h-5 text-cyan-400" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-white tracking-tight">
								Settings
							</h1>
							<p className="text-sm text-slate-400 mt-0.5">
								AI models, search providers, and API keys
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Settings content area */}
			<section
				className="relative z-10 max-w-5xl mx-auto px-6 pb-16"
				style={{
					opacity: mounted ? 1 : 0,
					transform: mounted ? "translateY(0)" : "translateY(16px)",
					transition: "opacity 0.45s ease 0.2s, transform 0.45s ease 0.2s",
				}}
			>
				{!showModal && (
					<div className="flex flex-col items-center justify-center py-24 gap-6">
						<div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
							<SettingsIcon className="w-7 h-7 text-slate-500" />
						</div>
						<div className="text-center">
							<p className="text-slate-300 text-lg font-medium mb-1">
								Settings closed
							</p>
							<p className="text-slate-500 text-sm">
								Reopen or head back to search
							</p>
						</div>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() => setShowModal(true)}
								className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-lg shadow-cyan-600/20"
							>
								Reopen Settings
							</button>
							<button
								type="button"
								onClick={() => navigate({ to: "/" })}
								className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors duration-200 border border-slate-700/50"
							>
								Back to Search
							</button>
						</div>
					</div>
				)}
			</section>

			<SettingsModal isOpen={showModal} onClose={handleClose} />
		</div>
	);
}
