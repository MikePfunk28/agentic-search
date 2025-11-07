# Agentic Search Platform - Project Plan

## 🎯 Project Overview
Build an intelligent agentic search platform with multi-model support (local + cloud), real-time chat interface, and distributed memory management, deployed to Cloudflare at mikepfunk.com.

---

## 🏗️ Infrastructure Setup

### Phase 1: Deployment & Configuration (Priority: CRITICAL)
- [x] Fix Cloudflare build error (.output/server directory missing)
- [ ] Create wrangler.toml for Cloudflare Pages deployment
- [ ] Configure build output for TanStack Start + Cloudflare
- [ ] Setup environment variables in Cloudflare dashboard
- [ ] Test successful deployment to mikepfunk.com
- [ ] Configure custom domain DNS (mikepfunk.com → Cloudflare Pages)

### Phase 2: Backend Services
- [ ] **Convex Backend**
  - [ ] Run `npx convex dev` and initialize project
  - [ ] Create schema for model configs, chat history, search results
  - [ ] Setup real-time subscriptions for chat
  - [ ] Configure Convex authentication (WorkOS integration)

- [ ] **Sentry Integration** (mikepfunk.sentry.io)
  - [x] Sentry already installed (@sentry/react, @sentry/tanstackstart-react)
  - [ ] Configure DSN in Cloudflare environment variables
  - [ ] Add performance monitoring for API routes
  - [ ] Setup error boundaries for React components
  - [ ] Add breadcrumbs for user actions

- [ ] **CodeRabbit CI/CD**
  - [ ] Add .coderabbit.yaml configuration
  - [ ] Setup GitHub Actions workflow
  - [ ] Configure PR review automation
  - [ ] Add code quality checks

---

## 🤖 Core Features

### Phase 3: Model Selection & Integration
- [x] Model configuration UI (Settings page)
- [x] Support for 6 providers (OpenAI, Anthropic, Google, Ollama, LM Studio, Azure)
- [x] Web Crypto API encryption for API keys
- [x] CSRF protection for API routes
- [ ] **Convex Schema for Models**
  - [ ] modelConfigurations table
  - [ ] mcpServers table
  - [ ] User preferences table
- [ ] **Local Model Integration (Ollama)**
  - [ ] Auto-detect Ollama running on localhost:11434
  - [ ] List available Ollama models via API
  - [ ] Test connection without API key
  - [ ] Fallback to cloud models if local unavailable
- [ ] **MCP Server Integration**
  - [ ] Connect model selection to MCP servers
  - [ ] Create MCP configuration UI
  - [ ] Test with claude-flow MCP server
  - [ ] Support custom MCP servers

### Phase 4: Agentic Search with Chat Interface
- [ ] **Chat UI Component**
  - [ ] Build ChatInterface.tsx with message history
  - [ ] Add SearchBar integration
  - [ ] Stream responses from AI models
  - [ ] Display search results inline
  - [ ] Markdown rendering with syntax highlighting

- [ ] **Search Backend**
  - [ ] Create /api/search endpoint
  - [ ] Integrate with selected AI model (local or cloud)
  - [ ] Parse user intent from chat message
  - [ ] Execute multi-step agentic search
  - [ ] Return structured results (sources, summaries, links)

- [ ] **Agentic Search Logic**
  - [ ] Break down complex queries into sub-queries
  - [ ] Use Claude Flow swarm for parallel search
  - [ ] Aggregate results from multiple sources
  - [ ] Rank and deduplicate results
  - [ ] Provide source attribution

### Phase 5: Memory Management (Short-term + Long-term)
- [ ] **Short-term Memory (Convex)**
  - [ ] Store chat history per session (Convex real-time)
  - [ ] Cache recent search results (5-minute TTL)
  - [ ] User context and preferences
  - [ ] Active model selection state

- [ ] **Long-term Memory (S3 + DynamoDB)**
  - [ ] S3: Store large search result datasets
  - [ ] DynamoDB: Index searchable conversation history
  - [ ] Archive old chat sessions (> 30 days)
  - [ ] Full-text search across historical data
  - [ ] User analytics and usage patterns

- [ ] **Memory Retrieval**
  - [ ] Semantic search across conversation history
  - [ ] Context injection for follow-up queries
  - [ ] Personalized recommendations based on history
  - [ ] Privacy controls (delete history, export data)

---

## 🔧 Technical Integrations

### Phase 6: Claude Flow MCP Integration
- [x] Claude Flow initialized with mesh swarm
- [x] ReasoningBank memory enabled
- [ ] **MCP Tools for Search**
  - [ ] Use mcp__claude-flow__task_orchestrate for complex searches
  - [ ] Spawn researcher agents for deep dives
  - [ ] Use memory system for context persistence
  - [ ] Integrate with local models (Ollama via MCP)

- [ ] **Custom MCP Servers**
  - [ ] Create search-specific MCP tools
  - [ ] Web scraping MCP server
  - [ ] Document parsing MCP server
  - [ ] Knowledge graph MCP server

### Phase 7: AI SDK Provider Adapter
- [ ] Create unified provider interface
- [ ] Map ModelConfigManager → AI SDK providers
- [ ] Support streaming for all providers
- [ ] Handle provider-specific features (tools, vision, etc.)
- [ ] Automatic fallback on provider errors

---

## 🧪 Testing & Quality Assurance

### Phase 8: Comprehensive Testing
- [x] 74 tests passing for model selection
- [x] 29 tests passing for CSRF protection
- [ ] **E2E Tests**
  - [ ] Test Ollama local model search
  - [ ] Test Anthropic Claude search
  - [ ] Test OpenAI GPT search
  - [ ] Test chat interface with streaming
  - [ ] Test memory persistence

- [ ] **Integration Tests**
  - [ ] Convex real-time sync
  - [ ] S3/DynamoDB operations
  - [ ] MCP server connectivity
  - [ ] Cloudflare deployment

- [ ] **Performance Tests**
  - [ ] Search latency benchmarks
  - [ ] Memory usage profiling
  - [ ] Concurrent user load testing
  - [ ] Bundle size optimization

---

## 🚀 Deployment Pipeline

### Phase 9: CI/CD with Cloudflare
- [ ] **GitHub Actions Workflow**
  - [ ] Build and test on PR
  - [ ] Deploy preview for each PR (Cloudflare Pages)
  - [ ] Automatic deployment to production (main branch)
  - [ ] CodeRabbit automated reviews

- [ ] **Environment Management**
  - [ ] Development (local with Ollama)
  - [ ] Staging (Cloudflare preview)
  - [ ] Production (mikepfunk.com)
  - [ ] Secrets management (Cloudflare Workers KV)

---

## 📊 Monitoring & Analytics

### Phase 10: Observability
- [ ] **Sentry Error Tracking**
  - [ ] Client-side error capture
  - [ ] Server-side error capture
  - [ ] Performance monitoring (Core Web Vitals)
  - [ ] User session replay

- [ ] **Search Analytics**
  - [ ] Query success rates
  - [ ] Model performance comparison
  - [ ] User engagement metrics
  - [ ] Cost tracking per provider

---

## 🐛 Known Issues to Fix

### Critical Bugs
- [x] Cloudflare build failing (.output/server directory)
- [x] Convex MCP Node.js API errors (functions split into Node.js runtime)
- [ ] ModelConfigManager not connected to AI SDK
- [ ] No Convex schema for user data
- [ ] Missing wrangler.toml configuration

### Medium Priority
- [ ] API keys in plain localStorage (need encryption)
- [ ] No CSRF protection on some routes
- [ ] Large bundle size (1.2MB main.js)
- [ ] Missing TypeScript strict mode compliance

### Low Priority
- [ ] Improve error messages for failed searches
- [ ] Add loading skeletons for chat messages
- [ ] Optimize image assets
- [ ] Add PWA support

---

## 📅 Timeline Estimate

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Infrastructure | 1-2 days | 🟡 In Progress |
| Phase 2: Backend Services | 2-3 days | ⭕ Not Started |
| Phase 3: Model Integration | 2-3 days | 🟢 70% Complete |
| Phase 4: Chat & Search | 3-4 days | ⭕ Not Started |
| Phase 5: Memory System | 3-4 days | ⭕ Not Started |
| Phase 6: MCP Integration | 2-3 days | 🟡 30% Complete |
| Phase 7: Provider Adapter | 1-2 days | ⭕ Not Started |
| Phase 8: Testing | 2-3 days | 🟢 40% Complete |
| Phase 9: CI/CD | 1-2 days | ⭕ Not Started |
| Phase 10: Monitoring | 1-2 days | 🟡 20% Complete |

**Total Estimated Time:** 18-28 days

---

## 🎯 Success Criteria

- ✅ Successfully deployed to mikepfunk.com on Cloudflare
- ✅ Local Ollama models working without API keys
- ✅ Cloud models (Anthropic, OpenAI) working with encrypted keys
- ✅ Chat interface with streaming responses
- ✅ Agentic search returning relevant results
- ✅ Short-term memory (Convex) and long-term memory (S3/DynamoDB) operational
- ✅ MCP server integration functional
- ✅ All tests passing (95%+ coverage)
- ✅ Sentry tracking errors and performance
- ✅ CodeRabbit reviewing PRs automatically

---

## 📝 Next Immediate Actions

1. **Fix Cloudflare build** (create .output/server directory in build script)
2. **Create wrangler.toml** for Cloudflare configuration
3. **Initialize Convex** with `npx convex dev`
4. **Create Convex schemas** for models, chat, search results
5. **Build chat interface** component with streaming support
6. **Test with Ollama** local model first (no API key needed)
7. **Deploy to Cloudflare** and test at mikepfunk.com

---

## 🔗 Resources

- TanStack Start Docs: https://tanstack.com/start/latest
- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Convex Docs: https://docs.convex.dev/quickstart/tanstack-start
- Ollama API: https://github.com/ollama/ollama/blob/main/docs/api.md
- Claude Flow: https://github.com/ruvnet/claude-flow
- Sentry Integration: https://mikepfunk.sentry.io
