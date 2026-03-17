import { describe, expect, test } from "vitest";
import { AgenticSearchEngine } from "../../src/lib/agentic-search";

describe("AgenticSearchEngine", () => {
	test("parses fenced JSON responses from model helpers", () => {
		const engine = new AgenticSearchEngine() as any;

		const parsed = engine.parseJsonObjectResponse(
			"```json\n{\n  \"type\": \"research\",\n  \"complexity\": \"moderate\",\n  \"sources\": [\"web\", \"academic\"]\n}\n```",
		);

		expect(parsed).toEqual({
			type: "research",
			complexity: "moderate",
			sources: ["web", "academic"],
		});
	});

	test("does not append the current year when the query already includes one", () => {
		const engine = new AgenticSearchEngine() as any;

		const variants = engine.buildDeterministicFollowUpQueries(
			"Latest in AI research as of march 2026",
			{
				type: "news",
				complexity: "moderate",
				sources: ["web", "academic"],
			},
		);

		expect(variants.some((variant: string) => variant.includes("2026 2026"))).toBe(
			false,
		);
		expect(variants).toContain(
			"Latest in AI research as of march 2026 recent developments",
		);
	});
});
