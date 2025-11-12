import { createFileRoute } from "@tanstack/react-router";
import { generateCsrfToken, setCsrfCookie } from "@/lib/csrf-protection";

export const Route = createFileRoute("/api/csrf-token")({
	server: {
		handlers: {
			GET: async () => {
				const token = generateCsrfToken();
				const response = new Response(
					JSON.stringify({ token }),
					{
						status: 200,
						headers: { "Content-Type": "application/json" },
					},
				);
				return setCsrfCookie(response, token);
			},
		},
	},
});
