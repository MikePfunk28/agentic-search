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
import type * as lib_ocr_processDocument from "../lib/ocr/processDocument.js";
import type * as mcp from "../mcp.js";
import type * as mcp_mutations from "../mcp_mutations.js";
import type * as modelConfiguration from "../modelConfiguration.js";
import type * as ocr from "../ocr.js";
import type * as todos from "../todos.js";

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
  "lib/ocr/processDocument": typeof lib_ocr_processDocument;
  mcp: typeof mcp;
  mcp_mutations: typeof mcp_mutations;
  modelConfiguration: typeof modelConfiguration;
  ocr: typeof ocr;
  todos: typeof todos;
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
