CodeRabbit has detected other AI code review bot(s) in this pull request and will avoid duplicating their findings in the review comments. This may lead to a less comprehensive review.

Walkthrough
Removes a GitHub Projects v2 automation PowerShell script and workflow; adds a new PowerShell script to import unchecked tasks from a Markdown plan into GitHub Issues. Introduces Convex OCR processing, MCP integrations (client + Convex actions), expanded Convex schema, AI provider adapters, Cloudflare Pages config and build scripts, many formatting changes across source files, and removal of Sentry demo/integration code.

Changes
Cohort / File(s)	Summary
GitHub automation replacement
.github/scripts/github_actions.ps1, .github/scripts/import-plan-to-issues.ps1, .github/workflows/setup-github-projects_Version3.yml	Deleted legacy GitHub Projects v2 PowerShell script; added import-plan-to-issues.ps1 to parse docs/plan.md, deduplicate, and create issues (supports dry-run); workflow simplified to manual + plan-file push triggers and calls the new import script.
Convex OCR processing
convex/lib/ocr/processDocument.ts, convex/ocr.ts	New OCR pipeline: PDF download + pdf-parse extraction, provider-driven AI compression (dynamic imports for multiple providers), token counting, confidence/compression metrics, and Convex mutations/queries to store results and errors; exports processDocument and OCRResult.
MCP integration (Convex + Node)
convex/mcp.ts, convex/mcp.node.ts, src/lib/mcp/client.ts	New MCP client and Convex actions: server connect/disconnect, list tools/resources, call tools/read resources, extraction endpoints, and internal mutations/queries for connection/extraction state; adds MCPClientManager and related types.
Convex config & schema expansion
convex.config.ts, convex/schema.ts	Adds Convex app definition and numerous schema tables (ocrResults, ocrErrors, mcpConnections, mcpExtractions, modelConfigurations, mcpServers, chatMessages, searchResults, userPreferences) with indices and fields.
AI provider & model management
src/lib/ai/providers.ts, src/lib/model-config.ts, src/lib/model-storage.ts	New provider adapter and utilities: ModelProvider/ModelConfig types, provider detection (local/cloud), model listing, provider metadata functions, expanded provider defaults, and exported modelConfig manager.
Cloudflare / build config
package.json, vite.config.ts, wrangler.json, wrangler.toml, .gitignore, convex.config.ts	Adds scripts (convex:dev, convex:deploy, build:cloudflare), AI & pdf-parse deps, Cloudflare Vite plugin, Wrangler config for Pages, and tighter .gitignore entries (no longer ignore all *.md).
Sentry removal & CSRF changes
src/integrations/sentry/error.js, src/integrations/sentry/sentry.js, src/middleware/csrf.ts, src/routes/demo/sentry.testing.tsx	Removed Sentry demo and init files; added/standardized CSRF utilities and middleware formatting; removed the /demo/sentry/testing route and references.
Route updates & CSRF-protected demo APIs
src/routeTree.gen.ts, src/routes/** (many)	Removed DemoSentryTesting route; updated many routes for formatting, added CSRF protection to demo MCP todos API, and integrated Convex/WorkOS/TanStack devtools providers in root.
Formatting and minor API/background changes
src/components/*, src/lib/*, src/hooks/*, src/integrations/*, src/routes/demo/*, src/utils/*, src/orpc/*	Broad stylistic standardization (quotes, semicolons, imports, indentation). Mostly non-functional changes; a few signature/type-only import adjustments and small schema/shape refinements (e.g., Firecrawl metadata typing).
MCP tooling & transport
src/lib/mcp/client.ts	New stdio-based MCP client manager, transports, RPC calls, and singleton accessor getMCPManager.
Tests & fixtures
tests/fixtures/mock-responses.ts, tests/utils/test-helpers.ts	Updated a mock search result title/snippet; made mock LLM tool invocation detection case-insensitive.
Docs & plans
README.md, docs/PROJECT_PLAN.md, docs/plan.md	Added a comprehensive README and project plan files describing architecture, setup, roadmap, and immediate actions.


sequenceDiagram
    participant User
    participant PS as PowerShell Script
    participant gh as gh CLI
    participant GitHub

    User->>PS: run import-plan-to-issues.ps1 (PlanFile)
    PS->>PS: read & parse docs/plan.md (unchecked tasks)
    PS->>gh: list existing issues
    gh->>GitHub: GET /issues
    GitHub-->>gh: issues list
    gh-->>PS: issues data
    PS->>PS: deduplicate tasks
    PS->>gh: create issues for new tasks
    gh->>GitHub: POST /issues
    GitHub-->>gh: created issues
    gh-->>PS: confirm
    PS-->>User: report created/failed counts


sequenceDiagram
    participant Client
    participant Convex
    participant OCR as OCR Module
    participant PDF as pdf-parse
    participant AI as AI Provider
    participant DB as Convex DB

    Client->>Convex: action processDocument(url, model)
    Convex->>OCR: run processDocument
    OCR->>OCR: download PDF
    OCR->>PDF: extract text & metadata
    PDF-->>OCR: raw text, pages, metadata
    OCR->>AI: request compression (provider/model)
    AI-->>OCR: compressed markdown
    OCR->>OCR: compute tokens, savings, confidence
    OCR->>Convex: storeResult mutation
    Convex->>DB: write ocrResults
    DB-->>Convex: ack
    Convex-->>Client: return OCRResult


sequenceDiagram
    participant App
    participant Manager as MCPClientManager
    participant Transport
    participant Server as MCP Server

    App->>Manager: connect(MCPServerConfig)
    Manager->>Transport: spawn StdioClientTransport (command,args)
    Transport->>Server: start process (stdio)
    Server-->>Transport: ready
    Manager-->>App: connection stored
    App->>Manager: listTools(serverName)
    Manager->>Transport: rpc tools/list
    Transport->>Server: RPC
    Server-->>Transport: tools[]
    Transport-->>Manager: tools
    Manager-->>App: return MCPTool[]
    App->>Manager: callTool(serverName, toolName, args)
    Manager->>Transport: rpc tools/call
    Transport->>Server: RPC
    Server-->>Transport: result
    Transport-->>Manager: result
    Manager-->>App: tool result


Estimated code review effort
🎯 4 (Complex) | ⏱️ ~70 minutes

Areas to focus review on:

convex/lib/ocr/processDocument.ts and convex/ocr.ts — token accounting, provider selection, error persistence.
src/lib/mcp/client.ts and convex/mcp*.ts — stdio transport lifecycle, RPC error handling, concurrency and cleanup.
convex/schema.ts — new tables/indices vs. queries used elsewhere.
src/lib/ai/providers.ts and src/lib/model-config.ts — provider detection, network checks, and default config consistency.
.github/scripts/import-plan-to-issues.ps1 — markdown parsing, deduplication, gh CLI interactions, and dry-run behavior.
Possibly related PRs
Test #1 — appears to add the original GitHub Projects automation (github_actions.ps1) and related workflow; this PR removes that automation and replaces it with the import-plan-to-issues flow.
Poem
🐇 I nibble plans in markdown light,

I hop through PDFs at night,
Compress and save each page and line,
MCP servers hum in kind,
Hooray — new issues, schema, and shine!

Pre-merge checks and finishing touches
❌ Failed checks (1 warning, 1 inconclusive)
Check name	Status	Explanation	Resolution
Docstring Coverage	⚠️ Warning	Docstring coverage is 78.13% which is insufficient. The required threshold is 80.00%.	You can run @coderabbitai generate docstrings to improve docstring coverage.
Title check	❓ Inconclusive	The pull request title 'Test' is vague and non-descriptive. It does not convey any meaningful information about the actual changes in the changeset.	Replace with a descriptive title that summarizes the main change, such as 'Add OCR processing, MCP integration, and plan documentation' or a more specific focus.
✅ Passed checks (1 passed)
Check name	Status	Explanation
Description Check	✅ Passed	Check skipped - CodeRabbit’s high-level summary is enabled.
✨ Finishing touches
🧪 Generate unit tests (beta)

.github/scripts/import-plan-to-issues.ps1 lines 86-137: the deduplication fails
when GitHub returns a single issue because ($existingIssuesJson |
ConvertFrom-Json).title becomes a scalar string and -contains against a scalar
never matches; update the assignment so titles are always an array (wrap the
result in an array constructor or coerce to an array) before using -contains,
e.g., ensure $existingIssues is set to an array of titles even when only one
title is returned.
-  if ($existingIssuesJson) {
-    $existingIssues = ($existingIssuesJson | ConvertFrom-Json).title
-  }
+  if ($existingIssuesJson) {
+    $existingIssues = @(
+      $existingIssuesJson |
+        ConvertFrom-Json |
+        ForEach-Object { $_.title }
+    )
+  }

.github/scripts/import-plan-to-issues.ps1 around lines 131 to 176: the script
always passes a label (often "task") to gh issue create which fails when that
label doesn't exist; modify the code to query the repo's labels (e.g., gh api or
gh label list) or attempt a lightweight check for the specific label and only
include the --label arg when the label exists, otherwise omit --label (or
substitute a guaranteed label like "triage"); build the gh args dynamically
(title, optional --label, --body) before calling gh issue create and handle the
different exit cases as before.
-    $tasksToCreate += @{
-      Title = $taskTitle
-      Label = $currentSection
-    }
+    $tasksToCreate += @{
+      Title = $taskTitle
+      Label = if ($currentSection -eq "task") { $null } else { $currentSection }
+    }
...
-  $label = $task.Label
+  $label = $task.Label
...
-    $issueUrl = gh issue create --repo $Repo --title $title --label $label --body "Created from $PlanFile" 2>$null
+    $args = @("--repo", $Repo, "--title", $title, "--body", "Created from $PlanFile")
+    if ($label) {
+      $args += @("--label", $label)
+    }
+    $issueUrl = gh issue create @args 2>$null

In convex/lib/ocr/processDocument.ts around lines 11-14 (and also apply similar
change at 121-123), the dynamic import returns the module namespace so later
calling pdfParse() causes TypeError; change getPdfParse to destructure and
return the module's default export (the parser function) instead of the whole
namespace, and remove the unsafe cast where pdfParse is invoked so the code
calls the returned function directly.

-const getPdfParse = async () => {
-  const pdfParse = await import('pdf-parse')
-  return pdfParse
-}
+const getPdfParse = async () => {
+  const { default: pdfParse } = await import('pdf-parse')
+  return pdfParse
+}
-      const pdfData = await (pdfParse as any)(buffer)
+      const pdfData = await pdfParse(buffer)

In convex/lib/ocr/processDocument.ts around lines 35 to 68, the code checks for
config.apiKey but never passes it into the SDK factories and also omits the
"azure" provider; update each provider branch to inject the provided credentials
into the client creation (e.g., pass apiKey and any provider-specific
baseURL/endpoint from config into createOpenAI/openai/anthropic/google), ensure
the error checks remain (throw when apiKey is missing), and add an "azure" case
that constructs the OpenAI-compatible client using the Azure endpoint and apiKey
from config (handling any Azure-specific parameter names like
deploymentId/modelId) so requests authenticate correctly.

In convex/lib/ocr/processDocument.ts around lines 35 to 68, the code checks for
config.apiKey but never passes it into the SDK factories and also omits the
"azure" provider; update each provider branch to inject the provided credentials
into the client creation (e.g., pass apiKey and any provider-specific
baseURL/endpoint from config into createOpenAI/openai/anthropic/google), ensure
the error checks remain (throw when apiKey is missing), and add an "azure" case
that constructs the OpenAI-compatible client using the Azure endpoint and apiKey
from config (handling any Azure-specific parameter names like
deploymentId/modelId) so requests authenticate correctly.

-  const { anthropic } = await import('@ai-sdk/anthropic')
-  const { openai, createOpenAI } = await import('@ai-sdk/openai')
-  const { google } = await import('@ai-sdk/google')
+  const { createAnthropic } = await import('@ai-sdk/anthropic')
+  const { createOpenAI } = await import('@ai-sdk/openai')
+  const { createGoogleGenerativeAI } = await import('@ai-sdk/google')
@@
     case 'openai':
       if (!config.apiKey) throw new Error('OpenAI API key required')
-      return openai(config.modelId)
+      const openai = createOpenAI({
+        apiKey: config.apiKey,
+        baseURL: config.baseURL
+      })
+      return openai(config.modelId)
@@
     case 'anthropic':
       if (!config.apiKey) throw new Error('Anthropic API key required')
-      return anthropic(config.modelId)
+      const anthropic = createAnthropic({
+        apiKey: config.apiKey
+      })
+      return anthropic(config.modelId)
@@
     case 'google':
       if (!config.apiKey) throw new Error('Google API key required')
-      return google(config.modelId)
+      const google = createGoogleGenerativeAI({
+        apiKey: config.apiKey
+      })
+      return google(config.modelId)
+
+    case 'azure':
+      if (!config.apiKey) throw new Error('Azure API key required')
+      if (!config.baseURL) throw new Error('Azure base URL required')
+      const azure = createOpenAI({
+        apiKey: config.apiKey,
+        baseURL: config.baseURL,
+        defaultHeaders: {
+          'api-key': config.apiKey
+        }
+      })
+      return azure(config.modelId)


Convex "use node" directive placement requirements

💡 Result:

Short answer — requirements and best practices for the "use node" directive in Convex:

The directive must appear at the very top of the file (e.g., "use node";). [1][2]
Files with "use node" are bundled for and run in the Node.js runtime and should be used only for actions (Node runtime is restricted to actions). [1][2]
Files that have "use node" must not define Convex queries or mutations (those run in the isolate/default runtime). [1][2]
Files without "use node" must not import files that contain "use node". [1][1]
Files in the legacy /convex/actions folder are expected to include "use node"; Convex may require it for files in that directory during migrations. To avoid surprises, put node-only code in its own file with "use node". [1][3]
Node.js actions have smaller argument-size limits (5 MiB) and may require configuring Node version in convex.json. [1]


---

🏁 Script executed:

```shell
#!/bin/bash
# Display the first 10 lines of convex/mcp.node.ts to see full context
fd 'mcp\.node\.ts' --type f --exec head -10 {}

Move "use node" directive to line 1, before file comments.

The "use node" directive must appear at the very top of the file. Currently it appears on line 7 after the JSDoc comment block. Rearrange to place the directive as the first line, then the comment block below.

In convex/mcp.node.ts around line 7, the "use node" directive is placed after
the JSDoc comment block; move the directive to the very top of the file (line 1)
so it appears before any comments or code, then place the existing comment block
immediately after it to ensure the directive is the first line in the file.

Configure sentry

Configure Sentry
Enable Sentry logs by adding enableLogs: true to your Sentry.init() configuration.

import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
  dsn: "https://702af28ad38faebd2a7784669ec466af@o4510314186014720.ingest.us.sentry.io/4510314188636160",
  integrations: [
    // send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
  // Enable logs to be sent to Sentry
  enableLogs: true,
});