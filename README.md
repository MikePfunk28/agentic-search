# Agentic Search

**Intelligent web search with real-time streaming, multi-source retrieval, and adversarial quality validation.**

Built with TanStack Start on Cloudflare Workers, Convex backend, and BYOK (Bring Your Own Key) support for any OpenAI-compatible or Anthropic model provider — including local models via Ollama and LM Studio.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+
- A search API key (Tavily, Exa, Brave, or Firecrawl)
- Optional: [Ollama](https://ollama.com/) or [LM Studio](https://lmstudio.ai/) for local AI models

### Install & Run

```bash
pnpm install
pnpm dev
```

Dev server starts at `http://localhost:3000`.

### Environment Variables

Create a `.dev.vars` file (read by Cloudflare Workers / miniflare in dev):

```env
TAVILY_API_KEY=your_tavily_key
EXA_SEARCH_API_KEY=your_exa_key
FIRECRAWL_API_KEY=your_firecrawl_key
BRAVE_SEARCH_API_KEY=your_brave_key
LMSTUDIO_API_KEY=your_lmstudio_key
```

These are server-side fallback keys. Users can also enter their own keys in the browser UI (Settings → Search APIs tab), which take priority over server keys.

For Convex, set these in `wrangler.toml` or your deployment environment:

```env
VITE_CONVEX_URL=your_convex_deployment_url
```

### Convex Backend

```bash
npx convex dev        # Start local Convex dev server
npx convex deploy     # Deploy to production
```

## How It Works

1. **User enters a query** in the chat interface
2. **Intent analysis** — AI model (if configured) or deterministic fallback classifies the query type (news, research, factual, comparison, etc.)
3. **Strategy planning** — determines which search providers to query, how many results to fetch, and quality thresholds
4. **Multi-source search** — queries Tavily, Exa, Firecrawl, and/or Brave in parallel
5. **ADD quality scoring** — Adversarial Differential Discrimination scores each result on relevance, freshness, diversity, and consistency
6. **Results display** — ranked by ADD quality score with full transparency into scoring
7. **Optional synthesis** — AI model summarizes and synthesizes results if configured

All steps stream to the browser via SSE (Server-Sent Events) so users see real-time progress.

## Features

### Search & Retrieval
- **Multi-source parallel search** across Tavily, Exa, Firecrawl, and Brave
- **ADD quality validation** — every result scored before display (relevance, freshness, diversity, consistency)
- **Adjustable quality threshold** slider — filter results from permissive (0.0) to strict (1.0)
- **Real-time SSE streaming** — progress steps, intermediate results, and final results streamed live
- **Deterministic fallback** — search works fully without any AI model configured; models enhance but aren't required

### AI Model Support
- **BYOK for any provider** — OpenAI, Anthropic, Google, DeepSeek, Moonshot, Kimi, OpenRouter, Azure OpenAI
- **Local model support** — Ollama (`localhost:11434`) and LM Studio (`localhost:1234`) with auto-detection
- **API keys for local providers** — both Ollama and LM Studio support optional API keys for authenticated setups
- **Multi-model parallel execution** — select multiple models to run simultaneously across different providers
- **Thinking model support** — handles models that output via `reasoning_content` instead of `content` (e.g., QwQ, DeepSeek-R1)
- **Fast timeout handling** — internal strategy calls use 15s timeouts and 300 max tokens to prevent long waits

### Settings UI (3 tabs)
- **Local Models** — auto-detect Ollama & LM Studio models, configure base URLs and optional API keys, toggle multiple models
- **Cloud / Custom** — add any OpenAI-compatible or Anthropic API endpoint with quick presets (OpenAI, Anthropic, DeepSeek, OpenRouter)
- **Search APIs** — enter Tavily, Exa, Firecrawl, and Brave API keys (stored in browser localStorage, sent encrypted per-request)

### Security
- **CSRF protection** — HttpOnly cookie + X-CSRF-Token header on all POST endpoints
- **Input sanitization** — all user inputs escaped and validated with Zod schemas
- **Keys stay local** — search API keys stored in browser localStorage, sent per-request, never persisted server-side
- **Server-side merging** — `.dev.vars` keys used as fallback when user doesn't provide their own

### Human-in-the-Loop
- **Real-time progress panel** — see each search step as it executes (analysis, planning, per-source search, reasoning)
- **Pause / resume / stop** — control search execution mid-flight
- **Quality transparency** — full ADD score breakdown visible for every result
- **Search history** — browse past searches, results, and quality scores

## Architecture

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | TanStack Start, TanStack Router, React, Tailwind CSS, Shadcn/ui |
| Backend | Convex (real-time database + serverless functions) |
| Hosting | Cloudflare Workers (via `@cloudflare/vite-plugin`) |
| Search Providers | Tavily, Exa, Firecrawl, Brave |
| AI Models | Any OpenAI-compatible API, Anthropic, Ollama, LM Studio |
| Validation | Zod schemas throughout |
| Testing | Vitest |
| Linting | Biome |
| Observability | Sentry |

### Project Structure

```
src/
├── components/          # React components
│   ├── AgenticChat.tsx          # Main chat interface
│   ├── EnhancedModelSelector.tsx # Multi-model selection with auto-detect
│   ├── SettingsModal.tsx        # Unified settings (local, cloud, search keys)
│   ├── ADDQualityPanel.tsx      # Quality score visualization
│   ├── SearchProgressPanel.tsx  # Real-time search progress
│   └── ResultsList.tsx          # Search results display
├── lib/                 # Core logic
│   ├── agentic-search.ts       # Search engine (intent, strategy, execution, scoring)
│   ├── unified-search-orchestrator.ts # Orchestrates the full search pipeline
│   ├── search-providers.ts     # Tavily, Exa, Firecrawl, Brave integrations
│   ├── add-discriminator.ts    # Adversarial Differential Discrimination scoring
│   ├── model-store.ts          # Unified model config (single source of truth)
│   ├── model-config.ts         # Provider types, Zod schemas, BYOK support
│   ├── csrf-protection.ts      # CSRF token validation
│   └── ai/model-detection.ts   # Auto-detect Ollama & LM Studio models
├── hooks/
│   └── useSearchProgress.ts    # SSE streaming hook (fetch + ReadableStream)
├── routes/
│   ├── index.tsx               # Landing page
│   ├── search.tsx              # Search page
│   ├── settings.tsx            # Settings page
│   ├── history.tsx             # Search history
│   └── api/
│       ├── search/stream.ts    # POST → SSE streaming search endpoint
│       ├── csrf-token.ts       # CSRF token endpoint
│       └── detect-models.ts    # Server-side model detection proxy
└── convex/              # Convex backend
    ├── schema.ts               # Database schema
    ├── search.ts               # Search-related mutations/queries
    ├── searchHistory.ts        # History storage
    ├── secureApiKeys.ts        # Encrypted key storage
    └── usageTracking.ts        # Usage metrics
```

### API Flow

```
Browser                          Cloudflare Worker
  │                                    │
  ├─ POST /api/search/stream ─────────►│
  │   body: { query, modelConfig,      │
  │           searchApiKeys }          │
  │                                    ├─ mergeSearchApiKeys(client, .dev.vars)
  │                                    ├─ analyzeIntent(query, model?)
  │                                    ├─ planSearchStrategy(intent, model?)
  │                                    ├─ executeMultiSourceSearch(strategy)
  │◄─ SSE: step updates ──────────────┤   ├─ tavily (parallel)
  │◄─ SSE: step updates ──────────────┤   ├─ exa (parallel)
  │                                    │   └─ ... other providers
  │                                    ├─ ADD quality scoring
  │◄─ SSE: results + addMetrics ──────┤
  │                                    ├─ synthesizeResults(model?) [optional]
  │◄─ SSE: synthesis ─────────────────┤
  │◄─ SSE: complete ──────────────────┤
```

## Scripts

```bash
pnpm dev              # Start dev server (port 3000)
pnpm build            # Production build
pnpm test             # Run tests (Vitest)
pnpm lint             # Lint (Biome)
pnpm format           # Format (Biome)
pnpm check            # Lint + format check (Biome)
pnpm deploy           # Build + deploy to Cloudflare
pnpm convex:dev       # Start Convex dev server
pnpm convex:deploy    # Deploy Convex to production
```

## Documentation

- [System Architecture](./docs/SYSTEM_ARCHITECTURE.md)
- [Project Plan](./docs/plan.md)
- [Agentic Search Design](./docs/AGENTIC_SEARCH.md)
- [Security Analysis](./docs/SECURITY_ANALYSIS_SUMMARY.md)
- [CSRF Protection](./docs/CSRF-PROTECTION.md)
- [CHANGELOG](./CHANGELOG.md)

## License

Private.
