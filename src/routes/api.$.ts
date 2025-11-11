import "@/polyfill.ts";

import { experimental_SmartCoercionPlugin as SmartCoercionPlugin } from "@orpc/json-schema";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { createFileRoute } from "@tanstack/react-router";
import {
	createCsrfErrorResponse,
	ensureCsrfToken,
	requiresCsrfProtection,
	validateCsrfRequest,
} from "@/lib/csrf-protection.ts";
import router from "@/orpc/router.ts";
import { TodoSchema } from "@/orpc/schema.ts";

const handler = new OpenAPIHandler(router, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
	plugins: [
		new SmartCoercionPlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
			specGenerateOptions: {
				info: {
					title: "TanStack ORPC Playground",
					version: "1.0.0",
				},
				commonSchemas: {
					Todo: { schema: TodoSchema },
					UndefinedError: { error: "UndefinedError" },
				},
				security: [{ bearerAuth: [] }],
				components: {
					securitySchemes: {
						bearerAuth: {
							type: "http",
							scheme: "bearer",
						},
					},
				},
			},
			docsConfig: {
				authentication: {
					securitySchemes: {
						bearerAuth: {
							token: "default-token",
						},
					},
				},
			},
		}),
	],
});

async function handle({ request }: { request: Request }) {
	// CSRF Protection: Validate tokens for state-changing methods
	if (requiresCsrfProtection(request.method)) {
		const validation = validateCsrfRequest(request);
		if (!validation.valid) {
			console.warn("[CSRF] Validation failed for /api/*:", validation.error);
			return createCsrfErrorResponse(validation.error!);
		}
	}

	const { response } = await handler.handle(request, {
		prefix: "/api",
		context: {},
	});

	const finalResponse = response ?? new Response("Not Found", { status: 404 });

	// Ensure CSRF token exists on response for safe methods
	if (!requiresCsrfProtection(request.method)) {
		return ensureCsrfToken(finalResponse);
	}

	return finalResponse;
}

export const Route = createFileRoute("/api/$")({
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
