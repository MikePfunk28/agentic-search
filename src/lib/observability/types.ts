export interface SpanAttributes {
	[key: string]: string | number | boolean | undefined;
}

export interface Span {
	spanId: string;
	traceId: string;
	name: string;
	kind: "internal" | "server" | "client";
	startTime: number;
	endTime?: number;
	attributes: SpanAttributes;
	status: "ok" | "error" | "unset";
	parentSpanId?: string;
}

export interface TraceContext {
	traceId: string;
	spanId: string;
	traceFlags: number;
}

export interface MetricsRecord {
	name: string;
	value: number;
	timestamp: number;
	attributes?: SpanAttributes;
	type: "counter" | "gauge" | "histogram";
}

export interface ObservabilityConfig {
	serviceName: string;
	serviceVersion: string;
	environment: string;
	langsmithApiKey?: string;
	langsmithProject?: string;
	enableConsoleExport: boolean;
	sampleRate: number;
}

export interface SearchTrace {
	query: string;
	enhancedQuery?: string;
	provider?: string;
	model?: string;
	tokensUsed: number;
	processingTimeMs: number;
	cacheHit: boolean;
	resultCount: number;
	qualityScore: number;
	error?: string;
}

export interface ModelCallTrace {
	provider: string;
	model: string;
	inputTokens: number;
	outputTokens: number;
	latencyMs: number;
	success: boolean;
	error?: string;
}

export const defaultConfig: ObservabilityConfig = {
	serviceName: "agentic-search",
	serviceVersion: "1.0.0",
	environment:
		typeof process !== "undefined"
			? process.env?.NODE_ENV || "development"
			: "development",
	enableConsoleExport: true,
	sampleRate: 1.0,
};
