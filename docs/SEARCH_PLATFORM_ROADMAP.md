# Search Platform Roadmap

## Purpose

This document is the implementation roadmap for turning the current app into a durable, provider-rich search platform that:

- works without any model configured
- supports multiple search providers and tool providers
- supports one model, two-model validation, and multi-agent/swarm execution
- supports user-owned credentials without depending on browser-only storage
- can grow into first-party crawling, indexing, and document ingestion

It is intentionally grounded in the current repository rather than older planning docs.

## Current Baseline

The current codebase already has useful foundations:

- Web-only search mode exists in `src/lib/agentic-search.ts`.
- Parallel web retrieval exists for Tavily, Exa, Firecrawl, and Brave in `src/lib/search-providers.ts`.
- Multi-model parallel execution and heuristic consensus exist in `src/lib/parallel-model-orchestrator.ts`.
- Unified orchestration exists in `src/lib/unified-search-orchestrator.ts`.
- User-configured active models and search API keys exist in `src/lib/model-store.ts` and `src/components/SettingsModal.tsx`.
- Document indexing exists for user-supplied documents in `convex/indexing.ts`.
- MCP client infrastructure exists in `src/lib/mcp/client.ts` and `convex/mcp.ts`, but most custom MCP operations are placeholders.

The current codebase also has structural limits that should be treated as blockers for the larger platform:

- Search providers are hardcoded to four providers.
- Search without keys falls back to in-memory cache only.
- `src/lib/results-storage.ts` uses an in-process `Map`, which is not durable across serverless isolates.
- Parallel models are prompt fan-out plus heuristic consensus, not task-specialized agents.
- Secret handling is split between browser localStorage and newer Convex-backed key storage.
- There is no first-party crawl/index pipeline for the open web.

## Design Principles

1. Separate retrieval from reasoning.
Search must remain useful with zero model configured.

2. Treat providers as capability modules.
Search providers, model providers, OCR providers, document parsers, and MCP tools should not share the same abstraction.

3. Make durable storage the default.
Anything used for fallback, cache, ranking memory, provider telemetry, or evidence sharing must survive process restarts.

4. Prefer role-based orchestration over naive fan-out.
Multiple models should have explicit jobs, budgets, and success criteria.

5. Do not break the current UI contract while the system is still moving.
New capabilities should land behind adapters and feature flags before replacing active code paths.

## Target Capability Model

### 1. Retrieval Layer

Retrieval should support:

- direct metasearch via external APIs
- first-party crawled/indexed documents
- user document search
- MCP-exposed search or parsing tools
- reranking and contradiction checking independent of synthesis

### 2. Provider Taxonomy

The platform should split providers into these groups:

- `SearchProvider`
  - examples: Tavily, Exa, Brave, Firecrawl search, Google Search, Google Grounding, Bedrock search tools
- `FetchProvider`
  - examples: Firecrawl scrape/crawl, direct fetch, browser-based extraction, MCP `llm-txt`
- `ParseProvider`
  - examples: MarkItDown, OCR/document parsing, PDF extraction, MCP document parsers
- `ModelProvider`
  - examples: OpenAI, Anthropic, Google, OpenRouter, local OpenAI-compatible servers, Bedrock model endpoints
- `ToolProvider`
  - examples: MCP servers, Claude Code bridge, Gemini CLI bridge, Bedrock AgentCore tools

These should not share one monolithic config shape.

### 3. Execution Modes

The orchestrator should support these explicit modes:

- `retrieval_only`
  - no model required
  - query normalization, provider routing, ranking, dedupe, freshness, citation clustering
- `single_model`
  - one model handles optional query rewrite, rerank, and synthesis
- `dual_model`
  - planner/synthesizer + verifier/citation auditor
- `swarm`
  - specialized workers with shared evidence store and bounded budgets

## Architecture Changes

### A. Introduce Provider Registry

Add a provider registry instead of directly calling providers from `src/lib/search-providers.ts`.

Suggested files:

- `src/lib/search/types.ts`
- `src/lib/search/provider-registry.ts`
- `src/lib/search/provider-capabilities.ts`
- `src/lib/search/providers/tavily.ts`
- `src/lib/search/providers/exa.ts`
- `src/lib/search/providers/brave.ts`
- `src/lib/search/providers/firecrawl-search.ts`
- `src/lib/search/providers/google-search.ts`
- `src/lib/search/providers/google-grounding.ts`
- `src/lib/search/providers/bedrock-search.ts`

Provider capability fields should include:

- `kind`
- `supportsWebSearch`
- `supportsFetch`
- `supportsFullText`
- `supportsStructuredAnswer`
- `supportsDateFiltering`
- `supportsDomainFiltering`
- `supportsAuthMode`
- `costClass`
- `latencyClass`
- `resultShape`

### B. Split Search, Fetch, Parse, and Model Settings

The current `model-store.ts` is carrying too much responsibility.

Suggested new stores/contracts:

- `SearchProviderCredential`
- `ModelCredential`
- `ToolCredential`
- `ExecutionPolicy`
- `ActiveSearchProfile`

`SettingsModal` should become a thin UI over these contracts instead of the single storage object.

### C. Replace In-Memory Fallback Cache

Replace `src/lib/results-storage.ts` process memory fallback with durable storage.

Suggested additions:

- `convex/searchCache.ts`
- `convex/evidenceStore.ts`
- `convex/providerTelemetry.ts`
- optional S3 backing for large evidence payloads

Durable records should store:

- normalized query
- evidence set
- provider provenance
- rank features
- citation clusters
- freshness metadata
- TTL

### D. Add First-Party Crawl and Index Pipeline

The repo has document indexing for user-supplied files but not a web corpus.

Add:

- `convex/crawlJobs.ts`
- `convex/webIndex.ts`
- `convex/webDocuments.ts`
- `convex/webEmbeddings.ts`
- `src/lib/crawl/canonicalize.ts`
- `src/lib/crawl/robots.ts`
- `src/lib/crawl/frontier.ts`
- `src/lib/crawl/chunker.ts`

Minimum viable web indexing pipeline:

1. enqueue seed URLs
2. fetch/scrape page
3. canonicalize URL
4. dedupe by canonical URL + content hash
5. extract content
6. chunk content
7. store searchable text and metadata
8. optionally store embeddings
9. schedule refresh by freshness policy

### E. Build a Shared Evidence Store for Agent Work

Right now, model fan-out happens over the raw query. That is too weak for multi-agent search.

Add a shared evidence format:

- `evidenceId`
- `queryId`
- `sourceType`
- `provider`
- `url`
- `title`
- `snippet`
- `content`
- `chunkId`
- `citationClusterId`
- `freshnessScore`
- `authorityScore`
- `riskFlags`
- `retrievedAt`

Every model or tool actor should read from and write to this store, not pass ad hoc strings to one another.

### F. Replace Heuristic Multi-Model Use with Role-Based Plans

Keep the current parallel orchestrator as a fallback, but add a higher-level planner.

Suggested roles:

- `planner`
- `retriever`
- `fetcher`
- `reranker`
- `fact_checker`
- `synthesizer`
- `citation_auditor`
- `safety_guard`

Execution policies:

- `single_model`
  - planner + synthesis combined
- `two_model`
  - synthesizer + verifier
- `three_model`
  - planner + synthesizer + citation auditor
- `swarm`
  - specialized workers with max budget per role

### G. Unify Secret Storage

The current active UI path still uses browser localStorage while Convex secure key storage exists separately.

Target state:

- browser stores only non-sensitive UI preferences
- credentials live in authenticated Convex storage
- short-lived client tokens are used only where strictly required
- per-provider auth mode is explicit:
  - API key
  - OAuth token
  - local CLI session bridge
  - server-managed secret

This is especially important before adding:

- Claude Code tokens
- Gemini login/CLI session reuse
- Bedrock credentials
- MCP server credentials

## Provider Roadmap

### Phase 1: Safe Expansion

Implement first because they fit the current architecture best:

- normalize current four providers behind registry
- durable search cache
- durable evidence store
- provider telemetry and error accounting
- web-only search quality improvements without model dependency

### Phase 2: High-Value Search Integrations

- Google Search integration
- Google Grounding / grounded search integration
- Firecrawl crawl jobs using existing scrape/search foundation
- richer Firecrawl fetch path for post-search expansion
- document parser abstraction

### Phase 3: Parsing and Tooling

- MarkItDown integration
- MCP parser/search adapters
- Bedrock search and parsing tools
- llm.txt extraction folded into fetch/parse provider layer

### Phase 4: Advanced Auth and Runtime Bridges

- Gemini CLI bridge
- Claude Code bridge
- OAuth-backed provider credentials
- local runtime session management

These should come after storage and provider abstractions are stabilized.

## Execution Strategy Roadmap

### Milestone 1: Durable Retrieval Without Models

Goal:
Make search work well with zero model configured.

Deliverables:

- provider registry for current providers
- durable search cache in Convex
- durable evidence store
- ranking pipeline split from synthesis
- deterministic query rewrite and diversification improvements
- better zero-provider fallback messaging and seeded cache behavior

Files likely touched:

- `src/lib/search-providers.ts`
- `src/lib/agentic-search.ts`
- `src/lib/unified-search-orchestrator.ts`
- new `src/lib/search/*`
- new `convex/searchCache.ts`
- new `convex/evidenceStore.ts`

### Milestone 2: Role-Based Two-Model Execution

Goal:
Make two models materially better than one.

Execution pattern:

- Model A: planner + synthesis
- Model B: verifier + contradiction checker

Deliverables:

- execution policy object
- role-aware model assignment
- evidence-based verification
- citation audit output in response payload

### Milestone 3: Swarm/Parallel Agent Execution

Goal:
Support specialized workers rather than prompt fan-out.

Execution pattern:

- planner produces task graph
- retrievers gather evidence
- fetchers expand pages/docs
- synthesizer drafts answer
- citation auditor validates claims
- safety/failure guard decides whether to block, retry, or downgrade

Deliverables:

- task graph schema
- shared evidence store
- per-agent budget accounting
- partial-failure handling
- result arbitration

## Concrete Next Steps

These are the safest next implementation steps for this repo:

1. Extract the current provider code into a registry-backed `src/lib/search/` module without changing UI behavior.
2. Add Convex-backed durable fallback cache and evidence storage.
3. Refactor `agentic-search.ts` to consume the new retrieval abstraction while preserving web-only mode.
4. Add an execution policy layer so the orchestrator can choose `retrieval_only`, `single_model`, or `dual_model`.
5. Move sensitive provider credentials out of the active browser-only store path.
6. Add Google Search / Grounding as the first non-current provider integration.
7. Add Firecrawl crawl jobs and indexed-web retrieval as the first first-party corpus capability.

## Things To Avoid Right Now

To reduce churn while active work is in progress:

- do not replace the current search route contracts in one large change
- do not add more provider-specific branches directly inside `agentic-search.ts`
- do not expand localStorage-based secret handling to more provider types
- do not treat CLI session integrations as equivalent to API-key integrations
- do not build swarm logic before the evidence store and execution policy exist

## Recommended First Implementation PR

Scope this as a safe foundation PR:

- add `src/lib/search/` provider registry and shared types
- add `convex/searchCache.ts`
- add `convex/evidenceStore.ts`
- adapt current Tavily/Exa/Brave/Firecrawl implementations to the registry
- preserve current route request/response shapes
- keep current settings UI working

Success criteria:

- no visible regression in current search flow
- search still works without a model
- fallback cache survives process restart/deploy
- provider results are stored with provenance and evidence metadata

## Follow-On PR Order

1. provider registry + durable cache/evidence
2. execution policy + dual-model verifier path
3. unified secret storage migration
4. Google Search / Grounding integration
5. Firecrawl crawl/index pipeline
6. MCP tool adapter layer
7. MarkItDown and document parser providers
8. Bedrock search/tooling
9. CLI auth bridges

