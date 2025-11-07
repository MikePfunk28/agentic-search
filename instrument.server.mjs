import { config } from 'dotenv'
import * as Sentry from '@sentry/tanstackstart-react'

// Load environment variables from .env.local
config({ path: '.env.local' })

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
})
