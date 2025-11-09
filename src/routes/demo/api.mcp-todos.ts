import { createFileRoute } from "@tanstack/react-router";
import {
	createCsrfErrorResponse,
	ensureCsrfToken,
	validateCsrfRequest,
} from "@/lib/csrf-protection";
import { addTodo, getTodos, subscribeToTodos } from "@/mcp-todos";

export const Route = createFileRoute("/demo/api/mcp-todos")({
	server: {
		handlers: {
			GET: ({ request }) => {
				const stream = new ReadableStream({
					start(controller) {
						function ping() {
							try {
								controller.enqueue(`event: ping\n\n`);
								setTimeout(ping, 1000);
							} catch {}
						}
						ping();
						const unsubscribe = subscribeToTodos((todos) => {
							controller.enqueue(`data: ${JSON.stringify(todos)}\n\n`);
						});
						const todos = getTodos();
						controller.enqueue(`data: ${JSON.stringify(todos)}\n\n`);
						return () => unsubscribe();
					},
				});

				const response = new Response(stream, {
					headers: { "Content-Type": "text/event-stream" },
				});

				// Ensure CSRF token exists on GET response
				return ensureCsrfToken(response);
			},
			POST: async ({ request }) => {
				// CSRF Protection: POST method requires CSRF token validation
				const validation = validateCsrfRequest(request);
				if (!validation.valid) {
					console.warn(
						"[CSRF] Validation failed for /demo/api/mcp-todos:",
						validation.error,
					);
					return createCsrfErrorResponse(validation.error!);
				}

				const { title } = await request.json();
				addTodo(title);
				return Response.json(getTodos());
			},
		},
	},
});
