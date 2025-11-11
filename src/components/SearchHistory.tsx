import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface SearchHistoryProps {
	onSelectSearch?: (searchId: Id<"searchHistory">) => void;
}

export default function SearchHistory({ onSelectSearch }: SearchHistoryProps) {
	const [currentPage, setCurrentPage] = useState(0);
	const [searchQuery, setSearchQuery] = useState("");
	const [qualityFilter, setQualityFilter] = useState<number | null>(null);
	const [modelFilter, setModelFilter] = useState<string>("");

	// Query search history with pagination
	const searchHistory = useQuery(api.searchHistory.listSearchHistory, {
		limit: 10,
		offset: currentPage * 10,
	});

	// Query search statistics
	const stats = useQuery(api.searchHistory.getSearchStats, {});

	// Search within history
	const searchResults = useQuery(
		api.searchHistory.searchHistory,
		searchQuery ? { query: searchQuery, limit: 10 } : "skip",
	);

	// Approve search mutation
	const approveSearch = useMutation(api.searchHistory.approveSearch);

	const handleApprove = async (searchId: Id<"searchHistory">, rating: number) => {
		try {
			await approveSearch({
				searchId,
				userApproved: true,
				userRating: rating,
				feedback: "Approved from history browser",
			});
		} catch (error) {
			console.error("Failed to approve search:", error);
		}
	};

	const handleSearchClick = (searchId: Id<"searchHistory">) => {
		if (onSelectSearch) {
			onSelectSearch(searchId);
		}
	};

	// Filter results based on criteria
	const filteredResults = (searchResults || searchHistory)?.filter((search) => {
		if (qualityFilter && search.quality < qualityFilter) return false;
		if (modelFilter && !search.modelUsed.includes(modelFilter)) return false;
		return true;
	});

	return (
		<div className="search-history-container">
			<div className="search-history-header">
				<h2>Search History</h2>

				{/* Statistics Dashboard */}
				{stats && (
					<div className="stats-dashboard">
						<div className="stat-card">
							<span className="stat-label">Total Searches</span>
							<span className="stat-value">{stats.totalSearches}</span>
						</div>
						<div className="stat-card">
							<span className="stat-label">Avg Quality</span>
							<span className="stat-value">{stats.averageQuality.toFixed(2)}</span>
						</div>
						<div className="stat-card">
							<span className="stat-label">Avg Time</span>
							<span className="stat-value">{(stats.averageExecutionTime / 1000).toFixed(1)}s</span>
						</div>
						<div className="stat-card">
							<span className="stat-label">Total Tokens</span>
							<span className="stat-value">{stats.totalTokens.toLocaleString()}</span>
						</div>
						<div className="stat-card">
							<span className="stat-label">Approval Rate</span>
							<span className="stat-value">{stats.approvalRate.toFixed(1)}%</span>
						</div>
					</div>
				)}
			</div>

			{/* Search and Filter Controls */}
			<div className="search-controls">
				<input
					type="text"
					placeholder="Search within history..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="search-input"
				/>

				<div className="filter-controls">
					<select
						value={qualityFilter || ""}
						onChange={(e) => setQualityFilter(e.target.value ? Number(e.target.value) : null)}
						className="filter-select"
					>
						<option value="">All Quality Levels</option>
						<option value="0.8">High Quality (0.8+)</option>
						<option value="0.6">Medium Quality (0.6+)</option>
						<option value="0.4">Low Quality (0.4+)</option>
					</select>

					<input
						type="text"
						placeholder="Filter by model..."
						value={modelFilter}
						onChange={(e) => setModelFilter(e.target.value)}
						className="filter-input"
					/>
				</div>
			</div>

			{/* Search Results List */}
			<div className="search-results-list">
				{filteredResults?.length === 0 ? (
					<div className="empty-state">
						<p>No searches found matching your criteria.</p>
					</div>
				) : (
					filteredResults?.map((search) => (
						<div
							key={search._id}
							className="search-result-card"
							onClick={() => handleSearchClick(search._id)}
						>
							<div className="search-card-header">
								<h3 className="search-query">{search.query}</h3>
								<div className="search-metadata">
									<span className="search-date">
										{new Date(search.timestamp).toLocaleDateString()}
									</span>
									<span className={`quality-badge quality-${getQualityLevel(search.quality)}`}>
										Quality: {search.quality.toFixed(2)}
									</span>
								</div>
							</div>

							<div className="search-card-body">
								<div className="search-details">
									<span className="detail-item">
										<strong>Model:</strong> {search.modelUsed}
									</span>
									<span className="detail-item">
										<strong>Results:</strong> {search.results.length}
									</span>
									<span className="detail-item">
										<strong>Time:</strong> {(search.executionTimeMs / 1000).toFixed(2)}s
									</span>
									<span className="detail-item">
										<strong>Tokens:</strong> {search.tokensUsed}
									</span>
								</div>

								{/* Segment Information */}
								{search.segments && (
									<div className="segment-info">
										<strong>Segments:</strong>
										<div className="segment-tags">
											{search.segments.map((segment: any, idx: number) => (
												<span key={idx} className="segment-tag">
													{segment.type}
												</span>
											))}
										</div>
									</div>
								)}

								{/* User Feedback */}
								{search.userApproved !== undefined && (
									<div className="user-feedback">
										<span className={search.userApproved ? "approved" : "rejected"}>
											{search.userApproved ? "✓ Approved" : "✗ Rejected"}
										</span>
										{search.userRating && (
											<span className="user-rating">
												Rating: {search.userRating}/5
											</span>
										)}
									</div>
								)}

								{/* Quick Actions */}
								<div className="quick-actions">
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleApprove(search._id, 5);
										}}
										className="action-btn approve-btn"
										disabled={search.userApproved}
									>
										👍 Approve
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleSearchClick(search._id);
										}}
										className="action-btn view-btn"
									>
										👁️ View Details
									</button>
								</div>
							</div>
						</div>
					))
				)}
			</div>

			{/* Pagination Controls */}
			<div className="pagination-controls">
				<button
					onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
					disabled={currentPage === 0}
					className="pagination-btn"
				>
					← Previous
				</button>
				<span className="page-indicator">
					Page {currentPage + 1}
				</span>
				<button
					onClick={() => setCurrentPage((p) => p + 1)}
					disabled={!searchHistory || searchHistory.length < 10}
					className="pagination-btn"
				>
					Next →
				</button>
			</div>

			<style>{`
				.search-history-container {
					padding: 2rem;
					max-width: 1200px;
					margin: 0 auto;
				}

				.search-history-header {
					margin-bottom: 2rem;
				}

				.search-history-header h2 {
					font-size: 2rem;
					font-weight: 700;
					margin-bottom: 1.5rem;
					color: #1a202c;
				}

				.stats-dashboard {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
					gap: 1rem;
					margin-bottom: 2rem;
				}

				.stat-card {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					padding: 1.5rem;
					border-radius: 12px;
					display: flex;
					flex-direction: column;
					gap: 0.5rem;
					box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
				}

				.stat-label {
					font-size: 0.875rem;
					color: rgba(255, 255, 255, 0.9);
					font-weight: 500;
				}

				.stat-value {
					font-size: 1.75rem;
					font-weight: 700;
					color: white;
				}

				.search-controls {
					margin-bottom: 2rem;
				}

				.search-input {
					width: 100%;
					padding: 1rem;
					border: 2px solid #e2e8f0;
					border-radius: 8px;
					font-size: 1rem;
					margin-bottom: 1rem;
					transition: border-color 0.2s;
				}

				.search-input:focus {
					outline: none;
					border-color: #667eea;
				}

				.filter-controls {
					display: flex;
					gap: 1rem;
					flex-wrap: wrap;
				}

				.filter-select,
				.filter-input {
					padding: 0.75rem;
					border: 2px solid #e2e8f0;
					border-radius: 8px;
					font-size: 0.875rem;
					flex: 1;
					min-width: 200px;
				}

				.search-results-list {
					display: flex;
					flex-direction: column;
					gap: 1rem;
				}

				.search-result-card {
					background: white;
					border: 2px solid #e2e8f0;
					border-radius: 12px;
					padding: 1.5rem;
					cursor: pointer;
					transition: all 0.2s;
				}

				.search-result-card:hover {
					border-color: #667eea;
					box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
					transform: translateY(-2px);
				}

				.search-card-header {
					display: flex;
					justify-content: space-between;
					align-items: start;
					margin-bottom: 1rem;
				}

				.search-query {
					font-size: 1.25rem;
					font-weight: 600;
					color: #1a202c;
					margin: 0;
					flex: 1;
				}

				.search-metadata {
					display: flex;
					gap: 0.75rem;
					align-items: center;
				}

				.search-date {
					font-size: 0.875rem;
					color: #718096;
				}

				.quality-badge {
					padding: 0.25rem 0.75rem;
					border-radius: 9999px;
					font-size: 0.75rem;
					font-weight: 600;
				}

				.quality-high {
					background: #c6f6d5;
					color: #22543d;
				}

				.quality-medium {
					background: #fef5e7;
					color: #744210;
				}

				.quality-low {
					background: #fed7d7;
					color: #742a2a;
				}

				.search-card-body {
					display: flex;
					flex-direction: column;
					gap: 1rem;
				}

				.search-details {
					display: flex;
					flex-wrap: wrap;
					gap: 1rem;
					font-size: 0.875rem;
					color: #4a5568;
				}

				.detail-item strong {
					color: #2d3748;
				}

				.segment-info {
					display: flex;
					flex-direction: column;
					gap: 0.5rem;
				}

				.segment-tags {
					display: flex;
					flex-wrap: wrap;
					gap: 0.5rem;
				}

				.segment-tag {
					padding: 0.25rem 0.75rem;
					background: #edf2f7;
					border-radius: 6px;
					font-size: 0.75rem;
					font-weight: 500;
					color: #4a5568;
				}

				.user-feedback {
					display: flex;
					gap: 1rem;
					align-items: center;
					font-size: 0.875rem;
					font-weight: 500;
				}

				.user-feedback .approved {
					color: #38a169;
				}

				.user-feedback .rejected {
					color: #e53e3e;
				}

				.quick-actions {
					display: flex;
					gap: 0.75rem;
					margin-top: 0.5rem;
				}

				.action-btn {
					padding: 0.5rem 1rem;
					border: none;
					border-radius: 6px;
					font-size: 0.875rem;
					font-weight: 500;
					cursor: pointer;
					transition: all 0.2s;
				}

				.approve-btn {
					background: #c6f6d5;
					color: #22543d;
				}

				.approve-btn:hover:not(:disabled) {
					background: #9ae6b4;
				}

				.approve-btn:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}

				.view-btn {
					background: #bee3f8;
					color: #2c5282;
				}

				.view-btn:hover {
					background: #90cdf4;
				}

				.pagination-controls {
					display: flex;
					justify-content: center;
					align-items: center;
					gap: 1rem;
					margin-top: 2rem;
				}

				.pagination-btn {
					padding: 0.75rem 1.5rem;
					background: #667eea;
					color: white;
					border: none;
					border-radius: 8px;
					font-weight: 500;
					cursor: pointer;
					transition: all 0.2s;
				}

				.pagination-btn:hover:not(:disabled) {
					background: #5a67d8;
					transform: translateY(-2px);
				}

				.pagination-btn:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}

				.page-indicator {
					font-weight: 500;
					color: #4a5568;
				}

				.empty-state {
					text-align: center;
					padding: 3rem;
					color: #718096;
				}

				.empty-state p {
					font-size: 1.125rem;
				}
			`}</style>
		</div>
	);
}

function getQualityLevel(quality: number): string {
	if (quality >= 0.7) return "high";
	if (quality >= 0.5) return "medium";
	return "low";
}
