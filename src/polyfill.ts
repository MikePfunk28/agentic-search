/**
 * Polyfill for the File API (needed only in Node.js 18 / Stackblitz).
 * Node 20+, Cloudflare Workers, and browsers already have File globally.
 * Uses dynamic import to avoid crashing the Cloudflare worker module resolver.
 */
if (typeof globalThis.File === "undefined") {
	try {
		const { File } = await import("node:buffer");
		globalThis.File = File as any;
	} catch {
		// Cloudflare worker runtime or environment where node:buffer is unavailable
	}
}
