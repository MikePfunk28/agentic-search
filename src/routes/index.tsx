import { createFileRoute } from "@tanstack/react-router";
import { AgenticChat } from "../components/AgenticChat";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="h-screen bg-slate-900">
			<AgenticChat />
		</div>
	);
}
