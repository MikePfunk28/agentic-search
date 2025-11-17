/**
 * Search Module Exports
 * Central export point for all search-related functionality
 * Note: querySegmentationActions has "use node" so it cannot be exported from here
 * Use (internal as any)["lib/search/querySegmentationActions"].segmentQuery instead
 */

// Cannot export from querySegmentationActions due to "use node" directive
// export { segmentQuery } from './querySegmentationActions'
export { getCachedSegmentation, storeSegmentation } from './querySegmentationQueries'
export type { QuerySegment, SegmentationResult } from './querySegmentationTypes'

// Actions exported separately (have "use node" directive)
// export { executeSegment, executeSegmentsParallel } from './segmentExecutorActions'
// Mutations cannot be exported from here
// export { storeExecution } from './segmentExecutorMutations'
export type { SegmentExecutionResult } from './segmentExecutorActions'


