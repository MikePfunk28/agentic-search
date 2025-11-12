import { Link } from "@tanstack/react-router";
import {
	Home,
	Menu,
	Settings,
	X,
	Key,
} from "lucide-react";
import { useState } from "react";
import WorkOSHeader from "./workos-user.tsx";
import { SettingsModal } from "./SettingsModal";

/**
 * Renders the application's top navigation bar with a quick-settings trigger and a slide-out side menu.
 *
 * The header includes a menu button that opens the side navigation, a title link to the home route,
 * and a "Configure Models" button that opens the settings modal. The side menu provides navigation
 * links (Home, Settings), a close control, and a footer area containing the WorkOS header.
 *
 * @returns The React element tree for the header, settings modal, and side navigation
 */
export default function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const [showSettings, setShowSettings] = useState(false);

	return (
		<>
			<header className="p-4 flex items-center justify-between bg-gray-800 text-white shadow-lg">
				<div className="flex items-center">
					<button
						type="button"
						onClick={() => setIsOpen(true)}
						className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
						aria-label="Open menu"
					>
						<Menu size={24} />
					</button>
					<h1 className="ml-4 text-xl font-semibold">
						<Link to="/" className="hover:text-primary-400 transition-colors">
							Agentic Search
						</Link>
					</h1>
				</div>

				{/* Quick Settings Button */}
				<button
					type="button"
					onClick={() => setShowSettings(true)}
					className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
					aria-label="Configure API Keys"
				>
					<Key size={18} />
					<span className="font-medium">Configure Models</span>
				</button>
			</header>

			{/* Settings Modal */}
			<SettingsModal
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
			/>

			<aside
				className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between p-4 border-b border-gray-700">
					<h2 className="text-xl font-bold">Menu</h2>
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
						aria-label="Close menu"
					>
						<X size={24} />
					</button>
				</div>

				<nav className="flex-1 p-4 overflow-y-auto">
					<Link
						to="/"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
						}}
					>
						<Home size={20} />
						<span className="font-medium">Home</span>
					</Link>

					<Link
						to="/settings"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
						}}
					>
						<Settings size={20} />
						<span className="font-medium">Settings</span>
					</Link>
				</nav>

				<div className="p-4 border-t border-gray-700 bg-gray-800 flex flex-col gap-2">
					<WorkOSHeader />
				</div>
			</aside>
		</>
	);
}