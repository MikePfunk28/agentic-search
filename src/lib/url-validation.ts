/**
 * SSRF Protection — URL Validation
 *
 * Validates URLs before server-side fetches to prevent SSRF attacks.
 * Uses exact hostname checks — no regex.
 *
 * Two layers:
 *  1. validateServerFetchUrl  — synchronous, checks literal hostname strings
 *  2. validateServerFetchUrlAsync — async, additionally resolves DNS and
 *     rejects hostnames that map to private/loopback/link-local addresses.
 *     Always prefer the async variant on the server side.
 */

/**
 * Known cloud provider hostnames that are always safe to fetch.
 * Exact values looked up from each provider's official documentation:
 *
 * OpenAI:      https://api.openai.com/v1
 * Anthropic:   https://api.anthropic.com
 * Google:      https://generativelanguage.googleapis.com/v1
 * DeepSeek:    https://api.deepseek.com/v1
 * Moonshot:    https://api.moonshot.cn/v1
 * OpenRouter:  https://openrouter.ai/api/v1
 * Z.AI:        https://api.z.ai/api/paas/v4  (general)
 *              https://api.z.ai/api/coding/paas/v4  (coding plan)
 *              https://api.z.ai/v1  (OpenAI-compatible)
 * Together.ai: https://api.together.xyz/v1
 * Groq:        https://api.groq.com/openai/v1
 * Fireworks:   https://api.fireworks.ai/inference/v1
 * Mistral:     https://api.mistral.ai/v1
 * Z.AI China:  https://open.bigmodel.cn
 *
 * Search providers:
 * Firecrawl:   https://api.firecrawl.dev/v1
 * Tavily:      https://api.tavily.com
 * Exa:         https://api.exa.ai
 * Brave:       https://api.search.brave.com
 */
const KNOWN_CLOUD_HOSTS = new Set([
	// AI model providers
	"api.openai.com",
	"api.anthropic.com",
	"generativelanguage.googleapis.com",
	"api.deepseek.com",
	"api.moonshot.cn",
	"openrouter.ai",
	"api.z.ai",
	"open.bigmodel.cn",
	"api.together.xyz",
	"api.groq.com",
	"api.fireworks.ai",
	"api.mistral.ai",
	// Search providers
	"api.firecrawl.dev",
	"api.tavily.com",
	"api.exa.ai",
	"api.search.brave.com",
]);

/** Localhost hostnames allowed for local model providers */
const LOCAL_HOSTS = new Set([
	"localhost",
	"127.0.0.1",
	"[::1]",
	"::1",
	"0.0.0.0",
]);

/** Cloud metadata endpoints that must always be blocked */
const BLOCKED_HOSTS = new Set([
	"169.254.169.254",
	"metadata.google.internal",
	"metadata.google",
	"100.100.100.200",
]);

/**
 * Check if an IPv4 address string is a private/internal IP.
 * Uses exact octet parsing — no regex.
 */
function isPrivateIPv4(hostname: string): boolean {
	const parts = hostname.split(".");
	if (parts.length !== 4) return false;

	const octets = parts.map((p) => parseInt(p, 10));
	if (octets.some((o) => Number.isNaN(o) || o < 0 || o > 255)) return false;

	const [a, b] = octets;

	// 10.0.0.0/8
	if (a === 10) return true;
	// 127.0.0.0/8 loopback
	if (a === 127) return true;
	// 172.16.0.0/12
	if (a === 172 && b >= 16 && b <= 31) return true;
	// 192.168.0.0/16
	if (a === 192 && b === 168) return true;
	// 169.254.0.0/16 link-local
	if (a === 169 && b === 254) return true;
	// 0.0.0.0/8
	if (a === 0) return true;
	// 100.64.0.0/10 CGNAT
	if (a === 100 && b >= 64 && b <= 127) return true;

	return false;
}

/**
 * Check if an IPv6 hostname is a private address.
 * Allows loopback (::1). Blocks fd00::/8 and fe80::/10 (link-local).
 */
function isPrivateIPv6(hostname: string): boolean {
	// Strip brackets if present: [::1] → ::1
	const bare = hostname.startsWith("[") ? hostname.slice(1, -1) : hostname;
	const lower = bare.toLowerCase();

	// Allow loopback
	if (lower === "::1") return false;

	// Block unique-local (fd00::/8) and link-local (fe80::/10)
	if (
		lower.startsWith("fd") ||
		lower.startsWith("fe8") ||
		lower.startsWith("fe9") ||
		lower.startsWith("fea") ||
		lower.startsWith("feb")
	) {
		return true;
	}

	return false;
}

/**
 * Validate a URL is safe to fetch from the server.
 * Throws an Error with a descriptive message if the URL is blocked.
 *
 * We accept ANY user-provided URL as long as it is not a security risk.
 * The known hosts set is a fast-path allowlist — it skips further checks
 * for well-known providers. But any public domain is allowed.
 *
 * Logic:
 * 1. Must be http or https
 * 2. Blocked metadata hosts → reject
 * 3. Known cloud hosts → allow (fast path)
 * 4. Known local hosts → allow (for local model providers)
 * 5. Private/internal IPs → reject
 * 6. Any other public domain → allow (custom providers, Z.AI coding plan, etc.)
 */
export function validateServerFetchUrl(url: string): void {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		throw new Error("Invalid URL format");
	}

	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
		throw new Error("Only http and https URLs are allowed");
	}

	const hostname = parsed.hostname.toLowerCase();

	// Always block metadata endpoints
	if (BLOCKED_HOSTS.has(hostname)) {
		throw new Error("Blocked: cloud metadata endpoint");
	}

	// Known cloud providers — always safe
	if (KNOWN_CLOUD_HOSTS.has(hostname)) {
		return;
	}

	// Localhost — safe for local model providers
	if (LOCAL_HOSTS.has(hostname)) {
		return;
	}

	// Check for private IPv4
	if (isPrivateIPv4(hostname)) {
		throw new Error("Blocked: private/internal IP address");
	}

	// Check for private IPv6
	if (isPrivateIPv6(hostname)) {
		throw new Error("Blocked: private IPv6 address");
	}

	// All other public domains are allowed (custom providers)
}

/**
 * Check whether a resolved IP address is internal (private, loopback,
 * link-local, or cloud metadata). This is intentionally strict: any
 * address that isn't clearly public gets rejected.
 */
function isInternalIP(ip: string): boolean {
	// Check private IPv4 ranges (10/8, 172.16/12, 192.168/16, etc.)
	if (isPrivateIPv4(ip)) return true;

	// Check blocked cloud metadata IPs
	if (BLOCKED_HOSTS.has(ip)) return true;

	// Check loopback
	if (LOCAL_HOSTS.has(ip)) return true;

	// Check private IPv6 (fd00::/8, fe80::/10)
	if (isPrivateIPv6(ip)) return true;

	// IPv6 loopback
	const bare = ip.startsWith("[") ? ip.slice(1, -1) : ip;
	if (bare === "::1" || bare === "0:0:0:0:0:0:0:1") return true;

	return false;
}

/**
 * Resolve hostname to IP via Node.js dns module.
 * Returns null when dns is unavailable (e.g. Cloudflare Workers, where
 * the runtime already blocks private IPs at the network layer).
 */
async function resolveDns(
	hostname: string,
): Promise<{ address: string; family: number }[] | null> {
	try {
		// Dynamic import so the module loads in non-Node runtimes without crashing
		const dns = await import("node:dns/promises");
		// Use lookup (OS resolver) rather than resolve4/resolve6 to cover
		// /etc/hosts, mDNS, and other non-standard resolution paths.
		const results = await dns.lookup(hostname, { all: true });
		return results;
	} catch {
		// dns module not available or lookup failure — fall through
		return null;
	}
}

/**
 * Async SSRF validation — the preferred server-side guard.
 *
 * 1. Runs all synchronous hostname checks from validateServerFetchUrl.
 * 2. Resolves DNS and rejects hostnames that map to private/internal IPs.
 *
 * Always use this instead of the sync version when in an async context.
 */
export async function validateServerFetchUrlAsync(url: string): Promise<void> {
	// Run the synchronous pre-flight checks first
	validateServerFetchUrl(url);

	const parsed = new URL(url);
	const hostname = parsed.hostname.toLowerCase();

	// Skip DNS resolution for known-safe cloud hosts — they are well-known
	// public endpoints and resolving them would add unnecessary latency.
	if (KNOWN_CLOUD_HOSTS.has(hostname)) {
		return;
	}

	// Skip DNS resolution for explicit localhost — these are intentionally
	// allowed for local model providers (Ollama, LM Studio, etc.)
	if (LOCAL_HOSTS.has(hostname)) {
		return;
	}

	// Resolve DNS and check every returned address
	const resolved = await resolveDns(hostname);
	if (resolved && resolved.length > 0) {
		for (const entry of resolved) {
			if (isInternalIP(entry.address)) {
				throw new Error(
					`Blocked: hostname "${hostname}" resolves to internal address ${entry.address}`,
				);
			}
		}
	}
}
