import { createFileRoute } from "@tanstack/react-router";
import SearchHistory from "../components/SearchHistory";

export const Route = createFileRoute("/history")({
	component: SearchHistoryPage,
});

/**
 * Page component that renders the search history inside a themed, responsive container.
 *
 * @returns The React element for the history page, containing the SearchHistory component within layout and background styling.
 */
function SearchHistoryPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="container mx-auto px-4 py-8">
				<SearchHistory />
			</div>
		</div>
	);
}