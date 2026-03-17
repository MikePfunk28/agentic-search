import { useEffect, useState } from "react";

let cachedCsrfToken: string | null = null;
let csrfFetchInFlight: Promise<string> | null = null;

async function requestCsrfToken(): Promise<string> {
	if (cachedCsrfToken) return cachedCsrfToken;
	if (csrfFetchInFlight) return csrfFetchInFlight;

	csrfFetchInFlight = (async () => {
		const res = await fetch("/api/csrf-token", { credentials: "same-origin" });
		if (!res.ok) {
			throw new Error(`CSRF token request failed (${res.status})`);
		}
		const data = await res.json();
		if (!data?.token || typeof data.token !== "string") {
			throw new Error("CSRF token missing in response");
		}
		cachedCsrfToken = data.token;
		return data.token;
	})();

	try {
		return await csrfFetchInFlight;
	} finally {
		csrfFetchInFlight = null;
	}
}

/**
 * Provides the CSRF token fetched from the server and any error encountered while retrieving it.
 *
 * @returns An object containing `token` — the CSRF token string or `null` if not yet available, and `error` — an `Error` instance if retrieval failed, otherwise `null`.
 */
export function useCsrfToken() {
	const [token, setToken] = useState<string | null>(cachedCsrfToken);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let cancelled = false;

		requestCsrfToken()
			.then((newToken) => {
				if (!cancelled) {
					setToken(newToken);
					setError(null);
				}
			})
			.catch((err) => {
				if (!cancelled) {
					setError(err instanceof Error ? err : new Error(String(err)));
				}
			});

		return () => {
			cancelled = true;
		};
	}, []);

	return { token, error };
}
