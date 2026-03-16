import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

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
