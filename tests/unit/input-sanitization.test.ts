import { describe, expect, it } from "vitest";
import {
	sanitizeApiKey,
	sanitizeFilename,
	sanitizeInput,
} from "../../src/lib/security/input-sanitization";

describe("input sanitization", () => {
	it("strips HTML from general input", () => {
		expect(
			sanitizeInput('<script>alert("x")</script><b>Hello</b> world'),
		).toBe("Hello world");
	});

	it("sanitizes filenames without preserving tags", () => {
		expect(sanitizeFilename("<b>report</b>.pdf")).toBe("report.pdf");
	});

	it("rejects API keys containing HTML", () => {
		expect(() => sanitizeApiKey("<b>sk-test-1234567890</b>")).toThrow(
			"Invalid characters in API key",
		);
	});
});
