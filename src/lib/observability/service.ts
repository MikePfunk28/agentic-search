import type {
	MetricsRecord,
	ModelCallTrace,
	ObservabilityConfig,
	SearchTrace,
	Span,
	SpanAttributes,
	TraceContext,
} from "./types";
import { defaultConfig } from "./types";

export class ObservabilityService {
	private config: ObservabilityConfig;
	private spans: Map<string, Span> = new Map();
	private metrics: MetricsRecord[] = [];
	private currentTraceId: string | null = null;
	private currentSpanStack: string[] = [];

	constructor(config: Partial<ObservabilityConfig> = {}) {
		this.config = { ...defaultConfig, ...config };
	}

	startTrace(name: string, attributes?: SpanAttributes): TraceContext {
		const traceId = this.generateId();
		const spanId = this.generateId();

		this.currentTraceId = traceId;
		this.currentSpanStack = [spanId];

		const span: Span = {
			spanId,
			traceId,
			name,
			kind: "server",
			startTime: Date.now(),
			attributes: {
				"service.name": this.config.serviceName,
				"service.version": this.config.serviceVersion,
				"service.environment": this.config.environment,
				...attributes,
			},
			status: "unset",
		};

		this.spans.set(spanId, span);

		if (this.config.enableConsoleExport) {
			console.log(`[Trace] START ${name}`, { traceId, spanId, attributes });
		}

		return {
			traceId,
			spanId,
			traceFlags: 1,
		};
	}

	startSpan(
		name: string,
		attributes?: SpanAttributes,
		parentContext?: TraceContext,
	): TraceContext {
		const traceId =
			parentContext?.traceId || this.currentTraceId || this.generateId();
		const spanId = this.generateId();
		const parentSpanId =
			this.currentSpanStack[this.currentSpanStack.length - 1];

		this.currentSpanStack.push(spanId);

		const span: Span = {
			spanId,
			traceId,
			name,
			kind: "internal",
			startTime: Date.now(),
			attributes: attributes || {},
			status: "unset",
			parentSpanId,
		};

		this.spans.set(spanId, span);

		if (this.config.enableConsoleExport) {
			console.log(`[Trace] SPAN ${name}`, { traceId, spanId, parentSpanId });
		}

		return {
			traceId,
			spanId,
			traceFlags: 1,
		};
	}

	endSpan(
		context: TraceContext,
		status: "ok" | "error" = "ok",
		error?: string,
	): void {
		const span = this.spans.get(context.spanId);
		if (!span) return;

		span.endTime = Date.now();
		span.status = status;

		if (error) {
			span.attributes["error.message"] = error;
		}

		this.currentSpanStack = this.currentSpanStack.filter(
			(id) => id !== context.spanId,
		);

		if (this.config.enableConsoleExport) {
			const duration = span.endTime - span.startTime;
			console.log(`[Trace] END ${span.name}`, {
				spanId: context.spanId,
				duration: `${duration}ms`,
				status,
			});
		}
	}

	endTrace(context: TraceContext, status: "ok" | "error" = "ok"): void {
		this.endSpan(context, status);

		if (this.currentSpanStack.length === 0) {
			this.currentTraceId = null;
		}
	}

	recordMetric(
		name: string,
		value: number,
		type: MetricsRecord["type"] = "gauge",
		attributes?: SpanAttributes,
	): void {
		const metric: MetricsRecord = {
			name,
			value,
			timestamp: Date.now(),
			type,
			attributes: {
				"service.name": this.config.serviceName,
				...attributes,
			},
		};

		this.metrics.push(metric);

		if (this.config.enableConsoleExport) {
			console.log(`[Metric] ${name}=${value}`, { type, attributes });
		}
	}

	incrementCounter(name: string, attributes?: SpanAttributes): void {
		this.recordMetric(name, 1, "counter", attributes);
	}

	recordHistogram(
		name: string,
		value: number,
		attributes?: SpanAttributes,
	): void {
		this.recordMetric(name, value, "histogram", attributes);
	}

	traceSearch(trace: SearchTrace): void {
		const context = this.startSpan("search.execute", {
			"search.query": trace.query,
			"search.enhanced_query": trace.enhancedQuery,
			"search.provider": trace.provider,
			"search.model": trace.model,
		});

		this.recordHistogram("search.duration_ms", trace.processingTimeMs, {
			"search.provider": trace.provider,
			"search.cache_hit": String(trace.cacheHit),
		});

		this.recordHistogram("search.tokens_used", trace.tokensUsed, {
			"search.provider": trace.provider,
			"search.model": trace.model,
		});

		this.recordHistogram("search.result_count", trace.resultCount);
		this.recordHistogram("search.quality_score", trace.qualityScore);

		if (trace.cacheHit) {
			this.incrementCounter("search.cache_hits");
		} else {
			this.incrementCounter("search.cache_misses");
		}

		this.endSpan(context, trace.error ? "error" : "ok", trace.error);
	}

	traceModelCall(trace: ModelCallTrace): void {
		const context = this.startSpan("model.call", {
			"model.provider": trace.provider,
			"model.name": trace.model,
		});

		this.recordHistogram("model.latency_ms", trace.latencyMs, {
			"model.provider": trace.provider,
			"model.name": trace.model,
		});

		this.recordHistogram("model.input_tokens", trace.inputTokens, {
			"model.provider": trace.provider,
		});

		this.recordHistogram("model.output_tokens", trace.outputTokens, {
			"model.provider": trace.provider,
		});

		if (trace.success) {
			this.incrementCounter("model.calls.success", {
				"model.provider": trace.provider,
			});
		} else {
			this.incrementCounter("model.calls.error", {
				"model.provider": trace.provider,
			});
		}

		this.endSpan(context, trace.success ? "ok" : "error", trace.error);
	}

	getSpans(): Span[] {
		return Array.from(this.spans.values());
	}

	getMetrics(): MetricsRecord[] {
		return [...this.metrics];
	}

	getStats(): {
		spanCount: number;
		metricCount: number;
		averageLatency: number;
		errorRate: number;
	} {
		const completedSpans = Array.from(this.spans.values()).filter(
			(s) => s.endTime,
		);
		const errorSpans = completedSpans.filter((s) => s.status === "error");
		const latencies = completedSpans.map((s) => s.endTime! - s.startTime);

		return {
			spanCount: this.spans.size,
			metricCount: this.metrics.length,
			averageLatency:
				latencies.length > 0
					? latencies.reduce((a, b) => a + b, 0) / latencies.length
					: 0,
			errorRate:
				completedSpans.length > 0
					? errorSpans.length / completedSpans.length
					: 0,
		};
	}

	clear(): void {
		this.spans.clear();
		this.metrics = [];
		this.currentTraceId = null;
		this.currentSpanStack = [];
	}

	private generateId(): string {
		return crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);
	}
}

function getEnvVar(name: string): string | undefined {
	try {
		return (import.meta as any)?.env?.[name];
	} catch {
		return typeof process !== "undefined" ? process.env?.[name] : undefined;
	}
}

function isDevelopment(): boolean {
	const env = getEnvVar("NODE_ENV");
	return env === "development" || !env;
}

export const observability = new ObservabilityService({
	langsmithApiKey: getEnvVar("VITE_LANGSMITH_API_KEY"),
	langsmithProject: "agentic-search",
	enableConsoleExport: isDevelopment(),
});

export type {
	Span,
	TraceContext,
	MetricsRecord,
	SearchTrace,
	ModelCallTrace,
	ObservabilityConfig,
};
