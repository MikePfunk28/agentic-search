/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as documents from "../documents.js";
import type * as http from "../http.js";
import type * as indexing from "../indexing.js";
import type * as interactiveSegmentation from "../interactiveSegmentation.js";
import type * as lib_indexing_documentIndexing from "../lib/indexing/documentIndexing.js";
import type * as lib_indexing_documentIndexingActions from "../lib/indexing/documentIndexingActions.js";
import type * as lib_indexing_documentIndexingQueries from "../lib/indexing/documentIndexingQueries.js";
import type * as lib_ocr_processDocument from "../lib/ocr/processDocument.js";
import type * as lib_reasoning_interleavedReasoningActions from "../lib/reasoning/interleavedReasoningActions.js";
import type * as lib_search_index from "../lib/search/index.js";
import type * as lib_search_orchestrator from "../lib/search/orchestrator.js";
import type * as lib_search_querySegmentationActions from "../lib/search/querySegmentationActions.js";
import type * as lib_search_querySegmentationQueries from "../lib/search/querySegmentationQueries.js";
import type * as lib_search_querySegmentationTypes from "../lib/search/querySegmentationTypes.js";
import type * as lib_search_segmentExecutorActions from "../lib/search/segmentExecutorActions.js";
import type * as lib_search_segmentExecutorMutations from "../lib/search/segmentExecutorMutations.js";
import type * as mcp from "../mcp.js";
import type * as mcp_mutations from "../mcp_mutations.js";
import type * as modelConfiguration from "../modelConfiguration.js";
import type * as ocr from "../ocr.js";
import type * as orchestrator from "../orchestrator.js";
import type * as reasoning from "../reasoning.js";
import type * as search from "../search.js";
import type * as searchHistory from "../searchHistory.js";
import type * as secureApiKeys from "../secureApiKeys.js";
import type * as todos from "../todos.js";
import type * as usageTracking from "../usageTracking.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  documents: typeof documents;
  http: typeof http;
  indexing: typeof indexing;
  interactiveSegmentation: typeof interactiveSegmentation;
  "lib/indexing/documentIndexing": typeof lib_indexing_documentIndexing;
  "lib/indexing/documentIndexingActions": typeof lib_indexing_documentIndexingActions;
  "lib/indexing/documentIndexingQueries": typeof lib_indexing_documentIndexingQueries;
  "lib/ocr/processDocument": typeof lib_ocr_processDocument;
  "lib/reasoning/interleavedReasoningActions": typeof lib_reasoning_interleavedReasoningActions;
  "lib/search/index": typeof lib_search_index;
  "lib/search/orchestrator": typeof lib_search_orchestrator;
  "lib/search/querySegmentationActions": typeof lib_search_querySegmentationActions;
  "lib/search/querySegmentationQueries": typeof lib_search_querySegmentationQueries;
  "lib/search/querySegmentationTypes": typeof lib_search_querySegmentationTypes;
  "lib/search/segmentExecutorActions": typeof lib_search_segmentExecutorActions;
  "lib/search/segmentExecutorMutations": typeof lib_search_segmentExecutorMutations;
  mcp: typeof mcp;
  mcp_mutations: typeof mcp_mutations;
  modelConfiguration: typeof modelConfiguration;
  ocr: typeof ocr;
  orchestrator: typeof orchestrator;
  reasoning: typeof reasoning;
  search: typeof search;
  searchHistory: typeof searchHistory;
  secureApiKeys: typeof secureApiKeys;
  todos: typeof todos;
  usageTracking: typeof usageTracking;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
