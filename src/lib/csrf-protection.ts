/**
 * CSRF Protection Library
 *
 * Implements Cross-Site Request Forgery protection using cryptographically
 * secure tokens, SameSite cookies, and header-based validation.
 */

/**
 * Generate a cryptographically secure CSRF token
 * Uses crypto.randomUUID for secure random generation (minimum 32 bytes)
 */
export function generateCsrfToken(): string {
  // Use crypto.randomUUID which provides 128-bit (16 bytes) UUID v4
  // For enhanced security, we'll concatenate two UUIDs to get 256 bits (32 bytes)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, '')
  }

  // Fallback for Node.js environments
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.randomUUID) {
    return `${globalThis.crypto.randomUUID()}${globalThis.crypto.randomUUID()}`.replace(/-/g, '')
  }

  throw new Error('crypto.randomUUID is not available')
}

/**
 * Validate CSRF token by comparing header token with cookie token
 * Uses constant-time comparison to prevent timing attacks
 */
export function validateCsrfToken(cookieToken: string, headerToken: string): boolean {
  if (!cookieToken || !headerToken) {
    return false
  }

  // Ensure tokens are the same length to prevent timing attacks
  if (cookieToken.length !== headerToken.length) {
    return false
  }

  // Constant-time comparison to prevent timing attacks
  let result = 0
  for (let i = 0; i < cookieToken.length; i++) {
    result |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i)
  }

  return result === 0
}

/**
 * Cookie configuration options
 */
export interface CsrfCookieOptions {
  name?: string
  maxAge?: number
  path?: string
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
}

/**
 * Default cookie options for CSRF tokens
 */
export const DEFAULT_CSRF_COOKIE_OPTIONS: Required<CsrfCookieOptions> = {
  name: 'csrf-token',
  maxAge: 3600, // 1 hour
  path: '/',
  domain: '',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'Strict',
}

/**
 * Set CSRF token as an HTTP-only, Secure, SameSite cookie
 */
export function setCsrfCookie(
  response: Response,
  token: string,
  options: CsrfCookieOptions = {}
): Response {
  const opts = { ...DEFAULT_CSRF_COOKIE_OPTIONS, ...options }

  const cookieParts = [
    `${opts.name}=${token}`,
    `Max-Age=${opts.maxAge}`,
    `Path=${opts.path}`,
  ]

  if (opts.domain) {
    cookieParts.push(`Domain=${opts.domain}`)
  }

  if (opts.secure) {
    cookieParts.push('Secure')
  }

  if (opts.httpOnly) {
    cookieParts.push('HttpOnly')
  }

  cookieParts.push(`SameSite=${opts.sameSite}`)

  const cookieHeader = cookieParts.join('; ')

  // Clone response to add cookie header
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  })

  newResponse.headers.append('Set-Cookie', cookieHeader)

  return newResponse
}

/**
 * Extract CSRF token from cookie header
 */
export function getCsrfTokenFromCookie(
  request: Request,
  cookieName: string = DEFAULT_CSRF_COOKIE_OPTIONS.name
): string | null {
  const cookieHeader = request.headers.get('Cookie')
  if (!cookieHeader) {
    return null
  }

  const cookies = cookieHeader.split(';').map(c => c.trim())
  const csrfCookie = cookies.find(c => c.startsWith(`${cookieName}=`))

  if (!csrfCookie) {
    return null
  }

  return csrfCookie.split('=')[1] || null
}

/**
 * Extract CSRF token from request header
 */
export function getCsrfTokenFromHeader(
  request: Request,
  headerName: string = 'X-CSRF-Token'
): string | null {
  return request.headers.get(headerName)
}

/**
 * Check if HTTP method requires CSRF protection
 * Only state-changing methods need protection
 */
export function requiresCsrfProtection(method: string): boolean {
  const protectedMethods = ['POST', 'PUT', 'DELETE', 'PATCH']
  return protectedMethods.includes(method.toUpperCase())
}

/**
 * CSRF validation result
 */
export interface CsrfValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate CSRF token for a request
 */
export function validateCsrfRequest(request: Request): CsrfValidationResult {
  // Skip validation for safe methods
  if (!requiresCsrfProtection(request.method)) {
    return { valid: true }
  }

  // Get tokens from cookie and header
  const cookieToken = getCsrfTokenFromCookie(request)
  const headerToken = getCsrfTokenFromHeader(request)

  if (!cookieToken) {
    return {
      valid: false,
      error: 'CSRF token missing from cookie',
    }
  }

  if (!headerToken) {
    return {
      valid: false,
      error: 'CSRF token missing from header',
    }
  }

  // Validate tokens match
  if (!validateCsrfToken(cookieToken, headerToken)) {
    return {
      valid: false,
      error: 'CSRF token validation failed',
    }
  }

  return { valid: true }
}

/**
 * Create a 403 Forbidden response for CSRF validation failures
 */
export function createCsrfErrorResponse(error: string): Response {
  return new Response(
    JSON.stringify({
      error: 'CSRF validation failed',
      message: error,
    }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

/**
 * CSRF middleware for TanStack Start
 * Automatically validates CSRF tokens and rotates them on each request
 */
export interface CsrfMiddlewareOptions {
  cookieOptions?: CsrfCookieOptions
  rotateTokens?: boolean
  skipPaths?: string[]
}

export function createCsrfMiddleware(options: CsrfMiddlewareOptions = {}) {
  const { cookieOptions, rotateTokens = true, skipPaths = [] } = options

  return async (request: Request, next: () => Promise<Response>): Promise<Response> => {
    // Check if path should skip CSRF protection
    const url = new URL(request.url)
    if (skipPaths.some(path => url.pathname.startsWith(path))) {
      return next()
    }

    // Validate CSRF token for protected methods
    const validation = validateCsrfRequest(request)
    if (!validation.valid) {
      return createCsrfErrorResponse(validation.error!)
    }

    // Execute the handler
    let response = await next()

    // Rotate token if enabled (for enhanced security)
    if (rotateTokens) {
      const newToken = generateCsrfToken()
      response = setCsrfCookie(response, newToken, cookieOptions)
    }

    return response
  }
}

/**
 * Utility to ensure CSRF token exists on response
 * Useful for initial page loads
 */
export function ensureCsrfToken(response: Response, cookieOptions?: CsrfCookieOptions): Response {
  const cookieHeader = response.headers.get('Set-Cookie')
  const cookieName = cookieOptions?.name || DEFAULT_CSRF_COOKIE_OPTIONS.name

  // Check if CSRF cookie is already being set
  if (cookieHeader && cookieHeader.includes(cookieName)) {
    return response
  }

  // Generate and set new token
  const token = generateCsrfToken()
  return setCsrfCookie(response, token, cookieOptions)
}
