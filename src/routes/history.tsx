import { createFileRoute } from "@tanstack/react-router";
import SearchHistory from "../components/SearchHistory";
import { SearchHistoryPage as LocalSearchHistoryPage } from "../components/SearchHistoryPage";
import { useAppAuth } from "../hooks/useAppAuth";

export const Route = createFileRoute("/history")({
	component: SearchHistoryPage,
});

/**
 * Page component that renders the search history inside a themed, responsive container.
 *
 * @returns The React element for the history page, containing the SearchHistory component within layout and background styling.
 */
function SearchHistoryPage() {
	const { isAuthenticated, isLoading } = useAppAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
				<div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="container mx-auto px-4 py-8">
				{isAuthenticated ? <SearchHistory /> : <LocalSearchHistoryPage />}
			</div>
		</div>
	);
}
