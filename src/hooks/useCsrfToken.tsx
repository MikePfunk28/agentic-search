import { useEffect, useState } from "react";

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
