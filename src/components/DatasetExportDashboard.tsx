import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

type ExportFormat = "openai_jsonl" | "anthropic_jsonl" | "generic_json";
type UsageEventType =
	| "search"
	| "segment_execution"
	| "model_call"
	| "user_feedback";

type FineTuneJobStatus =
	| "validating_files"
	| "queued"
	| "running"
	| "succeeded"
	| "failed"
	| "cancelled"
	| string;

const EVENT_TYPE_OPTIONS: UsageEventType[] = [
	"search",
	"user_feedback",
	"segment_execution",
	"model_call",
];

const OPENAI_TERMINAL_STATUSES = new Set<FineTuneJobStatus>([
	"succeeded",
	"failed",
	"cancelled",
]);

const DEFAULT_OPENAI_BASE_MODEL = "gpt-4.1-mini-2025-04-14";

interface OpenAIJobResponse {
	job: {
		id: string;
		status: FineTuneJobStatus;
		model: string;
		training_file: string;
		fine_tuned_model?: string | null;
		error?: {
			message?: string;
		} | null;
	};
	trainingFile?: {
		id: string;
		filename: string;
	};
	error?: string;
}

async function fetchCsrfToken(): Promise<string> {
	const response = await fetch("/api/csrf-token", {
		credentials: "same-origin",
	});
	if (!response.ok) {
		throw new Error("Failed to fetch CSRF token.");
	}
	const data = await response.json();
	if (typeof data?.token !== "string") {
		throw new Error("CSRF token response was invalid.");
	}
	return data.token;
}

function getStatusTone(status?: string): string {
	switch (status) {
		case "succeeded":
			return "success";
		case "failed":
		case "cancelled":
			return "danger";
		case "running":
			return "info";
		default:
			return "neutral";
	}
}

function parseHyperparameterValue(
	value: string,
): number | "auto" | undefined {
	const trimmed = value.trim();
	if (!trimmed) {
		return undefined;
	}
	if (trimmed === "auto") {
		return "auto";
	}
	const numeric = Number(trimmed);
	return Number.isFinite(numeric) ? numeric : undefined;
}

export default function DatasetExportDashboard() {
	const [format, setFormat] = useState<ExportFormat>("openai_jsonl");
	const [minQuality, setMinQuality] = useState<number>(0.7);
	const [eventTypes, setEventTypes] = useState<UsageEventType[]>([
		"search",
		"user_feedback",
	]);
	const [limit, setLimit] = useState<number>(1000);
	const [datasetName, setDatasetName] = useState<string>("reward-dataset-v1");
	const [datasetDescription, setDatasetDescription] = useState<string>("");
	const [isExporting, setIsExporting] = useState(false);

	const [openAIBaseModel, setOpenAIBaseModel] = useState<string>(
		DEFAULT_OPENAI_BASE_MODEL,
	);
	const [openAISuffix, setOpenAISuffix] = useState<string>("agentic-search");
	const [openAINEpochs, setOpenAINEpochs] = useState<string>("auto");
	const [openAIBatchSize, setOpenAIBatchSize] = useState<string>("auto");
	const [openAILearningRateMultiplier, setOpenAILearningRateMultiplier] =
		useState<string>("auto");
	const [launchingFineTune, setLaunchingFineTune] = useState(false);
	const [launchError, setLaunchError] = useState<string | null>(null);
	const [fineTuneMessage, setFineTuneMessage] = useState<string | null>(null);
	const [cancellingJobId, setCancellingJobId] = useState<string | null>(null);

	const stats = useQuery(api.usageTracking.getUsageStats, {});
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
	const datasets = useQuery(api.usageTracking.listDatasets, {});
	const createDataset = useMutation(api.usageTracking.createDatasetExport);
	const linkFineTuningJob = useMutation(api.usageTracking.linkFineTuningJob);
	const syncFineTuningJob = useMutation(api.usageTracking.syncFineTuningJob);

	const toggleEventType = (type: UsageEventType) => {
		setEventTypes((prev) =>
			prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type],
		);
	};

	const previewText = exportData
		? format === "generic_json"
			? JSON.stringify(exportData.data.slice(0, 3), null, 2)
			: exportData.data
					.slice(0, 3)
					.map((row) => JSON.stringify(row))
					.join("\n")
		: "";

	const openAIJobs =
		datasets?.filter((dataset) => dataset.provider === "openai" && dataset.jobId) ??
		[];

	useEffect(() => {
		if (!openAIJobs.length) {
			return;
		}

		const activeJobs = openAIJobs.filter(
			(dataset) =>
				dataset.jobId &&
				!OPENAI_TERMINAL_STATUSES.has(dataset.status || "queued"),
		);

		if (!activeJobs.length) {
			return;
		}

		let cancelled = false;

		const poll = async () => {
			for (const dataset of activeJobs) {
				if (cancelled || !dataset.jobId) {
					return;
				}

				try {
					const response = await fetch(
						`/api/fine-tune/openai?jobId=${encodeURIComponent(dataset.jobId)}`,
						{
							credentials: "same-origin",
						},
					);
					const payload = (await response.json()) as OpenAIJobResponse;
					if (!response.ok || !payload.job) {
						throw new Error(payload.error || "Failed to fetch OpenAI job status.");
					}

					await syncFineTuningJob({
						datasetId: dataset._id,
						status: payload.job.status,
						fineTunedModel: payload.job.fine_tuned_model || undefined,
						errorMessage: payload.job.error?.message,
						lastCheckedAt: Date.now(),
					});
				} catch (error) {
					console.error("Failed to synchronize OpenAI fine-tune status:", error);
				}
			}
		};

		void poll();
		const interval = setInterval(() => {
			void poll();
		}, 15000);

		return () => {
			cancelled = true;
			clearInterval(interval);
		};
	}, [openAIJobs, syncFineTuningJob]);

	const handleExport = () => {
		setIsExporting(true);
		setFineTuneMessage(null);
	};

	const handleDownload = () => {
		if (!exportData) return;

		const isJsonl = format !== "generic_json";
		const serialized = isJsonl
			? exportData.data.map((row) => JSON.stringify(row)).join("\n")
			: JSON.stringify(exportData.data, null, 2);
		const filename = `training-data-${format}-${Date.now()}.${isJsonl ? "jsonl" : "json"}`;
		const blob = new Blob([serialized], {
			type: isJsonl ? "application/x-ndjson" : "application/json",
		});
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = filename;
		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);
		URL.revokeObjectURL(url);
	};

	const handleSaveDataset = async () => {
		if (!datasetName.trim()) {
			alert("Please provide a dataset name.");
			return;
		}

		try {
			await createDataset({
				name: datasetName.trim(),
				description: datasetDescription.trim() || undefined,
				format,
				minQuality,
				eventTypes,
				limit,
			});
			alert("Dataset metadata saved.");
		} catch (error) {
			console.error("Failed to save dataset:", error);
			alert("Failed to save dataset metadata.");
		}
	};

	const handleLaunchOpenAIFineTune = async () => {
		if (!exportData) {
			setLaunchError("Generate an export first.");
			return;
		}
		if (!datasetName.trim()) {
			setLaunchError("A dataset name is required before launching.");
			return;
		}
		if (exportData.count < 10) {
			setLaunchError("OpenAI fine-tuning is not useful with fewer than 10 examples.");
			return;
		}

		setLaunchingFineTune(true);
		setLaunchError(null);
		setFineTuneMessage(null);

		try {
			const datasetId = await createDataset({
				name: datasetName.trim(),
				description: datasetDescription.trim() || undefined,
				format,
				minQuality,
				eventTypes,
				limit,
			});

			const csrfToken = await fetchCsrfToken();
			const response = await fetch("/api/fine-tune/openai", {
				method: "POST",
				credentials: "same-origin",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": csrfToken,
				},
				body: JSON.stringify({
					action: "launch",
					datasetName: datasetName.trim(),
					records: exportData.data,
					format: exportData.format,
					baseModel: openAIBaseModel.trim(),
					suffix: openAISuffix.trim() || undefined,
					hyperparameters: {
						nEpochs: parseHyperparameterValue(openAINEpochs),
						batchSize: parseHyperparameterValue(openAIBatchSize),
						learningRateMultiplier: parseHyperparameterValue(
							openAILearningRateMultiplier,
						),
					},
				}),
			});

			const payload = (await response.json()) as OpenAIJobResponse;
			if (!response.ok || !payload.job) {
				throw new Error(payload.error || "Failed to launch OpenAI fine-tuning.");
			}

			await linkFineTuningJob({
				datasetId: datasetId as Id<"finetuningDatasets">,
				provider: "openai",
				jobId: payload.job.id,
				baseModel: openAIBaseModel.trim(),
				suffix: openAISuffix.trim() || undefined,
				trainingFileId: payload.trainingFile?.id,
				status: payload.job.status,
				launchedAt: Date.now(),
			});

			setFineTuneMessage(
				`OpenAI fine-tune job ${payload.job.id} launched successfully.`,
			);
		} catch (error) {
			console.error("Failed to launch OpenAI fine-tune:", error);
			setLaunchError(
				error instanceof Error ? error.message : "Failed to launch OpenAI fine-tuning.",
			);
		} finally {
			setLaunchingFineTune(false);
		}
	};

	const handleCancelJob = async (
		datasetId: Id<"finetuningDatasets">,
		jobId: string,
	) => {
		setCancellingJobId(jobId);
		setLaunchError(null);
		setFineTuneMessage(null);

		try {
			const csrfToken = await fetchCsrfToken();
			const response = await fetch("/api/fine-tune/openai", {
				method: "POST",
				credentials: "same-origin",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": csrfToken,
				},
				body: JSON.stringify({
					action: "cancel",
					jobId,
				}),
			});
			const payload = (await response.json()) as OpenAIJobResponse;
			if (!response.ok || !payload.job) {
				throw new Error(payload.error || "Failed to cancel OpenAI fine-tune.");
			}

			await syncFineTuningJob({
				datasetId,
				status: payload.job.status,
				fineTunedModel: payload.job.fine_tuned_model || undefined,
				errorMessage: payload.job.error?.message,
				lastCheckedAt: Date.now(),
			});
			setFineTuneMessage(`Job ${jobId} was cancelled.`);
		} catch (error) {
			console.error("Failed to cancel OpenAI fine-tune:", error);
			setLaunchError(
				error instanceof Error ? error.message : "Failed to cancel OpenAI fine-tune.",
			);
		} finally {
			setCancellingJobId(null);
		}
	};

	return (
		<div className="dataset-export-dashboard">
			<div className="dashboard-header">
				<h2>Training Data Export</h2>
				<p className="dashboard-subtitle">
					Export reward signals, then launch an OpenAI supervised fine-tune directly from this TanStack Start app.
				</p>
			</div>

			{stats && (
				<div className="stats-overview">
					<h3>Available Reinforcement Data</h3>
					<div className="stats-grid">
						<div className="stat-card">
							<div className="stat-icon">📦</div>
							<div className="stat-content">
								<span className="stat-label">Tracked Events</span>
								<span className="stat-value">{stats.eventsCount}</span>
							</div>
						</div>
						<div className="stat-card">
							<div className="stat-icon">🔎</div>
							<div className="stat-content">
								<span className="stat-label">Searches</span>
								<span className="stat-value">{stats.totalSearches}</span>
							</div>
						</div>
						<div className="stat-card">
							<div className="stat-icon">🧠</div>
							<div className="stat-content">
								<span className="stat-label">Segments</span>
								<span className="stat-value">{stats.totalSegments}</span>
							</div>
						</div>
						<div className="stat-card">
							<div className="stat-icon">👍</div>
							<div className="stat-content">
								<span className="stat-label">Feedback Events</span>
								<span className="stat-value">{stats.totalFeedback}</span>
							</div>
						</div>
						<div className="stat-card">
							<div className="stat-icon">⭐</div>
							<div className="stat-content">
								<span className="stat-label">Avg Quality</span>
								<span className="stat-value">{stats.avgQuality.toFixed(2)}</span>
							</div>
						</div>
						<div className="stat-card">
							<div className="stat-icon">⏱️</div>
							<div className="stat-content">
								<span className="stat-label">Avg Runtime</span>
								<span className="stat-value">
									{(stats.avgExecutionTime / 1000).toFixed(1)}s
								</span>
							</div>
						</div>
					</div>

					<div className="distribution-legend">
						<div className="legend-item">
							<span className="legend-color gold"></span>
							<span>Total tokens: {stats.totalTokens.toLocaleString()}</span>
						</div>
						{Object.entries(stats.modelDistribution).map(([model, count]) => (
							<div key={model} className="legend-item">
								<span className="legend-color high"></span>
								<span>
									{model}: {count}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="export-configuration">
				<h3>Dataset Configuration</h3>

				<div className="config-form">
					<div className="form-group">
						<label>Export Format</label>
						<div className="format-options">
							<button
								onClick={() => setFormat("openai_jsonl")}
								className={`format-btn ${format === "openai_jsonl" ? "active" : ""}`}
							>
								<div className="format-icon">🤖</div>
								<div className="format-name">OpenAI JSONL</div>
								<div className="format-desc">Best choice for automated launch</div>
							</button>
							<button
								onClick={() => setFormat("anthropic_jsonl")}
								className={`format-btn ${format === "anthropic_jsonl" ? "active" : ""}`}
							>
								<div className="format-icon">🧠</div>
								<div className="format-name">Anthropic JSONL</div>
								<div className="format-desc">Prompt/completion export</div>
							</button>
							<button
								onClick={() => setFormat("generic_json")}
								className={`format-btn ${format === "generic_json" ? "active" : ""}`}
							>
								<div className="format-icon">📋</div>
								<div className="format-name">Generic JSON</div>
								<div className="format-desc">Full metadata for offline analysis</div>
							</button>
						</div>
					</div>

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
							Higher thresholds bias the dataset toward better reward signals and fewer noisy traces.
						</div>
					</div>

					<div className="form-group">
						<label>Event Types</label>
						<div className="event-types">
							{EVENT_TYPE_OPTIONS.map((type) => (
								<label key={type} className="checkbox-label">
									<input
										type="checkbox"
										checked={eventTypes.includes(type)}
										onChange={() => toggleEventType(type)}
										className="event-checkbox"
									/>
									<span>{type.replace(/_/g, " ")}</span>
								</label>
							))}
						</div>
					</div>

					<div className="two-col">
						<div className="form-group">
							<label>Maximum Examples</label>
							<input
								type="number"
								value={limit}
								onChange={(e) => setLimit(Number(e.target.value))}
								min="10"
								max="10000"
								step="10"
								className="limit-input"
							/>
						</div>

						<div className="form-group">
							<label>Dataset Name</label>
							<input
								type="text"
								value={datasetName}
								onChange={(e) => setDatasetName(e.target.value)}
								className="dataset-name-input"
							/>
						</div>
					</div>

					<div className="form-group">
						<label>Description</label>
						<input
							type="text"
							value={datasetDescription}
							onChange={(e) => setDatasetDescription(e.target.value)}
							placeholder="Optional note about this export batch"
							className="dataset-name-input"
						/>
					</div>

					<div className="export-actions">
						<button onClick={handleExport} className="btn btn-export">
							📊 Generate Export
						</button>
						<button onClick={handleSaveDataset} className="btn btn-save">
							💾 Save Dataset Metadata
						</button>
					</div>
				</div>
			</div>

			{exportData && (
				<div className="export-preview">
					<h3>Export Preview</h3>

					<div className="preview-metadata">
						<div className="metadata-item">
							<strong>Total Examples:</strong> {exportData.count}
						</div>
						<div className="metadata-item">
							<strong>Format:</strong> {exportData.format}
						</div>
						<div className="metadata-item">
							<strong>Min Quality:</strong> {(minQuality * 100).toFixed(0)}%
						</div>
						<div className="metadata-item">
							<strong>Included Signals:</strong> {eventTypes.join(", ")}
						</div>
					</div>

					<div className="sample-preview">
						<h4>Sample Data (first 3 records)</h4>
						<pre className="sample-code">
							{previewText || "No records matched the current filters."}
						</pre>
					</div>

					<div className="preview-actions">
						<button onClick={handleDownload} className="btn btn-download">
							⬇️ Download File
						</button>
					</div>
				</div>
			)}

			<div className="export-preview">
				<h3>OpenAI Automated Fine-Tuning</h3>
				<p className="dashboard-subtitle">
					This uploads the current export to OpenAI as a `fine-tune` file and creates a supervised fine-tuning job. The TanStack Start server must have `OPENAI_API_KEY` configured.
				</p>

				<div className="config-form">
					<div className="two-col">
						<div className="form-group">
							<label>Base Model</label>
							<input
								type="text"
								value={openAIBaseModel}
								onChange={(e) => setOpenAIBaseModel(e.target.value)}
								className="dataset-name-input"
							/>
						</div>
						<div className="form-group">
							<label>Suffix</label>
							<input
								type="text"
								value={openAISuffix}
								onChange={(e) => setOpenAISuffix(e.target.value)}
								className="dataset-name-input"
							/>
						</div>
					</div>

					<div className="three-col">
						<div className="form-group">
							<label>`n_epochs`</label>
							<input
								type="text"
								value={openAINEpochs}
								onChange={(e) => setOpenAINEpochs(e.target.value)}
								placeholder="auto"
								className="dataset-name-input"
							/>
						</div>
						<div className="form-group">
							<label>`batch_size`</label>
							<input
								type="text"
								value={openAIBatchSize}
								onChange={(e) => setOpenAIBatchSize(e.target.value)}
								placeholder="auto"
								className="dataset-name-input"
							/>
						</div>
						<div className="form-group">
							<label>`learning_rate_multiplier`</label>
							<input
								type="text"
								value={openAILearningRateMultiplier}
								onChange={(e) =>
									setOpenAILearningRateMultiplier(e.target.value)
								}
								placeholder="auto"
								className="dataset-name-input"
							/>
						</div>
					</div>

					{launchError ? <p className="message error">{launchError}</p> : null}
					{fineTuneMessage ? (
						<p className="message success">{fineTuneMessage}</p>
					) : null}

					<div className="export-actions">
						<button
							onClick={handleLaunchOpenAIFineTune}
							className="btn btn-export"
							disabled={launchingFineTune || !exportData}
						>
							{launchingFineTune ? "Launching..." : "🚀 Launch OpenAI Fine-Tune"}
						</button>
					</div>
				</div>
			</div>

			{datasets && datasets.length > 0 && (
				<div className="saved-datasets">
					<h3>Saved Dataset Exports</h3>
					<div className="datasets-list">
						{datasets.map((dataset) => (
							<div key={dataset._id} className="dataset-card">
								<div className="dataset-header">
									<h4>{dataset.name}</h4>
									<div className="job-header-right">
										<span className="dataset-format">{dataset.format}</span>
										{dataset.status ? (
											<span className={`status-pill ${getStatusTone(dataset.status)}`}>
												{dataset.status}
											</span>
										) : null}
									</div>
								</div>

								<div className="dataset-details">
									<span>📊 {dataset.eventCount} examples</span>
									<span>
										⭐ Avg quality: {(dataset.metadata?.avgQuality ?? 0).toFixed(2)}
									</span>
									{dataset.metadata?.approvedSearchCount ? (
										<span>
											✅ {dataset.metadata.approvedSearchCount} approved searches
										</span>
									) : null}
									{dataset.metadata?.usageEventCount ? (
										<span>
											🧪 {dataset.metadata.usageEventCount} event fallbacks
										</span>
									) : null}
									<span>
										📅 {new Date(dataset.exportedAt).toLocaleDateString()}
									</span>
								</div>

								{dataset.description ? (
									<p className="dashboard-subtitle">{dataset.description}</p>
								) : null}

								{dataset.jobId ? (
									<div className="job-details">
										<div className="metadata-item">
											<strong>Provider:</strong> {dataset.provider}
										</div>
										<div className="metadata-item">
											<strong>Job ID:</strong> {dataset.jobId}
										</div>
										<div className="metadata-item">
											<strong>Base Model:</strong> {dataset.baseModel}
										</div>
										{dataset.fineTunedModel ? (
											<div className="metadata-item">
												<strong>Fine-Tuned Model:</strong>{" "}
												{dataset.fineTunedModel}
											</div>
										) : null}
										{dataset.errorMessage ? (
											<div className="metadata-item error-text">
												<strong>Error:</strong> {dataset.errorMessage}
											</div>
										) : null}
										{dataset.jobId &&
										dataset.status &&
										!OPENAI_TERMINAL_STATUSES.has(dataset.status) ? (
											<div className="preview-actions">
												<button
													onClick={() =>
														handleCancelJob(dataset._id, dataset.jobId!)
													}
													className="btn btn-cancel"
													disabled={cancellingJobId === dataset.jobId}
												>
													{cancellingJobId === dataset.jobId
														? "Cancelling..."
														: "Cancel Job"}
												</button>
											</div>
										) : null}
									</div>
								) : null}
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

				.stats-overview,
				.export-configuration,
				.export-preview,
				.saved-datasets {
					background: white;
					border-radius: 12px;
					padding: 2rem;
					margin-bottom: 2rem;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
				}

				.stats-overview h3,
				.export-configuration h3,
				.export-preview h3,
				.saved-datasets h3 {
					font-size: 1.5rem;
					font-weight: 600;
					color: #2d3748;
					margin-bottom: 1.5rem;
				}

				.stats-grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
					gap: 1rem;
					margin-bottom: 1.5rem;
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
					font-size: 1.5rem;
					font-weight: 700;
					color: white;
				}

				.config-form {
					display: flex;
					flex-direction: column;
					gap: 1.5rem;
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

				.two-col,
				.three-col {
					display: grid;
					gap: 1rem;
				}

				.two-col {
					grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
				}

				.three-col {
					grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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

				.limit-input,
				.dataset-name-input {
					width: 100%;
					padding: 0.75rem;
					border: 2px solid #e2e8f0;
					border-radius: 8px;
					font-size: 1rem;
				}

				.export-actions,
				.preview-actions {
					display: flex;
					gap: 1rem;
					flex-wrap: wrap;
				}

				.btn {
					padding: 1rem 1.5rem;
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

				.btn:disabled {
					opacity: 0.6;
					cursor: not-allowed;
				}

				.btn-export {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: white;
				}

				.btn-save {
					background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
					color: white;
				}

				.btn-download {
					background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
					color: white;
				}

				.btn-cancel {
					background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
					color: white;
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
					font-family: "Courier New", monospace;
					font-size: 0.875rem;
					line-height: 1.6;
					max-height: 400px;
					overflow-y: auto;
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

				.dataset-header,
				.job-header-right {
					display: flex;
					align-items: center;
					gap: 0.75rem;
					justify-content: space-between;
					flex-wrap: wrap;
				}

				.dataset-header h4 {
					margin: 0;
					font-size: 1.125rem;
					color: #2d3748;
				}

				.dataset-format,
				.status-pill {
					padding: 0.25rem 0.75rem;
					border-radius: 9999px;
					font-size: 0.75rem;
					font-weight: 600;
				}

				.dataset-format {
					background: #edf2f7;
					color: #4a5568;
				}

				.status-pill.neutral {
					background: #e2e8f0;
					color: #2d3748;
				}

				.status-pill.info {
					background: #bee3f8;
					color: #2b6cb0;
				}

				.status-pill.success {
					background: #c6f6d5;
					color: #276749;
				}

				.status-pill.danger {
					background: #fed7d7;
					color: #c53030;
				}

				.dataset-details,
				.distribution-legend,
				.job-details {
					display: flex;
					gap: 1rem;
					flex-wrap: wrap;
					font-size: 0.875rem;
					color: #718096;
					margin-top: 0.75rem;
				}

				.legend-item {
					display: flex;
					align-items: center;
					gap: 0.5rem;
				}

				.legend-color {
					width: 0.9rem;
					height: 0.9rem;
					border-radius: 9999px;
				}

				.legend-color.gold {
					background: #ecc94b;
				}

				.legend-color.high {
					background: #48bb78;
				}

				.message {
					padding: 0.75rem 1rem;
					border-radius: 8px;
					font-size: 0.95rem;
					font-weight: 500;
				}

				.message.error,
				.error-text {
					color: #c53030;
					background: #fff5f5;
				}

				.message.success {
					color: #276749;
					background: #f0fff4;
				}
			`}</style>
		</div>
	);
}
