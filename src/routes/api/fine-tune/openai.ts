import { createFileRoute } from "@tanstack/react-router";
import { ZodError, z } from "zod";
import {
	createCsrfErrorResponse,
	validateCsrfRequest,
} from "@/lib/csrf-protection";
import {
	buildOpenAIJsonl,
	cancelFineTuneJob,
	createFineTuneJob,
	deleteTrainingFile,
	getFineTuneJob,
	uploadTrainingFile,
} from "@/lib/openai-fine-tuning";

const launchRequestSchema = z.object({
	action: z.literal("launch"),
	datasetName: z.string().min(1),
	records: z.array(z.unknown()).min(1),
	format: z.union([
		z.literal("openai_jsonl"),
		z.literal("anthropic_jsonl"),
		z.literal("generic_json"),
	]),
	baseModel: z.string().min(1),
	suffix: z.string().optional(),
	hyperparameters: z
		.object({
			nEpochs: z
				.union([z.literal("auto"), z.number().int().positive()])
				.optional(),
			batchSize: z
				.union([z.literal("auto"), z.number().int().positive()])
				.optional(),
			learningRateMultiplier: z
				.union([z.literal("auto"), z.number().positive()])
				.optional(),
		})
		.optional(),
});

const cancelRequestSchema = z.object({
	action: z.literal("cancel"),
	jobId: z.string().min(1),
});

export const Route = createFileRoute("/api/fine-tune/openai")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				// Auth gate: require valid session unless auth is explicitly disabled (dev mode)
				const authDisabled =
					typeof process !== "undefined" &&
					process.env?.VITE_DISABLE_AUTH === "true";
				if (!authDisabled) {
					const cookie = request.headers.get("cookie") || "";
					const hasSession =
						cookie.includes("__session") || cookie.includes("wos-session");
					if (!hasSession) {
						return new Response(
							JSON.stringify({ error: "Authentication required" }),
							{ status: 401, headers: { "Content-Type": "application/json" } },
						);
					}
				}
				// CSRF protection on GET — fine-tune status should not be leaked via cross-site requests
				const csrfCheck = validateCsrfRequest(request);
				if (!csrfCheck.valid) {
					return createCsrfErrorResponse(csrfCheck.error!);
				}

				const url = new URL(request.url);
				const jobId = url.searchParams.get("jobId");

				if (!jobId) {
					return new Response(JSON.stringify({ error: "jobId is required" }), {
						status: 400,
						headers: { "Content-Type": "application/json" },
					});
				}

				try {
					const job = await getFineTuneJob(jobId);
					return new Response(JSON.stringify({ job }), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					return new Response(
						JSON.stringify({
							error:
								error instanceof Error
									? error.message
									: "Failed to fetch fine-tune job",
						}),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
			POST: async ({ request }) => {
				// Auth gate: require valid session unless auth is explicitly disabled (dev mode)
				const postAuthDisabled =
					typeof process !== "undefined" &&
					process.env?.VITE_DISABLE_AUTH === "true";
				if (!postAuthDisabled) {
					const cookie = request.headers.get("cookie") || "";
					const hasSession =
						cookie.includes("__session") || cookie.includes("wos-session");
					if (!hasSession) {
						return new Response(
							JSON.stringify({ error: "Authentication required" }),
							{ status: 401, headers: { "Content-Type": "application/json" } },
						);
					}
				}
				const validation = validateCsrfRequest(request);
				if (!validation.valid) {
					return createCsrfErrorResponse(validation.error!);
				}

				try {
					const rawBody = await request.json();

					if (rawBody?.action === "cancel") {
						const cancelRequest = cancelRequestSchema.parse(rawBody);
						const job = await cancelFineTuneJob(cancelRequest.jobId);
						return new Response(JSON.stringify({ job }), {
							status: 200,
							headers: { "Content-Type": "application/json" },
						});
					}

					const launchRequest = launchRequestSchema.parse(rawBody);
					const jsonl = buildOpenAIJsonl(
						launchRequest.records,
						launchRequest.format,
					);
					const trainingFile = await uploadTrainingFile(
						launchRequest.datasetName,
						jsonl,
					);
					let job: Awaited<ReturnType<typeof createFineTuneJob>> | undefined;
					try {
						job = await createFineTuneJob(
							{
								datasetName: launchRequest.datasetName,
								records: launchRequest.records,
								format: launchRequest.format!,
								baseModel: launchRequest.baseModel,
								suffix: launchRequest.suffix,
								hyperparameters: launchRequest.hyperparameters,
							},
							trainingFile.id,
						);
					} catch (error) {
						try {
							await deleteTrainingFile(trainingFile.id);
						} catch (cleanupError) {
							console.error(
								"[FineTune] Failed to cleanup orphaned training file:",
								cleanupError,
							);
						}
						throw error;
					}

					return new Response(
						JSON.stringify({
							trainingFile,
							job,
						}),
						{
							status: 200,
							headers: { "Content-Type": "application/json" },
						},
					);
				} catch (error) {
					return new Response(
						JSON.stringify({
							error:
								error instanceof Error
									? error.message
									: "Failed to launch fine-tuning job",
						}),
						{
							status: error instanceof ZodError ? 400 : 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
		},
	},
});
