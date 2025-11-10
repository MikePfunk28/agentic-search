import { createFileRoute } from "@tanstack/react-router";
import { Search, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/search")({ component: SearchPage });

function SearchPage() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		setLoading(true);
		
		// Simulate search
		setTimeout(() => {
			setResults([
				{
					id: "1",
					title: `Results for: ${query}`,
					snippet: "AI-powered search results with quality scoring",
					url: "#",
					score: 0.95
				},
				{
					id: "2",
					title: "Related Information",
					snippet: "Additional context from multiple sources",
					url: "#",
					score: 0.88
				}
			]);
			setLoading(false);
		}, 1000);
	};

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
										Quality Score: {(result.score * 100).toFixed(0)}%
									</span>
									<a href={result.url} className="text-gray-500 hover:text-cyan-400">
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
