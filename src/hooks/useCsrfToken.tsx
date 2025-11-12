import { useEffect, useState } from "react";

/**
 * Provides the CSRF token fetched from the server and any error encountered while retrieving it.
 *
 * @returns An object containing `token` — the CSRF token string or `null` if not yet available, and `error` — an `Error` instance if retrieval failed, otherwise `null`.
 */
export function useCsrfToken() {
	const [token, setToken] = useState<string | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		fetch("/api/csrf-token")
			.then((res) => res.json())
			.then((data) => setToken(data.token))
			.catch((err) => setError(err));
	}, []);

	return { token, error };
}