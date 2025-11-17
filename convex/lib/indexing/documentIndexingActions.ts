"use node"

/**
 * Document Indexing Actions - Node.js Runtime
 */

import { action } from '../../_generated/server'
import { v } from 'convex/values'

export const searchDocuments = action({
  args: {
    userId: v.string(),
    query: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    // TODO: Implement document search
    return []
  },
})


