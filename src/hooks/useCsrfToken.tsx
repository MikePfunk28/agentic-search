/**
 * React Hook for CSRF Token Management
 *
 * Provides automatic CSRF token retrieval from cookies and
 * inclusion in fetch requests.
 */

import { useEffect, useState } from "react";

/**
 * Get CSRF token from document cookies
 */
function getCsrfTokenFromCookies(
	cookieName: string = "csrf-token",
): string | null {
	if (typeof document === "undefined") {
		return null;
	}

	const cookies = document.cookie.split(";").map((c) => c.trim());
	const csrfCookie = cookies.find((c) => c.startsWith(`${cookieName}=`));

	if (!csrfCookie) {
		return null;
	}

	return csrfCookie.split("=")[1] || null;
}

/**
 * Exposes the current CSRF token read from cookies and any initialization error.
 *
 * If the token is not present in cookies on first use, the hook attempts to obtain one from the server
 * and then keeps the returned token synchronized with subsequent cookie changes.
 *
 * @param cookieName - Name of the cookie that stores the CSRF token. Defaults to `"csrf-token"`.
 * @returns An object containing:
 *  - `token`: the current CSRF token string, or `null` if unavailable.
 *  - `error`: an error message string if initialization or fetch failed, or `null` otherwise.
 */
export function useCsrfToken(cookieName: string = "csrf-token") {
	const [token, setToken] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		if (isInitialized) return;

		const csrfToken = getCsrfTokenFromCookies(cookieName);

		if (csrfToken) {
			setToken(csrfToken);
			setError(null);
			setIsInitialized(true);
		} else {
			// Fetch token from server if not in cookie
			fetch("/api/csrf-token")
				.then((res) => res.json())
				.then((data) => {
					// Cookie is set by server, read it
					const newToken = getCsrfTokenFromCookies(cookieName);
					if (newToken) {
						setToken(newToken);
						setError(null);
					} else {
						setError("Failed to initialize CSRF token");
					}
					setIsInitialized(true);
				})
				.catch((err) => {
					console.error("Failed to fetch CSRF token:", err);
					setError("Failed to fetch CSRF token");
					setIsInitialized(true);
				});
		}
	}, [cookieName, isInitialized]);

	// Watch for cookie changes (token rotation)
	useEffect(() => {
		if (!isInitialized) return;

		const interval = setInterval(() => {
			const currentToken = getCsrfTokenFromCookies(cookieName);
			if (currentToken !== token) {
				setToken(currentToken);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [cookieName, token, isInitialized]);

	return { token, error };
}

/**
 * Enhanced fetch that automatically includes CSRF token
 */
export interface CsrfFetchOptions extends RequestInit {
	csrfToken?: string;
	csrfHeaderName?: string;
}

export async function csrfFetch(
	url: string | URL,
	options: CsrfFetchOptions = {},
): Promise<Response> {
	const {
		csrfToken,
		csrfHeaderName = "X-CSRF-Token",
		headers = {},
		...fetchOptions
	} = options;

	// Get token from options or cookies
	const token = csrfToken || getCsrfTokenFromCookies();

	if (!token) {
		throw new Error(
			"CSRF token not available. Ensure the server has set the csrf-token cookie.",
		);
	}

	// Add CSRF token to headers
	const enhancedHeaders = new Headers(headers);
	enhancedHeaders.set(csrfHeaderName, token);

	return fetch(url, {
		...fetchOptions,
		headers: enhancedHeaders,
	});
}

/**
 * Hook for CSRF-protected fetch
 * Returns a fetch function that automatically includes CSRF token
 */
export function useCsrfFetch(cookieName: string = "csrf-token") {
	const { token, error } = useCsrfToken(cookieName);

	const csrfProtectedFetch = async (
		url: string | URL,
		options: RequestInit = {},
	): Promise<Response> => {
		if (!token) {
			throw new Error(error || "CSRF token not available");
		}

		return csrfFetch(url, {
			...options,
			csrfToken: token,
		});
	};

	return {
		fetch: csrfProtectedFetch,
		token,
		error,
		isReady: !!token,
	};
}

/**
 * Create fetch headers with CSRF token
 */
export function createCsrfHeaders(
	token?: string,
	additionalHeaders: HeadersInit = {},
): Headers {
	const csrfToken = token || getCsrfTokenFromCookies();

	if (!csrfToken) {
		throw new Error("CSRF token not available");
	}

	const headers = new Headers(additionalHeaders);
	headers.set("X-CSRF-Token", csrfToken);

	return headers;
}

/**
 * Utility to check if CSRF token is present
 */
export function hasCsrfToken(cookieName: string = "csrf-token"): boolean {
	return getCsrfTokenFromCookies(cookieName) !== null;
}