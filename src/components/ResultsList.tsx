/**
 * ResultsList Component
 * Displays search results with ADD scores and OCR savings
 */

import {
	Calendar,
	ExternalLink,
	FileText,
	Star,
	ThumbsUp,
	TrendingUp,
	Volume2,
	VolumeX,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { useSpeechSynthesis } from "../hooks/useSpeech";
import type { OCRResult, SearchResult } from "../lib/types";

interface ResultsListProps {
	results: SearchResult[];
	ocrResults?: OCRResult[];
	tokenSavings?: number;
	isLoading?: boolean;
	ragMetadata?: {
		level?: string;
		chunkCount?: number;
		latencyMs?: number;
		tokensUsed?: number;
	};
	onRateRag?: (
		rating: number,
		preferredSource: "rag" | "web" | "merged",
		feedback?: string,
	) => void;
}

export function ResultsList({
	results,
	ocrResults,
	tokenSavings,
	isLoading = false,
	ragMetadata,
	onRateRag,
}: ResultsListProps) {
	if (isLoading) {
		return (
			<div className="w-full max-w-4xl mx-auto space-y-4">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="p-6 bg-white border border-gray-200 rounded-xl animate-pulse"
					>
						<div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
						<div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
						<div className="h-4 bg-gray-200 rounded w-5/6"></div>
					</div>
				))}
			</div>
		);
	}

	if (results.length === 0) {
		return (
			<div className="w-full max-w-4xl mx-auto text-center py-12">
				<div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
					<FileText className="w-8 h-8 text-gray-400" />
				</div>
				<h3 className="text-lg font-medium text-gray-900 mb-2">
					No results yet
				</h3>
				<p className="text-gray-600">
					Start a search to see AI-powered results
				</p>
			</div>
		);
	}

	return (
		<div className="w-full max-w-4xl mx-auto">
			{/* Token Savings Banner */}
			{tokenSavings && tokenSavings > 0 && (
				<div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
					<div className="flex items-center gap-3">
						<div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
							<Zap className="w-5 h-5 text-green-600" />
						</div>
						<div>
							<h4 className="font-semibold text-green-900">
								DeepSeek OCR Active - 10x Token Savings
							</h4>
							<p className="text-sm text-green-700">
								Saved {tokenSavings.toFixed(1)}% tokens through intelligent
								document compression
							</p>
						</div>
					</div>
				</div>
			)}

			{/* OCR Results Summary */}
			{ocrResults && ocrResults.length > 0 && (
				<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
					<div className="flex items-center gap-3">
						<FileText className="w-5 h-5 text-blue-600" />
						<div>
							<h4 className="font-semibold text-blue-900">
								Processed {ocrResults.length} document
								{ocrResults.length > 1 ? "s" : ""} with OCR
							</h4>
							<p className="text-sm text-blue-700">
								Average compression:{" "}
								{(
									ocrResults.reduce((sum, r) => sum + r.savings, 0) /
									ocrResults.length
								).toFixed(1)}
								%
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Results Count + Read All */}
			<div className="mb-4 flex items-center justify-between">
				<p className="text-sm text-gray-600">
					Found{" "}
					<span className="font-semibold text-gray-900">{results.length}</span>{" "}
					results
				</p>
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<Star className="w-4 h-4 text-yellow-500" />
						<span>Sorted by ADD Quality Score</span>
					</div>
				</div>
			</div>

			{/* Results */}
			<div className="space-y-4">
				{results.map((result, index) => (
					<ResultCard key={result.id} result={result} rank={index + 1} />
				))}
			</div>

			{/* RAG Rating Widget */}
			{ragMetadata?.level && ragMetadata.level !== "none" && onRateRag && (
				<RagRatingWidget ragMetadata={ragMetadata} onRate={onRateRag} />
			)}
		</div>
	);
}

function ResultCard({ result, rank }: { result: SearchResult; rank: number }) {
	const hasHighScore = result.addScore && result.addScore > 0.7;
	const {
		supported: ttsSupported,
		speaking,
		speak,
		stop,
	} = useSpeechSynthesis();

	const handleReadAloud = () => {
		if (speaking) {
			stop();
		} else {
			const text = `${result.title}. ${result.snippet}`;
			speak(text);
		}
	};

	return (
		<div
			className={`p-6 bg-white border-2 rounded-xl transition-all duration-200 hover:shadow-lg hover:border-primary-300
        ${hasHighScore ? "border-primary-200 bg-primary-50/30" : "border-gray-200"}`}
		>
			{/* Header */}
			<div className="flex items-start justify-between gap-4 mb-3">
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-2">
						{/* Rank Badge */}
						<span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
							{rank}
						</span>

						{/* ADD Score Badge */}
						{result.addScore !== undefined && (
							<div
								className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1
                  ${
										hasHighScore
											? "bg-green-100 text-green-800"
											: result.addScore > 0.5
												? "bg-yellow-100 text-yellow-800"
												: "bg-gray-100 text-gray-700"
									}`}
							>
								<TrendingUp className="w-3 h-3" />
								ADD Score: {result.addScore.toFixed(2)}
							</div>
						)}

						{/* Source Badge */}
						<span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
							{result.source}
						</span>

						{/* Read Aloud Button */}
						{ttsSupported && (
							<button
								type="button"
								onClick={handleReadAloud}
								className={`p-1 rounded-full transition-colors duration-200
									${speaking ? "bg-primary-100 text-primary-700 hover:bg-primary-200" : "text-gray-400 hover:text-primary-600 hover:bg-gray-100"}`}
								title={speaking ? "Stop reading" : "Read aloud"}
								aria-label={speaking ? "Stop reading" : "Read aloud"}
							>
								{speaking ? (
									<VolumeX className="w-4 h-4" />
								) : (
									<Volume2 className="w-4 h-4" />
								)}
							</button>
						)}
					</div>

					{/* Title */}
					<a
						href={result.url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-lg font-semibold text-primary-700 hover:text-primary-800 hover:underline flex items-center gap-2 group"
					>
						{result.title}
						<ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
					</a>
				</div>
			</div>

			{/* Snippet */}
			<p className="text-gray-700 mb-3 leading-relaxed">{result.snippet}</p>

			{/* Metadata */}
			<div className="flex items-center gap-4 text-sm text-gray-600">
				{/* URL */}
				<div className="flex items-center gap-1">
					<ExternalLink className="w-3.5 h-3.5" />
					<span className="truncate max-w-xs">
						{new URL(result.url).hostname}
					</span>
				</div>

				{/* Published Date */}
				{result.publishedDate && (
					<div className="flex items-center gap-1">
						<Calendar className="w-3.5 h-3.5" />
						<span>{new Date(result.publishedDate).toLocaleDateString()}</span>
					</div>
				)}
			</div>

			{/* OCR Data */}
			{result.ocrData && (
				<div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
					<div className="flex items-center gap-2 text-sm">
						<FileText className="w-4 h-4 text-green-600" />
						<span className="font-medium text-green-900">OCR Processed</span>
						<span className="text-green-700">
							{result.ocrData.savings.toFixed(1)}% token savings
						</span>
					</div>
				</div>
			)}
		</div>
	);
}

/** Inline rating widget shown when RAG results are blended into the search. */
function RagRatingWidget({
	ragMetadata,
	onRate,
}: {
	ragMetadata: {
		level?: string;
		chunkCount?: number;
		latencyMs?: number;
		tokensUsed?: number;
	};
	onRate: (
		rating: number,
		preferredSource: "rag" | "web" | "merged",
		feedback?: string,
	) => void;
}) {
	const [rating, setRating] = useState(0);
	const [preferred, setPreferred] = useState<"rag" | "web" | "merged" | null>(
		null,
	);
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = () => {
		if (rating > 0 && preferred) {
			onRate(rating, preferred);
			setSubmitted(true);
		}
	};

	if (submitted) {
		return (
			<div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
				<ThumbsUp className="w-5 h-5 text-green-600 mx-auto mb-2" />
				<p className="text-sm font-medium text-green-900">
					Thanks for your feedback!
				</p>
				<p className="text-xs text-green-700 mt-1">
					This helps improve RAG quality scoring.
				</p>
			</div>
		);
	}

	return (
		<div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
			<div className="flex items-center gap-2">
				<Star className="w-4 h-4 text-yellow-500" />
				<h4 className="text-sm font-semibold text-gray-900">
					Rate This Search ({ragMetadata.chunkCount} KB chunks blended,{" "}
					{ragMetadata.level} mode)
				</h4>
			</div>

			{/* Star rating */}
			<div className="flex items-center gap-1">
				{[1, 2, 3, 4, 5].map((v) => (
					<button
						key={v}
						type="button"
						onClick={() => setRating(v)}
						className="p-0.5 transition-colors"
						aria-label={`Rate ${v} stars`}
					>
						<Star
							className={`w-5 h-5 ${v <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
						/>
					</button>
				))}
				<span className="ml-2 text-xs text-gray-500">
					{rating > 0 ? `${rating}/5` : "Rate quality"}
				</span>
			</div>

			{/* Preferred source */}
			<div className="flex items-center gap-2">
				<span className="text-xs text-gray-600">Best source:</span>
				{(["rag", "web", "merged"] as const).map((src) => (
					<button
						key={src}
						type="button"
						onClick={() => setPreferred(src)}
						className={`px-3 py-1 text-xs rounded-full border transition-colors ${
							preferred === src
								? "bg-primary-100 border-primary-400 text-primary-800 font-medium"
								: "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
						}`}
					>
						{src === "rag"
							? "Knowledge Base"
							: src === "web"
								? "Web Search"
								: "Merged"}
					</button>
				))}
			</div>

			<button
				type="button"
				onClick={handleSubmit}
				disabled={rating === 0 || !preferred}
				className="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700
						   disabled:bg-gray-300 disabled:text-gray-500 rounded-lg transition-colors"
			>
				Submit Rating
			</button>
		</div>
	);
}
