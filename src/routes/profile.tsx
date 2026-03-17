/**
 * User Profile Page
 *
 * Displays account info, saved model configs, API keys (masked),
 * preferences, and usage summary.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { BarChart3, Key, LogOut, Settings, Shield, User } from "lucide-react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { useAppAuth } from "../hooks/useAppAuth";
import { getUserAvatarUrl, getUserDisplayName } from "../lib/user-profile";

export const Route = createFileRoute("/profile")({
	component: ProfilePage,
});

function ProfilePage() {
	const { user, isAuthenticated, isLoading, signOut, isAnonymous } =
		useAppAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
				<div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
				<div className="text-center">
					<User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-white mb-2">
						Sign in to view your profile
					</h2>
					<p className="text-gray-400 mb-6">
						Your saved configurations, API keys, and usage stats will appear
						here.
					</p>
					<Link
						to="/"
						className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium transition-colors"
					>
						Go Home
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
			{/* Header */}
			<section className="relative py-12 px-6">
				<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
				<div className="relative max-w-4xl mx-auto">
					<div className="flex items-center gap-4 mb-4">
						<User className="w-10 h-10 text-cyan-400" />
						<h1 className="text-4xl font-bold text-white">Profile</h1>
					</div>
					<p className="text-gray-300 text-lg">
						Manage your account, API keys, and preferences
					</p>
				</div>
			</section>

			<section className="max-w-4xl mx-auto px-6 pb-12 space-y-8">
				{/* Anonymous Warning */}
				{isAnonymous && (
					<div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4">
						<p className="text-amber-300 font-medium">
							You&apos;re signed in as a guest. Your data will be deleted when
							your session ends.
						</p>
						<p className="text-amber-400/70 text-sm mt-1">
							Sign up with GitHub to save your data permanently.
						</p>
					</div>
				)}

				{/* Account Info Card */}
				<AccountInfoCard user={user} />

				{/* API Keys Card */}
				<ApiKeysCard />

				{/* Preferences Card */}
				<PreferencesCard />

				{/* Usage Summary Card */}
				<UsageSummaryCard />

				{/* Danger Zone */}
				<div className="bg-red-900/10 border border-red-800/30 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-red-400 mb-4">Session</h3>
					<button
						type="button"
						onClick={() => void signOut()}
						className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800/50 rounded-lg text-red-400 transition-colors"
					>
						<LogOut size={16} />
						Sign Out
					</button>
				</div>
			</section>
		</div>
	);
}

function AccountInfoCard({ user }: { user: any }) {
	const displayName = getUserDisplayName(user);
	const avatarUrl = getUserAvatarUrl(user);

	return (
		<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
			<h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
				<User size={20} className="text-cyan-400" />
				Account
			</h3>
			<div className="flex items-center gap-4">
				{avatarUrl ? (
					<img
						src={avatarUrl}
						alt={displayName}
						className="w-16 h-16 rounded-full border-2 border-cyan-500"
					/>
				) : (
					<div className="w-16 h-16 rounded-full bg-cyan-600 flex items-center justify-center text-2xl font-bold text-white">
						{displayName.charAt(0).toUpperCase()}
					</div>
				)}
				<div>
					<p className="text-xl font-semibold text-white">{displayName}</p>
					{user?.email && <p className="text-gray-400">{user.email}</p>}
					{user?.isAnonymous && (
						<span className="text-xs px-2 py-0.5 bg-amber-900/50 text-amber-300 rounded-full">
							Guest
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

function ApiKeysCard() {
	const apiKeys = useQuery(api.secureApiKeys.listApiKeys);

	return (
		<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
			<h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
				<Key size={20} className="text-cyan-400" />
				API Keys
				<span className="text-xs px-2 py-0.5 bg-green-900/50 text-green-400 rounded-full ml-auto">
					<Shield size={12} className="inline mr-1" />
					Encrypted
				</span>
			</h3>

			{apiKeys === undefined ? (
				<div className="text-gray-500 text-sm">Loading...</div>
			) : apiKeys.length === 0 ? (
				<div className="text-gray-500 text-sm">
					No API keys saved. Add keys in{" "}
					<Link to="/settings" className="text-cyan-400 hover:underline">
						Settings
					</Link>
					.
				</div>
			) : (
				<div className="space-y-3">
					{apiKeys.map((key) => (
						<div
							key={key.configId}
							className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3"
						>
							<div>
								<code className="text-sm text-gray-300 font-mono">
									{key.masked}
								</code>
								<p className="text-xs text-gray-500 mt-1">
									Added {new Date(key.createdAt).toLocaleDateString()}
								</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function PreferencesCard() {
	const preferences = useQuery(api.userPreferences.getPreferences);
	const updatePrefs = useMutation(api.userPreferences.updatePreferences);
	const [saving, setSaving] = useState(false);

	const handleToggle = async (
		field: "searchHistory" | "analytics",
		value: boolean,
	) => {
		setSaving(true);
		try {
			await updatePrefs({ [field]: value });
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
			<h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
				<Settings size={20} className="text-cyan-400" />
				Preferences
			</h3>

			<div className="space-y-4">
				<label className="flex items-center justify-between cursor-pointer">
					<div>
						<p className="text-white font-medium">Search History</p>
						<p className="text-sm text-gray-400">
							Save your search history for later reference
						</p>
					</div>
					<input
						type="checkbox"
						checked={preferences?.searchHistory ?? true}
						onChange={(e) =>
							void handleToggle("searchHistory", e.target.checked)
						}
						disabled={saving}
						className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
					/>
				</label>

				<label className="flex items-center justify-between cursor-pointer">
					<div>
						<p className="text-white font-medium">Usage Analytics</p>
						<p className="text-sm text-gray-400">
							Track token usage and costs for your dashboard
						</p>
					</div>
					<input
						type="checkbox"
						checked={preferences?.analytics ?? true}
						onChange={(e) => void handleToggle("analytics", e.target.checked)}
						disabled={saving}
						className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
					/>
				</label>
			</div>
		</div>
	);
}

function UsageSummaryCard() {
	const costSummary = useQuery(api.costEstimation.getCostSummary, {
		daysBack: 30,
	});

	return (
		<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
			<h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
				<BarChart3 size={20} className="text-cyan-400" />
				Usage Summary (30 days)
				<Link
					to="/analytics"
					className="text-sm text-cyan-400 hover:underline ml-auto font-normal"
				>
					View Full Analytics →
				</Link>
			</h3>

			{costSummary === undefined ? (
				<div className="text-gray-500 text-sm">Loading...</div>
			) : costSummary === null ? (
				<div className="text-gray-500 text-sm">Sign in to see usage stats</div>
			) : (
				<div className="grid grid-cols-3 gap-4">
					<div className="bg-gray-900/50 rounded-lg p-4 text-center">
						<p className="text-2xl font-bold text-white">
							{costSummary.totalRequests.toLocaleString()}
						</p>
						<p className="text-sm text-gray-400">API Calls</p>
					</div>
					<div className="bg-gray-900/50 rounded-lg p-4 text-center">
						<p className="text-2xl font-bold text-white">
							{costSummary.totalTokens.toLocaleString()}
						</p>
						<p className="text-sm text-gray-400">Tokens Used</p>
					</div>
					<div className="bg-gray-900/50 rounded-lg p-4 text-center">
						<p className="text-2xl font-bold text-cyan-400">
							${costSummary.totalCost.toFixed(4)}
						</p>
						<p className="text-sm text-gray-400">Est. Cost</p>
					</div>
				</div>
			)}
		</div>
	);
}
