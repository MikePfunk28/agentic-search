import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { handleMcpRequest } from "../utils/mcp-handler";

// In-memory todos storage (server-side only)
const todos: Array<{ id: number; title: string }> = [
	{ id: 1, title: "Buy groceries" },
];

function addTodo(title: string) {
	const newTodo = { id: todos.length + 1, title };
	todos.push(newTodo);
	return newTodo;
}

const server = new McpServer({
	name: "start-server",
	version: "1.0.0",
});

interface AddTodoInput {
	title: string;
}

const addTodoHandler = ({ title }: AddTodoInput) => ({
	content: [{ type: "text" as const, text: JSON.stringify(addTodo(title)) }],
});

server.registerTool(
	"addTodo",
	{
		title: "Tool to add a todo to a list of todos",
		description: "Add a todo to a list of todos",
		inputSchema: {
			title: z.string().describe("The title of the todo"),
		},
	},
	addTodoHandler,
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
