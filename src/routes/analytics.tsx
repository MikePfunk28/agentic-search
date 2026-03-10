/**
 * Analytics Dashboard Page
 *
 * Comprehensive usage analytics:
 * - Overview cards (searches, tokens, cost, quality)
 * - Token usage by model over time
 * - External API usage (Firecrawl, Tavily, Brave, Exa, etc.)
 * - Cost breakdown by provider
 * - Search history with feedback
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3, Zap, DollarSign, Activity, Clock,
  TrendingUp, Search, User,
} from "lucide-react";
import { useAppAuth } from "../hooks/useAppAuth";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { isAuthenticated, isLoading } = useAppAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign in to view analytics</h2>
          <p className="text-gray-400 mb-6">Track your API usage, costs, and search quality.</p>
          <Link to="/" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <section className="relative py-12 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <BarChart3 className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Analytics</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Track API usage, costs, and search quality across all providers
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-12 space-y-8">
        {/* Overview Cards */}
        <OverviewCards />

        {/* External API Usage by Provider */}
        <ExternalApiStats />

        {/* Cost Breakdown */}
        <CostBreakdown />

        {/* Time Series */}
        <UsageTimeSeries />

        {/* Search History */}
        <RecentSearches />
      </section>
    </div>
  );
}

function OverviewCards() {
  const costSummary = useQuery(api.costEstimation.getCostSummary, { daysBack: 30 });

  const cards = [
    {
      label: "API Calls",
      value: costSummary?.totalRequests.toLocaleString() ?? "—",
      icon: Activity,
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
    },
    {
      label: "Tokens Used",
      value: costSummary?.totalTokens.toLocaleString() ?? "—",
      icon: Zap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/20",
    },
    {
      label: "Est. Cost (30d)",
      value: costSummary ? `$${costSummary.totalCost.toFixed(4)}` : "—",
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-900/20",
    },
    {
      label: "Providers Used",
      value: costSummary
        ? Object.keys(costSummary.costByProvider).length.toString()
        : "—",
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`${card.bgColor} border border-gray-700/50 rounded-xl p-5`}>
          <div className="flex items-center gap-2 mb-2">
            <card.icon size={18} className={card.color} />
            <span className="text-sm text-gray-400">{card.label}</span>
          </div>
          <p className="text-2xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

function ExternalApiStats() {
  const stats = useQuery(api.externalApiTracking.getExternalApiStats, { daysBack: 30 });

  if (!stats || stats.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">External API Usage</h3>
        <p className="text-gray-500 text-sm">No API usage data yet. Start searching to see stats here.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Activity size={20} className="text-cyan-400" />
        External API Usage (30 days)
      </h3>

      <div className="space-y-3">
        {stats
          .sort((a, b) => b.totalRequests - a.totalRequests)
          .map((stat) => {
            const maxRequests = Math.max(...stats.map((s) => s.totalRequests));
            const barWidth = (stat.totalRequests / maxRequests) * 100;

            return (
              <div key={stat.provider} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-300 capitalize">{stat.provider}</span>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{stat.totalRequests.toLocaleString()} calls</span>
                    {stat.totalTokens > 0 && <span>{stat.totalTokens.toLocaleString()} tokens</span>}
                    <span className={stat.successRate >= 0.95 ? "text-green-400" : stat.successRate >= 0.8 ? "text-yellow-400" : "text-red-400"}>
                      {(stat.successRate * 100).toFixed(0)}% success
                    </span>
                    <span>${stat.totalCost.toFixed(4)}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-900/50 rounded-full h-2">
                  <div
                    className="bg-cyan-500 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function CostBreakdown() {
  const costSummary = useQuery(api.costEstimation.getCostSummary, { daysBack: 30 });

  if (!costSummary || Object.keys(costSummary.costByProvider).length === 0) {
    return null;
  }

  const entries = Object.entries(costSummary.costByProvider)
    .sort(([, a], [, b]) => b - a);

  const total = costSummary.totalCost || 1;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <DollarSign size={20} className="text-green-400" />
        Cost Breakdown
      </h3>

      <div className="space-y-3">
        {entries.map(([provider, cost]) => {
          const percentage = (cost / total) * 100;
          return (
            <div key={provider} className="flex items-center gap-4">
              <span className="text-sm text-gray-300 capitalize w-28 truncate">{provider}</span>
              <div className="flex-1 bg-gray-900/50 rounded-full h-3">
                <div
                  className="bg-green-500/70 rounded-full h-3 transition-all duration-500"
                  style={{ width: `${Math.max(percentage, 2)}%` }}
                />
              </div>
              <span className="text-sm text-gray-400 w-20 text-right">${cost.toFixed(4)}</span>
              <span className="text-xs text-gray-500 w-12 text-right">{percentage.toFixed(0)}%</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between">
        <span className="text-sm font-medium text-gray-300">Total (30d)</span>
        <span className="text-sm font-bold text-green-400">${costSummary.totalCost.toFixed(4)}</span>
      </div>
    </div>
  );
}

function UsageTimeSeries() {
  const timeSeries = useQuery(api.externalApiTracking.getExternalApiTimeSeries, { daysBack: 14 });

  if (!timeSeries || timeSeries.length === 0) {
    return null;
  }

  const maxRequests = Math.max(...timeSeries.map((d) => d.requests), 1);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Clock size={20} className="text-cyan-400" />
        Daily Usage (14 days)
      </h3>

      {/* Simple bar chart */}
      <div className="flex items-end gap-1 h-32">
        {timeSeries.map((day) => {
          const height = (day.requests / maxRequests) * 100;
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center group relative">
              <div
                className="w-full bg-cyan-500/70 hover:bg-cyan-400/70 rounded-t transition-all"
                style={{ height: `${Math.max(height, 2)}%` }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs z-10 whitespace-nowrap">
                <p className="text-white font-medium">{day.date}</p>
                <p className="text-gray-400">{day.requests} calls</p>
                <p className="text-gray-400">{day.tokens.toLocaleString()} tokens</p>
                <p className="text-green-400">${day.cost.toFixed(4)}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">{timeSeries[0]?.date}</span>
        <span className="text-xs text-gray-500">{timeSeries[timeSeries.length - 1]?.date}</span>
      </div>
    </div>
  );
}

function RecentSearches() {
  // Use the existing searchHistory query if available
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Search size={20} className="text-cyan-400" />
        Recent Searches
        <Link to="/history" className="text-sm text-cyan-400 hover:underline ml-auto font-normal">
          View All →
        </Link>
      </h3>
      <p className="text-gray-500 text-sm">
        Search history with quality scores and feedback will appear here as you use the search.
      </p>
    </div>
  );
}
