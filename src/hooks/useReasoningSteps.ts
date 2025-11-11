/**
 * React Hook for Managing Reasoning Steps
 * Provides state management for interleaved reasoning display
 */

import { useState, useCallback } from 'react';
import type { ReasoningStepData, ReasoningPhase } from '../components/ReasoningStep';

export interface UseReasoningStepsResult {
  steps: ReasoningStepData[];
  addStep: (phase: ReasoningPhase, title: string, description?: string, metadata?: Record<string, any>) => string;
  updateStep: (id: string, updates: Partial<ReasoningStepData>) => void;
  completeStep: (id: string, metadata?: Record<string, any>) => void;
  errorStep: (id: string, error: string) => void;
  clearSteps: () => void;
  currentPhase: ReasoningPhase | null;
}

/**
 * Hook to manage reasoning steps in a search flow
 */
export function useReasoningSteps(): UseReasoningStepsResult {
  const [steps, setSteps] = useState<ReasoningStepData[]>([]);

  const addStep = useCallback((
    phase: ReasoningPhase,
    title: string,
    description?: string,
    metadata?: Record<string, any>
  ): string => {
    const id = `${phase}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const newStep: ReasoningStepData = {
      id,
      phase,
      title,
      description,
      status: 'inprogress',
      startTime: Date.now(),
      metadata,
    };

    setSteps(prev => [...prev, newStep]);
    return id;
  }, []);

  const updateStep = useCallback((id: string, updates: Partial<ReasoningStepData>) => {
    setSteps(prev =>
      prev.map(step =>
        step.id === id ? { ...step, ...updates } : step
      )
    );
  }, []);

  const completeStep = useCallback((id: string, metadata?: Record<string, any>) => {
    setSteps(prev =>
      prev.map(step =>
        step.id === id
          ? {
              ...step,
              status: 'complete' as const,
              endTime: Date.now(),
              metadata: metadata ? { ...step.metadata, ...metadata } : step.metadata,
            }
          : step
      )
    );
  }, []);

  const errorStep = useCallback((id: string, error: string) => {
    setSteps(prev =>
      prev.map(step =>
        step.id === id
          ? {
              ...step,
              status: 'error' as const,
              endTime: Date.now(),
              metadata: { ...step.metadata, error },
            }
          : step
      )
    );
  }, []);

  const clearSteps = useCallback(() => {
    setSteps([]);
  }, []);

  const currentPhase = steps.length > 0
    ? steps[steps.length - 1].phase
    : null;

  return {
    steps,
    addStep,
    updateStep,
    completeStep,
    errorStep,
    clearSteps,
    currentPhase,
  };
}

/**
 * Pre-configured reasoning steps for agentic search
 */
export const AGENTIC_SEARCH_PHASES: Array<{
  phase: ReasoningPhase;
  title: string;
  description: string;
}> = [
  {
    phase: 'intent',
    title: 'Analyzing Intent',
    description: 'Understanding what you\'re really asking for...',
  },
  {
    phase: 'strategy',
    title: 'Planning Search Strategy',
    description: 'Determining the best approach to find your answer...',
  },
  {
    phase: 'search',
    title: 'Executing Search',
    description: 'Searching across multiple sources...',
  },
  {
    phase: 'score',
    title: 'Scoring Results',
    description: 'Using ADD to identify highest-quality sources...',
  },
  {
    phase: 'synthesize',
    title: 'Synthesizing Answer',
    description: 'Combining insights into a comprehensive response...',
  },
  {
    phase: 'learn',
    title: 'Learning',
    description: 'Storing insights for future improvements...',
  },
];

/**
 * Helper to create a standard agentic search flow
 */
export function createAgenticSearchFlow(hooks: UseReasoningStepsResult) {
  return {
    startIntent: (query: string) => {
      const id = hooks.addStep('intent', 'Analyzing Intent', `Processing query: "${query}"`);
      return id;
    },
    startStrategy: (strategies: string[]) => {
      const id = hooks.addStep(
        'strategy',
        'Planning Search Strategy',
        'Selecting optimal search approach',
        { strategies }
      );
      return id;
    },
    startSearch: (sources: string[]) => {
      const id = hooks.addStep(
        'search',
        'Executing Search',
        `Searching ${sources.length} sources`,
        { sources }
      );
      return id;
    },
    startScoring: (resultCount: number) => {
      const id = hooks.addStep(
        'score',
        'Scoring Results',
        `Evaluating ${resultCount} results with ADD`,
        { resultCount }
      );
      return id;
    },
    startSynthesis: () => {
      const id = hooks.addStep(
        'synthesize',
        'Synthesizing Answer',
        'Combining insights from top sources'
      );
      return id;
    },
    startLearning: () => {
      const id = hooks.addStep(
        'learn',
        'Learning',
        'Storing search patterns for future optimization'
      );
      return id;
    },
  };
}
