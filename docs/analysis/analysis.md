Verify each finding against the current code and only fix it if needed.

In `@src/lib/agentic-search.ts` around lines 385 - 404, The duplicate-collapsing
loop in agentic-search.ts uses calculateJaccardSimilarity to pick a survivor but
currently discards the removed item's metrics; update the loop so that when you
determine keepIdx and removeIdx you first merge metrics from unique[removeIdx]
into unique[keepIdx] (at minimum add citationCount and any
crossCitedCount/related metrics, and consider aggregating other numeric fields
like rawScore appropriately) before adding removeIdx to toRemove; ensure the
merged object remains in unique[keepIdx] so filtered (unique.filter(...))
returns the survivor with summed citation evidence.

Verify each finding against the current code and only fix it if needed.

In `@src/routes/api/fine-tune/openai.ts` around lines 100 - 114, The uploaded
training file from uploadTrainingFile is left orphaned if createFineTuneJob
throws; wrap the call to createFineTuneJob in a try/catch and on any error call
the cleanup function (e.g., deleteTrainingFile or deleteOpenAIFile) with
trainingFile.id before rethrowing or returning the error; ensure this logic is
added around the block that calls createFineTuneJob so that trainingFile is
deleted on failure while leaving successful flows unchanged.

Verify each finding against the current code and only fix it if needed.

In `@src/routes/api/fine-tune/openai.ts` around lines 126 - 139, The catch block
currently treats all errors (including Zod validation failures from
cancelRequestSchema.parse() and launchRequestSchema.parse()) as 500; update the
handler to detect Zod validation errors (check error instanceof ZodError from
zod) and return a 400 Response containing the validation details (e.g.,
error.errors or error.message) and Content-Type JSON, otherwise keep the
existing 500 error response for non-Zod exceptions; refer to the parse calls on
cancelRequestSchema.parse and launchRequestSchema.parse and the existing catch
block to locate where to add the instanceof ZodError branching.

Verify each finding against the current code and only fix it if needed.

In `@src/lib/ai/providers.ts` around lines 9 - 12, The current export uses a
type-only re-export for the enum ModelProvider which removes the enum at
runtime; change the export from a type-only export to a regular value export so
the ModelProvider enum from ../model-config is preserved in emitted JS (i.e.,
replace the `export type { ModelProvider }` re-export with a normal `export {
ModelProvider }` re-export to retain runtime access and maintain the
backward-compatibility intent).

Don't write API keys straight to localStorage.

setModelStore() serializes provider apiKey fields and search-provider keys directly into localStorage. That's readable by any injected script and regresses the secure-storage pattern still present in src/lib/model-storage.ts:20-76.

Also applies to: 38-51, 91-99

#!/bin/bash
set -euo pipefail

printf '\n# URL validation call sites\n'
rg -n -C2 'validateServerFetchUrl' .

printf '\n# Provider client construction using config.baseUrl\n'
rg -n -C2 'create(OpenAI|Anthropic|GoogleGenerativeAI)\(|baseURL:\s*config\.baseUrl' .

printf '\n# ModelConfig/baseUrl sources\n'
rg -n -C2 '\bbaseUrl\b' .
Repository: MikePfunk28/agentic-search

Length of output: 50383

🏁 Script executed:

#!/bin/bash
# Find all calls to createModelInstance() to see if validation happens before/after
rg -n 'createModelInstance' --type ts -B3 -A3

# Check if there's a wrapper or validation before model usage
rg -n 'generateText|message|completion|response' src/lib/parallel-model-orchestrator.ts | head -20
Repository: MikePfunk28/agentic-search

Length of output: 2162

🏁 Script executed:

#!/bin/bash
# Look at the executeModel function around line 331 to see if there's validation
sed -n '315,360p' src/lib/parallel-model-orchestrator.ts

# Also check if generateText is wrapped or validated
rg -n 'executeModel' src/lib/parallel-model-orchestrator.ts -A10 | head -40
Repository: MikePfunk28/agentic-search

Length of output: 2376

🏁 Script executed:

#!/bin/bash
# Check the public entry points that call executeModel - look for orchestrateParallel and chainModels
sed -n '160,250p' src/lib/parallel-model-orchestrator.ts

# Check if there's any validation before these public methods are called
rg -n 'orchestrateParallel|chainModels' src/lib/parallel-model-orchestrator.ts -B5
Repository: MikePfunk28/agentic-search

Length of output: 2771

🏁 Script executed:

#!/bin/bash
# Find who calls runParallel, chainModels, and other public methods
rg -n 'runParallel|chainModels' . --type ts | grep -v test | head -20

# Check if there's a validation wrapper around these orchestrator calls
rg -n 'ParallelModelOrchestrator\|new ParallelModelOrchestrator' . --type ts -A5 | head -40
Repository: MikePfunk28/agentic-search

Length of output: 266

🏁 Script executed:

#!/bin/bash
# Check the unified-search-orchestrator context around line 192
sed -n '180,210p' src/lib/unified-search-orchestrator.ts

# Also check how parallelConfigs is built
sed -n '150,195p' src/lib/unified-search-orchestrator.ts | grep -A30 'parallelConfigs'
Repository: MikePfunk28/agentic-search

Length of output: 1965

🏁 Script executed:

#!/bin/bash
# Check if parallelModelConfigs comes from user input or validated sources
rg -n 'parallelModelConfigs' src/lib/unified-search-orchestrator.ts -B10 | head -60

# Also verify the entry point to unified-search-orchestrator
rg -n 'executeSearch|UnifiedSearchOrchestrator' src/routes/api/search.ts -A5 | head -40
Repository: MikePfunk28/agentic-search

Length of output: 1463

🏁 Script executed:

#!/bin/bash
# Check if search route or ModelConfig validates baseUrl before calling orchestrator
sed -n '1,100p' src/routes/api/search.ts

# Check if ModelConfig has validation
rg -n 'class ModelConfig|interface ModelConfig|export.*ModelConfig' src/lib/model-config.ts -A10 | head -30
Repository: MikePfunk28/agentic-search

Length of output: 5944

🏁 Script executed:

#!/bin/bash
# Check buildModelConfigFromClient to see if it validates baseUrl
sed -n '52,100p' src/lib/model-config.ts

# Confirm cloud providers skip health check
sed -n '83,95p' src/lib/parallel-model-orchestrator.ts
Repository: MikePfunk28/agentic-search

Length of output: 1984

🏁 Script executed:

#!/bin/bash
# Final confirmation: trace the full path from client input to SDK instantiation
echo "=== Path 1: Client Input ==="
sed -n '44,75p' src/routes/api/search.ts | grep -A10 'clientModelConfigs'

echo -e "\n=== Path 2: buildModelConfigFromClient (no validation) ==="
sed -n '82,88p' src/lib/model-config.ts

echo -e "\n=== Path 3: orchestrateParallel/executeModel ==="
sed -n '323,335p' src/lib/parallel-model-orchestrator.ts

echo -e "\n=== Path 4: createModelInstance passes raw baseUrl to SDKs ==="
sed -n '121,155p' src/lib/parallel-model-orchestrator.ts
Repository: MikePfunk28/agentic-search

Length of output: 2404

Add SSRF validation before SDK client instantiation in createModelInstance(), not just in the health check.

The validateServerFetchUrl() calls at lines 99 and 109 only protect preflight health checks. The actual inference path bypasses this entirely:

Cloud providers (lines 85–86) skip the health check block entirely and proceed to createModelInstance().
buildModelConfigFromClient() (line 82) passes user-supplied baseUrl directly without validation.
createModelInstance() (lines 122–155) passes unvalidated baseURL to all SDK constructors (createOpenAI, createAnthropic, createGoogleGenerativeAI, etc.).
Result: An attacker can inject an unsafe internal URL via the client and reach it during model inference, even if the health check would have rejected it.

Fix: Call validateServerFetchUrl(config.baseUrl) in createModelInstance() before instantiating any SDK provider, or validate in buildModelConfigFromClient() at the entry point.

🤖 Prompt for AI Agents
Verify each finding against the current code and only fix it if needed.

In `@src/lib/parallel-model-orchestrator.ts` around lines 83 - 115, The health
check currently calls validateServerFetchUrl() but createModelInstance() (and
buildModelConfigFromClient()) uses unvalidated config.baseUrl when instantiating
SDKs, allowing SSRF during inference; to fix, invoke
validateServerFetchUrl(config.baseUrl) at the start of createModelInstance() (or
add validation in buildModelConfigFromClient()) and reject or throw when
validation fails before any SDK constructors (e.g., createOpenAI,
createAnthropic, createGoogleGenerativeAI, etc.) are called so no unvalidated
URL is ever passed to provider clients.

Verify each finding against the current code and only fix it if needed.

In `@src/lib/url-validation.ts` around lines 75 - 97, isPrivateIPv4 currently
doesn't treat the entire loopback 127.0.0.0/8 as private, allowing addresses
like 127.0.0.2 to pass; update isPrivateIPv4 to mark the whole 127.*.*.* range
as private by adding a check (e.g., if a === 127) similar to the other CIDR
checks so any hostname with first octet 127 is rejected (this complements
LOCAL_HOSTS which only special-cases 127.0.0.1).

Verify each finding against the current code and only fix it if needed.

In `@src/routes/api/detect-models.ts` around lines 16 - 45, The POST handler in
detect-models.ts currently accepts arbitrary baseUrl and proxies a server-side
fetch after validateServerFetchUrl; add an authentication guard at the top of
that handler (before parsing body and before calling validateServerFetchUrl) to
block unauthenticated requests: check the app's session/auth utility or an
authorization header (e.g., verify session from getSession()/getUser() or
validate an API key/token) and return a 401/403 JSON response if
missing/invalid. Ensure the guard runs in the same request handler that contains
validateServerFetchUrl and the fetch logic so only authenticated clients can
reach the proxy behavior.

Verify each finding against the current code and only fix it if needed.

In `@src/routes/api/search/stream.ts` around lines 22 - 23, The module-global maps
eventPushers and searchFlags are keyed by a client-supplied searchId which
allows one client to overwrite another's stream state; change the design so keys
are server-generated and tied to the connection (e.g., generate a UUID via
crypto.randomUUID() or derive a unique key from the response/connection and
store that) or avoid global maps entirely by storing state in a per-request
closure/connection object; update the code paths that currently read/write
eventPushers and searchFlags (and the related handlers in this file) to use the
server-generated connection ID and return that ID to the caller if needed, or
scope the pusher/flags to the request lifecycle so no client-provided ID can
collide with others.

Verify each finding against the current code and only fix it if needed.

In `@src/routes/api/search/stream.ts` around lines 434 - 447, The call to
researchStorage.storeResults inside the main try block must be made best-effort
so storage outages don't abort the whole search; wrap the storage call (the code
that assigns storageId from researchStorage.storeResults) in its own try/catch,
catch and log the error (including error details) and leave storageId undefined
on failure, then proceed to call sendResults as normal; reference the storageId
variable and the researchStorage.storeResults invocation so you update that
exact block without changing the rest of the search flow.

In general, to fix incomplete multi-character sanitization here, we must ensure that: (1) decoding HTML entities cannot reintroduce characters (<, >, quotes) that will be interpreted as HTML when the result is used, or (2) any such characters are removed/escaped after all decoding is complete. The simplest robust fix, without changing behavior too much, is to decode entities first, then strip tags, and finally ensure any remaining < or > characters are removed so that <script> or other tags cannot be re-formed.

Concretely for stripHtml in src/lib/search/free-providers.ts, we can:

First normalize/“decode” the known entities (&amp;, &lt;, &gt;, &quot;, &#039;, &#x27;, &nbsp;) to their characters.
Then strip any HTML tags with /<[^>]+>/g on that decoded string.
Finally, defensively remove any remaining < or > characters, in case entity decoding or upstream data creates tricky patterns that tag stripping missed.
Keep the whitespace normalization (\s+ -> space) and trim().
This preserves the existing logical intent (plain text from HTML snippets) but closes the gap where entity decoding can reintroduce <script> or similar. We only need to edit the stripHtml function body; no extra imports or helpers are required.


In general, to fix incomplete URL substring sanitization, you should parse the URL with a proper URL parser and perform checks on the parsed components (e.g., hostname) rather than checking substrings of the whole URL string. When you want to exclude or include particular domains, compare against a clear whitelist/blacklist of hostnames or use well-defined rules on the hostname (and possibly protocol), not on the raw URL text.

For this specific case, the intent of line 112 is to skip DuckDuckGo internal result URLs (e.g., search pages, redirectors) and only keep external web pages. Instead of decodedUrl.includes("duckduckgo.com"), we should parse decodedUrl with the built-in URL class and check parsed.hostname (or host) for an exact match or a controlled set of hostnames (like duckduckgo.com, www.duckduckgo.com, html.duckduckgo.com). To avoid changing existing functionality, we will keep the same overall control flow: we’ll still skip URLs that point to DuckDuckGo, but we’ll now use new URL(decodedUrl) to obtain the hostname and check that against a small blacklist. To minimize changes, we will:

Parse the URL once near where we already validate it.
Store the parsed URL object in a local variable (e.g. parsedUrl).
Replace the substring check with a hostname-based check using parsedUrl.hostname.
Use parsedUrl.href (or keep decodedUrl as-is) for the stored URL value; behaviorally, this stays effectively the same because decodedUrl must already be a valid absolute URL.
Concretely, inside src/lib/search/free-providers.ts in the DuckDuckGo loop:

Move the URL validation (new URL(...)) before the skip check and store the result: const parsedUrl = new URL(decodedUrl);.

Change the skip-condition from decodedUrl.includes("duckduckgo.com") to something like:

const duckduckgoHosts = new Set([
    "duckduckgo.com",
    "www.duckduckgo.com",
    "html.duckduckgo.com",
]);
if (!title || !decodedUrl || duckduckgoHosts.has(parsedUrl.hostname)) continue;
To keep the change minimal and local, we can inline the host check instead of declaring a top-level constant if desired.

When pushing the result, we can still use decodedUrl as the url field; we've already validated it by successfully constructing parsedUrl, so we don't need to change that line.

No new imports are needed because URL is a standard global in modern Node.js/TypeScript environments.

Suggested changeset 1

src/lib/search/free-providers.ts
@@ -108,16 +108,26 @@
		const title = stripHtml(rawTitle);
		const snippet = stripHtml(rawSnippet);

		// Skip empty or invalid results
		if (!title || !decodedUrl || decodedUrl.includes("duckduckgo.com")) continue;

		// Validate URL
		// Validate URL and extract hostname
		let parsedUrl: URL;
		try {
			new URL(decodedUrl);
			parsedUrl = new URL(decodedUrl);
		} catch {
			// Skip invalid URLs
			continue;
		}

		// Skip empty results or DuckDuckGo internal URLs
		if (
			!title ||
			!decodedUrl ||
			parsedUrl.hostname === "duckduckgo.com" ||
			parsedUrl.hostname === "www.duckduckgo.com" ||
			parsedUrl.hostname === "html.duckduckgo.com"
		) {
			continue;
		}

		const domainAuthority = calculateDomainAuthority(decodedUrl);
		results.push({
			id: `ddg-${Date.now()}-${results.length}`,



⚠️ Potential issue | 🔴 Critical

Enforce ownership on every KB-scoped operation.

These handlers trust caller-supplied userId/document/KB ids. getChunksWithEmbeddings() ignores userId entirely, and toggleKnowledgeBase(), deleteKnowledgeBase(), and listCrawlJobs() operate on ids with no ownership check at all. Any caller that can guess an id can read embeddings or mutate another user's knowledge base unless auth is enforced elsewhere.

Also applies to: 59-86, 91-144, 148-189, 307-337

🧩 Analysis chain
🏁 Script executed:

#!/bin/bash
set -euo pipefail
fd 'rag\.ts$' .
rg -n -C4 'listKnowledgeBases|getRagAnalyticsSummary|createKnowledgeBase|storeChunks|logRagAnalytics|getAuthUserId|args\.userId|userId' convex/rag.ts
Repository: MikePfunk28/agentic-search

Length of output: 4358

Add server-side authorization validation to all RAG handlers.

The server handlers in convex/rag.ts directly use args.userId without verifying it matches the authenticated user. This allows cross-user read/write access.

Affected handlers: listKnowledgeBases, createKnowledgeBase, storeChunks, searchChunks, getChunksWithEmbeddings, logRagAnalytics, getRagAnalyticsSummary, createCrawlJob.

Each handler must derive the user from getAuthUserId(ctx) instead of trusting the client-supplied userId. Reject any mismatch.

🤖 Prompt for AI Agents
Verify each finding against the current code and only fix it if needed.

In `@src/hooks/useRag.ts` around lines 31 - 39, The listed RAG handlers
(listKnowledgeBases, createKnowledgeBase, storeChunks, searchChunks,
getChunksWithEmbeddings, logRagAnalytics, getRagAnalyticsSummary,
createCrawlJob) currently trust args.userId; update each handler to call
getAuthUserId(ctx) to derive the authenticated user, compare it against
args.userId (if provided) and reject when they differ (throw/return an
unauthorized error), and use the authenticated id for all DB reads/writes
instead of the client-supplied userId; ensure any early returns or error
messages make it clear the userId mismatch caused the rejection.

⚠️ Potential issue | 🔴 Critical

🧩 Analysis chain
🌐 Web query:

What are the current Anthropic Claude model names and identifiers as of March 2026?

💡 Result:

As of March 2026, Anthropic’s Claude API model identifiers (the model strings) are:

Active (recommended)
Claude Opus 4.6: claude-opus-4-6 [1][2]
Claude Sonnet 4.6: claude-sonnet-4-6 [1][2]
Claude Haiku 4.5 (snapshot): claude-haiku-4-5-20251001 (alias: claude-haiku-4-5) [1][3]
Claude Sonnet 4.5 (snapshot): claude-sonnet-4-5-20250929 (alias: claude-sonnet-4-5) [1][3]
Claude Opus 4.5 (snapshot): claude-opus-4-5-20251101 (alias commonly used in docs: claude-opus-4-5) [1][4]
Claude Opus 4.1 (snapshot): claude-opus-4-1-20250805 [1][4]
Claude Opus 4 (snapshot): claude-opus-4-20250514 [1]
Claude Sonnet 4 (snapshot): claude-sonnet-4-20250514 [1][4]
Deprecated but still usable in March 2026
Claude Haiku 3 (deprecated; retirement scheduled April 20, 2026): claude-3-haiku-20240307 [1]
Recently retired (no longer usable)
claude-3-7-sonnet-20250219 (retired Feb 19, 2026) [1]
claude-3-5-haiku-20241022 (retired Feb 19, 2026) [1]
Sources: Anthropic Claude API docs (Models overview / What’s new / Model deprecations / Migration guide). [1][2][3][4]

Update claude-sonnet-4-5-20241022 to claude-sonnet-4-5-20250929.

The ANTHROPIC_KNOWN_MODELS list contains an outdated model identifier. As of March 2026, claude-sonnet-4-5-20241022 should be claude-sonnet-4-5-20250929. Additionally, consider evaluating whether to include newer models like claude-opus-4-6 and claude-sonnet-4-6.

🤖 Prompt for AI Agents
Verify each finding against the current code and only fix it if needed.

In `@src/lib/model-store.ts` around lines 481 - 486, Update the
ANTHROPIC_KNOWN_MODELS constant in model-store.ts by replacing the outdated
entry "claude-sonnet-4-5-20241022" with the corrected identifier
"claude-sonnet-4-5-20250929"; locate the ANTHROPIC_KNOWN_MODELS array
declaration and perform the string swap, and optionally consider adding newer
model names like "claude-opus-4-6" and "claude-sonnet-4-6" to the same array if
you want to support those models.

LIKE I FUCKING SAID TO YOU!!! 4.6

📝 Committable suggestion
‼️ IMPORTANT
Carefully review the code before committing. Ensure that it accurately replaces the highlighted code, contains no missing lines, and has no issues with indentation. Thoroughly test & benchmark the code to ensure it meets the requirements.

Suggested change
						const baseUrl = (
							primaryModelConfig.baseUrl || "http://localhost:11434"
						).replace(/\/_?v1$/, "");
						const reasoningEngine = new InterleavedReasoningEngine(
							{
								orchestratorModel: primaryModelConfig.model,
								validatorModel: primaryModelConfig.model,
							},
							baseUrl,
							primaryModelConfig.apiKey ||
								(primaryModelConfig.provider === "ollama" ? "ollama" : "local"),
						);
					const resolvedBaseUrl =
						primaryModelConfig.baseUrl ??
						(primaryModelConfig.provider === "ollama"
							? "http://localhost:11434"
							: null);
					if (!resolvedBaseUrl) {
						throw new Error(
							`baseUrl is required for interleaved reasoning with provider ${primaryModelConfig.provider}`,
						);
					}
					const baseUrl = resolvedBaseUrl.replace(/\/_?v1$/, "");
					const reasoningEngine = new InterleavedReasoningEngine(
						{
							orchestratorModel: primaryModelConfig.model,
							validatorModel: primaryModelConfig.model,
						},
						baseUrl,
						primaryModelConfig.apiKey ||
							(primaryModelConfig.provider === "ollama" ? "ollama" : "local"),
					);
🤖 Prompt for AI Agents
Verify each finding against the current code and only fix it if needed.

In `@src/lib/unified-search-orchestrator.ts` around lines 281 - 292, The code is
defaulting primaryModelConfig.baseUrl to Ollama's localhost for all providers;
change the logic where InterleavedReasoningEngine is constructed (the baseUrl
expression using primaryModelConfig.baseUrl) to use provider-specific defaults:
if primaryModelConfig.baseUrl is missing, select
ProviderDefaults[primaryModelConfig.provider] (or a mapping lookup) for
providers in OPENAI_COMPATIBLE_REASONING_PROVIDERS, and only fall back to the
Ollama localhost when primaryModelConfig.provider === "ollama"; alternatively
validate and throw if baseUrl is required but absent—update the baseUrl
resolution before creating new InterleavedReasoningEngine so the engine receives
the correct provider-specific endpoint.

Both Cloudflare pages and Cloudflare workers builds failed as well.

src/lib/search/free-providers.ts:28 
/** Strip HTML tags from text */
function stripHtml(text: string): string {
	const decoded = he.decode(text);
	return decoded
		.replace(/<[^>]+>/g, "")
 Warning
Incomplete multi-character sanitization
This string may still contain <script
, which may cause an HTML element injection vulnerability.
CodeQL
		.replace(/\s+/g, " ")
		.trim();
}
Rule
Tool
CodeQL
Rule ID
js/incomplete-multi-character-sanitization
Query
View source
Description
Sanitizing untrusted input is a common technique for preventing injection attacks and other security vulnerabilities. Regular expressions are often used to perform this sanitization. However, when the regular expression matches multiple consecutive characters, replacing it just once can result in the unsafe text reappearing in the sanitized input.

Activity
First detected in commit 17 hours ago
@MikePfunk28
@github-advanced-security
Potential fix for code scanning alert no. 17: Incomplete multi-charac… …
f7ccbae
src/lib/search/ free-providers.ts:28 on branch refs/pull/28/head
Appeared in branch refs/pull/28/head 17 hours ago
 PR #28 #30: Commit f7ccbaef
( runner: ["ubuntu-latest"] category: /language:javascript-typescript language: javascript-typescript build-mode: none )