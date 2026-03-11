export type FineTuneExportFormat =
	| "openai_jsonl"
	| "anthropic_jsonl"
	| "generic_json";

export interface OpenAIFineTuneHyperparameters {
	nEpochs?: number | "auto";
	batchSize?: number | "auto";
	learningRateMultiplier?: number | "auto";
}

export interface OpenAIFineTuneLaunchRequest {
	datasetName: string;
	records: unknown[];
	format: FineTuneExportFormat;
	baseModel: string;
	suffix?: string;
	hyperparameters?: OpenAIFineTuneHyperparameters;
}

export interface OpenAIFileObject {
	id: string;
	filename: string;
	purpose: string;
	bytes?: number;
	created_at?: number;
	status?: string;
}

export interface OpenAIFineTuneJob {
	id: string;
	status: string;
	model: string;
	training_file: string;
	fine_tuned_model?: string | null;
	error?: {
		code?: string;
		message?: string;
		param?: string | null;
	} | null;
	created_at?: number;
	finished_at?: number | null;
}

function ensureOpenAIKey(): string {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		throw new Error(
			"OPENAI_API_KEY is not configured on the TanStack Start server.",
		);
	}
	return apiKey;
}

function getOpenAIBaseUrl(): string {
	return process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
}

async function openAIFetch(path: string, init: RequestInit): Promise<Response> {
	const response = await fetch(`${getOpenAIBaseUrl()}${path}`, {
		...init,
		headers: {
			Authorization: `Bearer ${ensureOpenAIKey()}`,
			...(init.headers || {}),
		},
	});

	if (!response.ok) {
		const errorText = await response.text().catch(() => "");
		throw new Error(
			`OpenAI API error (${response.status}): ${errorText || response.statusText}`,
		);
	}

	return response;
}

function normalizeOpenAIRecord(record: any): { messages: Array<{ role: string; content: string }> } {
	if (record?.messages && Array.isArray(record.messages)) {
		return {
			messages: record.messages.map((message: any) => ({
				role: typeof message?.role === "string" ? message.role : "user",
				content:
					typeof message?.content === "string"
						? message.content
						: JSON.stringify(message?.content ?? ""),
			})),
		};
	}

	if (
		typeof record?.prompt === "string" &&
		typeof record?.completion === "string"
	) {
		return {
			messages: [
				{ role: "user", content: record.prompt },
				{ role: "assistant", content: record.completion },
			],
		};
	}

	const query =
		typeof record?.query === "string"
			? record.query
			: typeof record?.input === "string"
				? record.input
				: JSON.stringify(record?.input ?? record ?? {});
	const response =
		typeof record?.response === "string"
			? record.response
			: typeof record?.output === "string"
				? record.output
				: JSON.stringify({
						feedback: record?.feedback,
						quality: record?.quality,
						metadata: record?.metadata,
					});

	return {
		messages: [
			{
				role: "system",
				content:
					"You are a search synthesis assistant. Answer with the most relevant verified findings, keep the response concise, and include a short Sources section with URLs.",
			},
			{ role: "user", content: query },
			{ role: "assistant", content: response },
		],
	};
}

export function buildOpenAIJsonl(
	records: unknown[],
	_format: FineTuneExportFormat,
): string {
	if (!Array.isArray(records) || records.length === 0) {
		throw new Error("At least one training record is required.");
	}

	return records
		.map((record) => JSON.stringify(normalizeOpenAIRecord(record)))
		.join("\n");
}

export async function uploadTrainingFile(
	datasetName: string,
	jsonlPayload: string,
): Promise<OpenAIFileObject> {
	const form = new FormData();
	form.set(
		"file",
		new File([jsonlPayload], `${datasetName || "training-data"}.jsonl`, {
			type: "application/jsonl",
		}),
	);
	form.set("purpose", "fine-tune");

	const response = await openAIFetch("/files", {
		method: "POST",
		body: form,
	});

	return (await response.json()) as OpenAIFileObject;
}

export async function deleteTrainingFile(fileId: string): Promise<void> {
	await openAIFetch(`/files/${fileId}`, {
		method: "DELETE",
	});
}

export async function createFineTuneJob(
	request: OpenAIFineTuneLaunchRequest,
	trainingFileId: string,
): Promise<OpenAIFineTuneJob> {
	const body: Record<string, unknown> = {
		model: request.baseModel,
		training_file: trainingFileId,
		method: {
			type: "supervised",
		},
	};

	if (request.suffix?.trim()) {
		body.suffix = request.suffix.trim();
	}

	const hyperparameters: Record<string, unknown> = {};
	if (request.hyperparameters?.nEpochs !== undefined) {
		hyperparameters.n_epochs = request.hyperparameters.nEpochs;
	}
	if (request.hyperparameters?.batchSize !== undefined) {
		hyperparameters.batch_size = request.hyperparameters.batchSize;
	}
	if (request.hyperparameters?.learningRateMultiplier !== undefined) {
		hyperparameters.learning_rate_multiplier =
			request.hyperparameters.learningRateMultiplier;
	}
	if (Object.keys(hyperparameters).length > 0) {
		body.method = {
			type: "supervised",
			supervised: {
				hyperparameters,
			},
		};
	}

	const response = await openAIFetch("/fine_tuning/jobs", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	return (await response.json()) as OpenAIFineTuneJob;
}

export async function getFineTuneJob(
	jobId: string,
): Promise<OpenAIFineTuneJob> {
	const response = await openAIFetch(`/fine_tuning/jobs/${jobId}`, {
		method: "GET",
	});

	return (await response.json()) as OpenAIFineTuneJob;
}

export async function cancelFineTuneJob(
	jobId: string,
): Promise<OpenAIFineTuneJob> {
	const response = await openAIFetch(`/fine_tuning/jobs/${jobId}/cancel`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});

	return (await response.json()) as OpenAIFineTuneJob;
}
