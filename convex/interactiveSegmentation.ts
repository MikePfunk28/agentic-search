/**
 * Interactive Segmentation with Human-in-the-Loop
 *
 * Allows users to:
 * - Approve/reject segment decompositions
 * - Modify segments before execution
 * - Guide reasoning step-by-step
 * - Create PERFECT training data from corrections
 *
 * This is the KEY to building high-quality fine-tuning datasets!
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Submit segment for user approval
 */
export const submitSegmentForApproval = mutation({
  args: {
    searchHistoryId: v.id("searchHistory"),
    segmentId: v.string(),
    segmentText: v.string(),
    segmentType: v.union(
      v.literal("entity"),
      v.literal("relation"),
      v.literal("constraint"),
      v.literal("intent"),
      v.literal("context"),
      v.literal("comparison"),
      v.literal("synthesis")
    ),
    aiConfidence: v.number(),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    // Verify search ownership
    const search = await ctx.db.get(args.searchHistoryId);
    if (!search || search.userId !== userIdentity.subject) {
      throw new Error("Unauthorized");
    }

    const approvalId = await ctx.db.insert("segmentApprovals", {
      userId: userIdentity.subject,
      searchHistoryId: args.searchHistoryId,
      segmentId: args.segmentId,
      segmentText: args.segmentText,
      originalSegmentText: args.segmentText,
      approved: false,
      rejected: false,
      segmentType: args.segmentType,
      aiConfidence: args.aiConfidence,
      createdAt: Date.now(),
    });

    return approvalId;
  },
});

/**
 * User approves a segment (as-is or modified)
 */
export const approveSegment = mutation({
  args: {
    approvalId: v.id("segmentApprovals"),
    modified: v.optional(v.boolean()),
    modifiedText: v.optional(v.string()),
    userConfidence: v.optional(v.number()),
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const approval = await ctx.db.get(args.approvalId);
    if (!approval || approval.userId !== userIdentity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.approvalId, {
      approved: true,
      rejected: false,
      modifiedSegmentText: args.modifiedText,
      userConfidence: args.userConfidence,
      userFeedback: args.feedback,
      respondedAt: Date.now(),
    });

    // If user modified the segment, this is GOLD for training!
    if (args.modified && args.modifiedText) {
      // Store as high-value training example
      await ctx.db.insert("usageEvents", {
        userId: userIdentity.subject,
        eventType: "user_feedback",
        query: approval.originalSegmentText,
        success: true,
        quality: 1.0, // User corrections are highest quality
        userFeedback: "positive",
        metadata: {
          type: "segment_correction",
          original: approval.originalSegmentText,
          corrected: args.modifiedText,
          segmentType: approval.segmentType,
          aiConfidence: approval.aiConfidence,
          userConfidence: args.userConfidence,
        },
        createdAt: Date.now(),
      });
    }
  },
});

/**
 * User rejects a segment with explanation
 */
export const rejectSegment = mutation({
  args: {
    approvalId: v.id("segmentApprovals"),
    reason: v.string(),
    suggestedImprovement: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const approval = await ctx.db.get(args.approvalId);
    if (!approval || approval.userId !== userIdentity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.approvalId, {
      approved: false,
      rejected: true,
      userFeedback: args.reason,
      suggestedImprovement: args.suggestedImprovement,
      respondedAt: Date.now(),
    });

    // Store rejection as training data
    await ctx.db.insert("usageEvents", {
      userId: userIdentity.subject,
      eventType: "user_feedback",
      query: approval.originalSegmentText,
      success: false,
      quality: 0.0, // Rejected = bad quality
      userFeedback: "negative",
      metadata: {
        type: "segment_rejection",
        original: approval.originalSegmentText,
        reason: args.reason,
        suggestedImprovement: args.suggestedImprovement,
        segmentType: approval.segmentType,
      },
      createdAt: Date.now(),
    });
  },
});

/**
 * Get pending segment approvals for user
 */
export const getPendingApprovals = query({
  args: {
    searchHistoryId: v.id("searchHistory"),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    let approvals;
    if (args.searchHistoryId) {
      // Get approvals for specific search
      approvals = await ctx.db
        .query("segmentApprovals")
        .withIndex("by_search", (q) => q.eq("searchHistoryId", args.searchHistoryId))
        .collect();
    } else {
      // Get all pending approvals for user
      approvals = await ctx.db
        .query("segmentApprovals")
        .withIndex("by_user", (q) => q.eq("userId", userIdentity.subject))
        .collect();
    }

    // Filter to only pending (not yet approved or rejected)
    return approvals.filter((a) => !a.approved && !a.rejected);
  },
});

/**
 * Submit reasoning step for validation
 */
export const submitReasoningStep = mutation({
  args: {
    searchHistoryId: v.id("searchHistory"),
    stepNumber: v.number(),
    stepType: v.string(),
    aiReasoning: v.string(),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const search = await ctx.db.get(args.searchHistoryId);
    if (!search || search.userId !== userIdentity.subject) {
      throw new Error("Unauthorized");
    }

    const stepId = await ctx.db.insert("reasoningStepApprovals", {
      userId: userIdentity.subject,
      searchHistoryId: args.searchHistoryId,
      stepNumber: args.stepNumber,
      stepType: args.stepType,
      aiReasoning: args.aiReasoning,
      approved: false,
      shouldRetry: false,
      createdAt: Date.now(),
    });

    return stepId;
  },
});

/**
 * User approves reasoning step (or modifies it)
 */
export const approveReasoningStep = mutation({
  args: {
    stepId: v.id("reasoningStepApprovals"),
    approved: v.boolean(),
    modification: v.optional(v.string()),
    shouldRetry: v.optional(v.boolean()),
    guidance: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const step = await ctx.db.get(args.stepId);
    if (!step || step.userId !== userIdentity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.stepId, {
      approved: args.approved,
      userModification: args.modification,
      shouldRetry: args.shouldRetry || false,
      userGuidance: args.guidance,
    });

    // Store as training data if user modified
    if (args.modification) {
      await ctx.db.insert("usageEvents", {
        userId: userIdentity.subject,
        eventType: "user_feedback",
        query: step.aiReasoning,
        success: args.approved,
        quality: args.approved ? 0.9 : 0.3,
        userFeedback: args.approved ? "positive" : "negative",
        metadata: {
          type: "reasoning_correction",
          original: step.aiReasoning,
          corrected: args.modification,
          stepType: step.stepType,
          stepNumber: step.stepNumber,
          shouldRetry: args.shouldRetry,
          guidance: args.guidance,
        },
        createdAt: Date.now(),
      });
    }
  },
});

/**
 * Get pending reasoning steps
 */
export const getPendingReasoningSteps = query({
  args: {
    searchHistoryId: v.id("searchHistory"),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const steps = await ctx.db
      .query("reasoningStepApprovals")
      .withIndex("by_search", (q) => q.eq("searchHistoryId", args.searchHistoryId))
      .order("asc") // Order by step number
      .collect();

    // Filter to pending only
    return steps.filter((s) => !s.approved && !s.shouldRetry);
  },
});

/**
 * Get approval statistics (for UI dashboard)
 */
export const getApprovalStats = query({
  args: {},
  handler: async (ctx) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const approvals = await ctx.db
      .query("segmentApprovals")
      .withIndex("by_user", (q) => q.eq("userId", userIdentity.subject))
      .collect();

    const total = approvals.length;
    const approved = approvals.filter((a) => a.approved).length;
    const rejected = approvals.filter((a) => a.rejected).length;
    const pending = total - approved - rejected;
    const modified = approvals.filter((a) => a.modifiedSegmentText).length;

    // Calculate by segment type
    const byType: Record<string, { approved: number; rejected: number; total: number }> = {};
    for (const approval of approvals) {
      if (!byType[approval.segmentType]) {
        byType[approval.segmentType] = { approved: 0, rejected: 0, total: 0 };
      }
      byType[approval.segmentType].total++;
      if (approval.approved) byType[approval.segmentType].approved++;
      if (approval.rejected) byType[approval.segmentType].rejected++;
    }

    return {
      total,
      approved,
      rejected,
      pending,
      modified,
      approvalRate: total > 0 ? (approved / total) * 100 : 0,
      modificationRate: total > 0 ? (modified / total) * 100 : 0,
      byType,
    };
  },
});
