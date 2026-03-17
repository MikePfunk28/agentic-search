    at Server.emit (node:events:530:35)
    at Server.emit (node:domain:489:12)
    at parserOnIncoming (node:_http_server:1155:12)
    at HTTPParser.parserOnHeadersComplete (node:_http_common:117:17)
Fallback service failed to fetch module; payload = AssertionError [ERR_ASSERTION]: Unexpected error: no match for module: node:http.
    at Object.unsafeModuleFallbackService (file:///C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@cloudflare+vite-plugin@1.1_b81d5a0cff7a1823ef80298218f89278/node_modules/@cloudflare/vite-plugin/dist/index.js:15492:5)   
    at #handleLoopback (C:\Users\mikep\ts-hackathon\agentic-search\node_modules\.pnpm\miniflare@4.20251109.0\node_modules\miniflare\dist\src\index.js:61547:48)
    at Server.emit (node:events:530:35)
    at Server.emit (node:domain:489:12)
    at parserOnIncoming (node:_http_server:1155:12)
    at HTTPParser.parserOnHeadersComplete (node:_http_common:117:17); spec = /?specifier=node%3Ahttp&referrer=&rawSpecifier=node%3Ahttp
TypeError: __vite_ssr_import_1__.experimental_SmartCoercionPlugin is not a constructor
    at C:/Users/mikep/ts-hackathon/agentic-search/src/routes/api.$.ts:25:3
    ... 8 lines matching cause stack trace ...
    at Object.runInlinedModule (workers/runner-worker.js:1337:4) {
  cause: TypeError: __vite_ssr_import_1__.experimental_SmartCoercionPlugin is not a constructor
      at C:/Users/mikep/ts-hackathon/agentic-search/src/routes/api.$.ts:25:3
      at Object.runInlinedModule (workers/runner-worker.js:1337:4)
      at CustomModuleRunner.directRequest (workers/runner-worker.js:1208:59)
      at CustomModuleRunner.cachedRequest (workers/runner-worker.js:1115:73)
      at C:/Users/mikep/ts-hackathon/agentic-search/src/routeTree.gen.ts:26:1
      at Object.runInlinedModule (workers/runner-worker.js:1337:4)
      at CustomModuleRunner.directRequest (workers/runner-worker.js:1208:59)
      at CustomModuleRunner.cachedRequest (workers/runner-worker.js:1115:73)
      at C:/Users/mikep/ts-hackathon/agentic-search/src/router.tsx:6:1
      at Object.runInlinedModule (workers/runner-worker.js:1337:4),
  status: 500,
  statusText: undefined,
  headers: undefined,
  data: undefined,
  body: undefined,
  unhandled: true
}
11:06:19 PM [vite] (ssr) hmr update /@id/virtual:cloudflare/worker-entry
[vite] hot updated: virtual:cloudflare/worker-entry
Error reading routerStream: TypeError: ctx.createEffectfulFunction is not a function
    at Object.serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval-plugins@1.3.3_seroval@1.5.0/node_modules/seroval-plugins/dist/esm/development/web.mjs:32:17)
    at serializePlugin (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1121:23)
    at serializeAssignable (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1335:14)
    at serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1378:46)
    at SerializePluginContext.serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:320:12)
    at Object.serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval-plugins@1.3.3_seroval@1.5.0/node_modules/seroval-plugins/dist/esm/development/web.mjs:113:11)
    at serializePlugin (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1121:23)
    at serializeAssignable (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1335:14)
    at serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1378:46)
    at serializeProperty (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:629:59)
Error reading appStream: TypeError: Unable to enqueue
    at Object.write (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@tanstack+router-core@1.134.13/node_modules/@tanstack/router-core/dist/esm/ssr/transformStreamWithRouter.js:52:18)
    at Object.onData (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@tanstack+router-core@1.134.13/node_modules/@tanstack/router-core/dist/esm/ssr/transformStreamWithRouter.js:235:26)
    at readStream (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@tanstack+router-core@1.134.13/node_modules/@tanstack/router-core/dist/esm/ssr/transformStreamWithRouter.js:82:12)
Error reading routerStream: TypeError: ctx.createEffectfulFunction is not a function
    at Object.serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval-plugins@1.3.3_seroval@1.5.0/node_modules/seroval-plugins/dist/esm/development/web.mjs:32:17)
    at serializePlugin (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1121:23)
    at serializeAssignable (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1335:14)
    at serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1378:46)
    at SerializePluginContext.serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:320:12)
    at Object.serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval-plugins@1.3.3_seroval@1.5.0/node_modules/seroval-plugins/dist/esm/development/web.mjs:113:11)
    at serializePlugin (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1121:23)
    at serializeAssignable (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1335:14)
    at serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1378:46)
    at serializeProperty (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:629:59)
Error reading appStream: TypeError: Unable to enqueue
    at Object.write (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@tanstack+router-core@1.134.13/node_modules/@tanstack/router-core/dist/esm/ssr/transformStreamWithRouter.js:52:18)
    at Object.onData (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@tanstack+router-core@1.134.13/node_modules/@tanstack/router-core/dist/esm/ssr/transformStreamWithRouter.js:235:26)
    at readStream (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@tanstack+router-core@1.134.13/node_modules/@tanstack/router-core/dist/esm/ssr/transformStreamWithRouter.js:82:12)
Error reading routerStream: TypeError: ctx.createEffectfulFunction is not a function
    at Object.serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval-plugins@1.3.3_seroval@1.5.0/node_modules/seroval-plugins/dist/esm/development/web.mjs:32:17)
    at serializePlugin (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1121:23)
    at serializeAssignable (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1335:14)
    at serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1378:46)
    at SerializePluginContext.serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:320:12)
    at Object.serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval-plugins@1.3.3_seroval@1.5.0/node_modules/seroval-plugins/dist/esm/development/web.mjs:113:11)
    at serializePlugin (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1121:23)
    at serializeAssignable (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1335:14)
    at serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1378:46)
    at serializeProperty (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:629:59)
Error reading appStream: TypeError: Unable to enqueue
    at Object.write (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@tanstack+router-core@1.134.13/node_modules/@tanstack/router-core/dist/esm/ssr/transformStreamWithRouter.js:52:18)
    at Object.onData (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@tanstack+router-core@1.134.13/node_modules/@tanstack/router-core/dist/esm/ssr/transformStreamWithRouter.js:235:26)
    at readStream (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@tanstack+router-core@1.134.13/node_modules/@tanstack/router-core/dist/esm/ssr/transformStreamWithRouter.js:82:12)
Error reading routerStream: TypeError: ctx.createEffectfulFunction is not a function
    at Object.serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval-plugins@1.3.3_seroval@1.5.0/node_modules/seroval-plugins/dist/esm/development/web.mjs:32:17)
    at serializePlugin (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1121:23)
    at serializeAssignable (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1335:14)
    at serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1378:46)
    at SerializePluginContext.serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:320:12)
    at Object.serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval-plugins@1.3.3_seroval@1.5.0/node_modules/seroval-plugins/dist/esm/development/web.mjs:113:11)
    at serializePlugin (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1121:23)
    at serializeAssignable (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1335:14)
    at serialize (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:1378:46)
    at serializeProperty (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/development/index.mjs:629:59)
Error reading appStream: TypeError: Unable to enqueue
    at Object.write (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@tanstack+router-core@1.134.13/node_modules/@tanstack/router-core/dist/esm/ssr/transformStreamWithRouter.js:52:18)
    at Object.onData (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@tanstack+router-core@1.134.13/node_modules/@tanstack/router-core/dist/esm/ssr/transformStreamWithRouter.js:235:26)
    at readStream (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@tanstack+router-core@1.134.13/node_modules/@tanstack/router-core/dist/esm/ssr/transformStreamWithRouter.js:82:12)
PS C:\Users\mikep\ts-hackathon\agentic-search> pnpm run dev

> agentic-search@ dev C:\Users\mikep\ts-hackathon\agentic-search
> node --import ./instrument.server.mjs .\node_modules\vite\bin\vite.js dev --port 3000

[dotenv@17.2.3] injecting env (22) from .env.local -- tip: 🔄 add secrets lifecycle management: https://dotenvx.com/ops
2:35:04 PM [vite] (ssr) Re-optimizing dependencies because lockfile has changed
Default inspector port 9229 not available, using 9230 instead

Using secrets defined in .dev.vars
[dotenv@17.2.3] injecting env (0) from .env.local -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.eenv'] }
2:35:05 PM [vite] (client) Re-optimizing dependencies because lockfile has changed
Port 3000 is in use, trying another one...

  VITE v7.2.1  ready in 18705 ms

  ➜  Local:   http://localhost:3001/
  ➜  Network: use --host to expose
  ➜  Debug:   http://localhost:3001/__debug
  ➜  press h + enter to show help
AssertionError [ERR_ASSERTION]: Unexpected error: no match for module: node:http.
    at Object.unsafeModuleFallbackService (file:///C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@cloudflare+vite-plugin@1.1_b81d5a0cff7a1823ef80298218f89278/node_modules/@cloudflare/vite-plugin/dist/index.js:15492:5)   
    at #handleLoopback (C:\Users\mikep\ts-hackathon\agentic-search\node_modules\.pnpm\miniflare@4.20251109.0\node_modules\miniflare\dist\src\index.js:61547:48)
    at Server.emit (node:events:530:35)
    at Server.emit (node:domain:489:12)
    at parserOnIncoming (node:_http_server:1155:12)
    at HTTPParser.parserOnHeadersComplete (node:_http_common:117:17)
Fallback service failed to fetch module; payload = AssertionError [ERR_ASSERTION]: Unexpected error: no match for module: node:http.
    at Object.unsafeModuleFallbackService (file:///C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@cloudflare+vite-plugin@1.1_b81d5a0cff7a1823ef80298218f89278/node_modules/@cloudflare/vite-plugin/dist/index.js:15492:5)   
    at #handleLoopback (C:\Users\mikep\ts-hackathon\agentic-search\node_modules\.pnpm\miniflare@4.20251109.0\node_modules\miniflare\dist\src\index.js:61547:48)
    at Server.emit (node:events:530:35)
    at Server.emit (node:domain:489:12)
    at parserOnIncoming (node:_http_server:1155:12)
    at HTTPParser.parserOnHeadersComplete (node:_http_common:117:17); spec = /?specifier=node%3Ahttp&referrer=&rawSpecifier=node%3Ahttp
[DetectModels] Failed to detect ollama models: internal error; reference = 0uq5kvkveo4fuqulits2pvbv
[DetectModels] Failed to detect ollama models: internal error; reference = 7db74on6vssf4vsbml45vuk3
[StreamSearch] Starting search for searchId=search-1773082676922, query="Latest AI research"
[StreamSearch] Using client-provided model: custom-1773082667032:glm-5
[StreamSearch] Search API keys received: { tavily: false, exa: false, firecrawl: false, brave: false }
[StreamSearch] Available providers: duckduckgo, wikipedia
[UnifiedSearch] Starting search for: "Latest AI research"
[UnifiedSearch] Options: parallel=false, reasoning=true, validation=true, segmentation=true
[UnifiedSearch] Execution mode: single_model (One model available, using single-model assisted search.)
[UnifiedSearch] Routing to segmented search...
[SegmentedSearch] Starting segmented search for: "Latest AI research"
[SegmentedSearch] This will work equally well with tiny or powerful models!
[SegmentedSearch] Phase 1: Segmenting query...
[Segmenter] Analyzing query: "Latest AI research"
[Segmenter] Simple query - single segment
[Segmenter] Execution graph: 1 stages, 0 parallel groups
[Segmenter] Created 1 segments (400 tokens estimated)
[SegmentedSearch] Created 1 segments:
  - entity: "Latest AI research" (priority: 10, complexity: simple)
    Recommended model: openai:glm-5 (SUGGESTION ONLY - user controls actual model)
[SegmentedSearch] Phase 2: Executing 1 segments with coordination...
[Coordinator] Starting execution of 1 segments
[Coordinator] Executing 1 segments sequentially
[Coordinator] Executing segment simple: "Latest AI research"
[Coordinator] Context from 0 dependencies
[Executor] Starting segment: simple
[Executor] Text: "Latest AI research"
[Executor] Recommended model: openai:glm-5 (user can override)
[Executor] Verifying model connection: openai:glm-5...
[Executor] Calling openai:glm-5 at https://api.z.ai/api/coding/paas/v4
✗ [Executor] Model openai:glm-5 verification failed: Error: OpenAI API error: 404 Not Found
    at SegmentExecutor.callOpenAI (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-executor.ts:497:13)
    at SegmentExecutor.verifyAndSelectModel (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-executor.ts:154:24)
    at SegmentExecutor.execute (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-executor.ts:51:22) 
    at SegmentCoordinator.executeSegment (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-coordinator.ts:164:20)
    at SegmentCoordinator.executeSequential (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-coordinator.ts:140:24)
    at SegmentCoordinator.execute (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-coordinator.ts:49:11)
    at UnifiedSearchOrchestrator.searchWithSegmentation (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/unified-search-orchestrator.ts:541:30)
    at executeSearchWithProgress (C:/Users/mikep/ts-hackathon/agentic-search/src/routes/api/search/stream.ts:425:24)  
⚠ [Executor] Model verification failed: Cannot connect to model openai:glm-5: OpenAI API error: 404 Not Found
⚠ [Executor] Proceeding with web search only
[Executor] Executing search with model openai:glm-5
[Executor] Search API keys available: { tavily: false, exa: false, firecrawl: false, brave: false }
OpenAI call failed: DOMException {
  code: 23,
  name: 'TimeoutError',
  message: 'The operation was aborted due to timeout',
  stack: 'TimeoutError: The operation was aborted due to timeout\n' +
    '    at AgenticSearchEngine.callOpenAI (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:1059:21)\n' +
    '    at AgenticSearchEngine.analyzeIntent (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:224:21)\n' +
    '    at AgenticSearchEngine.search (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:110:13)\n' +
    '    at SegmentExecutor.executeSearch (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-executor.ts:221:22)\n' +
    '    at SegmentExecutor.execute (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-executor.ts:63:29)\n' +
    '    at SegmentCoordinator.executeSegment (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-coordinator.ts:164:20)\n' +
    '    at SegmentCoordinator.executeSequential (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-coordinator.ts:140:24)\n' +
    '    at SegmentCoordinator.execute (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-coordinator.ts:49:11)\n' +
    '    at UnifiedSearchOrchestrator.searchWithSegmentation (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/unified-search-orchestrator.ts:541:30)\n' +
    '    at executeSearchWithProgress (C:/Users/mikep/ts-hackathon/agentic-search/src/routes/api/search/stream.ts:425:24)',
  retryable: true
}
[AgenticSearch] analyzeIntent model call failed, using deterministic fallback: Failed to call OpenAI: TimeoutError: The operation was aborted due to timeout
OpenAI call failed: DOMException {
  code: 23,
  name: 'TimeoutError',
  message: 'The operation was aborted due to timeout',
  stack: 'TimeoutError: The operation was aborted due to timeout\n' +
    '    at AgenticSearchEngine.callOpenAI (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:1059:21)\n' +
    '    at AgenticSearchEngine.planSearchStrategy (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:265:21)\n' +
    '    at AgenticSearchEngine.search (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:125:15)\n' +
    '    at SegmentExecutor.executeSearch (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-executor.ts:221:22)\n' +
    '    at SegmentExecutor.execute (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-executor.ts:63:29)\n' +
    '    at SegmentCoordinator.executeSegment (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-coordinator.ts:164:20)\n' +
    '    at SegmentCoordinator.executeSequential (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-coordinator.ts:140:24)\n' +
    '    at SegmentCoordinator.execute (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-coordinator.ts:49:11)\n' +
    '    at UnifiedSearchOrchestrator.searchWithSegmentation (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/unified-search-orchestrator.ts:541:30)\n' +
    '    at executeSearchWithProgress (C:/Users/mikep/ts-hackathon/agentic-search/src/routes/api/search/stream.ts:425:24)',
  retryable: true
}
[AgenticSearch] planSearchStrategy model call failed, using deterministic fallback: Failed to call OpenAI: TimeoutError: The operation was aborted due to timeout
[Wikipedia] Search API returned 403
[Wikipedia] Search API returned 403 (x2)
[Wikipedia] Search API returned 403 (x3)
[Wikipedia] Search API returned 403 (x4)
[DuckDuckGo] Returned 0 results for: Latest AI research official announcement
[DuckDuckGo] Returned 0 results for: Latest AI research
[DuckDuckGo] Returned 0 results for: "Latest AI research"
[DuckDuckGo] Returned 0 results for: Latest AI research latest updates
[ResearchStorage] Falling back to in-memory persistence: Error: Cannot find module 'node:fs/promises' imported from 'C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts'
    at CustomModuleRunner.cachedModule (workers/runner-worker.js:1236:20)
    at request (workers/runner-worker.js:1154:83)
    at ResearchStorage.ensureLoaded (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts:128:15)
    at ResearchStorage.findRelevantResults (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts:494:3)
    at getCachedResults (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/search/provider-registry.ts:198:24)
    at executeWebSearch (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/search/provider-registry.ts:334:25)       
    at C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:357:22
    at async Promise.all (index 3)
    at AgenticSearchEngine.executeMultiSourceSearch (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:354:24)
    at AgenticSearchEngine.search (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:134:22) {     
  remote: true
}
[ResearchStorage] Falling back to in-memory persistence: Error: Cannot find module 'node:fs/promises' imported from 'C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts'
    at CustomModuleRunner.cachedModule (workers/runner-worker.js:1236:20)
    at request (workers/runner-worker.js:1154:83)
    at ResearchStorage.ensureLoaded (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts:128:15)    
    at ResearchStorage.findRelevantResults (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts:494:3)
    at getCachedResults (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/search/provider-registry.ts:198:24)       
    at executeWebSearch (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/search/provider-registry.ts:334:25)       
    at C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:357:22
    at async Promise.all (index 0)
    at AgenticSearchEngine.executeMultiSourceSearch (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:354:24)
    at AgenticSearchEngine.search (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:134:22) {     
  remote: true
}
[ResearchStorage] Falling back to in-memory persistence: Error: Cannot find module 'node:fs/promises' imported from 'C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts'
    at CustomModuleRunner.cachedModule (workers/runner-worker.js:1236:20)
    at request (workers/runner-worker.js:1154:83)
    at ResearchStorage.ensureLoaded (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts:128:15)    
    at ResearchStorage.findRelevantResults (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts:494:3)
    at getCachedResults (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/search/provider-registry.ts:198:24)       
    at executeWebSearch (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/search/provider-registry.ts:334:25)       
    at C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:357:22
    at async Promise.all (index 1)
    at AgenticSearchEngine.executeMultiSourceSearch (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:354:24)
    at AgenticSearchEngine.search (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:134:22) {     
  remote: true
}
[ResearchStorage] Falling back to in-memory persistence: Error: Cannot find module 'node:fs/promises' imported from 'C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts'
    at CustomModuleRunner.cachedModule (workers/runner-worker.js:1236:20)
    at request (workers/runner-worker.js:1154:83)
    at ResearchStorage.ensureLoaded (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts:128:15)    
    at ResearchStorage.findRelevantResults (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts:494:3)
    at getCachedResults (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/search/provider-registry.ts:198:24)       
    at executeWebSearch (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/search/provider-registry.ts:334:25)       
    at C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:357:22
    at async Promise.all (index 2)
    at AgenticSearchEngine.executeMultiSourceSearch (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:354:24)
    at AgenticSearchEngine.search (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:134:22) {     
  remote: true
}
Learning update: {
  query: 'Latest AI research',
  intent: {
    type: 'research',
    complexity: 'simple',
    sources: [ 'web', 'academic' ]
  },
  strategy: {
    primaryQuery: 'Latest AI research',
    followUpQueries: [
      '"Latest AI research"',
      'Latest AI research latest updates',
      'Latest AI research official announcement'
    ],
    sources: [ 'web', 'academic' ],
    searchDepth: 4,
    qualityThreshold: 0.4
  },
  resultCount: 0,
  avgScore: 0,
  timestamp: 1773082708078
}
[Executor] Low confidence (0.00) - escalation recommended
[Executor] Segment simple completed in 30926ms
[Executor] Found 0 results, confidence: 0.00
[Coordinator] Segment simple spawned 1 new segments
[Coordinator] Segment simple flagged for escalation
[Coordinator] Execution complete: 30929ms, 0 tokens
[Coordinator] Success: 1/1
[SegmentedSearch] Zero results — falling back to non-segmented path
[SegmentedSearch] Search failed: Error: Segmented search returned zero results
    at UnifiedSearchOrchestrator.searchWithSegmentation (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/unified-search-orchestrator.ts:548:11)
    at executeSearchWithProgress (C:/Users/mikep/ts-hackathon/agentic-search/src/routes/api/search/stream.ts:425:24)  
[SegmentedSearch] Falling back to non-segmented search
[UnifiedSearch] Starting search for: "Latest AI research"
[UnifiedSearch] Options: parallel=false, reasoning=true, validation=true, segmentation=false
[UnifiedSearch] Execution mode: single_model (One model available, using single-model assisted search.)
[UnifiedSearch] Phase 1: Executing base agentic search...
OpenAI call failed: DOMException {
  code: 23,
  name: 'TimeoutError',
  message: 'The operation was aborted due to timeout',
  stack: 'TimeoutError: The operation was aborted due to timeout\n' +
    '    at AgenticSearchEngine.callOpenAI (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:1059:21)\n' +
    '    at AgenticSearchEngine.analyzeIntent (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:224:21)\n' +
    '    at AgenticSearchEngine.search (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:110:13)\n' +
    '    at UnifiedSearchOrchestrator.search (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/unified-search-orchestrator.ts:183:29)\n' +
    '    at executeSearchWithProgress (C:/Users/mikep/ts-hackathon/agentic-search/src/routes/api/search/stream.ts:425:24)',
  retryable: true
}
[AgenticSearch] analyzeIntent model call failed, using deterministic fallback: Failed to call OpenAI: TimeoutError: The operation was aborted due to timeout
OpenAI call failed: DOMException {
  code: 23,
  name: 'TimeoutError',
  message: 'The operation was aborted due to timeout',
  stack: 'TimeoutError: The operation was aborted due to timeout\n' +
    '    at AgenticSearchEngine.callOpenAI (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:1059:21)\n' +
    '    at AgenticSearchEngine.planSearchStrategy (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:265:21)\n' +
    '    at AgenticSearchEngine.search (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:125:15)\n' +
    '    at UnifiedSearchOrchestrator.search (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/unified-search-orchestrator.ts:183:29)\n' +
    '    at executeSearchWithProgress (C:/Users/mikep/ts-hackathon/agentic-search/src/routes/api/search/stream.ts:425:24)',
  retryable: true
}
[AgenticSearch] planSearchStrategy model call failed, using deterministic fallback: Failed to call OpenAI: TimeoutError: The operation was aborted due to timeout
[Wikipedia] Search API returned 403
[Wikipedia] Search API returned 403 (x2)
[Wikipedia] Search API returned 403 (x3)
[Wikipedia] Search API returned 403 (x4)
[DuckDuckGo] Returned 0 results for: "Latest AI research"
[DuckDuckGo] Returned 0 results for: Latest AI research official announcement
[DuckDuckGo] Returned 0 results for: Latest AI research
[DuckDuckGo] Returned 0 results for: Latest AI research latest updates
Learning update: {
  query: 'Latest AI research',
  intent: {
    type: 'research',
    complexity: 'simple',
    sources: [ 'web', 'academic' ]
  },
  strategy: {
    primaryQuery: 'Latest AI research',
    followUpQueries: [
      '"Latest AI research"',
      'Latest AI research latest updates',
      'Latest AI research official announcement'
    ],
    sources: [ 'web', 'academic' ],
    searchDepth: 4,
    qualityThreshold: 0.4
  },
  resultCount: 0,
  avgScore: 0,
  timestamp: 1773082738240
}
[UnifiedSearch] Phase 3: Executing interleaved reasoning...
[UnifiedSearch] Reasoning completed. 1 steps, confidence: 0.00
[UnifiedSearch] Phase 4: Calculating ADD quality metrics...
[UnifiedSearch] Phase 5: Validating components...
[UnifiedSearch] Validation complete. Retrieval: false, Reasoning: false, Response: true
[UnifiedSearch] Search completed in 30818ms
[UnifiedSearch] Quality: 0.50, Tokens: 0
[DetectModels] Failed to detect ollama models: internal error; reference = 4om7sd3l82fv881dkuqq78av
5:10:26 PM [vite] (client) hmr update /src/styles.css?direct
5:10:26 PM [vite] (ssr) hmr update /@id/virtual:cloudflare/worker-entry
[vite] hot updated: virtual:cloudflare/worker-entry
5:10:36 PM [vite] (client) hmr update /src/styles.css?direct
5:10:47 PM [vite] (client) hmr update /src/styles.css?direct, /src/routes/__root.tsx
5:10:47 PM [vite] (ssr) hmr update /@id/virtual:cloudflare/worker-entry
[vite] hot updated: virtual:cloudflare/worker-entry
5:11:00 PM [vite] (client) hmr update /src/styles.css?direct, /src/routes/__root.tsx
5:11:00 PM [vite] (ssr) hmr update /@id/virtual:cloudflare/worker-entry
[vite] hot updated: virtual:cloudflare/worker-entry
5:11:24 PM [vite] (client) hmr update /src/styles.css?direct, /src/routes/__root.tsx
5:11:24 PM [vite] (ssr) hmr update /@id/virtual:cloudflare/worker-entry
[vite] hot updated: virtual:cloudflare/worker-entry
5:11:37 PM [vite] (client) hmr update /src/styles.css?direct, /src/routes/__root.tsx
5:11:37 PM [vite] (ssr) hmr update /@id/virtual:cloudflare/worker-entry
[vite] hot updated: virtual:cloudflare/worker-entry
[DetectModels] Failed to detect ollama models: internal error; reference = 7oe01uondob3uk63f55oahrp
[DetectModels] Failed to detect ollama models: internal error; reference = clrbcuh1q1pg0vno9ohrtsig
PS C:\Users\mikep\ts-hackathon\agentic-search> pnpm i      
Lockfile is up to date, resolution step is skipped
Already up to date
Done in 706ms using pnpm v10.20.0
PS C:\Users\mikep\ts-hackathon\agentic-search> pnpm run dev

> agentic-search@ dev C:\Users\mikep\ts-hackathon\agentic-search
> node --import ./instrument.server.mjs .\node_modules\vite\bin\vite.js dev --port 3000

[dotenv@17.2.3] injecting env (22) from .env.local -- tip: ⚙️  enable debug logging with { debug: true }
5:13:42 PM [vite] (ssr) Re-optimizing dependencies because lockfile has changed
Using secrets defined in .dev.vars
[dotenv@17.2.3] injecting env (0) from .env.local -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }
5:13:43 PM [vite] (client) Re-optimizing dependencies because lockfile has changed (x2)

  VITE v7.2.1  ready in 21984 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  Debug:   http://localhost:3000/__debug
  ➜  press h + enter to show help
AssertionError [ERR_ASSERTION]: Unexpected error: no match for module: node:http.
    at Object.unsafeModuleFallbackService (file:///C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@cloudflare+vite-plugin@1.1_b81d5a0cff7a1823ef80298218f89278/node_modules/@cloudflare/vite-plugin/dist/index.js:15492:5)
    at #handleLoopback (C:\Users\mikep\ts-hackathon\agentic-search\node_modules\.pnpm\miniflare@4.20251109.0\node_modules\miniflare\dist\src\index.js:61547:48)
    at Server.emit (node:events:530:35)
    at Server.emit (node:domain:489:12)
    at parserOnIncoming (node:_http_server:1155:12)
    at HTTPParser.parserOnHeadersComplete (node:_http_common:117:17)
Fallback service failed to fetch module; payload = AssertionError [ERR_ASSERTION]: Unexpected error: no match for module: node:http.
    at Object.unsafeModuleFallbackService (file:///C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@cloudflare+vite-plugin@1.1_b81d5a0cff7a1823ef80298218f89278/node_modules/@cloudflare/vite-plugin/dist/index.js:15492:5)   
    at #handleLoopback (C:\Users\mikep\ts-hackathon\agentic-search\node_modules\.pnpm\miniflare@4.20251109.0\node_modules\miniflare\dist\src\index.js:61547:48)
    at Server.emit (node:events:530:35)
    at Server.emit (node:domain:489:12)
    at parserOnIncoming (node:_http_server:1155:12)
    at HTTPParser.parserOnHeadersComplete (node:_http_common:117:17); spec = /?specifier=node%3Ahttp&referrer=&rawSpecifier=node%3Ahttp
[DetectModels] Failed to detect ollama models: internal error; reference = 6rj5prmrfsc9enk276umrsgn
[DetectModels] Failed to detect ollama models: internal error; reference = ngb5nde3ik6fpnpk1m029mj7
[DetectModels] Failed to detect ollama models: internal error; reference = 20p0j2f9nni8fq7ffopp2g58
[DetectModels] Failed to detect ollama models: internal error; reference = ubfmnddrj04p7kr34eohuog3
[DetectModels] Failed to detect ollama models: internal error; reference = ulfiau1677te6ggb5cpec3td
[StreamSearch] Starting search for searchId=search-1773091649242, query="AI research papers"
[StreamSearch] Using client-provided model: custom-1772899526871:glm-5
[StreamSearch] Search API keys received: { tavily: false, exa: false, firecrawl: false, brave: false }
[StreamSearch] Available providers: duckduckgo, wikipedia
[StreamSearch] Parallel execution enabled with 2 models
[UnifiedSearch] Starting search for: "AI research papers"
[UnifiedSearch] Options: parallel=true, reasoning=true, validation=true, segmentation=true
[UnifiedSearch] Execution mode: dual_model (Two models available, using synthesizer plus validator execution.)        
[UnifiedSearch] Routing to segmented search...
[SegmentedSearch] Starting segmented search for: "AI research papers"
[SegmentedSearch] This will work equally well with tiny or powerful models!
[SegmentedSearch] Phase 1: Segmenting query...
[Segmenter] Analyzing query: "AI research papers"
[Segmenter] Simple query - single segment
[Segmenter] Execution graph: 1 stages, 0 parallel groups
[Segmenter] Created 1 segments (400 tokens estimated)
[SegmentedSearch] Created 1 segments:
  - entity: "AI research papers" (priority: 10, complexity: simple)
    Recommended model: openai:glm-5 (SUGGESTION ONLY - user controls actual model)
[SegmentedSearch] Phase 2: Executing 1 segments with coordination...
[Coordinator] Starting execution of 1 segments
[Coordinator] Executing 1 segments sequentially
[Coordinator] Executing segment simple: "AI research papers"
[Coordinator] Context from 0 dependencies
[Executor] Starting segment: simple
[Executor] Text: "AI research papers"
[Executor] Recommended model: openai:glm-5 (user can override)
[Executor] Verifying model connection: openai:glm-5...
[Executor] Calling openai:glm-5 at [https://api.z.ai/api/coding/paas/v4](https://api.z.ai/api/coding/paas/v4)
✗ [Executor] Model openai:glm-5 verification failed: TypeError: Invalid URL: [https://api.z.ai/api/coding/paas/v4](https://api.z.ai/api/coding/paas/v4)/v1/chat/completions
    at globalThis.fetch (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@tanstack+start-server-core@1.134.13/node_modules/@tanstack/start-server-core/dist/esm/createStartHandler.js:114:14)
    at SegmentExecutor.callOpenAI (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-executor.ts:482:28)
    at SegmentExecutor.callModel (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-executor.ts:387:21)
    at SegmentExecutor.verifyAndSelectModel (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-executor.ts:154:35)
    at SegmentExecutor.execute (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-executor.ts:51:33) 
    at SegmentCoordinator.executeSegment (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-coordinator.ts:164:40)
    at SegmentCoordinator.executeSequential (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-coordinator.ts:140:35)
    at SegmentCoordinator.execute (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-coordinator.ts:49:22)
    at UnifiedSearchOrchestrator.searchWithSegmentation (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/unified-search-orchestrator.ts:541:48)
    at executeSearchWithProgress (C:/Users/mikep/ts-hackathon/agentic-search/src/routes/api/search/stream.ts:425:24)  
⚠ [Executor] Model verification failed: Cannot connect to model openai:glm-5: Invalid URL: [https://api.z.ai/api/coding/paas/v4](https://api.z.ai/api/coding/paas/v4)/v1/chat/completions
⚠ [Executor] Proceeding with web search only
[Executor] Executing search with model openai:glm-5
[Executor] Search API keys available: { tavily: false, exa: false, firecrawl: false, brave: false }
[AgenticSearch] analyzeIntent model call failed, using deterministic fallback: Invalid URL format
[AgenticSearch] planSearchStrategy model call failed, using deterministic fallback: Invalid URL format
[Wikipedia] Search API returned 403
[Wikipedia] Search API returned 403 (x2)
[Wikipedia] Search API returned 403 (x3)
[Wikipedia] Search API returned 403 (x4)
[DuckDuckGo] Returned 0 results for: AI research papers evidence
[DuckDuckGo] Returned 0 results for: AI research papers overview
[ResearchStorage] Falling back to in-memory persistence: Error: Cannot find module 'node:fs/promises' imported from 'C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts'
    at CustomModuleRunner.cachedModule (workers/runner-worker.js:1236:20)
    at request (workers/runner-worker.js:1154:83)
    at ResearchStorage.ensureLoaded (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts:128:15)
    at ResearchStorage.findRelevantResults (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts:494:3)
    at getCachedResults (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/search/provider-registry.ts:198:24)
    at executeWebSearch (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/search/provider-registry.ts:334:25)
    at C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:357:22
    at async Promise.all (index 2)
    at AgenticSearchEngine.executeMultiSourceSearch (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:354:24)
    at AgenticSearchEngine.search (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:134:22) {     
  remote: true
}
[ResearchStorage] Falling back to in-memory persistence: Error: Cannot find module 'node:fs/promises' imported from 'C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts'
    at CustomModuleRunner.cachedModule (workers/runner-worker.js:1236:20)
    at request (workers/runner-worker.js:1154:83)
    at ResearchStorage.ensureLoaded (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts:128:15)    
    at ResearchStorage.findRelevantResults (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/results-storage.ts:494:3)
    at getCachedResults (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/search/provider-registry.ts:198:24)       
    at executeWebSearch (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/search/provider-registry.ts:334:25)       
    at C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:357:22
    at async Promise.all (index 3)
    at AgenticSearchEngine.executeMultiSourceSearch (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:354:24)
    at AgenticSearchEngine.search (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/agentic-search.ts:134:22) {     
  remote: true
}
[DuckDuckGo] Returned 0 results for: "AI research papers"
[DuckDuckGo] Returned 0 results for: AI research papers
Learning update: {
  query: 'AI research papers',
  intent: {
    type: 'research',
    complexity: 'simple',
    sources: [ 'web', 'academic' ]
  },
  strategy: {
    primaryQuery: 'AI research papers',
    followUpQueries: [
      '"AI research papers"',
      'AI research papers evidence',
      'AI research papers overview'
    ],
    sources: [ 'web', 'academic' ],
    searchDepth: 4,
    qualityThreshold: 0.4
  },
  resultCount: 0,
  avgScore: 0,
  timestamp: 1773091649532
}
[Executor] Low confidence (0.00) - escalation recommended
[Executor] Segment simple completed in 204ms
[Executor] Found 0 results, confidence: 0.00
[Coordinator] Segment simple spawned 1 new segments
[Coordinator] Segment simple flagged for escalation
[Coordinator] Execution complete: 207ms, 0 tokens
[Coordinator] Success: 1/1
[SegmentedSearch] Zero results — falling back to non-segmented path
[SegmentedSearch] Search failed: Error: Segmented search returned zero results
    at UnifiedSearchOrchestrator.searchWithSegmentation (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/unified-search-orchestrator.ts:548:11)
    at executeSearchWithProgress (C:/Users/mikep/ts-hackathon/agentic-search/src/routes/api/search/stream.ts:425:24)  
[SegmentedSearch] Falling back to non-segmented search
[UnifiedSearch] Starting search for: "AI research papers"
[UnifiedSearch] Options: parallel=true, reasoning=true, validation=true, segmentation=false
[UnifiedSearch] Execution mode: dual_model (Two models available, using synthesizer plus validator execution.)        
[UnifiedSearch] Phase 1: Executing base agentic search...
[AgenticSearch] analyzeIntent model call failed, using deterministic fallback: Invalid URL format
[AgenticSearch] planSearchStrategy model call failed, using deterministic fallback: Invalid URL format
[DuckDuckGo] Returned 0 results for: "AI research papers"
[DuckDuckGo] Returned 0 results for: AI research papers
[Wikipedia] Search API returned 403
[Wikipedia] Search API returned 403 (x2)
[Wikipedia] Search API returned 403 (x3)
[Wikipedia] Search API returned 403 (x4)
[DuckDuckGo] Returned 0 results for: AI research papers overview
[DuckDuckGo] Returned 0 results for: AI research papers evidence
Learning update: {
  query: 'AI research papers',
  intent: {
    type: 'research',
    complexity: 'simple',
    sources: [ 'web', 'academic' ]
  },
  strategy: {
    primaryQuery: 'AI research papers',
    followUpQueries: [
      '"AI research papers"',
      'AI research papers evidence',
      'AI research papers overview'
    ],
    sources: [ 'web', 'academic' ],
    searchDepth: 4,
    qualityThreshold: 0.4
  },
  resultCount: 0,
  avgScore: 0,
  timestamp: 1773091649612
}
[UnifiedSearch] Phase 2: Running parallel models (2 models)...
[ParallelOrchestrator] Executing 2 model(s) in parallel (max concurrency: 2)
Error executing model openai:glm-5: TypeError: Invalid URL: [https://api.z.ai/api/coding/paas/v4](https://api.z.ai/api/coding/paas/v4)/responses
    at globalThis.fetch (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@tanstack+start-server-core@1.134.13/node_modules/@tanstack/start-server-core/dist/esm/createStartHandler.js:114:14)
    at postToApi (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/chunk-ZDSKKVEZ.js:556:28)    
    at postJsonToApi (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/chunk-ZDSKKVEZ.js:511:7) 
    at OpenAIResponsesLanguageModel.doGenerate (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/@ai-sdk_openai.js:3185:28)
    at fn (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/chunk-NTIGLTHW.js:4215:34)
    at C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/chunk-NTIGLTHW.js:3531:22
    at _retryWithExponentialBackoff (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/chunk-NTIGLTHW.js:3670:12)
    at fn (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/chunk-NTIGLTHW.js:4173:34)
    at C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/chunk-NTIGLTHW.js:3531:22
    at generateText (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/chunk-NTIGLTHW.js:4118:12)
[ParallelOrchestrator] Consensus: strategy=unanimous, agreement=100%, agreed=37 claims, contradictions=0
[UnifiedSearch] Parallel models completed. Confidence: 0.95, Agreement: 100%, Strategy: unanimous
[UnifiedSearch] Phase 3: Executing interleaved reasoning...
[UnifiedSearch] Reasoning completed. 1 steps, confidence: 0.00
[UnifiedSearch] Phase 4: Calculating ADD quality metrics...
[UnifiedSearch] Phase 5: Validating components...
[UnifiedSearch] Validation complete. Retrieval: false, Reasoning: false, Response: true
[UnifiedSearch] Search completed in 18183ms
[UnifiedSearch] Quality: 0.50, Tokens: 1468
5:28:12 PM [vite] (client) hmr update /src/styles.css?direct
5:28:12 PM [vite] (client) hmr update /src/styles.css?direct (x2)
5:28:12 PM [vite] (client) hmr update /src/styles.css?direct (x3)
5:28:12 PM [vite] (client) hmr update /src/styles.css?direct (x4)
5:28:13 PM [vite] (client) hmr update /src/styles.css?direct (x5)
5:28:13 PM [vite] (client) hmr update /src/styles.css?direct (x6)
5:28:20 PM [vite] (client) hmr update /src/styles.css?direct (x7)
[DetectModels] Failed to detect ollama models: internal error; reference = mk5313eolri56a5f2mpugf4u
[StreamSearch] Starting search for searchId=search-1773092008999, query="ai research training methods"
[StreamSearch] Using client-provided model: custom-1772899526871:glm-5
[StreamSearch] Search API keys received: { tavily: false, exa: false, firecrawl: false, brave: false }
[StreamSearch] Available providers: duckduckgo, wikipedia
[StreamSearch] Parallel execution enabled with 2 models
[UnifiedSearch] Starting search for: "ai research training methods"
[UnifiedSearch] Options: parallel=true, reasoning=true, validation=true, segmentation=true
[UnifiedSearch] Execution mode: dual_model (Two models available, using synthesizer plus validator execution.)
[UnifiedSearch] Routing to segmented search...
[SegmentedSearch] Starting segmented search for: "ai research training methods"
[SegmentedSearch] This will work equally well with tiny or powerful models!
[SegmentedSearch] Phase 1: Segmenting query...
[Segmenter] Analyzing query: "ai research training methods"
[Segmenter] Simple query - single segment
[Segmenter] Execution graph: 1 stages, 0 parallel groups
[Segmenter] Created 1 segments (400 tokens estimated)
[SegmentedSearch] Created 1 segments:
  - entity: "ai research training methods" (priority: 10, complexity: simple)
    Recommended model: openai:glm-5 (SUGGESTION ONLY - user controls actual model)
[SegmentedSearch] Phase 2: Executing 1 segments with coordination...
[Coordinator] Starting execution of 1 segments
[Coordinator] Executing 1 segments sequentially
[Coordinator] Executing segment simple: "ai research training methods"
[Coordinator] Context from 0 dependencies
[Executor] Starting segment: simple
[Executor] Text: "ai research training methods"
[Executor] Recommended model: openai:glm-5 (user can override)
[Executor] Verifying model connection: openai:glm-5...
[Executor] Calling openai:glm-5 at [https://api.z.ai/api/coding/paas/v4](https://api.z.ai/api/coding/paas/v4)
✗ [Executor] Model openai:glm-5 verification failed: TypeError: Invalid URL: [https://api.z.ai/api/coding/paas/v4](https://api.z.ai/api/coding/paas/v4)/v1/chat/completions
    at globalThis.fetch (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@tanstack+start-server-core@1.134.13/node_modules/@tanstack/start-server-core/dist/esm/createStartHandler.js:114:14)
    at SegmentExecutor.callOpenAI (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-executor.ts:482:28)
    at SegmentExecutor.callModel (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-executor.ts:387:21)
    at SegmentExecutor.verifyAndSelectModel (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-executor.ts:154:35)
    at SegmentExecutor.execute (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-executor.ts:51:33)
    at SegmentCoordinator.executeSegment (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-coordinator.ts:164:40)
    at SegmentCoordinator.executeSequential (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-coordinator.ts:140:35)
    at SegmentCoordinator.execute (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/segment/segment-coordinator.ts:49:22)
    at UnifiedSearchOrchestrator.searchWithSegmentation (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/unified-search-orchestrator.ts:541:48)
    at executeSearchWithProgress (C:/Users/mikep/ts-hackathon/agentic-search/src/routes/api/search/stream.ts:425:24)
⚠ [Executor] Model verification failed: Cannot connect to model openai:glm-5: Invalid URL: [https://api.z.ai/api/coding/paas/v4](https://api.z.ai/api/coding/paas/v4)/v1/chat/completions   
⚠ [Executor] Proceeding with web search only
[Executor] Executing search with model openai:glm-5
[Executor] Search API keys available: { tavily: false, exa: false, firecrawl: false, brave: false }
[AgenticSearch] analyzeIntent model call failed, using deterministic fallback: Invalid URL format
[AgenticSearch] planSearchStrategy model call failed, using deterministic fallback: Invalid URL format
[Wikipedia] Search API returned 403
[Wikipedia] Search API returned 403 (x2)
[Wikipedia] Search API returned 403 (x3)
[Wikipedia] Search API returned 403 (x4)
[DuckDuckGo] Returned 0 results for: ai research training methods
[DuckDuckGo] Returned 0 results for: ai research training methods evidence
[DuckDuckGo] Returned 0 results for: "ai research training methods"
[DuckDuckGo] Returned 0 results for: ai research training methods overview
Learning update: {
  query: 'ai research training methods',
  intent: {
    type: 'research',
    complexity: 'simple',
    sources: [ 'web', 'academic' ]
  },
  strategy: {
    primaryQuery: 'ai research training methods',
    followUpQueries: [
      '"ai research training methods"',
      'ai research training methods evidence',
      'ai research training methods overview'
    ],
    sources: [ 'web', 'academic' ],
    searchDepth: 4,
    qualityThreshold: 0.4
  },
  resultCount: 0,
  avgScore: 0,
  timestamp: 1773092009228
}
[Executor] Low confidence (0.00) - escalation recommended
[Executor] Segment simple completed in 184ms
[Executor] Found 0 results, confidence: 0.00
[Coordinator] Segment simple spawned 1 new segments
[Coordinator] Segment simple flagged for escalation
[Coordinator] Execution complete: 184ms, 0 tokens
[Coordinator] Success: 1/1
[SegmentedSearch] Zero results — falling back to non-segmented path
[SegmentedSearch] Search failed: Error: Segmented search returned zero results
    at UnifiedSearchOrchestrator.searchWithSegmentation (C:/Users/mikep/ts-hackathon/agentic-search/src/lib/unified-search-orchestrator.ts:548:11)
    at executeSearchWithProgress (C:/Users/mikep/ts-hackathon/agentic-search/src/routes/api/search/stream.ts:425:24)
[SegmentedSearch] Falling back to non-segmented search
[UnifiedSearch] Starting search for: "ai research training methods"
[UnifiedSearch] Options: parallel=true, reasoning=true, validation=true, segmentation=false   
[UnifiedSearch] Execution mode: dual_model (Two models available, using synthesizer plus validator execution.)
[UnifiedSearch] Phase 1: Executing base agentic search...
[AgenticSearch] analyzeIntent model call failed, using deterministic fallback: Invalid URL format
[AgenticSearch] planSearchStrategy model call failed, using deterministic fallback: Invalid URL format
[DuckDuckGo] Returned 0 results for: ai research training methods evidence
[DuckDuckGo] Returned 0 results for: "ai research training methods"
[Wikipedia] Search API returned 403
[Wikipedia] Search API returned 403 (x2)
[Wikipedia] Search API returned 403 (x3)
[Wikipedia] Search API returned 403 (x4)
[DuckDuckGo] Returned 0 results for: ai research training methods overview
[DuckDuckGo] Returned 0 results for: ai research training methods
Learning update: {
  query: 'ai research training methods',
  intent: {
    type: 'research',
    complexity: 'simple',
    sources: [ 'web', 'academic' ]
  },
  strategy: {
    primaryQuery: 'ai research training methods',
    followUpQueries: [
      '"ai research training methods"',
      'ai research training methods evidence',
      'ai research training methods overview'
    ],
    sources: [ 'web', 'academic' ],
    searchDepth: 4,
    qualityThreshold: 0.4
  },
  resultCount: 0,
  avgScore: 0,
  timestamp: 1773092009306
}
[UnifiedSearch] Phase 2: Running parallel models (2 models)...
[ParallelOrchestrator] Executing 2 model(s) in parallel (max concurrency: 2)
Error executing model openai:glm-5: TypeError: Invalid URL: [https://api.z.ai/api/coding/paas/v4](https://api.z.ai/api/coding/paas/v4)/responses
    at globalThis.fetch (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.pnpm/@tanstack+start-server-core@1.134.13/node_modules/@tanstack/start-server-core/dist/esm/createStartHandler.js:114:14)
    at postToApi (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/chunk-ZDSKKVEZ.js:556:28)
    at postJsonToApi (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/chunk-ZDSKKVEZ.js:511:7)
    at OpenAIResponsesLanguageModel.doGenerate (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/@ai-sdk_openai.js:3185:28)
    at fn (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/chunk-NTIGLTHW.js:4215:34)
    at C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/chunk-NTIGLTHW.js:3531:22
    at _retryWithExponentialBackoff (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/chunk-NTIGLTHW.js:3670:12)
    at fn (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/chunk-NTIGLTHW.js:4173:34)
    at C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/chunk-NTIGLTHW.js:3531:22
    at generateText (C:/Users/mikep/ts-hackathon/agentic-search/node_modules/.vite/deps_ssr/chunk-NTIGLTHW.js:4118:12)
