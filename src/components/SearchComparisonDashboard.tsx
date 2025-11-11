import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface SearchComparisonDashboardProps {
	searchIds?: [Id<"searchHistory">, Id<"searchHistory">];
}

export default function SearchComparisonDashboard({ searchIds }: SearchComparisonDashboardProps) {
	const [leftSearchId, setLeftSearchId] = useState<Id<"searchHistory"> | null>(
		searchIds?.[0] || null,
	);
	const [rightSearchId, setRightSearchId] = useState<Id<"searchHistory"> | null>(
		searchIds?.[1] || null,
	);

	const recentSearches = useQuery(api.searchHistory.listSearchHistory, {
		limit: 20,
		offset: 0,
	});

	const leftSearch = useQuery(
		api.searchHistory.getSearch,
		leftSearchId ? { searchId: leftSearchId } : "skip",
	);

	const rightSearch = useQuery(
		api.searchHistory.getSearch,
		rightSearchId ? { searchId: rightSearchId } : "skip",
	);

	return (
		<div className="search-comparison-dashboard">
			<div className="dashboard-header">
				<h2>Search Comparison Dashboard</h2>
				<p>Compare searches side-by-side for quality and performance analysis.</p>
			</div>

			<div className="selection-controls">
				<select
					value={leftSearchId || ""}
					onChange={(e) => setLeftSearchId(e.target.value as Id<"searchHistory">)}
					className="search-select"
				>
					<option value="">Select first search...</option>
					{recentSearches?.map((search) => (
						<option key={search._id} value={search._id}>
							{search.query} - {new Date(search.timestamp).toLocaleDateString()}
						</option>
					))}
				</select>

				<div className="vs-badge">VS</div>

				<select
					value={rightSearchId || ""}
					onChange={(e) => setRightSearchId(e.target.value as Id<"searchHistory">)}
					className="search-select"
				>
					<option value="">Select second search...</option>
					{recentSearches?.map((search) => (
						<option key={search._id} value={search._id}>
							{search.query} - {new Date(search.timestamp).toLocaleDateString()}
						</option>
					))}
				</select>
			</div>

			<div className="comparison-panels">
				<div className="panel">
					<h3>Search 1</h3>
					{leftSearch ? (
						<div>
							<p><strong>Query:</strong> {leftSearch.query}</p>
							<p><strong>Quality:</strong> {leftSearch.quality.toFixed(3)}</p>
							<p><strong>Results:</strong> {leftSearch.results.length}</p>
							<p><strong>Time:</strong> {(leftSearch.executionTimeMs / 1000).toFixed(2)}s</p>
							<p><strong>Tokens:</strong> {leftSearch.tokensUsed}</p>
						</div>
					) : (
						<p>Select a search</p>
					)}
				</div>
				<div className="panel">
					<h3>Search 2</h3>
					{rightSearch ? (
						<div>
							<p><strong>Query:</strong> {rightSearch.query}</p>
							<p><strong>Quality:</strong> {rightSearch.quality.toFixed(3)}</p>
							<p><strong>Results:</strong> {rightSearch.results.length}</p>
							<p><strong>Time:</strong> {(rightSearch.executionTimeMs / 1000).toFixed(2)}s</p>
							<p><strong>Tokens:</strong> {rightSearch.tokensUsed}</p>
						</div>
					) : (
						<p>Select a search</p>
					)}
				</div>
			</div>

			<style>{`
				.search-comparison-dashboard {
					max-width: 1200px;
					margin: 0 auto;
				}

				.dashboard-header {
					text-align: center;
					margin-bottom: 2rem;
				}

				.dashboard-header h2 {
					font-size: 2rem;
					font-weight: 700;
					color: #1a202c;
					margin-bottom: 0.5rem;
				}

				.dashboard-header p {
					color: #718096;
				}

				.selection-controls {
					display: grid;
					grid-template-columns: 1fr auto 1fr;
					gap: 1rem;
					align-items: center;
					margin-bottom: 2rem;
				}

				.search-select {
					width: 100%;
					padding: 0.75rem;
					border: 2px solid #e2e8f0;
					border-radius: 8px;
					font-size: 1rem;
				}

				.vs-badge {
					font-weight: 700;
					color: #667eea;
					padding: 0.5rem 1rem;
					background: #edf2f7;
					border-radius: 8px;
				}

				.comparison-panels {
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 2rem;
				}

				.panel {
					background: white;
					border-radius: 12px;
					padding: 2rem;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
					border-top: 4px solid #667eea;
				}

				.panel h3 {
					font-size: 1.25rem;
					font-weight: 600;
					color: #2d3748;
					margin-bottom: 1rem;
				}

				.panel p {
					margin-bottom: 0.5rem;
					color: #4a5568;
				}

				.panel strong {
					color: #2d3748;
				}
			`}</style>
		</div>
	);
}
