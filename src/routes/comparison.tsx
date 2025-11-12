import { createFileRoute } from "@tanstack/react-router";
import SearchComparisonDashboard from "../components/SearchComparisonDashboard";

export const Route = createFileRoute("/comparison")({
	component: ComparisonPage,
});

/**
 * Renders the comparison page with a full-height gradient background and a centered SearchComparisonDashboard.
 *
 * @returns The rendered JSX element for the comparison page.
 */
function ComparisonPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="container mx-auto px-4 py-8">
				<SearchComparisonDashboard />
			</div>
		</div>
	);
}