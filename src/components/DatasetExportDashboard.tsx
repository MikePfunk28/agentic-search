import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

type ExportFormat = "openai_jsonl" | "anthropic_jsonl" | "generic_json";

export default function DatasetExportDashboard() {
	const [format, setFormat] = useState<ExportFormat>("openai_jsonl");
	const [minQuality, setMinQuality] = useState<number>(0.7);
	const [eventTypes, setEventTypes] = useState<string[]>(["user_feedback", "segment_execution"]);
	const [limit, setLimit] = useState<number>(1000);
	const [datasetName, setDatasetName] = useState<string>("");
	const [isExporting, setIsExporting] = useState(false);

	// Query usage statistics
	const stats = useQuery(api.usageTracking.getUsageStats, {});

	// Query export data
	const exportData = useQuery(
		api.usageTracking.exportForFineTuning,
		isExporting
			? {
					format,
					minQuality,
					eventTypes,
					limit,
			  }
			: "skip",
	);

	// Query existing datasets
	const datasets = useQuery(api.usageTracking.listDatasets, { limit: 10 });

	// Create dataset mutation
	const createDataset = useMutation(api.usageTracking.createDatasetExport);

	const handleExport = () => {
		setIsExporting(true);
	};

	const handleDownload = () => {
		if (!exportData) return;

		const filename = `training-data-${format}-${Date.now()}.${format.includes("jsonl") ? "jsonl" : "json"}`;
		const blob = new Blob([JSON.stringify(exportData.data, null, format.includes("jsonl") ? 0 : 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const handleSaveDataset = async () => {
		if (!datasetName || !exportData) {
			alert("Please provide a dataset name");
			return;
		}

		try {
			await createDataset({
				name: datasetName,
				format,
				minQuality,
				eventTypes,
				totalExamples: exportData.metadata.total_examples,
			});
			alert("Dataset saved successfully!");
			setDatasetName("");
			setIsExporting(false);
		} catch (error) {
			console.error("Failed to save dataset:", error);
			alert("Failed to save dataset");
		}
	};

	const toggleEventType = (type: string) => {
		setEventTypes((prev) =>
			prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
		);
	};

	return (
		<div className="dataset-export-dashboard">
			<div className="dashboard-header">
				<h2>Training Data Export</h2>
				<p className="dashboard-subtitle">
					Export your interactions as fine-tuning datasets for OpenAI, Anthropic, or custom models.
				</p>
			</div>

			{/* Statistics Overview */}
			{stats && (
				<div className="stats-overview">
					<h3>Available Training Data</h3>
					<div className="stats-grid">
						<div className="stat-card">
							<div className="stat-icon">📊</div>
							<div className="stat-content">
								<span className="stat-label">Total Events</span>
								<span className="stat-value">{stats.totalEvents}</span>
							</div>
						</div>
						<div className="stat-card">
							<div className="stat-icon">✅</div>
							<div className="stat-content">
								<span className="stat-label">Successful</span>
								<span className="stat-value">{stats.successfulEvents}</span>
							</div>
						</div>
						<div className="stat-card">
							<div className="stat-icon">⭐</div>
							<div className="stat-content">
								<span className="stat-label">Avg Quality</span>
								<span className="stat-value">{stats.averageQuality.toFixed(2)}</span>
							</div>
						</div>
						<div className="stat-card">
							<div className="stat-icon">🎯</div>
							<div className="stat-content">
								<span className="stat-label">High Quality</span>
								<span className="stat-value">
									{stats.qualityDistribution?.high || 0}
								</span>
							</div>
						</div>
					</div>

					{/* Quality Distribution Chart */}
					<div className="quality-distribution">
						<h4>Quality Distribution</h4>
						<div className="distribution-bar">
							<div
								className="quality-segment gold"
								style={{
									width: `${((stats.qualityDistribution?.gold || 0) / stats.totalEvents) * 100}%`,
								}}
								title={`Gold (1.0): ${stats.qualityDistribution?.gold || 0}`}
							/>
							<div
								className="quality-segment high"
								style={{
									width: `${((stats.qualityDistribution?.high || 0) / stats.totalEvents) * 100}%`,
								}}
								title={`High (0.7-0.9): ${stats.qualityDistribution?.high || 0}`}
							/>
							<div
								className="quality-segment medium"
								style={{
									width: `${((stats.qualityDistribution?.medium || 0) / stats.totalEvents) * 100}%`,
								}}
								title={`Medium (0.4-0.6): ${stats.qualityDistribution?.medium || 0}`}
							/>
							<div
								className="quality-segment low"
								style={{
									width: `${((stats.qualityDistribution?.low || 0) / stats.totalEvents) * 100}%`,
								}}
								title={`Low (0-0.3): ${stats.qualityDistribution?.low || 0}`}
							/>
						</div>
						<div className="distribution-legend">
							<div className="legend-item">
								<span className="legend-color gold"></span>
								<span>Gold (1.0)</span>
							</div>
							<div className="legend-item">
								<span className="legend-color high"></span>
								<span>High (0.7-0.9)</span>
							</div>
							<div className="legend-item">
								<span className="legend-color medium"></span>
								<span>Medium (0.4-0.6)</span>
							</div>
							<div className="legend-item">
								<span className="legend-color low"></span>
								<span>Low (0-0.3)</span>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Export Configuration */}
			<div className="export-configuration">
				<h3>Export Configuration</h3>

				<div className="config-form">
					{/* Format Selection */}
					<div className="form-group">
						<label>Export Format:</label>
						<div className="format-options">
							<button
								onClick={() => setFormat("openai_jsonl")}
								className={`format-btn ${format === "openai_jsonl" ? "active" : ""}`}
							>
								<div className="format-icon">🤖</div>
								<div className="format-name">OpenAI JSONL</div>
								<div className="format-desc">For GPT fine-tuning</div>
							</button>
							<button
								onClick={() => setFormat("anthropic_jsonl")}
								className={`format-btn ${format === "anthropic_jsonl" ? "active" : ""}`}
							>
								<div className="format-icon">🧠</div>
								<div className="format-name">Anthropic JSONL</div>
								<div className="format-desc">For Claude fine-tuning</div>
							</button>
							<button
								onClick={() => setFormat("generic_json")}
								className={`format-btn ${format === "generic_json" ? "active" : ""}`}
							>
								<div className="format-icon">📋</div>
								<div className="format-name">Generic JSON</div>
								<div className="format-desc">For any model</div>
							</button>
						</div>
					</div>

					{/* Quality Threshold */}
					<div className="form-group">
						<label>Minimum Quality: {(minQuality * 100).toFixed(0)}%</label>
						<input
							type="range"
							min="0"
							max="1"
							step="0.05"
							value={minQuality}
							onChange={(e) => setMinQuality(Number(e.target.value))}
							className="quality-slider"
						/>
						<div className="quality-markers">
							<span>0%</span>
							<span>25%</span>
							<span>50%</span>
							<span>75%</span>
							<span>100%</span>
						</div>
						<div className="quality-hint">
							💡 Higher threshold = Better quality but fewer examples
						</div>
					</div>

					{/* Event Types */}
					<div className="form-group">
						<label>Event Types:</label>
						<div className="event-types">
							{["user_feedback", "segment_execution", "search_query", "reasoning_step"].map(
								(type) => (
									<label key={type} className="checkbox-label">
										<input
											type="checkbox"
											checked={eventTypes.includes(type)}
											onChange={() => toggleEventType(type)}
											className="event-checkbox"
										/>
										<span>{type.replace(/_/g, " ")}</span>
									</label>
								),
							)}
						</div>
					</div>

					{/* Limit */}
					<div className="form-group">
						<label>Maximum Examples:</label>
						<input
							type="number"
							value={limit}
							onChange={(e) => setLimit(Number(e.target.value))}
							min="100"
							max="10000"
							step="100"
							className="limit-input"
						/>
					</div>

					{/* Export Actions */}
					<div className="export-actions">
						<button onClick={handleExport} className="btn btn-export" disabled={isExporting}>
							{isExporting ? "⏳ Exporting..." : "📊 Generate Export"}
						</button>
					</div>
				</div>
			</div>

			{/* Export Preview */}
			{exportData && (
				<div className="export-preview">
					<h3>Export Preview</h3>

					<div className="preview-metadata">
						<div className="metadata-item">
							<strong>Total Examples:</strong> {exportData.metadata.total_examples}
						</div>
						<div className="metadata-item">
							<strong>Format:</strong> {exportData.metadata.format}
						</div>
						<div className="metadata-item">
							<strong>Min Quality:</strong> {(exportData.metadata.min_quality * 100).toFixed(0)}%
						</div>
						<div className="metadata-item">
							<strong>Generated:</strong> {new Date(exportData.metadata.generated_at).toLocaleString()}
						</div>
					</div>

					{/* Sample Preview */}
					<div className="sample-preview">
						<h4>Sample Data (first 3 examples):</h4>
						<pre className="sample-code">
							{JSON.stringify(exportData.data.slice(0, 3), null, 2)}
						</pre>
					</div>

					{/* Save & Download Actions */}
					<div className="preview-actions">
						<div className="save-form">
							<input
								type="text"
								value={datasetName}
								onChange={(e) => setDatasetName(e.target.value)}
								placeholder="Dataset name (e.g., 'v1-high-quality')"
								className="dataset-name-input"
							/>
							<button onClick={handleSaveDataset} className="btn btn-save">
								💾 Save Dataset
							</button>
						</div>
						<button onClick={handleDownload} className="btn btn-download">
							⬇️ Download File
						</button>
					</div>
				</div>
			)}

			{/* Saved Datasets */}
			{datasets && datasets.length > 0 && (
				<div className="saved-datasets">
					<h3>Saved Datasets</h3>
					<div className="datasets-list">
						{datasets.map((dataset) => (
							<div key={dataset._id} className="dataset-card">
								<div className="dataset-header">
									<h4>{dataset.name}</h4>
									<span className="dataset-format">{dataset.format}</span>
								</div>
								<div className="dataset-details">
									<span>📊 {dataset.totalExamples} examples</span>
									<span>⭐ Min quality: {(dataset.minQuality * 100).toFixed(0)}%</span>
									<span>📅 {new Date(dataset.exportedAt).toLocaleDateString()}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			<style>{`
				.dataset-export-dashboard {
					max-width: 1200px;
					margin: 0 auto;
					padding: 2rem;
				}

				.dashboard-header {
					margin-bottom: 2rem;
				}

				.dashboard-header h2 {
					font-size: 2rem;
					font-weight: 700;
					color: #1a202c;
					margin-bottom: 0.5rem;
				}

				.dashboard-subtitle {
					color: #718096;
				}

				.stats-overview {
					background: white;
					border-radius: 12px;
					padding: 2rem;
					margin-bottom: 2rem;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
				}

				.stats-overview h3 {
					font-size: 1.5rem;
					font-weight: 600;
					color: #2d3748;
					margin-bottom: 1.5rem;
				}

				.stats-grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
					gap: 1rem;
					margin-bottom: 2rem;
				}

				.stat-card {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					padding: 1.5rem;
					border-radius: 12px;
					display: flex;
					align-items: center;
					gap: 1rem;
					box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
				}

				.stat-icon {
					font-size: 2rem;
				}

				.stat-content {
					display: flex;
					flex-direction: column;
					gap: 0.25rem;
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

				.quality-distribution {
					margin-top: 2rem;
				}

				.quality-distribution h4 {
					font-size: 1.125rem;
					font-weight: 600;
					color: #2d3748;
					margin-bottom: 1rem;
				}

				.distribution-bar {
					display: flex;
					width: 100%;
					height: 3rem;
					border-radius: 8px;
					overflow: hidden;
					margin-bottom: 1rem;
				}

				.quality-segment {
					height: 100%;
					transition: all 0.3s;
					cursor: help;
				}

				.quality-segment.gold { background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); }
				.quality-segment.high { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); }
				.quality-segment.medium { background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%); }
				.quality-segment.low { background: linear-gradient(135deg, #fc8181 0%, #f56565 100%); }

				.distribution-legend {
					display: flex;
					gap: 1.5rem;
					flex-wrap: wrap;
				}

				.legend-item {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					font-size: 0.875rem;
					color: #4a5568;
				}

				.legend-color {
					width: 1rem;
					height: 1rem;
					border-radius: 3px;
				}

				.legend-color.gold { background: #ffd700; }
				.legend-color.high { background: #48bb78; }
				.legend-color.medium { background: #ed8936; }
				.legend-color.low { background: #fc8181; }

				.export-configuration {
					background: white;
					border-radius: 12px;
					padding: 2rem;
					margin-bottom: 2rem;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
				}

				.export-configuration h3 {
					font-size: 1.5rem;
					font-weight: 600;
					color: #2d3748;
					margin-bottom: 1.5rem;
				}

				.config-form {
					display: flex;
					flex-direction: column;
					gap: 2rem;
				}

				.form-group label {
					display: block;
					font-weight: 600;
					color: #2d3748;
					margin-bottom: 0.75rem;
				}

				.format-options {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
					gap: 1rem;
				}

				.format-btn {
					padding: 1.5rem;
					background: #f7fafc;
					border: 2px solid #e2e8f0;
					border-radius: 12px;
					cursor: pointer;
					transition: all 0.2s;
					text-align: center;
				}

				.format-btn:hover {
					border-color: #667eea;
					transform: translateY(-2px);
					box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
				}

				.format-btn.active {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					border-color: #667eea;
					color: white;
				}

				.format-icon {
					font-size: 2.5rem;
					margin-bottom: 0.5rem;
				}

				.format-name {
					font-weight: 600;
					font-size: 1rem;
					margin-bottom: 0.25rem;
				}

				.format-desc {
					font-size: 0.75rem;
					opacity: 0.8;
				}

				.quality-slider {
					width: 100%;
					height: 8px;
					border-radius: 9999px;
					-webkit-appearance: none;
					appearance: none;
					background: linear-gradient(90deg, #fc8181 0%, #fbd38d 50%, #68d391 100%);
					outline: none;
				}

				.quality-slider::-webkit-slider-thumb {
					-webkit-appearance: none;
					appearance: none;
					width: 24px;
					height: 24px;
					border-radius: 50%;
					background: white;
					border: 3px solid #667eea;
					cursor: pointer;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
				}

				.quality-markers {
					display: flex;
					justify-content: space-between;
					font-size: 0.75rem;
					color: #718096;
					margin-top: 0.25rem;
				}

				.quality-hint {
					font-size: 0.875rem;
					color: #718096;
					padding: 0.5rem 0.75rem;
					background: #fef5e7;
					border-radius: 6px;
					border-left: 3px solid #f59e0b;
					margin-top: 0.5rem;
				}

				.event-types {
					display: flex;
					flex-direction: column;
					gap: 0.75rem;
				}

				.checkbox-label {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					cursor: pointer;
					padding: 0.5rem;
					border-radius: 6px;
					transition: background 0.2s;
				}

				.checkbox-label:hover {
					background: #f7fafc;
				}

				.event-checkbox {
					width: 1.25rem;
					height: 1.25rem;
					cursor: pointer;
				}

				.limit-input {
					width: 100%;
					padding: 0.75rem;
					border: 2px solid #e2e8f0;
					border-radius: 8px;
					font-size: 1rem;
				}

				.export-actions {
					display: flex;
					gap: 1rem;
					padding-top: 1rem;
				}

				.btn {
					padding: 1rem 2rem;
					border: none;
					border-radius: 8px;
					font-weight: 600;
					font-size: 1rem;
					cursor: pointer;
					transition: all 0.2s;
					display: inline-flex;
					align-items: center;
					gap: 0.5rem;
				}

				.btn-export {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: white;
					box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
				}

				.btn-export:hover:not(:disabled) {
					transform: translateY(-2px);
					box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
				}

				.btn-export:disabled {
					opacity: 0.6;
					cursor: not-allowed;
				}

				.export-preview {
					background: white;
					border-radius: 12px;
					padding: 2rem;
					margin-bottom: 2rem;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
				}

				.export-preview h3 {
					font-size: 1.5rem;
					font-weight: 600;
					color: #2d3748;
					margin-bottom: 1.5rem;
				}

				.preview-metadata {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
					gap: 1rem;
					margin-bottom: 2rem;
					padding: 1rem;
					background: #f7fafc;
					border-radius: 8px;
				}

				.metadata-item {
					font-size: 0.875rem;
					color: #4a5568;
				}

				.metadata-item strong {
					color: #2d3748;
					margin-right: 0.5rem;
				}

				.sample-preview {
					margin-bottom: 2rem;
				}

				.sample-preview h4 {
					font-size: 1rem;
					font-weight: 600;
					color: #2d3748;
					margin-bottom: 1rem;
				}

				.sample-code {
					background: #1a202c;
					color: #68d391;
					padding: 1.5rem;
					border-radius: 8px;
					overflow-x: auto;
					font-family: 'Courier New', monospace;
					font-size: 0.875rem;
					line-height: 1.6;
					max-height: 400px;
					overflow-y: auto;
				}

				.preview-actions {
					display: flex;
					gap: 1rem;
					flex-wrap: wrap;
					align-items: center;
				}

				.save-form {
					display: flex;
					gap: 1rem;
					flex: 1;
				}

				.dataset-name-input {
					flex: 1;
					padding: 0.75rem;
					border: 2px solid #e2e8f0;
					border-radius: 8px;
					font-size: 1rem;
				}

				.btn-save {
					background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
					color: white;
					box-shadow: 0 2px 4px rgba(72, 187, 120, 0.3);
				}

				.btn-save:hover {
					transform: translateY(-2px);
					box-shadow: 0 4px 8px rgba(72, 187, 120, 0.4);
				}

				.btn-download {
					background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
					color: white;
					box-shadow: 0 2px 4px rgba(66, 153, 225, 0.3);
				}

				.btn-download:hover {
					transform: translateY(-2px);
					box-shadow: 0 4px 8px rgba(66, 153, 225, 0.4);
				}

				.saved-datasets {
					background: white;
					border-radius: 12px;
					padding: 2rem;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
				}

				.saved-datasets h3 {
					font-size: 1.5rem;
					font-weight: 600;
					color: #2d3748;
					margin-bottom: 1.5rem;
				}

				.datasets-list {
					display: grid;
					gap: 1rem;
				}

				.dataset-card {
					padding: 1.5rem;
					background: #f7fafc;
					border-radius: 8px;
					border-left: 4px solid #667eea;
				}

				.dataset-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 0.75rem;
				}

				.dataset-header h4 {
					margin: 0;
					font-size: 1.125rem;
					color: #2d3748;
				}

				.dataset-format {
					padding: 0.25rem 0.75rem;
					background: #edf2f7;
					border-radius: 6px;
					font-size: 0.75rem;
					font-weight: 600;
					color: #4a5568;
				}

				.dataset-details {
					display: flex;
					gap: 1.5rem;
					font-size: 0.875rem;
					color: #718096;
				}
			`}</style>
		</div>
	);
}
