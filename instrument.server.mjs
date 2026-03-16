// NOTE: dotenv is NOT imported here — Vite and TanStack Start already load
// .env.local automatically in dev mode. Importing dotenv would pull in node:http
// transitively, which crashes miniflare's workerd runtime.

// NOTE: Do not initialize Sentry in local dev worker runtime.
// Cloudflare/miniflare cannot resolve some Node module fallbacks used by Sentry.
if (process.env.NODE_ENV === 'production' && process.env.VITE_SENTRY_DSN) {
  const Sentry = await import('@sentry/tanstackstart-react')
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    sendDefaultPii: process.env.SENTRY_SEND_DEFAULT_PII === 'true',
    integrations: [
      Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
    ],
    enableLogs: true,
  })
}
