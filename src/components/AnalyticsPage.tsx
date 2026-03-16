import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { useAppAuth } from "../hooks/useAppAuth";

interface Summary {
	total: number;
	top: [string, number][];
}

export default function AnalyticsPage() {
	const [summary, setSummary] = useState<Summary | null>(null);
	const { user } = useAppAuth();

	const result = useQuery(api.searchAnalytics.getAnalyticsSummary, {
		userId: user?._id || "",
	});

	useEffect(() => {
		if (result) setSummary(result as Summary);
	}, [result]);

	if (!summary) return <div>Loading analytics...</div>;

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Search Analytics</h1>
			<p>Total searches: {summary.total}</p>
			<h2 className="mt-6 text-xl font-semibold">Top Queries</h2>
			<ul className="list-disc list-inside">
				{summary.top.map(([q, count]) => (
					<li key={q}>
						<span className="font-mono">{q}</span> – {count} times
					</li>
				))}
			</ul>
		</div>
	);
}
