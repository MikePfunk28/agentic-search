import "@/polyfill.ts";

import { RPCHandler } from "@orpc/server/fetch";
import { createFileRoute } from "@tanstack/react-router";
import {
	createCsrfErrorResponse,
	ensureCsrfToken,
	requiresCsrfProtection,
	validateCsrfRequest,
} from "@/lib/csrf-protection";
import router from "@/orpc/router";

const handler = new RPCHandler(router);

async function handle({ request }: { request: Request }) {
	// CSRF Protection: Validate tokens for state-changing methods
	if (requiresCsrfProtection(request.method)) {
		const validation = validateCsrfRequest(request);
		if (!validation.valid) {
			console.warn(
				"[CSRF] Validation failed for /api/rpc/*:",
				validation.error,
			);
			return createCsrfErrorResponse(validation.error!);
		}
	}

	const { response } = await handler.handle(request, {
		prefix: "/api/rpc",
		context: {},
	});

	const finalResponse = response ?? new Response("Not Found", { status: 404 });

	// Ensure CSRF token exists on response for safe methods
	if (!requiresCsrfProtection(request.method)) {
		return ensureCsrfToken(finalResponse);
	}

	return finalResponse;
}

export const Route = createFileRoute("/api/rpc/$")({
	server: {
		handlers: {
			HEAD: handle,
			GET: handle,
			POST: handle,
			PUT: handle,
			PATCH: handle,
			DELETE: handle,
		},
	},
});
