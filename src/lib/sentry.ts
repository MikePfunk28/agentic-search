/**
 * Sentry Error Tracking Setup
 * Monitors frontend errors and performance for the agentic search platform
 */
import * as Sentry from "@sentry/tanstackstart-react";

export interface SentryConfig {
	dsn?: string;
	environment?: string;
	enabled?: boolean;
}

/**
 * Initialize Sentry error tracking
 * @param config - Sentry configuration options
 */
export function initSentry(config?: SentryConfig) {
	const dsn =
		config?.dsn || import.meta.env.VITE_SENTRY_DSN || process.env.SENTRY_DSN;
	const environment =
		config?.environment || import.meta.env.MODE || "development";
	const enabled = config?.enabled ?? environment === "production";

	if (!dsn || !enabled) {
		console.log("[Sentry] Disabled in development or missing DSN");
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
			Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
		],
		tracesSampleRate: environment === "production" ? 0.1 : 1.0,
		replaysSessionSampleRate: 0.1,
		replaysOnErrorSampleRate: 1.0,
		enableLogs: true,
	});

	console.log(`[Sentry] Initialized for ${environment}`);
}

/**
 * Capture a custom error with context
 */
export function captureError(error: Error, context?: Record<string, unknown>) {
	Sentry.captureException(error, {
		extra: context,
	});
}

/**
 * Set user context for error tracking
 */
export function setUserContext(userId: string, email?: string) {
	Sentry.setUser({
		id: userId,
		email,
	});
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
	message: string,
	category: string,
	data?: Record<string, unknown>,
) {
	Sentry.addBreadcrumb({
		message,
		category,
		data,
		level: "info",
	});
}
