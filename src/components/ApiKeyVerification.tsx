/**
 * API Key Verification Component
 * Tests and displays the status of API keys from Convex secure storage
 */

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Check, X, AlertCircle, Key, RefreshCw } from "lucide-react";
import { useState } from "react";

export function ApiKeyVerification() {
	const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
	const [isTesting, setIsTesting] = useState(false);

	// Get all API keys (masked) from Convex
	const apiKeys = useQuery(api.secureApiKeys.listApiKeys);

	const testApiKey = async (configId: string, provider: string) => {
		setIsTesting(true);
		try {
			// Simple test: make a minimal API call to verify the key works
			const response = await fetch("/api/test-key", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ configId, provider }),
			});

			const result = await response.json();
			setTestResults((prev) => ({
				...prev,
				[configId]: {
					success: result.success,
					message: result.message || (result.success ? "API key is valid" : "API key test failed"),
				},
			}));
		} catch (error) {
			setTestResults((prev) => ({
				...prev,
				[configId]: {
					success: false,
					message: error instanceof Error ? error.message : "Test failed",
				},
			}));
		} finally {
			setIsTesting(false);
		}
	};

	return (
		<div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
			<div className="flex items-center gap-2 mb-4">
				<Key className="w-5 h-5 text-cyan-400" />
				<h3 className="text-lg font-semibold text-white">API Key Verification</h3>
			</div>

			{!apiKeys ? (
				<div className="flex items-center gap-2 text-slate-400">
					<RefreshCw className="w-4 h-4 animate-spin" />
					<span>Loading API keys...</span>
				</div>
			) : apiKeys.length === 0 ? (
				<div className="text-center py-8 text-slate-400">
					<AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
					<p>No API keys configured yet.</p>
					<p className="text-sm mt-1">Configure API keys in Settings to enable cloud models.</p>
				</div>
			) : (
				<div className="space-y-3">
					{apiKeys.map((key) => {
						const testResult = testResults[key.configId];
						return (
							<div
								key={key.configId}
								className="bg-slate-900/50 border border-slate-700 rounded-lg p-4"
							>
								<div className="flex items-center justify-between mb-2">
									<div>
										<p className="font-mono text-sm text-white">{key.masked}</p>
										<p className="text-xs text-slate-400 mt-1">
											Added: {new Date(key.createdAt).toLocaleDateString()}
										</p>
									</div>

									<button
										onClick={() => testApiKey(key.configId, "anthropic")}
										disabled={isTesting}
										className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
									>
										{isTesting ? (
											<>
												<RefreshCw className="w-4 h-4 animate-spin" />
												Testing...
											</>
										) : (
											<>
												<RefreshCw className="w-4 h-4" />
												Test Key
											</>
										)}
									</button>
								</div>

								{testResult && (
									<div
										className={`flex items-start gap-2 mt-3 p-3 rounded-lg ${
											testResult.success
												? "bg-green-900/20 border border-green-700"
												: "bg-red-900/20 border border-red-700"
										}`}
									>
										{testResult.success ? (
											<Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
										) : (
											<X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
										)}
										<div>
											<p className={`font-medium ${testResult.success ? "text-green-400" : "text-red-400"}`}>
												{testResult.success ? "API Key Valid" : "API Key Invalid"}
											</p>
											<p className="text-sm text-slate-300 mt-1">{testResult.message}</p>
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}

			<div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
				<div className="flex items-start gap-2">
					<AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
					<div className="text-sm">
						<p className="font-medium text-blue-300 mb-1">Security Note</p>
						<p className="text-slate-300">
							API keys are stored securely in Convex with server-side encryption. They are never
							exposed to the browser or included in client-side code.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
