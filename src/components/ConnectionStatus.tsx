/**
 * ConnectionStatus Component
 * Displays test connection status with latency indicator
 */

import { AlertCircle, CheckCircle, Loader2, XCircle, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface ConnectionStatusProps {
	isConnected: boolean | null;
	latency?: number;
	error?: string;
	provider: string;
	onTest?: () => Promise<void>;
	isTesting?: boolean;
}

export function ConnectionStatus({
	isConnected,
	latency,
	error,
	provider,
	onTest,
	isTesting = false,
}: ConnectionStatusProps) {
	const [showDetails, setShowDetails] = useState(false);

	// Show details automatically when there's an error
	useEffect(() => {
		if (error) {
			setShowDetails(true);
		}
	}, [error]);

	const getStatusColor = () => {
		if (isConnected === null) return "gray";
		if (isConnected) return "green";
		return "red";
	};

	const getLatencyColor = (ms: number) => {
		if (ms < 500) return "text-green-600";
		if (ms < 1000) return "text-yellow-600";
		return "text-orange-600";
	};

	const getLatencyLabel = (ms: number) => {
		if (ms < 500) return "Excellent";
		if (ms < 1000) return "Good";
		if (ms < 2000) return "Fair";
		return "Slow";
	};

	const statusColor = getStatusColor();

	return (
		<div className="w-full">
			<div
				className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-200
                   ${
											statusColor === "green"
												? "bg-green-50 border-green-200"
												: statusColor === "red"
													? "bg-red-50 border-red-200"
													: "bg-gray-50 border-gray-200"
										}`}
			>
				{/* Status icon */}
				<div>
					{isTesting ? (
						<Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
					) : isConnected === true ? (
						<CheckCircle className="w-5 h-5 text-green-600" />
					) : isConnected === false ? (
						<XCircle className="w-5 h-5 text-red-600" />
					) : (
						<AlertCircle className="w-5 h-5 text-gray-400" />
					)}
				</div>

				{/* Status text */}
				<div className="flex-1">
					<div className="font-medium text-gray-900">
						{isTesting
							? `Testing ${provider} connection...`
							: isConnected === true
								? `Connected to ${provider}`
								: isConnected === false
									? `Connection failed`
									: `Connection not tested`}
					</div>

					{/* Latency indicator */}
					{latency !== undefined && isConnected && (
						<div className="flex items-center gap-2 mt-1">
							<Zap className={`w-4 h-4 ${getLatencyColor(latency)}`} />
							<span
								className={`text-sm font-medium ${getLatencyColor(latency)}`}
							>
								{latency}ms - {getLatencyLabel(latency)}
							</span>
						</div>
					)}
				</div>

				{/* Test button */}
				{onTest && (
					<button
						type="button"
						onClick={onTest}
						disabled={isTesting}
						className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg
                       hover:bg-primary-700 active:bg-primary-800
                       disabled:bg-gray-300 disabled:cursor-not-allowed
                       transition-colors duration-200"
					>
						{isTesting ? "Testing..." : "Test Connection"}
					</button>
				)}

				{/* Show details toggle */}
				{(error || latency !== undefined) && (
					<button
						type="button"
						onClick={() => setShowDetails(!showDetails)}
						className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
					>
						{showDetails ? "Hide details" : "Show details"}
					</button>
				)}
			</div>

			{/* Detailed information */}
			{showDetails && (
				<div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
					{error && (
						<div className="flex items-start gap-2 text-red-700 mb-2">
							<AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
							<div>
								<div className="font-medium">Error Details:</div>
								<div className="mt-1 font-mono text-xs bg-red-100 p-2 rounded">
									{error}
								</div>
							</div>
						</div>
					)}

					{latency !== undefined && (
						<div className="text-gray-700">
							<div className="font-medium">Connection Details:</div>
							<div className="mt-1 space-y-1">
								<div className="flex justify-between">
									<span>Latency:</span>
									<span className="font-mono">{latency}ms</span>
								</div>
								<div className="flex justify-between">
									<span>Status:</span>
									<span className={`font-medium ${getLatencyColor(latency)}`}>
										{getLatencyLabel(latency)}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
