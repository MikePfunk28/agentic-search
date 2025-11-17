/**
 * Reasoning Visualization Component
 * Real-time visualization of interleaved reasoning steps
 */

import { useState } from 'react'
import { Brain, Zap, Search, Code, FileText, Database, Check, X, Clock, ChevronRight } from 'lucide-react'
import type { ReasoningStep, ReasoningSession } from '../../../convex/lib/reasoning/interleavedReasoning'

export interface ReasoningVisualizationProps {
  session: ReasoningSession
  onStepApprove?: (stepId: string, approved: boolean, feedback?: string) => void
  showTokenUsage?: boolean
  interactive?: boolean
}

export function ReasoningVisualization({
  session,
  onStepApprove,
  showTokenUsage = true,
  interactive = false,
}: ReasoningVisualizationProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())
  const [feedback, setFeedback] = useState<Record<string, string>>({})

  const toggleExpand = (stepId: string) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId)
    } else {
      newExpanded.add(stepId)
    }
    setExpandedSteps(newExpanded)
  }

  const getStepTypeIcon = (type: ReasoningStep['type']) => {
    const icons = {
      analysis: Brain,
      planning: Search,
      action: Zap,
      synthesis: Code,
      validation: Check,
      reflection: FileText,
    }
    return icons[type] || Brain
  }

  const getStepTypeColor = (type: ReasoningStep['type']) => {
    const colors = {
      analysis: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      planning: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      action: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      synthesis: 'bg-green-500/20 text-green-300 border-green-500/30',
      validation: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      reflection: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    }
    return colors[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }

  const getActionIcon = (actionType: string) => {
    const icons: Record<string, any> = {
      search: Search,
      execute_segment: Zap,
      fetch_document: FileText,
      code_exec: Code,
      mcp_call: Database,
    }
    return icons[actionType] || Zap
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400'
    if (confidence >= 0.6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const totalExecutionTime = session.steps.reduce((sum, step) => sum + (step.result?.executionTimeMs || 0), 0)

  return (
    <div className="space-y-4">
      {/* Session header */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Reasoning Session</h3>
            <p className="text-gray-400 text-sm">{session.originalQuery}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded text-sm font-medium ${
                session.status === 'completed'
                  ? 'bg-green-500/20 text-green-300'
                  : session.status === 'active'
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-gray-500/20 text-gray-300'
              }`}
            >
              {session.status}
            </span>
          </div>
        </div>

        {/* Session stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-800/50 rounded p-3">
            <div className="text-gray-400 text-xs mb-1">Steps</div>
            <div className="text-white text-xl font-bold">{session.steps.length}</div>
          </div>
          {showTokenUsage && (
            <div className="bg-slate-800/50 rounded p-3">
              <div className="text-gray-400 text-xs mb-1">Tokens Used</div>
              <div className="text-white text-xl font-bold">{session.totalTokensUsed.toLocaleString()}</div>
            </div>
          )}
          <div className="bg-slate-800/50 rounded p-3">
            <div className="text-gray-400 text-xs mb-1">Execution Time</div>
            <div className="text-white text-xl font-bold">{(totalExecutionTime / 1000).toFixed(2)}s</div>
          </div>
          {session.compressionRatio > 1 && (
            <div className="bg-slate-800/50 rounded p-3">
              <div className="text-gray-400 text-xs mb-1">Compression</div>
              <div className="text-white text-xl font-bold">{session.compressionRatio.toFixed(1)}x</div>
            </div>
          )}
        </div>
      </div>

      {/* Reasoning steps */}
      <div className="space-y-3">
        {session.steps.map((step, index) => {
          const isExpanded = expandedSteps.has(step.id)
          const StepIcon = getStepTypeIcon(step.type)
          const ActionIcon = step.action ? getActionIcon(step.action.type) : null

          return (
            <div
              key={step.id}
              className="bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-colors"
            >
              {/* Step header */}
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Step number and icon */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold">
                      {step.stepNumber}
                    </div>
                    {index < session.steps.length - 1 && (
                      <div className="w-0.5 h-12 bg-slate-700"></div>
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStepTypeColor(step.type)}`}>
                        <StepIcon className="w-3 h-3 inline mr-1" />
                        {step.type}
                      </span>
                      <span className={`text-sm font-medium ${getConfidenceColor(step.confidence)}`}>
                        {(step.confidence * 100).toFixed(0)}% confident
                      </span>
                      {step.needsHumanReview && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-amber-500/20 text-amber-300">
                          Needs Review
                        </span>
                      )}
                      {step.result && (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            step.result.success
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {step.result.success ? <Check className="w-3 h-3 inline" /> : <X className="w-3 h-3 inline" />}
                        </span>
                      )}
                    </div>

                    {/* Thinking */}
                    <p className="text-white mb-2">{step.thinking}</p>

                    {/* Action */}
                    {step.action && ActionIcon && (
                      <div className="bg-slate-800/50 rounded p-3 mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <ActionIcon className="w-4 h-4 text-amber-400" />
                          <span className="text-sm font-medium text-amber-400">Action: {step.action.type}</span>
                        </div>
                        <p className="text-sm text-gray-300">{step.action.description}</p>
                      </div>
                    )}

                    {/* Dependencies */}
                    {step.dependencies.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <ChevronRight className="w-4 h-4" />
                        <span>Depends on: {step.dependencies.map((d) => d.replace('step-', '#')).join(', ')}</span>
                      </div>
                    )}

                    {/* Token/time info */}
                    {step.result && (
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        {showTokenUsage && (
                          <span className="flex items-center gap-1">
                            <Code className="w-3 h-3" />
                            {step.result.tokensUsed} tokens
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {(step.result.executionTimeMs / 1000).toFixed(2)}s
                        </span>
                      </div>
                    )}

                    {/* Expand/collapse button */}
                    {(step.result?.output || step.compressedContext) && (
                      <button
                        onClick={() => toggleExpand(step.id)}
                        className="mt-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        {isExpanded ? '▼ Hide details' : '▶ Show details'}
                      </button>
                    )}

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="mt-3 space-y-2">
                        {step.result?.output && (
                          <div className="bg-slate-800/50 rounded p-3">
                            <div className="text-xs font-medium text-gray-400 mb-1">Result:</div>
                            <pre className="text-sm text-white whitespace-pre-wrap">
                              {typeof step.result.output === 'string'
                                ? step.result.output
                                : JSON.stringify(step.result.output, null, 2)}
                            </pre>
                          </div>
                        )}

                        {step.compressedContext && (
                          <div className="bg-slate-800/50 rounded p-3">
                            <div className="text-xs font-medium text-gray-400 mb-1">Compressed Context:</div>
                            <p className="text-sm text-gray-300">{step.compressedContext}</p>
                          </div>
                        )}

                        {/* Approval controls */}
                        {interactive && step.needsHumanReview && onStepApprove && (
                          <div className="space-y-2">
                            <textarea
                              value={feedback[step.id] || ''}
                              onChange={(e) => setFeedback({ ...feedback, [step.id]: e.target.value })}
                              placeholder="Provide feedback on this reasoning step..."
                              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => onStepApprove(step.id, true, feedback[step.id])}
                                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded text-sm font-medium transition-colors"
                              >
                                <Check className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => onStepApprove(step.id, false, feedback[step.id])}
                                className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-sm font-medium transition-colors"
                              >
                                <X className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Final answer */}
      {session.finalAnswer && (
        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-700/50 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-cyan-300 mb-2">Final Answer</h4>
          <p className="text-white whitespace-pre-wrap">{session.finalAnswer}</p>
        </div>
      )}
    </div>
  )
}
