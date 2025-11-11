/**
 * SearchHistoryPage Component
 * 
 * Browse past searches, view annotations, re-run queries, export to other models/agents
 */

import { useState, useEffect } from 'react';
import { Search, Download, RefreshCw, Trash2, Calendar, BarChart } from 'lucide-react';
import { researchStorage } from '../lib/results-storage';
import type { StoredResearchResult } from '../lib/results-storage';

export function SearchHistoryPage() {
	const [searchHistory, setSearchHistory] = useState<StoredResearchResult[]>([]);
	const [filterModel, setFilterModel] = useState<string>('');
	const [filterDateRange, setFilterDateRange] = useState<string>('all');
	const [sortBy, setSortBy] = useState<'date' | 'quality' | 'results'>('date');

	// Load search history on mount
	useEffect(() => {
		loadHistory();
	}, []);

	const loadHistory = () => {
		const allResults = researchStorage.getAllResults();
		setSearchHistory(allResults);
	};

	// Filter and sort results
	const filteredResults = searchHistory
		.filter(result => {
			// Filter by model
			if (filterModel && !result.modelUsed.toLowerCase().includes(filterModel.toLowerCase())) {
				return false;
			}

			// Filter by date range
			if (filterDateRange !== 'all') {
				const now = Date.now();
				const age = now - result.timestamp;
				const dayInMs = 24 * 60 * 60 * 1000;

				switch (filterDateRange) {
					case '1d':
						if (age > dayInMs) return false;
						break;
					case '7d':
						if (age > 7 * dayInMs) return false;
						break;
					case '30d':
						if (age > 30 * dayInMs) return false;
						break;
				}
			}

			return true;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case 'date':
					return b.timestamp - a.timestamp;
				case 'quality':
					return b.addScore - a.addScore;
				case 'results':
					return b.results.length - a.results.length;
				default:
					return 0;
			}
		});

	const handleExport = (result: StoredResearchResult, format: 'markdown' | 'json' | 'jsonl' | 'prompt') => {
		const exported = researchStorage.exportResult(result.id, format);
		if (exported) {
			// Download as file
			const blob = new Blob([exported], { type: 'text/plain' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `search-${result.id}-${format}.${format === 'json' ? 'json' : 'txt'}`;
			a.click();
			URL.revokeObjectURL(url);
		}
	};

	const handleDelete = (id: string) => {
		if (confirm('Delete this search result?')) {
			researchStorage.deleteResult(id);
			loadHistory();
		}
	};

	const handleRerun = async (query: string) => {
		// Navigate to home with query pre-filled
		window.location.href = `/?q=${encodeURIComponent(query)}`;
	};

	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleString();
	};

	const getQualityColor = (score: number) => {
		if (score >= 0.8) return 'text-green-500';
		if (score >= 0.6) return 'text-yellow-500';
		return 'text-red-500';
	};

	return (
		<div className="min-h-screen bg-slate-900 text-white p-8">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
						<Search className="w-8 h-8 text-primary-400" />
						Search History
					</h1>
					<p className="text-slate-400">
						Browse past searches, view annotations, and export results for use with other models
					</p>
				</div>

				{/* Filters */}
				<div className="bg-slate-800 rounded-lg p-4 mb-6 flex flex-wrap gap-4">
					<div className="flex-1 min-w-[200px]">
						<label className="block text-sm text-slate-400 mb-2">Filter by Model</label>
						<input
							type="text"
							placeholder="e.g. ollama, gpt-4"
							value={filterModel}
							onChange={(e) => setFilterModel(e.target.value)}
							className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg"
						/>
					</div>

					<div>
						<label className="block text-sm text-slate-400 mb-2">Date Range</label>
						<select
							value={filterDateRange}
							onChange={(e) => setFilterDateRange(e.target.value)}
							className="px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg"
						>
							<option value="all">All Time</option>
							<option value="1d">Last 24 Hours</option>
							<option value="7d">Last 7 Days</option>
							<option value="30d">Last 30 Days</option>
						</select>
					</div>

					<div>
						<label className="block text-sm text-slate-400 mb-2">Sort By</label>
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as 'date' | 'quality' | 'results')}
							className="px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg"
						>
							<option value="date">Date</option>
							<option value="quality">Quality Score</option>
							<option value="results">Result Count</option>
						</select>
					</div>
				</div>

				{/* Results Count */}
				<div className="mb-4 text-slate-400">
					Found {filteredResults.length} searches
				</div>

				{/* Search Results List */}
				<div className="space-y-4">
					{filteredResults.length === 0 ? (
						<div className="bg-slate-800 rounded-lg p-8 text-center text-slate-400">
							<Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
							<p>No search history yet. Start searching to see results here.</p>
						</div>
					) : (
						filteredResults.map((result) => (
							<div
								key={result.id}
								className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
							>
								{/* Header */}
								<div className="flex items-start justify-between mb-4">
									<div className="flex-1">
										<h3 className="text-xl font-semibold mb-2">{result.query}</h3>
										<div className="flex flex-wrap gap-4 text-sm text-slate-400">
											<span className="flex items-center gap-1">
												<Calendar className="w-4 h-4" />
												{formatDate(result.timestamp)}
											</span>
											<span>Model: {result.modelUsed}</span>
											<span>{result.results.length} results</span>
											<span>{result.segmentCount} segments</span>
											<span className={getQualityColor(result.addScore)}>
												Quality: {(result.addScore * 100).toFixed(0)}%
											</span>
										</div>
									</div>

									{/* Actions */}
									<div className="flex gap-2">
										<button
											onClick={() => handleRerun(result.query)}
											className="p-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
											title="Re-run search"
										>
											<RefreshCw className="w-4 h-4" />
										</button>
										<button
											onClick={() => handleDelete(result.id)}
											className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
											title="Delete"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								</div>

								{/* Annotations */}
								{result.annotations.length > 0 && (
									<div className="mb-4 p-3 bg-slate-900 rounded-lg">
										<div className="text-sm font-medium mb-2">Annotations ({result.annotations.length})</div>
										<div className="space-y-2">
											{result.annotations.slice(0, 3).map((annotation) => (
												<div key={annotation.id} className="text-sm text-slate-300">
													<span className="text-slate-500">{annotation.author}:</span> {annotation.text}
												</div>
											))}
											{result.annotations.length > 3 && (
												<div className="text-xs text-slate-500">
													+{result.annotations.length - 3} more annotations
												</div>
											)}
										</div>
									</div>
								)}

								{/* Export Options */}
								<div className="flex flex-wrap gap-2">
									<span className="text-sm text-slate-400 flex items-center gap-2">
										<Download className="w-4 h-4" />
										Export:
									</span>
									<button
										onClick={() => handleExport(result, 'markdown')}
										className="text-sm px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
									>
										Markdown
									</button>
									<button
										onClick={() => handleExport(result, 'json')}
										className="text-sm px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
									>
										JSON
									</button>
									<button
										onClick={() => handleExport(result, 'jsonl')}
										className="text-sm px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
									>
										JSONL (Training)
									</button>
									<button
										onClick={() => handleExport(result, 'prompt')}
										className="text-sm px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
									>
										Prompt Format
									</button>
								</div>

								{/* User Approval Status */}
								{result.userApproved && (
									<div className="mt-3 text-sm text-green-500">
										✓ User approved
									</div>
								)}
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
