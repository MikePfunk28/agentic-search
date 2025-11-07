/**
 * CSRF Middleware for TanStack Start
 *
 * Provides automatic CSRF token injection and validation for all routes.
 * Implements token rotation, secure cookie configuration, and path-based
 * exemptions.
 */

import {
  generateCsrfToken,
  validateCsrfRequest,
  setCsrfCookie,
  createCsrfErrorResponse,
  getCsrfTokenFromCookie,
  requiresCsrfProtection,
  type CsrfCookieOptions,
} from '@/lib/csrf-protection'

/**
 * Middleware configuration options
 */
export interface CsrfMiddlewareConfig {
  /**
   * Cookie options for CSRF token storage
   */
  cookieOptions?: CsrfCookieOptions

  /**
   * Rotate token on every request (default: true)
   * Provides enhanced security but may cause issues with parallel requests
   */
  rotateOnEveryRequest?: boolean

  /**
   * Paths that should skip CSRF protection
   * Useful for webhooks, health checks, etc.
   */
  skipPaths?: string[]

  /**
   * Whether to enable CSRF protection (default: true)
   * Can be disabled for development
   */
  enabled?: boolean
}

/**
 * Default middleware configuration
 */
const DEFAULT_CONFIG: Required<CsrfMiddlewareConfig> = {
  cookieOptions: {},
  rotateOnEveryRequest: true,
  skipPaths: [
    '/api/health',
    '/api/webhooks',
  ],
  enabled: process.env.NODE_ENV === 'production',
}

/**
 * Create CSRF middleware for TanStack Start
 */
export function createCsrfMiddleware(userConfig: CsrfMiddlewareConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig }

  return async function csrfMiddleware(
    request: Request,
    next: () => Promise<Response>
  ): Promise<Response> {
    // Skip if disabled
    if (!config.enabled) {
      return next()
    }

    const url = new URL(request.url)

    // Skip CSRF protection for exempted paths
    if (config.skipPaths.some(path => url.pathname.startsWith(path))) {
      return next()
    }

    // For safe methods (GET, HEAD, OPTIONS), ensure token exists
    if (!requiresCsrfProtection(request.method)) {
      const response = await next()

      // Check if CSRF token cookie exists
      const existingToken = getCsrfTokenFromCookie(request)

      // If no token exists, generate and set one
      if (!existingToken) {
        const newToken = generateCsrfToken()
        return setCsrfCookie(response, newToken, config.cookieOptions)
      }

      return response
    }

    // For state-changing methods, validate CSRF token
    const validation = validateCsrfRequest(request)

    if (!validation.valid) {
      console.warn('[CSRF] Validation failed:', validation.error)
      return createCsrfErrorResponse(validation.error!)
    }

    // Execute the handler
    let response = await next()

    // Rotate token if enabled
    if (config.rotateOnEveryRequest) {
      const newToken = generateCsrfToken()
      response = setCsrfCookie(response, newToken, config.cookieOptions)
    }

    return response
  }
}

/**
 * Default CSRF middleware instance with production settings
 */
export const csrfMiddleware = createCsrfMiddleware({
  rotateOnEveryRequest: true,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'Strict',
    maxAge: 3600, // 1 hour
  },
  skipPaths: [
    '/api/health',
    '/api/webhooks',
  ],
  enabled: process.env.NODE_ENV === 'production',
})

/**
 * Development-friendly CSRF middleware (token rotation disabled)
 */
export const csrfMiddlewareDev = createCsrfMiddleware({
  rotateOnEveryRequest: false, // Easier for development
  cookieOptions: {
    secure: false, // Allow HTTP in development
    httpOnly: true,
    sameSite: 'Lax', // More permissive for development
    maxAge: 86400, // 24 hours
  },
  skipPaths: [
    '/api/health',
    '/api/webhooks',
  ],
  enabled: true,
})

/**
 * Utility to manually validate CSRF for custom handlers
 */
export function validateCsrf(request: Request): boolean {
  const validation = validateCsrfRequest(request)
  return validation.valid
}

/**
 * Utility to create CSRF-protected response
 */
export function withCsrfToken(response: Response, cookieOptions?: CsrfCookieOptions): Response {
  const token = generateCsrfToken()
  return setCsrfCookie(response, token, cookieOptions)
}
