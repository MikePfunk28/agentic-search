import { createFileRoute } from "@tanstack/react-router";
import { Search, Send } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/search")({ component: SearchPage });

interface SearchResult {
	id: string;
	title: string;
	snippet: string;
	url: string;
	addScore: number;
	source: string;
}

/**
 * Display the Agentic Search UI and handle user-initiated search requests.
 *
 * Manages local state for the query, results, loading, and error. Submits the query to /api/search including a CSRF token read from cookies, updates results on success, sets an error message on failure, and aborts in-flight requests on cleanup.
 *
 * @returns The rendered search page element
 */
function SearchPage() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		const abortController = new AbortController();
		setLoading(true);
		setError(null);

		try {
			// Get CSRF token from cookie
			const csrfToken = document.cookie
				.split("; ")
				.find((row) => row.startsWith("csrf-token="))
				?.split("=")[1];

			if (!csrfToken) {
				throw new Error("CSRF token not found. Please refresh the page.");
			}

			const response = await fetch("/api/search", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": csrfToken,
				},
				body: JSON.stringify({ query }),
				signal: abortController.signal,
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
				throw new Error(errorData.error || `Search failed with status ${response.status}`);
			}

			const data = await response.json();
			setResults(data.results || []);
		} catch (err) {
			if (err instanceof Error && err.name === "AbortError") {
				console.log("[Search] Request aborted");
			} else {
				console.error("[Search] Error:", err);
				setError(err instanceof Error ? err.message : "Search request failed");
			}
		} finally {
			setLoading(false);
		}

		// Cleanup function
		return () => abortController.abort();
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			// Cancel any pending requests on component unmount
		};
	}, []);

	return (
		<div className="min-h-screen bg-slate-900 p-8">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-5xl font-bold text-white mb-4">
						Agentic Search
					</h1>
					<p className="text-gray-400 text-lg">
						AI-powered search with reasoning and quality scoring
					</p>
				</div>

				<form onSubmit={handleSearch} className="mb-8">
					<div className="relative">
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search anything..."
							className="w-full px-6 py-4 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-cyan-500 focus:outline-none text-lg"
						/>
						<button
							type="submit"
							disabled={loading}
							className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg disabled:opacity-50"
						>
							{loading ? <Search className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
						</button>
					</div>
				</form>

				{error && (
					<div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
						{error}
					</div>
				)}

				{results.length > 0 && (
					<div className="space-y-4">
						{results.map((result) => (
							<div
								key={result.id}
								className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500 transition-colors"
							>
								<h3 className="text-xl font-semibold text-white mb-2">
									{result.title}
								</h3>
								<p className="text-gray-400 mb-3">{result.snippet}</p>
								<div className="flex items-center gap-4 text-sm">
									<span className="text-cyan-400">
										Quality Score: {(result.addScore * 100).toFixed(0)}%
									</span>
									<span className="text-gray-500">
										Source: {result.source}
									</span>
									<a href={result.url} className="text-gray-500 hover:text-cyan-400 truncate">
										{result.url}
									</a>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}