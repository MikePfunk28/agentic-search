/**
 * OCR Document Processing with AI Compression
 * Runs entirely in Convex - no external API keys needed
 */

import { action, internalMutation } from '../../_generated/server'
import { v } from 'convex/values'
import { internal } from '../../_generated/api'
import pdfParse from 'pdf-parse'

/**
 * Estimate token count (rough approximation)
 * OpenAI/Anthropic: ~4 chars per token
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Create model instance based on provider config
 * This imports dynamically to work in Convex actions
 */
async function createModelForCompression(config: {
  provider: string
  modelId: string
  apiKey?: string
  baseURL?: string
}) {
  // Dynamic imports for Convex actions
  const { anthropic } = await import('@ai-sdk/anthropic')
  const { openai, createOpenAI } = await import('@ai-sdk/openai')
  const { google } = await import('@ai-sdk/google')

  switch (config.provider) {
    case 'ollama':
      const ollama = createOpenAI({
        baseURL: config.baseURL || 'http://localhost:11434/v1',
        apiKey: 'ollama' // Ollama doesn't need real API key
      })
      return ollama(config.modelId)

    case 'lmstudio':
      const lmstudio = createOpenAI({
        baseURL: config.baseURL || 'http://localhost:1234/v1',
        apiKey: 'lmstudio'
      })
      return lmstudio(config.modelId)

    case 'openai':
      if (!config.apiKey) throw new Error('OpenAI API key required')
      return openai(config.modelId, { apiKey: config.apiKey })

    case 'anthropic':
      if (!config.apiKey) throw new Error('Anthropic API key required')
      return anthropic(config.modelId, { apiKey: config.apiKey })

    case 'google':
      if (!config.apiKey) throw new Error('Google API key required')
      return google(config.modelId, { apiKey: config.apiKey })

    default:
      throw new Error(`Unknown provider: ${config.provider}`)
  }
}

export interface OCRResult {
  documentUrl: string
  originalText: string
  compressedMarkdown: string
  originalTokens: number
  compressedTokens: number
  tokenSavings: number // percentage
  compressionRatio: number // e.g., 10 for 10x
  processingTimeMs: number
  confidence: number
  metadata: {
    pages?: number
    title?: string
    author?: string
    createdAt?: string
  }
}

/**
 * Process a PDF document with OCR and AI compression
 * Uses user's selected model for compression
 */
export const processDocument = action({
  args: {
    documentUrl: v.string(),
    compressionModel: v.object({
      provider: v.string(),
      modelId: v.string(),
      apiKey: v.optional(v.string()),
      baseURL: v.optional(v.string())
    }),
    targetCompressionRatio: v.optional(v.number()) // Default: 10x
  },
  handler: async (ctx, args): Promise<OCRResult> => {
    const startTime = Date.now()
    const targetRatio = args.targetCompressionRatio || 10

    try {
      // Step 1: Download PDF
      console.log('[OCR] Downloading document:', args.documentUrl)
      const response = await fetch(args.documentUrl)
      if (!response.ok) {
        throw new Error(`Failed to download document: ${response.statusText}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Step 2: Extract text with pdf-parse
      console.log('[OCR] Extracting text from PDF...')
      const pdfData = await pdfParse(buffer)
      const originalText = pdfData.text
      const originalTokens = estimateTokens(originalText)

      console.log('[OCR] Extracted:', {
        pages: pdfData.numpages,
        characters: originalText.length,
        estimatedTokens: originalTokens
      })

      // Step 3: Compress with user's selected AI model
      console.log('[OCR] Compressing with', args.compressionModel.provider, args.compressionModel.modelId)

      const model = await createModelForCompression(args.compressionModel)
      const { generateText } = await import('ai')

      const targetLength = Math.floor(originalText.length / targetRatio)
      const targetTokens = Math.floor(originalTokens / targetRatio)

      const { text: compressedMarkdown } = await generateText({
        model,
        prompt: `You are an expert document compressor. Compress this document to approximately ${targetTokens} tokens (${targetRatio}x compression) while preserving ALL key information.

REQUIREMENTS:
- Output ONLY valid markdown
- Preserve all important facts, numbers, and citations
- Maintain document structure with headings
- Keep technical terminology intact
- Remove redundancy and verbose explanations
- Target length: ~${targetLength} characters

DOCUMENT TO COMPRESS:
${originalText}

COMPRESSED MARKDOWN:`,
        temperature: 0.3, // Low temperature for consistency
        maxTokens: Math.min(targetTokens * 2, 4096) // Allow some buffer
      })

      const compressedTokens = estimateTokens(compressedMarkdown)
      const actualRatio = originalTokens / compressedTokens
      const tokenSavings = ((originalTokens - compressedTokens) / originalTokens) * 100

      console.log('[OCR] Compression complete:', {
        originalTokens,
        compressedTokens,
        actualRatio: actualRatio.toFixed(2) + 'x',
        tokenSavings: tokenSavings.toFixed(1) + '%'
      })

      // Step 4: Calculate confidence score
      // Higher confidence if compression is close to target
      const ratioDeviation = Math.abs(actualRatio - targetRatio) / targetRatio
      const confidence = Math.max(0.5, 1 - ratioDeviation)

      const result: OCRResult = {
        documentUrl: args.documentUrl,
        originalText,
        compressedMarkdown,
        originalTokens,
        compressedTokens,
        tokenSavings,
        compressionRatio: actualRatio,
        processingTimeMs: Date.now() - startTime,
        confidence,
        metadata: {
          pages: pdfData.numpages,
          title: pdfData.info?.Title,
          author: pdfData.info?.Author,
          createdAt: pdfData.info?.CreationDate
        }
      }

      // Step 5: Store result in database
      await ctx.runMutation(internal.ocr.storeResult, {
        documentUrl: args.documentUrl,
        result: result as any
      })

      return result

    } catch (error: any) {
      console.error('[OCR] Processing failed:', error)

      // Store error in database
      await ctx.runMutation(internal.ocr.storeError, {
        documentUrl: args.documentUrl,
        errorMessage: error.message,
        errorStack: error.stack
      })

      throw new Error(`OCR processing failed: ${error.message}`)
    }
  }
})

/**
 * Process multiple documents in parallel
 */
export const processDocumentBatch = action({
  args: {
    documentUrls: v.array(v.string()),
    compressionModel: v.object({
      provider: v.string(),
      modelId: v.string(),
      apiKey: v.optional(v.string()),
      baseURL: v.optional(v.string())
    }),
    targetCompressionRatio: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    console.log('[OCR] Processing batch of', args.documentUrls.length, 'documents')

    const results = await Promise.allSettled(
      args.documentUrls.map(url =>
        ctx.runAction(internal.ocr.processDocument, {
          documentUrl: url,
          compressionModel: args.compressionModel,
          targetCompressionRatio: args.targetCompressionRatio
        })
      )
    )

    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    console.log('[OCR] Batch complete:', { successful, failed })

    return {
      total: args.documentUrls.length,
      successful,
      failed,
      results: results.map((r, i) => ({
        url: args.documentUrls[i],
        status: r.status,
        result: r.status === 'fulfilled' ? r.value : null,
        error: r.status === 'rejected' ? r.reason?.message : null
      }))
    }
  }
})

/**
 * Internal mutation to store OCR result
 */
export const storeResult = internalMutation({
  args: {
    documentUrl: v.string(),
    result: v.any()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('ocrResults', {
      documentUrl: args.documentUrl,
      originalTokens: args.result.originalTokens,
      compressedTokens: args.result.compressedTokens,
      tokenSavings: args.result.tokenSavings,
      compressionRatio: args.result.compressionRatio,
      compressedMarkdown: args.result.compressedMarkdown,
      processingTimeMs: args.result.processingTimeMs,
      confidence: args.result.confidence,
      metadata: args.result.metadata,
      createdAt: Date.now()
    })
  }
})

/**
 * Internal mutation to store OCR error
 */
export const storeError = internalMutation({
  args: {
    documentUrl: v.string(),
    errorMessage: v.string(),
    errorStack: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('ocrErrors', {
      documentUrl: args.documentUrl,
      errorMessage: args.errorMessage,
      errorStack: args.errorStack,
      createdAt: Date.now()
    })
  }
})
