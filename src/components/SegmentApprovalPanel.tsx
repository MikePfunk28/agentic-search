import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface SegmentApprovalPanelProps {
	searchHistoryId: Id<"searchHistory">;
	onComplete?: () => void;
}

type SegmentType = "entity" | "relation" | "constraint" | "intent" | "context" | "comparison" | "synthesis";

export default function SegmentApprovalPanel({ searchHistoryId, onComplete }: SegmentApprovalPanelProps) {
	const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
	const [editedText, setEditedText] = useState<string>("");
	const [userConfidence, setUserConfidence] = useState<number>(0.8);
	const [feedback, setFeedback] = useState<string>("");
	const [rejectReason, setRejectReason] = useState<string>("");
	const [suggestedImprovement, setSuggestedImprovement] = useState<string>("");

	// Query pending approvals for this search
	const pendingApprovals = useQuery(api.interactiveSegmentation.getPendingApprovals, {
		searchHistoryId,
	});

	// Get approval statistics
	const stats = useQuery(api.interactiveSegmentation.getApprovalStats, {});

	// Mutations
	const approveSegment = useMutation(api.interactiveSegmentation.approveSegment);
	const rejectSegment = useMutation(api.interactiveSegmentation.rejectSegment);

	const handleStartEdit = (segmentId: string, currentText: string) => {
		setEditingSegmentId(segmentId);
		setEditedText(currentText);
	};

	const handleApprove = async (approvalId: Id<"segmentApprovals">, modified: boolean) => {
		try {
			await approveSegment({
				approvalId,
				modified,
				modifiedText: modified ? editedText : undefined,
				userConfidence,
				feedback: feedback || undefined,
			});

			// Reset state
			setEditingSegmentId(null);
			setEditedText("");
			setFeedback("");
			setUserConfidence(0.8);

			// Check if all segments are approved
			if (pendingApprovals && pendingApprovals.length <= 1) {
				onComplete?.();
			}
		} catch (error) {
			console.error("Failed to approve segment:", error);
		}
	};

	const handleReject = async (approvalId: Id<"segmentApprovals">) => {
		if (!rejectReason) {
			alert("Please provide a reason for rejection");
			return;
		}

		try {
			await rejectSegment({
				approvalId,
				reason: rejectReason,
				suggestedImprovement: suggestedImprovement || undefined,
			});

			// Reset state
			setRejectReason("");
			setSuggestedImprovement("");

			// Check if all segments are processed
			if (pendingApprovals && pendingApprovals.length <= 1) {
				onComplete?.();
			}
		} catch (error) {
			console.error("Failed to reject segment:", error);
		}
	};

	if (!pendingApprovals || pendingApprovals.length === 0) {
		return (
			<div className="segment-approval-panel">
				<div className="completion-message">
					<div className="completion-icon">✓</div>
					<h3>All segments reviewed!</h3>
					<p>You've reviewed all proposed segments for this search.</p>
					{onComplete && (
						<button onClick={onComplete} className="continue-btn">
							Continue to Execution
						</button>
					)}
				</div>

				<style>{`
					.completion-message {
						text-align: center;
						padding: 3rem;
						background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
						border-radius: 12px;
					}

					.completion-icon {
						font-size: 4rem;
						color: #22543d;
						margin-bottom: 1rem;
					}

					.completion-message h3 {
						font-size: 1.5rem;
						color: #22543d;
						margin-bottom: 0.5rem;
					}

					.completion-message p {
						color: #276749;
						margin-bottom: 1.5rem;
					}

					.continue-btn {
						padding: 1rem 2rem;
						background: #38a169;
						color: white;
						border: none;
						border-radius: 8px;
						font-weight: 600;
						cursor: pointer;
						transition: all 0.2s;
					}

					.continue-btn:hover {
						background: #2f855a;
						transform: translateY(-2px);
					}
				`}</style>
			</div>
		);
	}

	return (
		<div className="segment-approval-panel">
			<div className="panel-header">
				<h2>Review Query Segments</h2>
				<p className="panel-subtitle">
					Review and modify segments before execution. Your corrections improve the AI's learning.
				</p>

				{/* Progress Indicator */}
				<div className="progress-bar">
					<div
						className="progress-fill"
						style={{
							width: `${((stats?.total || 0) - pendingApprovals.length) / (stats?.total || 1) * 100}%`,
						}}
					/>
					<span className="progress-text">
						{(stats?.total || 0) - pendingApprovals.length} of {stats?.total || 0} reviewed
					</span>
				</div>

				{/* Statistics */}
				{stats && (
					<div className="approval-stats">
						<div className="stat-item">
							<span className="stat-label">Approval Rate:</span>
							<span className="stat-value">{stats.approvalRate.toFixed(1)}%</span>
						</div>
						<div className="stat-item">
							<span className="stat-label">Modification Rate:</span>
							<span className="stat-value">{stats.modificationRate.toFixed(1)}%</span>
						</div>
					</div>
				)}
			</div>

			{/* Segment Cards */}
			<div className="segments-container">
				{pendingApprovals.map((approval, index) => (
					<div key={approval._id} className={`segment-card segment-type-${approval.segmentType}`}>
						<div className="segment-header">
							<div className="segment-type-badge">
								{approval.segmentType.toUpperCase()}
							</div>
							<div className="ai-confidence">
								AI Confidence: {(approval.aiConfidence * 100).toFixed(0)}%
							</div>
							<div className="segment-number">
								Segment {index + 1} of {pendingApprovals.length}
							</div>
						</div>

						<div className="segment-body">
							{/* Original Text */}
							{editingSegmentId !== approval.segmentId && (
								<div className="segment-text-display">
									<label>Original Segment:</label>
									<div className="text-display">{approval.segmentText}</div>
								</div>
							)}

							{/* Edit Mode */}
							{editingSegmentId === approval.segmentId && (
								<div className="segment-text-edit">
									<label>Modified Segment:</label>
									<textarea
										value={editedText}
										onChange={(e) => setEditedText(e.target.value)}
										className="text-editor"
										rows={4}
										placeholder="Edit the segment text..."
									/>
									<div className="edit-hint">
										Tip: Make your changes as precise as possible - this creates GOLD training data!
									</div>
								</div>
							)}

							{/* User Confidence Slider */}
							<div className="confidence-control">
								<label>Your Confidence Level: {(userConfidence * 100).toFixed(0)}%</label>
								<input
									type="range"
									min="0"
									max="1"
									step="0.05"
									value={userConfidence}
									onChange={(e) => setUserConfidence(Number(e.target.value))}
									className="confidence-slider"
								/>
								<div className="confidence-labels">
									<span>Low</span>
									<span>Medium</span>
									<span>High</span>
								</div>
							</div>

							{/* Feedback */}
							<div className="feedback-control">
								<label>Feedback (Optional):</label>
								<textarea
									value={feedback}
									onChange={(e) => setFeedback(e.target.value)}
									className="feedback-input"
									rows={2}
									placeholder="Why did you make this change? What should the AI learn?"
								/>
							</div>

							{/* Action Buttons */}
							<div className="action-buttons">
								{editingSegmentId !== approval.segmentId ? (
									<>
										<button
											onClick={() => handleApprove(approval._id, false)}
											className="btn btn-approve"
										>
											✓ Approve As-Is
										</button>
										<button
											onClick={() => handleStartEdit(approval.segmentId, approval.segmentText)}
											className="btn btn-modify"
										>
											✏️ Modify
										</button>
										<button
											onClick={() => setEditingSegmentId(`reject-${approval.segmentId}`)}
											className="btn btn-reject"
										>
											✗ Reject
										</button>
									</>
								) : editingSegmentId === `reject-${approval.segmentId}` ? (
									<div className="reject-form">
										<label>Reason for Rejection:</label>
										<textarea
											value={rejectReason}
											onChange={(e) => setRejectReason(e.target.value)}
											className="reject-reason-input"
											rows={3}
											placeholder="Why is this segment incorrect?"
											required
										/>
										<label>Suggested Improvement (Optional):</label>
										<textarea
											value={suggestedImprovement}
											onChange={(e) => setSuggestedImprovement(e.target.value)}
											className="suggestion-input"
											rows={2}
											placeholder="How could the AI improve this?"
										/>
										<div className="reject-actions">
											<button
												onClick={() => handleReject(approval._id)}
												className="btn btn-confirm-reject"
												disabled={!rejectReason}
											>
												Confirm Rejection
											</button>
											<button
												onClick={() => {
													setEditingSegmentId(null);
													setRejectReason("");
													setSuggestedImprovement("");
												}}
												className="btn btn-cancel"
											>
												Cancel
											</button>
										</div>
									</div>
								) : (
									<>
										<button
											onClick={() => handleApprove(approval._id, true)}
											className="btn btn-save"
											disabled={!editedText || editedText === approval.segmentText}
										>
											✓ Save Changes
										</button>
										<button
											onClick={() => {
												setEditingSegmentId(null);
												setEditedText("");
											}}
											className="btn btn-cancel"
										>
											Cancel
										</button>
									</>
								)}
							</div>
						</div>

						{/* Segment Type Description */}
						<div className="segment-type-description">
							{getSegmentTypeDescription(approval.segmentType)}
						</div>
					</div>
				))}
			</div>

			<style>{`
				.segment-approval-panel {
					max-width: 900px;
					margin: 0 auto;
					padding: 2rem;
				}

				.panel-header {
					margin-bottom: 2rem;
				}

				.panel-header h2 {
					font-size: 2rem;
					font-weight: 700;
					color: #1a202c;
					margin-bottom: 0.5rem;
				}

				.panel-subtitle {
					color: #718096;
					margin-bottom: 1.5rem;
				}

				.progress-bar {
					position: relative;
					width: 100%;
					height: 2rem;
					background: #e2e8f0;
					border-radius: 9999px;
					overflow: hidden;
					margin-bottom: 1rem;
				}

				.progress-fill {
					position: absolute;
					top: 0;
					left: 0;
					height: 100%;
					background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
					transition: width 0.5s ease;
				}

				.progress-text {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					font-weight: 600;
					color: #1a202c;
					z-index: 1;
				}

				.approval-stats {
					display: flex;
					gap: 2rem;
					padding: 1rem;
					background: #f7fafc;
					border-radius: 8px;
				}

				.stat-item {
					display: flex;
					gap: 0.5rem;
				}

				.stat-label {
					font-weight: 500;
					color: #4a5568;
				}

				.stat-value {
					font-weight: 700;
					color: #667eea;
				}

				.segments-container {
					display: flex;
					flex-direction: column;
					gap: 1.5rem;
				}

				.segment-card {
					background: white;
					border: 2px solid #e2e8f0;
					border-radius: 12px;
					padding: 1.5rem;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
				}

				.segment-type-entity { border-left: 4px solid #48bb78; }
				.segment-type-relation { border-left: 4px solid #4299e1; }
				.segment-type-constraint { border-left: 4px solid #ed8936; }
				.segment-type-intent { border-left: 4px solid #9f7aea; }
				.segment-type-context { border-left: 4px solid #ecc94b; }
				.segment-type-comparison { border-left: 4px solid #f56565; }
				.segment-type-synthesis { border-left: 4px solid #38b2ac; }

				.segment-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 1rem;
					flex-wrap: wrap;
					gap: 0.5rem;
				}

				.segment-type-badge {
					padding: 0.25rem 0.75rem;
					background: #edf2f7;
					border-radius: 6px;
					font-size: 0.75rem;
					font-weight: 700;
					color: #2d3748;
				}

				.ai-confidence {
					font-size: 0.875rem;
					color: #718096;
					font-weight: 500;
				}

				.segment-number {
					font-size: 0.875rem;
					color: #a0aec0;
				}

				.segment-body {
					display: flex;
					flex-direction: column;
					gap: 1.5rem;
				}

				.segment-text-display label,
				.segment-text-edit label,
				.feedback-control label,
				.confidence-control label {
					display: block;
					font-weight: 600;
					color: #2d3748;
					margin-bottom: 0.5rem;
				}

				.text-display {
					padding: 1rem;
					background: #f7fafc;
					border-radius: 8px;
					border: 1px solid #e2e8f0;
					font-size: 1rem;
					line-height: 1.6;
					color: #1a202c;
				}

				.text-editor,
				.feedback-input,
				.reject-reason-input,
				.suggestion-input {
					width: 100%;
					padding: 1rem;
					border: 2px solid #e2e8f0;
					border-radius: 8px;
					font-size: 1rem;
					font-family: inherit;
					resize: vertical;
					transition: border-color 0.2s;
				}

				.text-editor:focus,
				.feedback-input:focus,
				.reject-reason-input:focus,
				.suggestion-input:focus {
					outline: none;
					border-color: #667eea;
				}

				.edit-hint {
					font-size: 0.75rem;
					color: #718096;
					font-style: italic;
				}

				.confidence-slider {
					width: 100%;
					height: 8px;
					border-radius: 9999px;
					-webkit-appearance: none;
					appearance: none;
					background: linear-gradient(90deg, #fc8181 0%, #fbd38d 50%, #68d391 100%);
					outline: none;
				}

				.confidence-slider::-webkit-slider-thumb {
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

				.confidence-slider::-moz-range-thumb {
					width: 24px;
					height: 24px;
					border-radius: 50%;
					background: white;
					border: 3px solid #667eea;
					cursor: pointer;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
				}

				.confidence-labels {
					display: flex;
					justify-content: space-between;
					font-size: 0.75rem;
					color: #718096;
					margin-top: 0.25rem;
				}

				.action-buttons {
					display: flex;
					gap: 0.75rem;
					flex-wrap: wrap;
				}

				.reject-form {
					display: flex;
					flex-direction: column;
					gap: 1rem;
					width: 100%;
				}

				.reject-actions {
					display: flex;
					gap: 0.75rem;
				}

				.btn {
					padding: 0.75rem 1.5rem;
					border: none;
					border-radius: 8px;
					font-weight: 600;
					font-size: 0.875rem;
					cursor: pointer;
					transition: all 0.2s;
					display: inline-flex;
					align-items: center;
					gap: 0.5rem;
				}

				.btn-approve {
					background: #c6f6d5;
					color: #22543d;
				}

				.btn-approve:hover {
					background: #9ae6b4;
					transform: translateY(-2px);
				}

				.btn-modify {
					background: #bee3f8;
					color: #2c5282;
				}

				.btn-modify:hover {
					background: #90cdf4;
					transform: translateY(-2px);
				}

				.btn-reject {
					background: #fed7d7;
					color: #742a2a;
				}

				.btn-reject:hover {
					background: #fc8181;
					transform: translateY(-2px);
				}

				.btn-save {
					background: #667eea;
					color: white;
				}

				.btn-save:hover:not(:disabled) {
					background: #5a67d8;
					transform: translateY(-2px);
				}

				.btn-save:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}

				.btn-cancel {
					background: #e2e8f0;
					color: #4a5568;
				}

				.btn-cancel:hover {
					background: #cbd5e0;
				}

				.btn-confirm-reject {
					background: #f56565;
					color: white;
				}

				.btn-confirm-reject:hover:not(:disabled) {
					background: #e53e3e;
					transform: translateY(-2px);
				}

				.btn-confirm-reject:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}

				.segment-type-description {
					margin-top: 1rem;
					padding: 0.75rem;
					background: #f7fafc;
					border-radius: 6px;
					font-size: 0.875rem;
					color: #4a5568;
					border-left: 3px solid #cbd5e0;
				}
			`}</style>
		</div>
	);
}

function getSegmentTypeDescription(type: SegmentType): string {
	const descriptions: Record<SegmentType, string> = {
		entity: "🎯 Entity: Core concepts, subjects, or objects to search for",
		relation: "🔗 Relation: Relationships between entities or how they connect",
		constraint: "📏 Constraint: Limitations, filters, or requirements for results",
		intent: "💡 Intent: User's underlying goal or what they're trying to accomplish",
		context: "📋 Context: Background information or situational details",
		comparison: "⚖️ Comparison: Analyzing differences or similarities between options",
		synthesis: "🔬 Synthesis: Combining multiple pieces of information into insights",
	};
	return descriptions[type] || "Unknown segment type";
}
