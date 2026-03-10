/**
 * Usage Tracking for Fine-tuning Dataset Collection
 *
 * Tracks all user interactions with the search system to build
 * high-quality fine-tuning datasets for custom LLM training.
 *
 * Captures:
 * - Search queries and results
 * - Segment executions
 * - Model responses
 * - User feedback (positive/negative)
 * - Quality scores from ADD discriminator
 */

import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

type ExportFormat = "openai_jsonl" | "anthropic_jsonl" | "generic_json";
type ExportEventType =
  | "search"
  | "segment_execution"
  | "model_call"
  | "user_feedback";
type FineTuneRecordSource =
  | "approved_search_history"
  | "search_usage_event"
  | "usage_event";
type FineTuneExportArgs = {
  format: ExportFormat;
  minQuality?: number;
  eventTypes?: ExportEventType[];
  limit?: number;
};
type FineTuneRecord = {
  sourceType: FineTuneRecordSource;
  query: string;
  response: string;
  model?: string;
  tokens?: number;
  executionTime?: number;
  success: boolean;
  quality?: number;
  feedback?: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
};

const ALL_EXPORT_EVENT_TYPES: ExportEventType[] = [
  "search",
  "segment_execution",
  "model_call",
  "user_feedback",
];

const SEARCH_SYNTHESIS_SYSTEM_PROMPT =
  "You are a search synthesis assistant. Answer with the most relevant verified findings, keep the response concise, and include a short Sources section with URLs.";

function normalizeWhitespace(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function extractStringField(
  value: unknown,
  keys: string[],
): string | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  for (const key of keys) {
    const field = (value as Record<string, unknown>)[key];
    const normalized = normalizeWhitespace(field);
    if (normalized) {
      return normalized;
    }
  }

  return undefined;
}

function extractPreferredAnswer(value: unknown): string | undefined {
  const directValue = normalizeWhitespace(value);
  if (directValue) {
    return directValue;
  }

  if (Array.isArray(value)) {
    const flattened = value
      .map((item) => normalizeWhitespace(item))
      .filter(Boolean)
      .join("\n");
    return flattened || undefined;
  }

  return extractStringField(value, [
    "answer",
    "finalAnswer",
    "response",
    "summary",
    "text",
    "content",
    "rewrite",
    "notes",
  ]);
}

function getSelectedEventTypes(
  eventTypes?: ExportEventType[],
): ExportEventType[] {
  if (eventTypes && eventTypes.length > 0) {
    return eventTypes;
  }

  return ALL_EXPORT_EVENT_TYPES;
}

function shouldBuildSearchExamples(
  selectedEventTypes: ExportEventType[],
): boolean {
  return (
    selectedEventTypes.includes("search") ||
    selectedEventTypes.includes("user_feedback")
  );
}

function formatSearchFinding(result: {
  title?: string;
  url?: string;
  snippet?: string;
}): string | undefined {
  const title = truncateText(normalizeWhitespace(result.title), 140);
  const snippet = truncateText(normalizeWhitespace(result.snippet), 220);

  if (title && snippet) {
    return `- ${title}: ${snippet}`;
  }
  if (title) {
    return `- ${title}`;
  }
  if (snippet) {
    return `- ${snippet}`;
  }

  return undefined;
}

function formatSearchSource(result: {
  title?: string;
  url?: string;
}): string | undefined {
  const url = normalizeWhitespace(result.url);
  if (!url) {
    return undefined;
  }

  const title = truncateText(normalizeWhitespace(result.title), 100);
  return title ? `- ${title}: ${url}` : `- ${url}`;
}

function buildSearchResponse(
  query: string,
  results: Array<{
    title?: string;
    url?: string;
    snippet?: string;
  }>,
  preferredAnswer?: string,
  reasoningSummary?: string,
): string {
  const findings = results
    .slice(0, 5)
    .map((result) => formatSearchFinding(result))
    .filter((value): value is string => Boolean(value));
  const sources = results
    .slice(0, 5)
    .map((result) => formatSearchSource(result))
    .filter((value): value is string => Boolean(value));

  const sections: string[] = [];
  const lead =
    truncateText(preferredAnswer || reasoningSummary || "", 900) ||
    `Most relevant findings for "${normalizeWhitespace(query)}":`;
  sections.push(lead);

  if (findings.length > 0) {
    sections.push(["Key findings:", ...findings].join("\n"));
  }

  if (sources.length > 0 && !lead.includes("http")) {
    sections.push(["Sources:", ...sources].join("\n"));
  }

  return sections.join("\n\n").trim();
}

function buildApprovedSearchRecord(
  search: Doc<"searchHistory">,
): FineTuneRecord {
  const preferredAnswer = extractPreferredAnswer(search.userModifications);
  const response = buildSearchResponse(
    search.query,
    search.results,
    preferredAnswer,
    undefined,
  );

  return {
    sourceType: "approved_search_history",
    query: search.query,
    response,
    model: search.modelUsed,
    tokens: search.tokensUsed,
    executionTime: search.executionTimeMs,
    success: true,
    quality: search.quality,
    feedback: normalizeWhitespace(search.feedback) || undefined,
    metadata: {
      resultCount: search.results.length,
      userApproved: search.userApproved ?? true,
      userRating: search.userRating,
      topSources: search.results
        .slice(0, 5)
        .map((result) => result.url)
        .filter(Boolean),
    },
    timestamp: search.createdAt,
  };
}

function getTopResultsFromMetadata(
  metadata: unknown,
): Array<{ title?: string; url?: string; snippet?: string }> {
  if (!metadata || typeof metadata !== "object") {
    return [];
  }

  const topResults = (metadata as Record<string, unknown>).topResults;
  if (!Array.isArray(topResults)) {
    return [];
  }

  return topResults
    .filter((result) => result && typeof result === "object")
    .map((result) => ({
      title: normalizeWhitespace((result as Record<string, unknown>).title),
      url: normalizeWhitespace((result as Record<string, unknown>).url),
      snippet: normalizeWhitespace((result as Record<string, unknown>).snippet),
    }));
}

function buildSearchUsageEventRecord(
  event: Doc<"usageEvents">,
): FineTuneRecord | null {
  const query = normalizeWhitespace(event.query);
  if (!query) {
    return null;
  }

  const metadata = event.metadata;
  const response = buildSearchResponse(
    query,
    getTopResultsFromMetadata(metadata),
    undefined,
    extractStringField(metadata, ["reasoningSummary", "summary"]),
  );

  return {
    sourceType: "search_usage_event",
    query,
    response,
    model: event.modelUsed,
    tokens: event.tokensUsed,
    executionTime: event.executionTimeMs,
    success: event.success,
    quality: event.quality,
    feedback: event.userFeedback,
    metadata:
      metadata && typeof metadata === "object"
        ? {
            ...((metadata as Record<string, unknown>) || {}),
            eventType: event.eventType,
          }
        : {
            eventType: event.eventType,
          },
    timestamp: event.createdAt,
  };
}

function buildUsageEventRecord(event: Doc<"usageEvents">): FineTuneRecord | null {
  const query = normalizeWhitespace(event.query);
  if (!query) {
    return null;
  }

  const responsePayload = {
    eventType: event.eventType,
    feedback: event.userFeedback,
    quality: event.quality,
    metadata: event.metadata,
  };

  return {
    sourceType: "usage_event",
    query,
    response: JSON.stringify(responsePayload),
    model: event.modelUsed,
    tokens: event.tokensUsed,
    executionTime: event.executionTimeMs,
    success: event.success,
    quality: event.quality,
    feedback: event.userFeedback,
    metadata:
      event.metadata && typeof event.metadata === "object"
        ? {
            ...(event.metadata as Record<string, unknown>),
            eventType: event.eventType,
          }
        : {
            eventType: event.eventType,
          },
    timestamp: event.createdAt,
  };
}

function sortRecords(records: FineTuneRecord[]): FineTuneRecord[] {
  return records.sort((left, right) => {
    const ratingDelta =
      ((right.metadata?.userRating as number | undefined) || 0) -
      ((left.metadata?.userRating as number | undefined) || 0);
    if (ratingDelta !== 0) {
      return ratingDelta;
    }

    const qualityDelta = (right.quality || 0) - (left.quality || 0);
    if (qualityDelta !== 0) {
      return qualityDelta;
    }

    return right.timestamp - left.timestamp;
  });
}

async function buildFineTuningRecords(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  args: FineTuneExportArgs,
) {
  const selectedEventTypes = getSelectedEventTypes(args.eventTypes);
  const includesSearchExamples = shouldBuildSearchExamples(selectedEventTypes);

  const usageEvents = await ctx.db
    .query("usageEvents")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  let filteredUsageEvents = usageEvents.filter((event) =>
    selectedEventTypes.includes(event.eventType),
  );

  if (args.minQuality !== undefined) {
    filteredUsageEvents = filteredUsageEvents.filter(
      (event) => event.quality !== undefined && event.quality >= args.minQuality!,
    );
  }

  let searchRecords: FineTuneRecord[] = [];
  if (includesSearchExamples) {
    const approvedSearches = (
      await ctx.db
        .query("searchHistory")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect()
    )
      .filter(
        (search) =>
          Boolean(normalizeWhitespace(search.query)) &&
          search.results.length > 0 &&
          (search.userApproved === true || (search.userRating || 0) >= 4) &&
          (args.minQuality === undefined ||
            (search.quality !== undefined && search.quality >= args.minQuality)),
      )
      .map((search) => buildApprovedSearchRecord(search));

    searchRecords = sortRecords(approvedSearches);

    if (searchRecords.length === 0) {
      searchRecords = sortRecords(
        filteredUsageEvents
          .filter((event) => event.eventType === "search")
          .map((event) => buildSearchUsageEventRecord(event))
          .filter((event): event is FineTuneRecord => Boolean(event)),
      );
    }
  }

  let records =
    args.format === "generic_json"
      ? [
          ...searchRecords,
          ...filteredUsageEvents
            .filter((event) => event.eventType !== "search")
            .map((event) => buildUsageEventRecord(event))
            .filter((event): event is FineTuneRecord => Boolean(event)),
        ]
      : searchRecords;

  records = sortRecords(records);

  if (args.limit !== undefined) {
    records = records.slice(0, args.limit);
  }

  const modelDistribution: Record<string, number> = {};
  const sourceBreakdown: Record<string, number> = {};

  for (const record of records) {
    if (record.model) {
      modelDistribution[record.model] = (modelDistribution[record.model] || 0) + 1;
    }

    sourceBreakdown[record.sourceType] =
      (sourceBreakdown[record.sourceType] || 0) + 1;
  }

  const qualityValues = records
    .map((record) => record.quality)
    .filter((quality): quality is number => quality !== undefined);
  const totalTokens = records.reduce(
    (sum, record) => sum + (record.tokens || 0),
    0,
  );

  return {
    records,
    stats: {
      avgQuality:
        qualityValues.reduce((sum, quality) => sum + quality, 0) /
        (qualityValues.length || 1),
      totalTokens,
      modelDistribution,
      sourceBreakdown,
      approvedSearchCount: sourceBreakdown.approved_search_history || 0,
      usageEventCount:
        (sourceBreakdown.search_usage_event || 0) +
        (sourceBreakdown.usage_event || 0),
    },
  };
}

/**
 * Track a search event
 */
export const trackSearch = mutation({
  args: {
    query: v.string(),
    modelUsed: v.string(),
    tokensUsed: v.optional(v.number()),
    executionTimeMs: v.number(),
    success: v.boolean(),
    quality: v.optional(v.number()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      // Allow anonymous usage tracking for analytics
      console.log("[Usage] Anonymous search tracked");
    }

    await ctx.db.insert("usageEvents", {
      userId: userIdentity?.subject || "anonymous",
      eventType: "search",
      query: args.query,
      modelUsed: args.modelUsed,
      tokensUsed: args.tokensUsed,
      executionTimeMs: args.executionTimeMs,
      success: args.success,
      quality: args.quality,
      metadata: args.metadata,
      createdAt: Date.now(),
    });
  },
});

/**
 * Track a segment execution
 */
export const trackSegmentExecution = mutation({
  args: {
    segmentId: v.string(),
    segmentText: v.string(),
    segmentType: v.string(),
    modelUsed: v.string(),
    tokensUsed: v.number(),
    executionTimeMs: v.number(),
    success: v.boolean(),
    confidence: v.number(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();

    await ctx.db.insert("usageEvents", {
      userId: userIdentity?.subject || "anonymous",
      eventType: "segment_execution",
      query: args.segmentText,
      modelUsed: args.modelUsed,
      tokensUsed: args.tokensUsed,
      executionTimeMs: args.executionTimeMs,
      success: args.success,
      quality: args.confidence,
      metadata: {
        segmentId: args.segmentId,
        segmentType: args.segmentType,
        ...args.metadata,
      },
      createdAt: Date.now(),
    });
  },
});

/**
 * Track user feedback on a search result
 */
export const trackFeedback = mutation({
  args: {
    query: v.string(),
    feedback: v.union(
      v.literal("positive"),
      v.literal("negative"),
      v.literal("neutral")
    ),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required to submit feedback");
    }

    await ctx.db.insert("usageEvents", {
      userId: userIdentity.subject,
      eventType: "user_feedback",
      query: args.query,
      success: true,
      userFeedback: args.feedback,
      metadata: args.metadata,
      createdAt: Date.now(),
    });
  },
});

/**
 * Get usage statistics for the authenticated user
 */
export const getUsageStats = query({
  args: {
    timeRangeMs: v.optional(v.number()), // Default: last 30 days
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const timeRange = args.timeRangeMs || 30 * 24 * 60 * 60 * 1000; // 30 days
    const since = Date.now() - timeRange;

    const events = await ctx.db
      .query("usageEvents")
      .withIndex("by_user_created", (q) =>
        q.eq("userId", userIdentity.subject).gt("createdAt", since)
      )
      .collect();

    // Calculate statistics
    const totalSearches = events.filter((e) => e.eventType === "search").length;
    const totalSegments = events.filter(
      (e) => e.eventType === "segment_execution"
    ).length;
    const totalFeedback = events.filter(
      (e) => e.eventType === "user_feedback"
    ).length;

    const avgQuality =
      events
        .filter((e) => e.quality !== undefined)
        .reduce((sum, e) => sum + (e.quality || 0), 0) /
        (events.filter((e) => e.quality !== undefined).length || 1);

    const totalTokens = events.reduce(
      (sum, e) => sum + (e.tokensUsed || 0),
      0
    );

    const avgExecutionTime =
      events
        .filter((e) => e.executionTimeMs !== undefined)
        .reduce((sum, e) => sum + (e.executionTimeMs || 0), 0) /
        (events.filter((e) => e.executionTimeMs !== undefined).length || 1);

    // Model distribution
    const modelDistribution: Record<string, number> = {};
    for (const event of events) {
      if (event.modelUsed) {
        modelDistribution[event.modelUsed] =
          (modelDistribution[event.modelUsed] || 0) + 1;
      }
    }

    return {
      totalSearches,
      totalSegments,
      totalFeedback,
      avgQuality,
      totalTokens,
      avgExecutionTime,
      modelDistribution,
      eventsCount: events.length,
    };
  },
});

/**
 * Export usage events for fine-tuning dataset
 */
export const exportForFineTuning = query({
  args: {
    format: v.union(
      v.literal("openai_jsonl"),
      v.literal("anthropic_jsonl"),
      v.literal("generic_json")
    ),
    minQuality: v.optional(v.number()), // Filter by minimum quality score
    eventTypes: v.optional(
      v.array(
        v.union(
          v.literal("search"),
          v.literal("segment_execution"),
          v.literal("model_call"),
          v.literal("user_feedback")
        )
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const { records } = await buildFineTuningRecords(ctx, userIdentity.subject, {
      format: args.format,
      minQuality: args.minQuality,
      eventTypes: args.eventTypes,
      limit: args.limit,
    });

    // Format based on requested format
    let formatted: any[];
    switch (args.format) {
      case "openai_jsonl":
        formatted = records.map((record) => ({
          messages: [
            {
              role: "system",
              content: SEARCH_SYNTHESIS_SYSTEM_PROMPT,
            },
            { role: "user", content: record.query },
            {
              role: "assistant",
              content: record.response,
            },
          ],
        }));
        break;

      case "anthropic_jsonl":
        formatted = records.map((record) => ({
          prompt: record.query,
          completion: record.response,
        }));
        break;

      case "generic_json":
      default:
        formatted = records.map((record) => ({
          sourceType: record.sourceType,
          query: record.query,
          response: record.response,
          model: record.model,
          tokens: record.tokens,
          executionTime: record.executionTime,
          success: record.success,
          quality: record.quality,
          feedback: record.feedback,
          metadata: record.metadata,
          timestamp: record.timestamp,
        }));
        break;
    }

    return {
      format: args.format,
      count: formatted.length,
      data: formatted,
    };
  },
});

/**
 * Create a fine-tuning dataset export
 */
export const createDatasetExport = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    format: v.union(
      v.literal("openai_jsonl"),
      v.literal("anthropic_jsonl"),
      v.literal("generic_json")
    ),
    minQuality: v.optional(v.number()),
    eventTypes: v.optional(
      v.array(
        v.union(
          v.literal("search"),
          v.literal("segment_execution"),
          v.literal("model_call"),
          v.literal("user_feedback")
        )
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const { records, stats } = await buildFineTuningRecords(
      ctx,
      userIdentity.subject,
      {
        format: args.format,
        minQuality: args.minQuality,
        eventTypes: args.eventTypes,
        limit: args.limit,
      },
    );

    // Create dataset export record
    const datasetId = await ctx.db.insert("finetuningDatasets", {
      userId: userIdentity.subject,
      name: args.name,
      description: args.description,
      format: args.format,
      eventCount: records.length,
      exportedAt: Date.now(),
      metadata: {
        avgQuality: stats.avgQuality,
        totalTokens: stats.totalTokens,
        modelDistribution: stats.modelDistribution,
        sourceBreakdown: stats.sourceBreakdown,
        approvedSearchCount: stats.approvedSearchCount,
        usageEventCount: stats.usageEventCount,
      },
    });

    return datasetId;
  },
});

/**
 * List fine-tuning datasets for the authenticated user
 */
export const listDatasets = query({
  args: {},
  handler: async (ctx) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const datasets = await ctx.db
      .query("finetuningDatasets")
      .withIndex("by_user", (q) => q.eq("userId", userIdentity.subject))
      .collect();

    return datasets.sort((a, b) => b.exportedAt - a.exportedAt);
  },
});

/**
 * Attach an external fine-tuning job to an exported dataset.
 */
export const linkFineTuningJob = mutation({
  args: {
    datasetId: v.id("finetuningDatasets"),
    provider: v.union(v.literal("openai")),
    jobId: v.string(),
    baseModel: v.string(),
    suffix: v.optional(v.string()),
    trainingFileId: v.optional(v.string()),
    validationFileId: v.optional(v.string()),
    status: v.string(),
    launchedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const dataset = await ctx.db.get(args.datasetId);
    if (!dataset || dataset.userId !== userIdentity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.datasetId, {
      provider: args.provider,
      jobId: args.jobId,
      baseModel: args.baseModel,
      suffix: args.suffix,
      trainingFileId: args.trainingFileId,
      validationFileId: args.validationFileId,
      status: args.status,
      launchedAt: args.launchedAt,
      lastCheckedAt: args.launchedAt,
      errorMessage: undefined,
    });
  },
});

/**
 * Synchronize the latest status for an external fine-tuning job.
 */
export const syncFineTuningJob = mutation({
  args: {
    datasetId: v.id("finetuningDatasets"),
    status: v.string(),
    fineTunedModel: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    lastCheckedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const dataset = await ctx.db.get(args.datasetId);
    if (!dataset || dataset.userId !== userIdentity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.datasetId, {
      status: args.status,
      fineTunedModel: args.fineTunedModel,
      errorMessage: args.errorMessage,
      lastCheckedAt: args.lastCheckedAt,
    });
  },
});

/**
 * Get usage events grouped by day for time-series charts
 */
export const getUsageTimeSeries = query({
  args: {
    daysBack: v.optional(v.number()),
    eventType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) return [];

    const userId = userIdentity.subject;
    const cutoff = Date.now() - (args.daysBack ?? 30) * 24 * 60 * 60 * 1000;

    let events = await ctx.db
      .query("usageEvents")
      .withIndex("by_user_created", (q) =>
        q.eq("userId", userId).gte("createdAt", cutoff)
      )
      .collect();

    if (args.eventType) {
      events = events.filter((e) => e.eventType === args.eventType);
    }

    // Group by day
    const byDay = new Map<string, {
      date: string;
      searchCount: number;
      totalTokens: number;
      avgQuality: number;
      qualitySum: number;
      qualityCount: number;
    }>();

    for (const event of events) {
      const date = new Date(event.createdAt).toISOString().split("T")[0];
      const existing = byDay.get(date) ?? {
        date,
        searchCount: 0,
        totalTokens: 0,
        avgQuality: 0,
        qualitySum: 0,
        qualityCount: 0,
      };

      existing.searchCount++;
      existing.totalTokens += event.tokensUsed ?? 0;
      if (event.quality != null) {
        existing.qualitySum += event.quality;
        existing.qualityCount++;
        existing.avgQuality = existing.qualitySum / existing.qualityCount;
      }

      byDay.set(date, existing);
    }

    return Array.from(byDay.values())
      .map(({ qualitySum, qualityCount, ...rest }) => rest)
      .sort((a, b) => a.date.localeCompare(b.date));
  },
});

/**
 * Get top queries by frequency
 */
export const getTopQueries = query({
  args: {
    limit: v.optional(v.number()),
    daysBack: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) return [];

    const userId = userIdentity.subject;
    const cutoff = Date.now() - (args.daysBack ?? 30) * 24 * 60 * 60 * 1000;

    const events = await ctx.db
      .query("usageEvents")
      .withIndex("by_user_created", (q) =>
        q.eq("userId", userId).gte("createdAt", cutoff)
      )
      .collect();

    const queryEvents = events.filter((e) => e.eventType === "search" && e.query);

    const byQuery = new Map<string, {
      query: string;
      count: number;
      avgQuality: number;
      qualitySum: number;
      qualityCount: number;
    }>();

    for (const event of queryEvents) {
      const q = event.query!;
      const existing = byQuery.get(q) ?? {
        query: q,
        count: 0,
        avgQuality: 0,
        qualitySum: 0,
        qualityCount: 0,
      };

      existing.count++;
      if (event.quality != null) {
        existing.qualitySum += event.quality;
        existing.qualityCount++;
        existing.avgQuality = existing.qualitySum / existing.qualityCount;
      }

      byQuery.set(q, existing);
    }

    return Array.from(byQuery.values())
      .map(({ qualitySum, qualityCount, ...rest }) => rest)
      .sort((a, b) => b.count - a.count)
      .slice(0, args.limit ?? 10);
  },
});


