// TanStack Start auto-discovers instrument.server.* at worker startup.
//
// Do not import Sentry's TanStack Start SDK here. Its server entry resolves to
// @sentry/node and transitively pulls in node:http, which Cloudflare workerd /
// Miniflare cannot load. Client-side Sentry, when enabled, must be initialized
// from browser-only code paths instead.
export {}
