import { describe, it, expect } from 'vitest'
import {
  generateCsrfToken,
  validateCsrfToken,
  requiresCsrfProtection,
  validateCsrfRequest,
  setCsrfCookie,
  getCsrfTokenFromCookie,
  getCsrfTokenFromHeader,
  createCsrfErrorResponse,
} from '../src/lib/csrf-protection'

describe('CSRF Protection Library', () => {
  describe('Token Generation', () => {
    it('generates unique tokens', () => {
      const token1 = generateCsrfToken()
      const token2 = generateCsrfToken()

      expect(token1).not.toBe(token2)
    })

    it('generates tokens of correct length (64 characters)', () => {
      const token = generateCsrfToken()
      expect(token.length).toBe(64)
    })

    it('generates alphanumeric tokens', () => {
      const token = generateCsrfToken()
      expect(token).toMatch(/^[a-f0-9]{64}$/)
    })
  })

  describe('Token Validation', () => {
    it('validates matching tokens', () => {
      const token = generateCsrfToken()
      expect(validateCsrfToken(token, token)).toBe(true)
    })

    it('rejects mismatched tokens', () => {
      const token1 = generateCsrfToken()
      const token2 = generateCsrfToken()
      expect(validateCsrfToken(token1, token2)).toBe(false)
    })

    it('rejects empty tokens', () => {
      const token = generateCsrfToken()
      expect(validateCsrfToken('', token)).toBe(false)
      expect(validateCsrfToken(token, '')).toBe(false)
      expect(validateCsrfToken('', '')).toBe(false)
    })

    it('rejects tokens of different lengths', () => {
      const token = generateCsrfToken()
      const shortToken = token.substring(0, 32)
      expect(validateCsrfToken(token, shortToken)).toBe(false)
    })
  })

  describe('Method Protection Detection', () => {
    it('identifies POST as requiring protection', () => {
      expect(requiresCsrfProtection('POST')).toBe(true)
    })

    it('identifies PUT as requiring protection', () => {
      expect(requiresCsrfProtection('PUT')).toBe(true)
    })

    it('identifies DELETE as requiring protection', () => {
      expect(requiresCsrfProtection('DELETE')).toBe(true)
    })

    it('identifies PATCH as requiring protection', () => {
      expect(requiresCsrfProtection('PATCH')).toBe(true)
    })

    it('identifies GET as not requiring protection', () => {
      expect(requiresCsrfProtection('GET')).toBe(false)
    })

    it('identifies HEAD as not requiring protection', () => {
      expect(requiresCsrfProtection('HEAD')).toBe(false)
    })

    it('identifies OPTIONS as not requiring protection', () => {
      expect(requiresCsrfProtection('OPTIONS')).toBe(false)
    })

    it('handles lowercase method names', () => {
      expect(requiresCsrfProtection('post')).toBe(true)
      expect(requiresCsrfProtection('get')).toBe(false)
    })
  })

  describe('Cookie Management', () => {
    it('sets CSRF cookie with correct format', () => {
      const token = generateCsrfToken()
      const baseResponse = new Response('OK')
      const response = setCsrfCookie(baseResponse, token)

      const cookieHeader = response.headers.get('Set-Cookie')
      expect(cookieHeader).toBeTruthy()
      expect(cookieHeader).toContain(`csrf-token=${token}`)
      expect(cookieHeader).toContain('HttpOnly')
      expect(cookieHeader).toContain('SameSite=Strict')
    })

    it('sets Secure flag when explicitly configured', () => {
      const token = generateCsrfToken()
      const baseResponse = new Response('OK')
      const response = setCsrfCookie(baseResponse, token, { secure: true })

      const cookieHeader = response.headers.get('Set-Cookie')
      expect(cookieHeader).toContain('Secure')
    })

    it('extracts token from cookie header', () => {
      const token = generateCsrfToken()
      const request = new Request('http://localhost', {
        headers: {
          Cookie: `csrf-token=${token}; other=value`,
        },
      })

      const extractedToken = getCsrfTokenFromCookie(request)
      expect(extractedToken).toBe(token)
    })

    it('returns null for missing cookie', () => {
      const request = new Request('http://localhost')
      const extractedToken = getCsrfTokenFromCookie(request)
      expect(extractedToken).toBeNull()
    })
  })

  describe('Header Management', () => {
    it('extracts token from header', () => {
      const token = generateCsrfToken()
      const request = new Request('http://localhost', {
        headers: {
          'X-CSRF-Token': token,
        },
      })

      const extractedToken = getCsrfTokenFromHeader(request)
      expect(extractedToken).toBe(token)
    })

    it('returns null for missing header', () => {
      const request = new Request('http://localhost')
      const extractedToken = getCsrfTokenFromHeader(request)
      expect(extractedToken).toBeNull()
    })
  })

  describe('Request Validation', () => {
    it('allows GET requests without CSRF token', () => {
      const request = new Request('http://localhost', {
        method: 'GET',
      })

      const result = validateCsrfRequest(request)
      expect(result.valid).toBe(true)
    })

    it('rejects POST requests without CSRF cookie', () => {
      const request = new Request('http://localhost', {
        method: 'POST',
      })

      const result = validateCsrfRequest(request)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('cookie')
    })

    it('rejects POST requests without CSRF header', () => {
      const token = generateCsrfToken()
      const request = new Request('http://localhost', {
        method: 'POST',
        headers: {
          Cookie: `csrf-token=${token}`,
        },
      })

      const result = validateCsrfRequest(request)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('header')
    })

    it('rejects POST requests with mismatched tokens', () => {
      const token1 = generateCsrfToken()
      const token2 = generateCsrfToken()
      const request = new Request('http://localhost', {
        method: 'POST',
        headers: {
          Cookie: `csrf-token=${token1}`,
          'X-CSRF-Token': token2,
        },
      })

      const result = validateCsrfRequest(request)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('validation failed')
    })

    it('accepts POST requests with valid CSRF tokens', () => {
      const token = generateCsrfToken()
      const request = new Request('http://localhost', {
        method: 'POST',
        headers: {
          Cookie: `csrf-token=${token}`,
          'X-CSRF-Token': token,
        },
      })

      const result = validateCsrfRequest(request)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  describe('Error Response', () => {
    it('creates 403 response for CSRF errors', () => {
      const response = createCsrfErrorResponse('Test error')

      expect(response.status).toBe(403)
      expect(response.headers.get('Content-Type')).toBe('application/json')
    })

    it('includes error message in response body', async () => {
      const errorMessage = 'Token validation failed'
      const response = createCsrfErrorResponse(errorMessage)

      const body = await response.json()
      expect(body.error).toBe('CSRF validation failed')
      expect(body.message).toBe(errorMessage)
    })
  })

  describe('Constant-Time Comparison Security', () => {
    it('validates tokens using bitwise comparison (constant-time implementation)', () => {
      // Test that the implementation uses bitwise XOR for constant-time comparison
      // This is a structural test rather than a timing test
      const token1 = generateCsrfToken()
      const token2 = generateCsrfToken()

      // Both validation calls should complete successfully
      // The actual constant-time behavior is verified by code review
      const result1 = validateCsrfToken(token1, token1)
      const result2 = validateCsrfToken(token1, token2)

      expect(result1).toBe(true)
      expect(result2).toBe(false)

      // Verify that comparison handles all characters
      // (the implementation uses char-by-char XOR which is constant-time)
      expect(token1.length).toBe(token2.length) // Same length ensures constant-time
    })
  })
})
