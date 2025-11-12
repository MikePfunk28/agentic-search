import { createFileRoute } from "@tanstack/react-router";
import DatasetExportDashboard from "../components/DatasetExportDashboard";

export const Route = createFileRoute("/export")({
	component: DatasetExportPage,
});

function DatasetExportPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="container mx-auto px-4 py-8">
				<DatasetExportDashboard />
			</div>
		</div>
	);
}
