import { createFileRoute } from "@tanstack/react-router";
import SearchHistory from "../components/SearchHistory";

export const Route = createFileRoute("/history")({
	component: SearchHistoryPage,
});

function SearchHistoryPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="container mx-auto px-4 py-8">
				<SearchHistory />
			</div>
		</div>
	);
}
