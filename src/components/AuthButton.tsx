/**
 * AuthButton Component
 *
 * Shows sign-in options when not authenticated.
 * Shows user avatar + dropdown when authenticated.
 * Shows "Guest" badge for anonymous users.
 */

import { Link } from "@tanstack/react-router";
import {
	BarChart3,
	ChevronDown,
	Github,
	LogIn,
	LogOut,
	User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppAuth } from "../hooks/useAppAuth";
import { getUserAvatarUrl, getUserDisplayName } from "../lib/user-profile";

const USER_PREVIEW_STORAGE_KEY = "agentic-search-user-preview";

interface StoredUserPreview {
	name?: string;
	email?: string;
	image?: string;
}

export default function AuthButton() {
	const { user, isAuthenticated, isLoading, signIn, signOut, isAnonymous } =
		useAppAuth();
	const [showDropdown, setShowDropdown] = useState(false);
	const [showSignIn, setShowSignIn] = useState(false);
	const [cachedPreview, setCachedPreview] = useState<StoredUserPreview | null>(
		null,
	);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const signInRef = useRef<HTMLDivElement>(null);

	// Close dropdowns on outside click
	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setShowDropdown(false);
			}
			if (signInRef.current && !signInRef.current.contains(e.target as Node)) {
				setShowSignIn(false);
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	useEffect(() => {
		try {
			const stored = window.localStorage.getItem(USER_PREVIEW_STORAGE_KEY);
			if (stored) {
				setCachedPreview(JSON.parse(stored) as StoredUserPreview);
			}
		} catch {
			setCachedPreview(null);
		}
	}, []);

	useEffect(() => {
		if (isLoading) return;

		if (isAuthenticated && user && !isAnonymous) {
			const preview: StoredUserPreview = {
				name: getUserDisplayName(user) || undefined,
				email: user.email || undefined,
				image: getUserAvatarUrl(user),
			};
			setCachedPreview(preview);
			try {
				window.localStorage.setItem(
					USER_PREVIEW_STORAGE_KEY,
					JSON.stringify(preview),
				);
			} catch {
				// Ignore storage errors; auth state remains authoritative.
			}
			return;
		}

		if (!isAuthenticated || isAnonymous) {
			setCachedPreview(null);
			try {
				window.localStorage.removeItem(USER_PREVIEW_STORAGE_KEY);
			} catch {
				// Ignore storage errors.
			}
		}
	}, [isAnonymous, isAuthenticated, isLoading, user]);

	if (isLoading) {
		if (cachedPreview) {
			const previewName = cachedPreview.name || cachedPreview.email || "User";
			const previewInitial = previewName.charAt(0).toUpperCase();
			return (
				<div className="flex items-center gap-2 px-2 py-1.5 rounded-lg opacity-80">
					{cachedPreview.image ? (
						<img
							src={cachedPreview.image}
							alt={previewName}
							className="w-8 h-8 rounded-full border-2 border-cyan-500/60"
						/>
					) : (
						<div className="w-8 h-8 rounded-full bg-cyan-600/80 flex items-center justify-center text-sm font-bold">
							{previewInitial}
						</div>
					)}
				</div>
			);
		}

		return <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />;
	}

	// Not authenticated - show sign in button
	if (!isAuthenticated) {
		return (
			<div className="relative" ref={signInRef}>
				<button
					type="button"
					onClick={() => setShowSignIn(!showSignIn)}
					className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
				>
					<LogIn size={16} />
					<span>Sign In</span>
				</button>

				{showSignIn && (
					<div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
						<div className="p-4">
							<h3 className="text-sm font-semibold text-white mb-3">
								Sign in to save your data
							</h3>

							{/* GitHub OAuth */}
							<button
								type="button"
								onClick={() => {
									void signIn("github", {
										redirectTo: window.location.pathname,
									});
									setShowSignIn(false);
								}}
								className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-900 hover:bg-gray-950 rounded-lg transition-colors mb-2 text-sm"
							>
								<Github size={18} />
								<span>Continue with GitHub</span>
							</button>

							{/* Anonymous - try without account */}
							<button
								type="button"
								onClick={() => {
									void signIn("anonymous");
									setShowSignIn(false);
								}}
								className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm text-gray-300"
							>
								<User size={18} />
								<span>Continue as Guest</span>
							</button>

							<p className="mt-3 text-xs text-gray-500">
								Guest data is temporary and deleted on session end.
							</p>
						</div>
					</div>
				)}
			</div>
		);
	}

	// Anonymous user
	if (isAnonymous) {
		return (
			<div className="relative" ref={dropdownRef}>
				<button
					type="button"
					onClick={() => setShowDropdown(!showDropdown)}
					className="flex items-center gap-2 px-3 py-2 bg-amber-900/50 hover:bg-amber-800/50 border border-amber-700/50 rounded-lg transition-colors text-sm"
				>
					<User size={16} className="text-amber-400" />
					<span className="text-amber-300">Guest</span>
					<ChevronDown size={14} className="text-amber-400" />
				</button>

				{showDropdown && (
					<div className="absolute right-0 top-full mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
						<div className="p-3 border-b border-gray-700 bg-amber-900/20">
							<p className="text-xs text-amber-300">
								Sign up to save your data permanently
							</p>
						</div>
						<div className="p-2">
							<button
								type="button"
								onClick={() => {
									void signIn("github", {
										redirectTo: window.location.pathname,
									});
									setShowDropdown(false);
								}}
								className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-sm"
							>
								<Github size={16} />
								<span>Sign up with GitHub</span>
							</button>
							<button
								type="button"
								onClick={() => {
									void signOut();
									setShowDropdown(false);
								}}
								className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-sm text-red-400"
							>
								<LogOut size={16} />
								<span>End Session</span>
							</button>
						</div>
					</div>
				)}
			</div>
		);
	}

	// Authenticated user with real account
	const displayName = getUserDisplayName(user);
	const avatarUrl = getUserAvatarUrl(user);
	const initials = displayName.charAt(0).toUpperCase();

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setShowDropdown(!showDropdown)}
				className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-700 rounded-lg transition-colors"
			>
				{avatarUrl ? (
					<img
						src={avatarUrl}
						alt={displayName}
						className="w-8 h-8 rounded-full border-2 border-cyan-500"
					/>
				) : (
					<div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-sm font-bold">
						{initials}
					</div>
				)}
				<span className="text-sm font-medium max-w-[120px] truncate hidden sm:block">
					{displayName}
				</span>
				<ChevronDown size={14} className="text-gray-400" />
			</button>

			{showDropdown && (
				<div className="absolute right-0 top-full mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
					<div className="p-3 border-b border-gray-700">
						<p className="text-sm font-medium text-white truncate">
							{displayName}
						</p>
						{user?.email && (
							<p className="text-xs text-gray-400 truncate">{user.email}</p>
						)}
					</div>
					<div className="p-2">
						<Link
							to="/profile"
							onClick={() => setShowDropdown(false)}
							className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-sm"
						>
							<User size={16} />
							<span>Profile</span>
						</Link>
						<Link
							to="/analytics"
							onClick={() => setShowDropdown(false)}
							className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-sm"
						>
							<BarChart3 size={16} />
							<span>Analytics</span>
						</Link>
						<button
							type="button"
							onClick={() => {
								void signOut();
								setShowDropdown(false);
							}}
							className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-sm text-red-400"
						>
							<LogOut size={16} />
							<span>Sign Out</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
