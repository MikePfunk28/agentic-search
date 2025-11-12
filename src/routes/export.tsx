import { createFileRoute } from "@tanstack/react-router";
import DatasetExportDashboard from "../components/DatasetExportDashboard";

export const Route = createFileRoute("/export")({
	component: DatasetExportPage,
});

/**
 * Renders the dataset export page layout with a full-height gradient background and centered dashboard.
 *
 * @returns The JSX element containing a responsive container and the DatasetExportDashboard component.
 */
function DatasetExportPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="container mx-auto px-4 py-8">
				<DatasetExportDashboard />
			</div>
		</div>
	);
}