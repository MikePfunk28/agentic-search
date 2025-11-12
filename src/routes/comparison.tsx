import { createFileRoute } from "@tanstack/react-router";
import SearchComparisonDashboard from "../components/SearchComparisonDashboard";

export const Route = createFileRoute("/comparison")({
	component: ComparisonPage,
});

function ComparisonPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="container mx-auto px-4 py-8">
				<SearchComparisonDashboard />
			</div>
		</div>
	);
}
