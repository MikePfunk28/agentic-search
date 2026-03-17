/**
 * Sentry Error Tracking Setup
 * Monitors frontend errors and performance for the agentic search platform
 *
 * All imports of @sentry/tanstackstart-react are LAZY and browser-only so that
 * node:http — a transitive dependency of the Sentry SDK — is never pulled into
 * the Cloudflare workerd / Miniflare SSR bundle during server rendering.
 */

// Lazy-loaded Sentry module reference (populated on first use).
let _sentry: typeof import("@sentry/tanstackstart-react") | null = null;

function isBrowserSentryRuntime() {
	return typeof window !== "undefined" && typeof document !== "undefined";
}

async function getSentry() {
	if (!isBrowserSentryRuntime()) {
		return null;
	}

	if (!_sentry) {
		_sentry = await import("@sentry/tanstackstart-react");
	}
	return _sentry;
}

export interface SentryConfig {
	dsn?: string;
	environment?: string;
	enabled?: boolean;
}

/**
 * Initialize Sentry error tracking
 * @param config - Sentry configuration options
 */
export async function initSentry(config?: SentryConfig) {
	if (!isBrowserSentryRuntime()) {
		return;
	}

	const dsn =
		config?.dsn || import.meta.env.VITE_SENTRY_DSN || process.env.SENTRY_DSN;
	const environment =
		config?.environment || import.meta.env.MODE || "development";
	const enabled = config?.enabled ?? environment === "production";

	if (!dsn || !enabled) {
		console.log("[Sentry] Disabled in development or missing DSN");
		return;
	}

	const Sentry = await getSentry();
	if (!Sentry) {
		return;
	}

	Sentry.init({
		dsn,
		environment,
		integrations: [
			Sentry.browserTracingIntegration(),
			Sentry.replayIntegration({
				maskAllText: false,
				blockAllMedia: false,
			}),
		],
		tracesSampleRate: environment === "production" ? 0.1 : 1.0,
		replaysSessionSampleRate: 0.1,
		replaysOnErrorSampleRate: 1.0,
	});

	console.log(`[Sentry] Initialized for ${environment}`);
}

/**
 * Capture a custom error with context
 */
export async function captureError(error: Error, context?: Record<string, unknown>) {
	const Sentry = await getSentry();
	if (!Sentry) {
		return;
	}
	Sentry.captureException(error, {
		extra: context,
	});
}

/**
 * Set user context for error tracking
 */
export async function setUserContext(userId: string, email?: string) {
	const Sentry = await getSentry();
	if (!Sentry) {
		return;
	}
	Sentry.setUser({
		id: userId,
		email,
	});
}

/**
 * Add breadcrumb for debugging
 */
export async function addBreadcrumb(
	message: string,
	category: string,
	data?: Record<string, unknown>,
) {
	const Sentry = await getSentry();
	if (!Sentry) {
		return;
	}
	Sentry.addBreadcrumb({
		message,
		category,
		data,
		level: "info",
	});
}
