/**
 * Security Utilities for Input Sanitization and Validation
 * Uses DOMPurify (battle-tested library) instead of fragile regex patterns.
 */

import DOMPurify from "isomorphic-dompurify";

/**
 * Maximum allowed string lengths to prevent DoS
 */
export const MAX_QUERY_LENGTH = 10000;
export const MAX_CONTENT_LENGTH = 1000000;
export const MAX_FILENAME_LENGTH = 255;
export const MAX_URL_LENGTH = 2048;

/**
 * Sanitize user input string for safe processing.
 * Uses DOMPurify to strip HTML — no fragile regex.
 */
export function sanitizeInput(
	input: string,
	options: {
		maxLength?: number;
		allowHtml?: boolean;
		strict?: boolean;
	} = {},
): string {
	const {
		maxLength = MAX_QUERY_LENGTH,
		allowHtml = false,
		strict = false,
	} = options;

	if (typeof input !== "string") {
		throw new Error("Input must be a string");
	}

	let sanitized = input;

	// Remove null bytes and control characters (except newlines/tabs)
	// biome-ignore lint/suspicious/noControlCharactersInRegex: intentional security sanitization of control chars
	sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

	// Trim to max length
	if (sanitized.length > maxLength) {
		sanitized = sanitized.substring(0, maxLength);
	}

	if (!allowHtml) {
		// DOMPurify strips ALL HTML tags — one line, battle-tested
		sanitized = DOMPurify.sanitize(sanitized, { ALLOWED_TAGS: [] });
	}

	if (strict) {
		// DOMPurify handles HTML; strict mode additionally removes
		// characters that could be dangerous in shell/SQL contexts
		sanitized = sanitized
			.replaceAll("<", "")
			.replaceAll(">", "")
			.replaceAll('"', "")
			.replaceAll("'", "")
			.replaceAll(";", "")
			.replaceAll("&", "")
			.replaceAll("|", "")
			.replaceAll("`", "");
	}

	return sanitized.trim();
}

/**
 * Sanitize filename to prevent path traversal and invalid characters
 */
export function sanitizeFilename(filename: string): string {
	if (typeof filename !== "string") {
		throw new Error("Filename must be a string");
	}

	// Check for path traversal attempts — simple string checks, no regex
	if (
		filename.includes("../") ||
		filename.includes("..\\") ||
		filename.toLowerCase().includes("%2e%2e%2f") ||
		filename.toLowerCase().includes("%2e%2e%5c")
	) {
		throw new Error("Invalid filename: path traversal detected");
	}

	// Strip HTML via DOMPurify first
	let sanitized = DOMPurify.sanitize(filename, { ALLOWED_TAGS: [] });

	// Remove any path components
	const lastSlash = Math.max(
		sanitized.lastIndexOf("/"),
		sanitized.lastIndexOf("\\"),
	);
	if (lastSlash >= 0) {
		sanitized = sanitized.substring(lastSlash + 1);
	}

	// Remove null bytes
	sanitized = sanitized.replaceAll("\x00", "");

	// Replace dangerous filesystem characters with underscore
	const dangerousChars = new Set(["<", ">", ":", '"', "|", "?", "*"]);
	sanitized = Array.from(sanitized)
		.map((ch) => {
			if (dangerousChars.has(ch)) return "_";
			// Control characters
			if (ch.charCodeAt(0) < 0x20) return "_";
			return ch;
		})
		.join("");

	// Block Windows reserved device names
	const reserved =
		/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
	if (reserved.test(sanitized)) {
		sanitized = `_${sanitized}`;
	}

	// Remove trailing dots and spaces
	while (sanitized.endsWith(".") || sanitized.endsWith(" ")) {
		sanitized = sanitized.slice(0, -1);
	}

	// Limit length
	if (sanitized.length > MAX_FILENAME_LENGTH) {
		const ext = sanitized.lastIndexOf(".");
		if (ext > 0) {
			const extension = sanitized.substring(ext);
			sanitized =
				sanitized.substring(0, MAX_FILENAME_LENGTH - extension.length) +
				extension;
		} else {
			sanitized = sanitized.substring(0, MAX_FILENAME_LENGTH);
		}
	}

	// Ensure we have a valid filename
	if (!sanitized || sanitized === "." || sanitized === "..") {
		sanitized = `file_${Date.now()}`;
	}

	return sanitized;
}

/**
 * Sanitize URL to prevent injection and validate format
 */
export function sanitizeUrl(url: string): string {
	if (typeof url !== "string") {
		throw new Error("URL must be a string");
	}

	let sanitized = url.trim();

	// Limit length
	if (sanitized.length > MAX_URL_LENGTH) {
		throw new Error("URL exceeds maximum length");
	}

	// Remove whitespace and control characters
	// biome-ignore lint/suspicious/noControlCharactersInRegex: intentional security sanitization of control chars in URLs
	sanitized = sanitized.replace(/[\s\x00-\x1F\x7F]/g, "");

	// Check for javascript: or data: protocols
	const lowerUrl = sanitized.toLowerCase();
	if (
		lowerUrl.startsWith("javascript:") ||
		lowerUrl.startsWith("data:text/html")
	) {
		throw new Error("Invalid URL protocol");
	}

	// Validate URL format
	try {
		const parsed = new URL(sanitized);
		// Only allow safe protocols
		if (!["http:", "https:"].includes(parsed.protocol)) {
			throw new Error("Only HTTP and HTTPS protocols are allowed");
		}
	} catch {
		throw new Error("Invalid URL format");
	}

	return sanitized;
}

/**
 * Validate and sanitize API key input
 */
export function sanitizeApiKey(key: string | undefined): string | undefined {
	if (!key) return undefined;

	if (typeof key !== "string") {
		throw new Error("API key must be a string");
	}

	// Remove whitespace
	const sanitized = key.trim();

	// Check for reasonable length (API keys are typically 20-200 chars)
	if (sanitized.length < 10 || sanitized.length > 500) {
		throw new Error("Invalid API key length");
	}

	// Strip any HTML via DOMPurify
	const cleaned = DOMPurify.sanitize(sanitized, { ALLOWED_TAGS: [] });
	if (cleaned !== sanitized) {
		throw new Error("Invalid characters in API key");
	}

	return sanitized;
}

/**
 * Sanitize model configuration from client
 */
export function sanitizeModelConfig(config: unknown): {
	provider: string;
	model: string;
	baseUrl?: string;
	apiKey?: string;
} {
	if (!config || typeof config !== "object") {
		throw new Error("Invalid model configuration");
	}

	const cfg = config as Record<string, unknown>;

	const provider = sanitizeInput(String(cfg.provider || ""), { maxLength: 50 });
	const model = sanitizeInput(String(cfg.model || ""), { maxLength: 100 });

	if (!provider || !model) {
		throw new Error("Provider and model are required");
	}

	// Validate provider against whitelist
	const allowedProviders = [
		"openai",
		"anthropic",
		"google",
		"ollama",
		"lm_studio",
		"azure",
		"deepseek",
		"moonshot",
		"kimi",
		"vllm",
		"gguf",
		"onnx",
	];
	if (!allowedProviders.includes(provider.toLowerCase())) {
		throw new Error(`Invalid provider: ${provider}`);
	}

	const result: {
		provider: string;
		model: string;
		baseUrl?: string;
		apiKey?: string;
	} = {
		provider: provider.toLowerCase(),
		model,
	};

	if (cfg.baseUrl && typeof cfg.baseUrl === "string") {
		try {
			result.baseUrl = sanitizeUrl(cfg.baseUrl);
		} catch {
			// Invalid URL - will use default
		}
	}

	if (cfg.apiKey && typeof cfg.apiKey === "string") {
		result.apiKey = sanitizeApiKey(cfg.apiKey);
	}

	return result;
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
	const sanitized = sanitizeInput(query, { maxLength: MAX_QUERY_LENGTH });

	// Check for shell metacharacters — simple set lookup, no regex
	const shellChars = new Set([";", "&", "|", "`", "$", "(", ")", "{", "}", "[", "]"]);
	for (const ch of sanitized) {
		if (shellChars.has(ch)) {
			console.warn("[Security] Potential command injection detected in query");
			break;
		}
	}

	return sanitized;
}

/**
 * Create secure response headers
 */
export function getSecurityHeaders(): Record<string, string> {
	return {
		"Content-Type": "application/json",
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options": "DENY",
		"X-XSS-Protection": "1; mode=block",
		"Referrer-Policy": "strict-origin-when-cross-origin",
		"Permissions-Policy": "camera=(), microphone=(), geolocation=()",
		"Content-Security-Policy":
			"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
	};
}

/**
 * Validate JSON request body size to prevent DoS
 */
export function validateRequestBodySize(
	request: Request,
	maxSizeBytes: number = 1024 * 1024,
): void {
	const contentLength = request.headers.get("Content-Length");
	if (contentLength) {
		const size = parseInt(contentLength, 10);
		if (Number.isNaN(size) || size > maxSizeBytes) {
			throw new Error(`Request body too large. Maximum: ${maxSizeBytes} bytes`);
		}
	}
}

/**
 * Rate limiting helper (simple in-memory, for production use Redis)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
	key: string,
	maxRequests: number = 100,
	windowMs: number = 60000,
): { allowed: boolean; remaining: number; resetTime: number } {
	const now = Date.now();
	const record = rateLimitStore.get(key);

	if (!record || now > record.resetTime) {
		rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
		return {
			allowed: true,
			remaining: maxRequests - 1,
			resetTime: now + windowMs,
		};
	}

	if (record.count >= maxRequests) {
		return { allowed: false, remaining: 0, resetTime: record.resetTime };
	}

	record.count++;
	return {
		allowed: true,
		remaining: maxRequests - record.count,
		resetTime: record.resetTime,
	};
}

/**
 * Escape JSON string values to prevent JSON injection
 */
export function escapeJsonString(str: string): string {
	return JSON.stringify(str).slice(1, -1);
}

/**
 * Create a safe JSON response with security headers
 */
export function createSecureJsonResponse(
	data: unknown,
	status: number = 200,
): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: getSecurityHeaders(),
	});
}

/**
 * Create a safe error response
 */
export function createSecureErrorResponse(
	message: string,
	status: number = 500,
): Response {
	return createSecureJsonResponse(
		{ error: sanitizeInput(message, { maxLength: 500 }) },
		status,
	);
}
