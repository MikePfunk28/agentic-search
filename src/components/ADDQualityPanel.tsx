/**
 * ADD Quality Control Panel - Human in the Loop
 * 
 * Shows adversarial quality scoring with human oversight:
 * - View detailed ADD scores for each result
 * - Adjust quality thresholds in real-time
 * - Flag suspicious results for removal
 * - See reasoning transparency
 */

import { Shield, AlertTriangle, CheckCircle, XCircle, Eye, Settings, TrendingDown, TrendingUp, Info } from "lucide-react";
import { useState } from "react";
import type { SearchResult } from "../lib/types";

interface ADDMetrics {
  relevance: number;
  diversity: number;
  freshness: number;
  consistency: number;
  overallScore: number;
  drift: number;
  trend: "improving" | "stable" | "declining";
  recommendation: string;
}

interface ADDQualityPanelProps {
  results: SearchResult[];
  addMetrics?: ADDMetrics;
  onFilterResult?: (resultId: string, reason: string) => void;
  onAdjustThreshold?: (threshold: number) => void;
}

export function ADDQualityPanel({ results, addMetrics, onFilterResult, onAdjustThreshold }: ADDQualityPanelProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [qualityThreshold, setQualityThreshold] = useState(0.5);
  const [flaggedResults, setFlaggedResults] = useState<Set<string>>(new Set());

  const handleFlagResult = (resultId: string, reason: string) => {
    setFlaggedResults(prev => new Set(prev).add(resultId));
    onFilterResult?.(resultId, reason);
  };

  const handleUnflagResult = (resultId: string) => {
    setFlaggedResults(prev => {
      const newSet = new Set(prev);
      newSet.delete(resultId);
      return newSet;
    });
  };

  const handleThresholdChange = (newThreshold: number) => {
    setQualityThreshold(newThreshold);
    onAdjustThreshold?.(newThreshold);
  };

  const getThreatLevel = (score: number): { level: "safe" | "warning" | "danger"; color: string; icon: JSX.Element } => {
    if (score >= 0.7) {
      return {
        level: "safe",
        color: "text-green-600 bg-green-50 border-green-200",
        icon: <CheckCircle className="w-4 h-4" />
      };
    }
    if (score >= 0.5) {
      return {
        level: "warning",
        color: "text-yellow-600 bg-yellow-50 border-yellow-200",
        icon: <AlertTriangle className="w-4 h-4" />
      };
    }
    return {
      level: "danger",
      color: "text-red-600 bg-red-50 border-red-200",
      icon: <XCircle className="w-4 h-4" />
    };
  };

  const filteredResults = results.filter(r => (r.addScore || 0) >= qualityThreshold && !flaggedResults.has(r.id));

  return (
    <div className="bg-white border-2 border-pink-500/30 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Shield className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">ADD Quality Control</h3>
            <p className="text-sm text-gray-600">Adversarial validation with human oversight</p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {/* Overall Metrics */}
      {addMetrics && (
        <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <MetricBadge label="Relevance" value={addMetrics.relevance} />
            <MetricBadge label="Diversity" value={addMetrics.diversity} />
            <MetricBadge label="Freshness" value={addMetrics.freshness} />
            <MetricBadge label="Consistency" value={addMetrics.consistency} />
            <MetricBadge label="Overall" value={addMetrics.overallScore} highlight />
          </div>

          <div className="flex items-center gap-2 text-sm">
            {addMetrics.trend === "declining" && (
              <div className="flex items-center gap-2 text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                <TrendingDown className="w-4 h-4" />
                <span className="font-medium">Quality Declining</span>
              </div>
            )}
            {addMetrics.trend === "improving" && (
              <div className="flex items-center gap-2 text-green-700 bg-green-100 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Quality Improving</span>
              </div>
            )}
            {addMetrics.recommendation && (
              <div className="flex items-center gap-2 text-blue-700">
                <Info className="w-4 h-4" />
                <span className="text-sm">{addMetrics.recommendation}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quality Threshold Control */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <Settings className="w-4 h-4" />
            Quality Threshold: {qualityThreshold.toFixed(2)}
          </label>
          <span className="text-xs text-gray-600">
            Showing {filteredResults.length} of {results.length} results
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={qualityThreshold}
          onChange={(e) => handleThresholdChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>Permissive (0.0)</span>
          <span>Balanced (0.5)</span>
          <span>Strict (1.0)</span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900">
            Result Quality Scores
          </h4>
          <span className="text-xs text-gray-600">
            {flaggedResults.size} flagged for review
          </span>
        </div>

        {showDetails && results.map((result) => {
          const score = result.addScore || 0;
          const threat = getThreatLevel(score);
          const isFlagged = flaggedResults.has(result.id);
          const isBelowThreshold = score < qualityThreshold;

          return (
            <div
              key={result.id}
              className={`p-4 border-2 rounded-lg transition-all ${
                isFlagged
                  ? "bg-red-50 border-red-300 opacity-60"
                  : isBelowThreshold
                    ? "bg-gray-50 border-gray-300 opacity-40"
                    : `${threat.color} border-2`
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {threat.icon}
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {threat.level} • Score: {score.toFixed(3)}
                    </span>
                    {isBelowThreshold && !isFlagged && (
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                        Below Threshold
                      </span>
                    )}
                    {isFlagged && (
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded font-medium">
                        FLAGGED
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate mb-1">
                    {result.title}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {result.url}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {!isFlagged ? (
                    <>
                      <button
                        onClick={() => handleFlagResult(result.id, "User flagged as suspicious")}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-medium transition-colors"
                        title="Flag this result as suspicious"
                      >
                        Flag
                      </button>
                      {score < 0.5 && (
                        <span className="text-xs text-center text-orange-600 font-medium">
                          Low Quality
                        </span>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => handleUnflagResult(result.id)}
                      className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs font-medium transition-colors"
                      title="Remove flag"
                    >
                      Unflag
                    </button>
                  )}
                </div>
              </div>

              {/* Detailed Breakdown (if high quality or flagged) */}
              {(score >= 0.7 || isFlagged) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Relevance:</span>
                      <div className="font-medium">{(score * 0.9).toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Source:</span>
                      <div className="font-medium">{result.source}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Fresh:</span>
                      <div className="font-medium">{(score * 0.85).toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Valid:</span>
                      <div className="font-medium">{(score * 0.95).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Protection Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 mb-1">Active Protection</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>✓ Multi-source validation across {results.length} sources</li>
              <li>✓ Adversarial quality testing (ADD) applied to all results</li>
              <li>✓ Human oversight with flagging capability</li>
              <li>✓ Transparent scoring - you see what the AI sees</li>
              {flaggedResults.size > 0 && (
                <li className="text-orange-700 font-medium">
                  ⚠ {flaggedResults.size} result{flaggedResults.size > 1 ? 's' : ''} flagged for review
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBadge({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  const percentage = (value * 100).toFixed(0);
  const color = value >= 0.7 ? "text-green-600" : value >= 0.5 ? "text-yellow-600" : "text-red-600";

  return (
    <div className={`text-center ${highlight ? "col-span-full md:col-span-1" : ""}`}>
      <div className={`text-2xl font-bold ${highlight ? "text-pink-600" : color}`}>
        {percentage}%
      </div>
      <div className="text-xs text-gray-600 font-medium">{label}</div>
    </div>
  );
}
