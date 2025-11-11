/**
 * SegmentApprovalModal Component
 * 
 * Interactive UI for user to control/approve each search segment before execution
 */

import { useState } from 'react';
import { X, CheckCircle, XCircle, Edit2, AlertCircle } from 'lucide-react';
import type { QuerySegment } from '../lib/segment/types';

interface SegmentApprovalModalProps {
	segments: QuerySegment[];
	onApprove: (approvedSegments: QuerySegment[]) => void;
	onCancel: () => void;
	isOpen: boolean;
}

export function SegmentApprovalModal({
	segments,
	onApprove,
	onCancel,
	isOpen
}: SegmentApprovalModalProps) {
	const [editedSegments, setEditedSegments] = useState<QuerySegment[]>(segments);
	const [selectedSegments, setSelectedSegments] = useState<Set<number>>(
		new Set(segments.map((_, idx) => idx))
	);

	if (!isOpen) return null;

	const toggleSegment = (index: number) => {
		const newSelected = new Set(selectedSegments);
		if (newSelected.has(index)) {
			newSelected.delete(index);
		} else {
			newSelected.add(index);
		}
		setSelectedSegments(newSelected);
	};

	const updateSegmentQuery = (index: number, newQuery: string) => {
		const updated = [...editedSegments];
		updated[index] = { ...updated[index], text: newQuery };
		setEditedSegments(updated);
	};

	const updateSegmentMetadata = (index: number, key: string, value: unknown) => {
		const updated = [...editedSegments];
		const metadata = updated[index].metadata || {};
		updated[index] = { ...updated[index], metadata: { ...metadata, [key]: value } };
		setEditedSegments(updated);
	};

	const handleApprove = () => {
		const approved = editedSegments.filter((_, idx) => selectedSegments.has(idx));
		onApprove(approved);
	};

	const getSegmentTypeColor = (type: QuerySegment['type']) => {
		const colors: Record<QuerySegment['type'], string> = {
			'entity': 'bg-purple-600',
			'relation': 'bg-green-600',
			'constraint': 'bg-orange-600',
			'intent': 'bg-pink-600',
			'context': 'bg-teal-600',
			'comparison': 'bg-yellow-600',
			'synthesis': 'bg-blue-600'
		};
		return colors[type] || 'bg-gray-600';
	};

	const getSegmentTypeLabel = (type: QuerySegment['type']) => {
		const labels: Record<QuerySegment['type'], string> = {
			'entity': 'Entity',
			'relation': 'Relation',
			'constraint': 'Constraint',
			'intent': 'Intent',
			'context': 'Context',
			'comparison': 'Comparison',
			'synthesis': 'Synthesis'
		};
		return labels[type] || type;
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-slate-700">
					<div>
						<h2 className="text-2xl font-bold text-white">Review Search Segments</h2>
						<p className="text-slate-400 mt-1">
							Select and edit segments to control the search process
						</p>
					</div>
					<button
						onClick={onCancel}
						className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
					>
						<X className="w-6 h-6 text-slate-400" />
					</button>
				</div>

				{/* Segments List */}
				<div className="flex-1 overflow-y-auto p-6 space-y-4">
					{editedSegments.map((segment, index) => {
						const isSelected = selectedSegments.has(index);
						return (
							<div
								key={index}
								className={`border-2 rounded-lg p-4 transition-all ${
									isSelected
										? 'border-primary-500 bg-slate-750'
										: 'border-slate-600 bg-slate-800 opacity-60'
								}`}
							>
								{/* Segment Header */}
								<div className="flex items-start justify-between mb-3">
									<div className="flex items-center gap-3">
										<button
											onClick={() => toggleSegment(index)}
											className={`p-2 rounded-lg transition-colors ${
												isSelected
													? 'bg-primary-600 hover:bg-primary-700'
													: 'bg-slate-700 hover:bg-slate-600'
											}`}
										>
											{isSelected ? (
												<CheckCircle className="w-5 h-5 text-white" />
											) : (
												<XCircle className="w-5 h-5 text-slate-400" />
											)}
										</button>

										<div>
											<div className="flex items-center gap-2">
												<span
													className={`text-xs px-2 py-1 rounded ${getSegmentTypeColor(
														segment.type
													)} text-white`}
												>
													{getSegmentTypeLabel(segment.type)}
												</span>
												<span className="text-sm text-slate-400">
													Priority: {segment.priority}
												</span>
											</div>
										</div>
									</div>

									{segment.dependencies && segment.dependencies.length > 0 && (
										<div className="flex items-center gap-1 text-xs text-slate-400">
											<AlertCircle className="w-4 h-4" />
											Depends on: {segment.dependencies.join(', ')}
										</div>
									)}
								</div>

								{/* Query Editor */}
								<div className="mb-3">
									<label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
										<Edit2 className="w-4 h-4" />
										Query
									</label>
								<textarea
									value={segment.text}
									onChange={(e) => updateSegmentQuery(index, e.target.value)}
									disabled={!isSelected}
										className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-white resize-none ${
											isSelected
												? 'border-slate-600 focus:border-primary-500'
												: 'border-slate-700 opacity-50 cursor-not-allowed'
										}`}
										rows={2}
									/>
								</div>

								{/* Metadata */}
								{segment.metadata && Object.keys(segment.metadata).length > 0 && (
									<div className="mb-3">
										<label className="block text-sm text-slate-400 mb-2">
											Metadata
										</label>
										<div className="text-xs text-slate-500 bg-slate-900 p-2 rounded">
											{JSON.stringify(segment.metadata, null, 2)}
										</div>
									</div>
								)}

								{/* Model Assignment */}
								{segment.recommendedModel && (
									<div className="mt-2 text-xs text-slate-500">
										Recommended: {segment.recommendedModel} ({segment.estimatedComplexity})
									</div>
								)}
							</div>
						);
					})}
				</div>

				{/* Footer */}
				<div className="p-6 border-t border-slate-700 flex items-center justify-between">
					<div className="text-sm text-slate-400">
						{selectedSegments.size} of {editedSegments.length} segments selected
					</div>
					<div className="flex gap-3">
						<button
							onClick={onCancel}
							className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={handleApprove}
							disabled={selectedSegments.size === 0}
							className={`px-4 py-2 rounded-lg transition-colors ${
								selectedSegments.size === 0
									? 'bg-slate-700 text-slate-500 cursor-not-allowed'
									: 'bg-primary-600 hover:bg-primary-700 text-white'
							}`}
						>
							Approve & Search ({selectedSegments.size})
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
