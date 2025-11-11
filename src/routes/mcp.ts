import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFileRoute } from "@tanstack/react-router";
import { handleMcpRequest } from "../utils/mcp-handler";


// In-memory todos storage (server-side only)
const todos: Array<{ id: number; title: string }> = [
	{ id: 1, title: "Buy groceries" },
];

/**
 * Create a new todo, append it to the server's in-memory todo list, and return the created item.
 *
 * @param title - The todo's title
 * @returns The created todo object with `id` and `title`
 */
function addTodo(title: string) {
	const newTodo = { id: todos.length + 1, title };
	todos.push(newTodo);
	return newTodo;
}

const server = new McpServer({
	name: "start-server",
	version: "1.0.0",
});

server.registerTool(
	"addTodo",
	{
		title: "Tool to add a todo to a list of todos",
		description: "Add a todo to a list of todos",
		inputSchema: {
			type: "object",
			properties: {
				title: {
					type: "string",
					description: "The title of the todo",
				},
			},
			required: ["title"],
		},
	} as any,
	(({ title }: any) => ({
		content: [{ type: "text", text: String(addTodo(title)) }],
	})) as any,
);

// server.registerResource(
//   "counter-value",
//   "count://",
//   {
//     title: "Counter Resource",
//     description: "Returns the current value of the counter",
//   },
//   async (uri) => {
//     return {
//       contents: [
//         {
//           uri: uri.href,
//           text: `The counter is at 20!`,
//         },
//       ],
//     };
//   }
// );

export const Route = createFileRoute("/mcp")({
	server: {
		handlers: {
			POST: async ({ request }) => handleMcpRequest(request, server),
		},
	},
});