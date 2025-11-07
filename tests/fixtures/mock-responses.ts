/**
 * Mock API responses for testing without real API calls
 * Ensures tests can run with local models and don't require real API keys
 */

export const mockSearchResponses = {
  autumn: {
    success: {
      results: [
        {
          id: 'autumn-1',
          title: 'Introduction to Neural Networks',
          url: 'https://example.com/neural-networks',
          snippet: 'A comprehensive guide to understanding neural networks and deep learning.',
          publishedDate: '2024-01-15',
          domain: 'example.com',
          relevanceScore: 0.95,
        },
        {
          id: 'autumn-2',
          title: 'Machine Learning Best Practices',
          url: 'https://arxiv.org/ml-practices',
          snippet: 'Research paper on best practices in machine learning engineering.',
          publishedDate: '2024-02-01',
          domain: 'arxiv.org',
          relevanceScore: 0.88,
        },
      ],
      metadata: {
        totalResults: 2,
        queryTime: 145,
      },
    },
    error: {
      error: 'API_ERROR',
      message: 'Failed to fetch results from Autumn API',
      statusCode: 500,
    },
  },

  firecrawl: {
    success: {
      results: [
        {
          id: 'firecrawl-1',
          title: 'Deep Learning Tutorial',
          url: 'https://github.com/deep-learning-tutorial',
          snippet: 'Complete tutorial on deep learning with practical examples.',
          publishedDate: '2024-01-20',
          domain: 'github.com',
          relevanceScore: 0.92,
          markdown: '# Deep Learning Tutorial\n\nComplete guide to deep learning...',
        },
        {
          id: 'firecrawl-2',
          title: 'TensorFlow Documentation',
          url: 'https://tensorflow.org/docs',
          snippet: 'Official TensorFlow documentation and guides.',
          publishedDate: '2024-02-10',
          domain: 'tensorflow.org',
          relevanceScore: 0.85,
          markdown: '# TensorFlow\n\nOfficial documentation...',
        },
      ],
      metadata: {
        totalResults: 2,
        queryTime: 230,
      },
    },
    error: {
      error: 'SCRAPING_ERROR',
      message: 'Failed to scrape content from URL',
      statusCode: 500,
    },
  },
};

export const mockOCRResponses = {
  deepseek: {
    success: {
      content: '# Research Paper\n\nThis is the extracted content from the PDF document...',
      stats: {
        originalTokens: 5000,
        compressedTokens: 500,
        compressionRatio: 10,
      },
      confidence: 0.96,
      metadata: {
        pages: 10,
        processingTime: 3500,
      },
    },
    error: {
      error: 'OCR_ERROR',
      message: 'Failed to process document',
      statusCode: 500,
    },
  },
};

export const mockLLMResponses = {
  claude: {
    success: {
      id: 'msg_123',
      type: 'message',
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: 'This is a test response from Claude.',
        },
      ],
      model: 'claude-3-5-sonnet-20241022',
      stop_reason: 'end_turn',
      usage: {
        input_tokens: 100,
        output_tokens: 50,
      },
    },
    toolCalling: {
      id: 'msg_456',
      type: 'message',
      role: 'assistant',
      content: [
        {
          type: 'tool_use',
          id: 'tool_123',
          name: 'autumn_search',
          input: {
            query: 'neural networks',
          },
        },
      ],
      model: 'claude-3-5-sonnet-20241022',
      stop_reason: 'tool_use',
      usage: {
        input_tokens: 150,
        output_tokens: 75,
      },
    },
  },

  openai: {
    success: {
      id: 'chatcmpl-123',
      object: 'chat.completion',
      created: 1677652288,
      model: 'gpt-4',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: 'This is a test response from OpenAI.',
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 100,
        completion_tokens: 50,
        total_tokens: 150,
      },
    },
  },

  local: {
    success: {
      model: 'llama2',
      created_at: '2024-01-01T00:00:00Z',
      message: {
        role: 'assistant',
        content: 'This is a response from a local model.',
      },
      done: true,
      total_duration: 500000000,
      load_duration: 100000000,
      prompt_eval_count: 100,
      eval_count: 50,
    },
  },
};

export const mockConvexData = {
  searches: [
    {
      _id: 'search_1',
      _creationTime: Date.now(),
      query: 'neural networks',
      userId: 'user_1',
      results: [],
      status: 'pending',
      createdAt: Date.now(),
    },
    {
      _id: 'search_2',
      _creationTime: Date.now() - 3600000,
      query: 'machine learning',
      userId: 'user_1',
      results: mockSearchResponses.autumn.success.results,
      status: 'complete',
      tokenSavings: 90.0,
      addScores: {
        'autumn-1': 0.92,
        'autumn-2': 0.85,
      },
      createdAt: Date.now() - 3600000,
    },
  ],

  toolCalls: [
    {
      _id: 'tool_1',
      _creationTime: Date.now(),
      toolName: 'autumn_search',
      parameters: { query: 'neural networks' },
      result: mockSearchResponses.autumn.success,
      duration: 145,
      success: true,
      timestamp: Date.now(),
    },
    {
      _id: 'tool_2',
      _creationTime: Date.now() - 1000,
      toolName: 'firecrawl_search',
      parameters: { query: 'neural networks' },
      result: mockSearchResponses.firecrawl.success,
      duration: 230,
      success: true,
      timestamp: Date.now() - 1000,
    },
  ],

  learningPatterns: [
    {
      _id: 'pattern_1',
      _creationTime: Date.now(),
      toolName: 'parallel_search',
      successRate: 0.95,
      avgDuration: 187.5,
      recommendations: [
        'Use parallel execution for better performance',
        'Cache frequently used queries',
      ],
      lastUpdated: Date.now(),
    },
  ],
};

export const mockADDScores = {
  results: [
    {
      id: 'autumn-1',
      addScore: 0.92,
      delta: {
        relevance: 0.15,
        freshness: 0.05,
        authority: 0.10,
      },
    },
    {
      id: 'autumn-2',
      addScore: 0.85,
      delta: {
        relevance: 0.12,
        freshness: 0.03,
        authority: 0.08,
      },
    },
  ],
};

// Helper to create mock fetch responses
export function createMockFetchResponse<T>(data: T, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers({
      'content-type': 'application/json',
    }),
  } as Response;
}

// Helper to simulate API delays
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper to generate random mock data
export function generateMockSearchResult(id: string) {
  return {
    id,
    title: `Mock Result ${id}`,
    url: `https://example.com/result-${id}`,
    snippet: `This is a mock search result snippet for ${id}`,
    publishedDate: new Date().toISOString(),
    domain: 'example.com',
    relevanceScore: Math.random(),
  };
}
