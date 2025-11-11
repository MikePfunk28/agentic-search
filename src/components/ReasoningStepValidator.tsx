import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface ReasoningStepValidatorProps {
	searchHistoryId: Id<"searchHistory">;
	onComplete?: () => void;
}

export default function ReasoningStepValidator({ searchHistoryId, onComplete }: ReasoningStepValidatorProps) {
	const [currentStepId, setCurrentStepId] = useState<Id<"reasoningStepApprovals"> | null>(null);
	const [modification, setModification] = useState<string>("");
	const [guidance, setGuidance] = useState<string>("");
	const [showModifyForm, setShowModifyForm] = useState(false);

	// Query pending reasoning steps
	const pendingSteps = useQuery(api.interactiveSegmentation.getPendingReasoningSteps, {
		searchHistoryId,
	});

	// Mutation to approve/modify reasoning step
	const approveReasoningStep = useMutation(api.interactiveSegmentation.approveReasoningStep);

	const handleApprove = async (stepId: Id<"reasoningStepApprovals">, withModification: boolean) => {
		try {
			await approveReasoningStep({
				stepId,
				approved: true,
				modification: withModification ? modification : undefined,
				shouldRetry: false,
				guidance: guidance || undefined,
			});

			// Reset state
			setCurrentStepId(null);
			setModification("");
			setGuidance("");
			setShowModifyForm(false);

			// Check if all steps are complete
			if (pendingSteps && pendingSteps.length <= 1) {
				onComplete?.();
			}
		} catch (error) {
			console.error("Failed to approve reasoning step:", error);
		}
	};

	const handleRetry = async (stepId: Id<"reasoningStepApprovals">) => {
		if (!guidance) {
			alert("Please provide guidance for the retry");
			return;
		}

		try {
			await approveReasoningStep({
				stepId,
				approved: false,
				shouldRetry: true,
				guidance,
			});

			// Reset state
			setGuidance("");

			// Check if all steps are complete
			if (pendingSteps && pendingSteps.length <= 1) {
				onComplete?.();
			}
		} catch (error) {
			console.error("Failed to request retry:", error);
		}
	};

	if (!pendingSteps || pendingSteps.length === 0) {
		return (
			<div className="reasoning-validator">
				<div className="completion-message">
					<div className="completion-icon">✓</div>
					<h3>All reasoning steps validated!</h3>
					<p>You've reviewed all reasoning steps for this search.</p>
					{onComplete && (
						<button onClick={onComplete} className="continue-btn">
							Continue to Results
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
		<div className="reasoning-validator">
			<div className="validator-header">
				<h2>Step-by-Step Reasoning Validation</h2>
				<p className="validator-subtitle">
					Guide the AI's thinking process. Your feedback creates training data for better reasoning.
				</p>

				{/* Progress Stepper */}
				<div className="progress-stepper">
					{pendingSteps.map((step, index) => (
						<div
							key={step._id}
							className={`step-indicator ${index === 0 ? "active" : "pending"}`}
						>
							<div className="step-number">{step.stepNumber}</div>
							<div className="step-type">{step.stepType}</div>
						</div>
					))}
				</div>
			</div>

			{/* Current Step */}
			{pendingSteps[0] && (
				<div className="reasoning-step-card">
					<div className="step-header">
						<h3 className="step-title">
							Step {pendingSteps[0].stepNumber}: {pendingSteps[0].stepType.toUpperCase()}
						</h3>
						<span className="step-count">
							{pendingSteps[0].stepNumber} of {pendingSteps.length + pendingSteps[0].stepNumber - 1}
						</span>
					</div>

					<div className="step-body">
						{/* AI's Reasoning */}
						<div className="reasoning-display">
							<label>AI's Reasoning:</label>
							<div className="reasoning-content">
								<div className="thinking-icon">🤔</div>
								<p>{pendingSteps[0].aiReasoning}</p>
							</div>
						</div>

						{/* Modification Form */}
						{showModifyForm && currentStepId === pendingSteps[0]._id ? (
							<div className="modification-form">
								<label>Your Improved Reasoning:</label>
								<textarea
									value={modification}
									onChange={(e) => setModification(e.target.value)}
									className="modification-input"
									rows={6}
									placeholder="How should the AI think about this step instead?"
								/>
								<div className="modification-hint">
									💡 Tip: Explain your reasoning clearly - this creates high-quality training examples!
								</div>
							</div>
						) : null}

						{/* Guidance */}
						<div className="guidance-form">
							<label>Additional Guidance (Optional):</label>
							<textarea
								value={guidance}
								onChange={(e) => setGuidance(e.target.value)}
								className="guidance-input"
								rows={3}
								placeholder="Provide specific guidance for improvement (e.g., 'Focus on recent sources', 'Consider edge cases', etc.)"
							/>
						</div>

						{/* Step Type Explanation */}
						<div className="step-explanation">
							<strong>About this step:</strong>
							<p>{getStepTypeExplanation(pendingSteps[0].stepType)}</p>
						</div>

						{/* Action Buttons */}
						<div className="action-buttons">
							{!showModifyForm || currentStepId !== pendingSteps[0]._id ? (
								<>
									<button
										onClick={() => handleApprove(pendingSteps[0]._id, false)}
										className="btn btn-approve"
									>
										✓ Approve Reasoning
									</button>
									<button
										onClick={() => {
											setCurrentStepId(pendingSteps[0]._id);
											setModification(pendingSteps[0].aiReasoning);
											setShowModifyForm(true);
										}}
										className="btn btn-modify"
									>
										✏️ Modify Reasoning
									</button>
									<button
										onClick={() => {
											setCurrentStepId(pendingSteps[0]._id);
											setShowModifyForm(false);
										}}
										className="btn btn-retry"
									>
										🔄 Request Retry
									</button>
								</>
							) : showModifyForm ? (
								<>
									<button
										onClick={() => handleApprove(pendingSteps[0]._id, true)}
										className="btn btn-save"
										disabled={!modification || modification === pendingSteps[0].aiReasoning}
									>
										💾 Save Improved Reasoning
									</button>
									<button
										onClick={() => {
											setShowModifyForm(false);
											setModification("");
											setCurrentStepId(null);
										}}
										className="btn btn-cancel"
									>
										Cancel
									</button>
								</>
							) : (
								<>
									<button
										onClick={() => handleRetry(pendingSteps[0]._id)}
										className="btn btn-confirm-retry"
										disabled={!guidance}
									>
										🔄 Confirm Retry with Guidance
									</button>
									<button
										onClick={() => {
											setCurrentStepId(null);
											setGuidance("");
										}}
										className="btn btn-cancel"
									>
										Cancel
									</button>
								</>
							)}
						</div>
					</div>

					{/* Reasoning Quality Tips */}
					<div className="quality-tips">
						<h4>💡 Tips for Good Reasoning:</h4>
						<ul>
							<li>Be specific about what sources to prioritize</li>
							<li>Mention any biases or limitations to watch for</li>
							<li>Suggest alternative approaches if needed</li>
							<li>Point out missing considerations</li>
							<li>Explain why your version is better</li>
						</ul>
					</div>
				</div>
			)}

			{/* Upcoming Steps Preview */}
			{pendingSteps.length > 1 && (
				<div className="upcoming-steps">
					<h3>Upcoming Steps:</h3>
					<div className="upcoming-steps-list">
						{pendingSteps.slice(1, 4).map((step) => (
							<div key={step._id} className="upcoming-step-item">
								<span className="step-badge">Step {step.stepNumber}</span>
								<span className="step-type-badge">{step.stepType}</span>
							</div>
						))}
						{pendingSteps.length > 4 && (
							<div className="more-steps">
								+ {pendingSteps.length - 4} more steps
							</div>
						)}
					</div>
				</div>
			)}

			<style>{`
				.reasoning-validator {
					max-width: 1000px;
					margin: 0 auto;
					padding: 2rem;
				}

				.validator-header {
					margin-bottom: 2rem;
				}

				.validator-header h2 {
					font-size: 2rem;
					font-weight: 700;
					color: #1a202c;
					margin-bottom: 0.5rem;
				}

				.validator-subtitle {
					color: #718096;
					margin-bottom: 2rem;
				}

				.progress-stepper {
					display: flex;
					gap: 1rem;
					overflow-x: auto;
					padding: 1rem 0;
				}

				.step-indicator {
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 0.5rem;
					min-width: 80px;
					padding: 1rem;
					border-radius: 8px;
					transition: all 0.3s;
				}

				.step-indicator.active {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: white;
					box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
				}

				.step-indicator.pending {
					background: #f7fafc;
					color: #a0aec0;
				}

				.step-number {
					width: 32px;
					height: 32px;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: 700;
					background: rgba(255, 255, 255, 0.2);
				}

				.step-indicator.active .step-number {
					background: rgba(255, 255, 255, 0.3);
				}

				.step-type {
					font-size: 0.75rem;
					font-weight: 600;
					text-transform: uppercase;
				}

				.reasoning-step-card {
					background: white;
					border: 2px solid #e2e8f0;
					border-radius: 12px;
					padding: 2rem;
					box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
				}

				.step-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 1.5rem;
					padding-bottom: 1rem;
					border-bottom: 2px solid #e2e8f0;
				}

				.step-title {
					font-size: 1.5rem;
					font-weight: 700;
					color: #1a202c;
					margin: 0;
				}

				.step-count {
					font-size: 0.875rem;
					color: #a0aec0;
					font-weight: 600;
				}

				.step-body {
					display: flex;
					flex-direction: column;
					gap: 1.5rem;
				}

				.reasoning-display label,
				.modification-form label,
				.guidance-form label {
					display: block;
					font-weight: 600;
					color: #2d3748;
					margin-bottom: 0.75rem;
					font-size: 1rem;
				}

				.reasoning-content {
					display: flex;
					gap: 1rem;
					padding: 1.5rem;
					background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
					border-radius: 12px;
					border-left: 4px solid #667eea;
				}

				.thinking-icon {
					font-size: 2rem;
					flex-shrink: 0;
				}

				.reasoning-content p {
					margin: 0;
					line-height: 1.8;
					color: #2d3748;
				}

				.modification-input,
				.guidance-input {
					width: 100%;
					padding: 1rem;
					border: 2px solid #e2e8f0;
					border-radius: 8px;
					font-size: 1rem;
					font-family: inherit;
					resize: vertical;
					transition: border-color 0.2s;
					line-height: 1.6;
				}

				.modification-input:focus,
				.guidance-input:focus {
					outline: none;
					border-color: #667eea;
					box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
				}

				.modification-hint {
					font-size: 0.875rem;
					color: #718096;
					padding: 0.5rem 0.75rem;
					background: #fef5e7;
					border-radius: 6px;
					border-left: 3px solid #f59e0b;
				}

				.step-explanation {
					padding: 1rem;
					background: #f0f4ff;
					border-radius: 8px;
					border-left: 3px solid #667eea;
				}

				.step-explanation strong {
					color: #667eea;
					display: block;
					margin-bottom: 0.5rem;
				}

				.step-explanation p {
					margin: 0;
					color: #4a5568;
					line-height: 1.6;
				}

				.action-buttons {
					display: flex;
					gap: 0.75rem;
					flex-wrap: wrap;
					padding-top: 1rem;
				}

				.btn {
					padding: 0.875rem 1.75rem;
					border: none;
					border-radius: 8px;
					font-weight: 600;
					font-size: 0.938rem;
					cursor: pointer;
					transition: all 0.2s;
					display: inline-flex;
					align-items: center;
					gap: 0.5rem;
				}

				.btn-approve {
					background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
					color: white;
					box-shadow: 0 2px 4px rgba(72, 187, 120, 0.3);
				}

				.btn-approve:hover {
					transform: translateY(-2px);
					box-shadow: 0 4px 8px rgba(72, 187, 120, 0.4);
				}

				.btn-modify {
					background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
					color: white;
					box-shadow: 0 2px 4px rgba(66, 153, 225, 0.3);
				}

				.btn-modify:hover {
					transform: translateY(-2px);
					box-shadow: 0 4px 8px rgba(66, 153, 225, 0.4);
				}

				.btn-retry {
					background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
					color: white;
					box-shadow: 0 2px 4px rgba(237, 137, 54, 0.3);
				}

				.btn-retry:hover {
					transform: translateY(-2px);
					box-shadow: 0 4px 8px rgba(237, 137, 54, 0.4);
				}

				.btn-save {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: white;
					box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
				}

				.btn-save:hover:not(:disabled) {
					transform: translateY(-2px);
					box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
				}

				.btn-save:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}

				.btn-confirm-retry {
					background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
					color: white;
					box-shadow: 0 2px 4px rgba(245, 101, 101, 0.3);
				}

				.btn-confirm-retry:hover:not(:disabled) {
					transform: translateY(-2px);
					box-shadow: 0 4px 8px rgba(245, 101, 101, 0.4);
				}

				.btn-confirm-retry:disabled {
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

				.quality-tips {
					margin-top: 2rem;
					padding: 1.5rem;
					background: linear-gradient(135deg, #fef5e7 0%, #fef3c7 100%);
					border-radius: 12px;
					border-left: 4px solid #f59e0b;
				}

				.quality-tips h4 {
					margin: 0 0 1rem 0;
					color: #92400e;
					font-size: 1rem;
				}

				.quality-tips ul {
					margin: 0;
					padding-left: 1.5rem;
					color: #78350f;
				}

				.quality-tips li {
					margin-bottom: 0.5rem;
					line-height: 1.6;
				}

				.upcoming-steps {
					margin-top: 2rem;
					padding: 1.5rem;
					background: #f7fafc;
					border-radius: 12px;
				}

				.upcoming-steps h3 {
					font-size: 1.125rem;
					font-weight: 600;
					color: #2d3748;
					margin: 0 0 1rem 0;
				}

				.upcoming-steps-list {
					display: flex;
					flex-direction: column;
					gap: 0.75rem;
				}

				.upcoming-step-item {
					display: flex;
					gap: 0.75rem;
					align-items: center;
					padding: 0.75rem;
					background: white;
					border-radius: 8px;
					border: 1px solid #e2e8f0;
				}

				.step-badge {
					padding: 0.25rem 0.75rem;
					background: #edf2f7;
					border-radius: 6px;
					font-size: 0.75rem;
					font-weight: 600;
					color: #4a5568;
				}

				.step-type-badge {
					padding: 0.25rem 0.75rem;
					background: #e6fffa;
					border-radius: 6px;
					font-size: 0.75rem;
					font-weight: 600;
					color: #234e52;
					text-transform: uppercase;
				}

				.more-steps {
					padding: 0.75rem;
					text-align: center;
					color: #718096;
					font-size: 0.875rem;
					font-weight: 500;
				}
			`}</style>
		</div>
	);
}

function getStepTypeExplanation(stepType: string): string {
	const explanations: Record<string, string> = {
		analysis: "The AI analyzes the query to understand what information is needed and how to approach finding it.",
		search: "The AI determines the best search strategies, keywords, and sources to use for retrieving information.",
		synthesis: "The AI combines and integrates information from multiple sources to form a coherent answer.",
		validation: "The AI checks the quality, relevance, and accuracy of the information before presenting it.",
		reasoning: "The AI applies logical reasoning to draw conclusions and make connections between pieces of information.",
		evaluation: "The AI assesses the confidence level and reliability of the information gathered.",
	};
	return explanations[stepType] || "The AI processes information at this step.";
}
