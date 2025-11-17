/**
 * Segment Approval UI
 * Human-in-the-loop interface for reviewing and correcting query segmentation
 */

import { useState } from 'react'
import { Check, X, Edit2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import type { QuerySegment } from '../../../convex/lib/search/querySegmentation'

export interface SegmentApprovalUIProps {
  segments: QuerySegment[]
  onApprove: (segmentId: string, approved: boolean, feedback?: string) => void
  onModify: (segmentId: string, modifiedText: string) => void
  showConfidence?: boolean
}

export function SegmentApprovalUI({
  segments,
  onApprove,
  onModify,
  showConfidence = true,
}: SegmentApprovalUIProps) {
  const [expandedSegments, setExpandedSegments] = useState<Set<string>>(new Set())
  const [editingSegment, setEditingSegment] = useState<string | null>(null)
  const [editedText, setEditedText] = useState<string>('')
  const [feedback, setFeedback] = useState<Record<string, string>>({})

  const toggleExpand = (segmentId: string) => {
    const newExpanded = new Set(expandedSegments)
    if (newExpanded.has(segmentId)) {
      newExpanded.delete(segmentId)
    } else {
      newExpanded.add(segmentId)
    }
    setExpandedSegments(newExpanded)
  }

  const startEdit = (segment: QuerySegment) => {
    setEditingSegment(segment.id)
    setEditedText(segment.text)
  }

  const saveEdit = (segmentId: string) => {
    if (editedText.trim()) {
      onModify(segmentId, editedText.trim())
      setEditingSegment(null)
      setEditedText('')
    }
  }

  const cancelEdit = () => {
    setEditingSegment(null)
    setEditedText('')
  }

  const getSegmentTypeColor = (type: QuerySegment['type']) => {
    const colors = {
      entity: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      relation: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      constraint: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      intent: 'bg-green-500/20 text-green-300 border-green-500/30',
      context: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      comparison: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      synthesis: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    }
    return colors[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }

  const getComplexityBadge = (complexity: QuerySegment['estimatedComplexity']) => {
    const badges = {
      tiny: { color: 'bg-green-500/20 text-green-300', icon: '⚡' },
      small: { color: 'bg-blue-500/20 text-blue-300', icon: '📦' },
      medium: { color: 'bg-amber-500/20 text-amber-300', icon: '🔨' },
      large: { color: 'bg-red-500/20 text-red-300', icon: '🏗️' },
    }
    return badges[complexity]
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Review Query Segmentation</h3>
        </div>
        <p className="text-gray-400 text-sm">
          Review the AI's breakdown of your query. Approve accurate segments or provide corrections to improve future results.
        </p>
      </div>

      <div className="space-y-3">
        {segments.map((segment, index) => {
          const isExpanded = expandedSegments.has(segment.id)
          const isEditing = editingSegment === segment.id
          const complexityBadge = getComplexityBadge(segment.estimatedComplexity)

          return (
            <div
              key={segment.id}
              className="bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-colors"
            >
              {/* Header */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-500 font-mono text-sm">#{index + 1}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getSegmentTypeColor(segment.type)}`}
                      >
                        {segment.type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${complexityBadge.color}`}>
                        {complexityBadge.icon} {segment.estimatedComplexity}
                      </span>
                      {segment.priority <= 2 && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-300">
                          🔴 High Priority
                        </span>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(segment.id)}
                            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-sm font-medium transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-white">{segment.text}</p>
                    )}

                    {segment.dependencies.length > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                        <span>Depends on:</span>
                        {segment.dependencies.map((depId) => {
                          const depIndex = segments.findIndex((s) => s.id === depId)
                          return (
                            <span key={depId} className="text-cyan-400 font-mono">
                              #{depIndex + 1}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(segment)}
                      disabled={isEditing}
                      className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
                      title="Edit segment"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleExpand(segment.id)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                      title="Show details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Approval buttons */}
                {!isEditing && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onApprove(segment.id, true, feedback[segment.id])}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-medium transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => onApprove(segment.id, false, feedback[segment.id])}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-medium transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-slate-700 bg-slate-800/30 p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Assigned Tool:</span>
                      <span className="ml-2 text-white font-mono">{segment.assignedTool}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Estimated Tokens:</span>
                      <span className="ml-2 text-white">{segment.estimatedTokens}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400">Recommended Model:</span>
                      <span className="ml-2 text-white">{segment.recommendedModel}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400">Tool Reasoning:</span>
                      <p className="mt-1 text-white">{segment.toolReasoning}</p>
                    </div>
                  </div>

                  {/* Feedback input */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Feedback (optional):
                    </label>
                    <textarea
                      value={feedback[segment.id] || ''}
                      onChange={(e) => setFeedback({ ...feedback, [segment.id]: e.target.value })}
                      placeholder="Explain why this segment is good or needs improvement..."
                      className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
