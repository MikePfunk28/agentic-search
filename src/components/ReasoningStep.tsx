/**
 * Reasoning Step Component
 * Displays individual reasoning steps during agentic search with visual indicators
 */

import { CheckCircle2, Loader2, AlertCircle, Search, Lightbulb, Target, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export type ReasoningPhase =
  | 'intent'      // Analyzing user intent
  | 'strategy'    // Planning search strategy
  | 'search'      // Executing search
  | 'score'       // Scoring results with ADD
  | 'synthesize'  // Synthesizing answer
  | 'learn';      // Learning from interaction

export interface ReasoningStepData {
  id: string;
  phase: ReasoningPhase;
  title: string;
  description?: string;
  status: 'pending' | 'inprogress' | 'complete' | 'error';
  startTime?: number;
  endTime?: number;
  metadata?: Record<string, any>;
}

interface ReasoningStepProps {
  step: ReasoningStepData;
  isLast?: boolean;
  autoExpand?: boolean;
}

const phaseIcons: Record<ReasoningPhase, typeof Search> = {
  intent: Target,
  strategy: Lightbulb,
  search: Search,
  score: Sparkles,
  synthesize: CheckCircle2,
  learn: Lightbulb,
};

const phaseColors: Record<ReasoningPhase, string> = {
  intent: 'from-purple-500 to-pink-500',
  strategy: 'from-blue-500 to-cyan-500',
  search: 'from-green-500 to-emerald-500',
  score: 'from-yellow-500 to-orange-500',
  synthesize: 'from-indigo-500 to-purple-500',
  learn: 'from-pink-500 to-rose-500',
};

export function ReasoningStep({ step, isLast = false, autoExpand = false }: ReasoningStepProps) {
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const Icon = phaseIcons[step.phase];
  const gradient = phaseColors[step.phase];

  useEffect(() => {
    if (step.status === 'inprogress') {
      setIsExpanded(true);
    }
  }, [step.status]);

  const duration = step.startTime && step.endTime
    ? ((step.endTime - step.startTime) / 1000).toFixed(2)
    : null;

  return (
    <div className={`relative ${!isLast ? 'pb-6' : ''}`}>
      {/* Vertical connector line */}
      {!isLast && (
        <div className="absolute left-4 top-10 h-full w-0.5 bg-gradient-to-b from-slate-600 to-transparent" />
      )}

      {/* Step container */}
      <div
        className={`
          relative bg-slate-800/50 backdrop-blur-sm border rounded-lg transition-all duration-300
          ${step.status === 'inprogress' ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20' : 'border-slate-700'}
          ${step.status === 'complete' ? 'border-green-500/30' : ''}
          ${step.status === 'error' ? 'border-red-500/50' : ''}
        `}
      >
        {/* Header */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center gap-4 text-left hover:bg-slate-700/30 transition-colors rounded-lg"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? `Collapse ${step.phase} step` : `Expand ${step.phase} step`}
          aria-controls={`reasoning-step-${step.id}`}
        >
          {/* Status indicator */}
          <div className="flex-shrink-0">
            {step.status === 'pending' && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <Icon className="w-4 h-4 text-slate-400" />
              </div>
            )}
            {step.status === 'inprogress' && (
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center animate-pulse`}>
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
            )}
            {step.status === 'complete' && (
              <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
            )}
            {step.status === 'error' && (
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-400" />
              </div>
            )}
          </div>

          {/* Title and phase */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                step.status === 'inprogress'
                  ? `bg-gradient-to-r ${gradient} text-white`
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {step.phase.toUpperCase()}
              </span>
              {duration && (
                <span className="text-xs text-slate-400">{duration}s</span>
              )}
            </div>
            <h3 className={`text-sm font-medium mt-1 ${
              step.status === 'inprogress' ? 'text-white' : 'text-gray-200'
            }`}>
              {step.title}
            </h3>
            {step.description && !isExpanded && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                {step.description}
              </p>
            )}
          </div>

          {/* Expand indicator */}
          <div className="flex-shrink-0">
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Expanded content */}
        {isExpanded && (step.description || step.metadata) && (
          <div
            className="px-4 pb-4 pt-0 border-t border-slate-700/50 mt-2"
            id={`reasoning-step-${step.id}`}
          >
            {step.description && (
              <p className="text-sm text-gray-300 mb-3">
                {step.description}
              </p>
            )}

            {/* Metadata display */}
            {step.metadata && Object.keys(step.metadata).length > 0 && (
              <div className="bg-slate-900/50 rounded p-3 space-y-2">
                {Object.entries(step.metadata).map(([key, value]) => {
                  let displayValue: string;
                  const cache: any[] = [];
                  try {
                    if (value === null) {
                      displayValue = "null";
                    } else if (typeof value === 'object') {
                      displayValue = JSON.stringify(value, (_key, val) => {
                        // Handle circular references
                        if (typeof val === 'object' && val !== null) {
                          if (cache.includes(val)) {
                            return '[Circular]';
                          }
                          cache.push(val);
                        }
                        return val;
                      }, 2);
                    } else {
                      displayValue = String(value);
                    }
                  } catch (error) {
                    displayValue = "[Unserializable]";
                  }

                  return (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="text-slate-200 font-mono">
                        {displayValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Container for displaying multiple reasoning steps
 */
export interface ReasoningTimelineProps {
  steps: ReasoningStepData[];
  title?: string;
  className?: string;
}

export function ReasoningTimeline({ steps, title = "Reasoning Process", className = "" }: ReasoningTimelineProps) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Timeline header */}
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      {/* Steps */}
      <div className="space-y-0">
        {steps.map((step, index) => (
          <ReasoningStep
            key={step.id}
            step={step}
            isLast={index === steps.length - 1}
            autoExpand={step.status === 'inprogress'}
          />
        ))}
      </div>
    </div>
  );
}
