/**
 * S3 Document Storage with IAM Role
 * Secure document upload/download using AWS SDK v3
 * 
 * Setup:
 * 1. Create IAM role with S3 permissions
 * 2. Set environment variables:
 *    - AWS_ACCESS_KEY_ID
 *    - AWS_SECRET_ACCESS_KEY
 *    - AWS_REGION (default: us-east-1)
 *    - AWS_S3_BUCKET
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client with IAM credentials from environment
const s3Client = new S3Client({
	region: process.env.AWS_REGION || "us-east-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
	},
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "agentic-search-documents";

export interface UploadResult {
	key: string;
	url: string;
	size: number;
}

/**
 * Upload a file to S3 and return its storage details.
 *
 * @param file - The file content to upload; either a Buffer or a UTF-8 string.
 * @param filename - The original filename to preserve in object metadata and key.
 * @param contentType - The MIME type of the file.
 * @returns The upload result containing the S3 object `key`, a public `url`, and the object `size` in bytes.
 * @throws If `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` environment variables are not set.
 */
export async function uploadDocument(
	file: Buffer | string,
	filename: string,
	contentType: string
): Promise<UploadResult> {
	// Validate credentials
	if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
		throw new Error(
			"AWS credentials not configured. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables."
		);
	}

	// Generate unique key with timestamp
	const timestamp = Date.now();
	const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
	const key = `documents/${timestamp}-${sanitizedFilename}`;

	// Convert string to buffer if needed
	const body = typeof file === "string" ? Buffer.from(file, "utf-8") : file;

	// Upload to S3
	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		Key: key,
		Body: body,
		ContentType: contentType,
		// Server-side encryption
		ServerSideEncryption: "AES256",
		// Metadata
		Metadata: {
			uploadedAt: new Date().toISOString(),
			originalFilename: filename,
		},
	});

	await s3Client.send(command);

	// Generate public URL (or use presigned URL for private access)
	const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;

	return {
		key,
		url,
		size: body.length,
	};
}

/**
 * Generates a presigned URL for temporary private access to an S3 object.
 *
 * @param key - The S3 object key.
 * @param expiresIn - Expiration time in seconds (default: 3600).
 * @returns A presigned URL that grants access to the specified object for the given number of seconds.
 */
export async function getPresignedDownloadUrl(
	key: string,
	expiresIn: number = 3600
): Promise<string> {
	const command = new GetObjectCommand({
		Bucket: BUCKET_NAME,
		Key: key,
	});

	// Generate presigned URL (valid for 1 hour by default)
	const url = await getSignedUrl(s3Client, command, { expiresIn });
	return url;
}

/**
 * Retrieve an S3 object and return its complete contents as a Buffer.
 *
 * @returns The object's bytes as a `Buffer`.
 * @throws Error if the S3 response has no body.
 */
export async function downloadDocument(key: string): Promise<Buffer> {
	const command = new GetObjectCommand({
		Bucket: BUCKET_NAME,
		Key: key,
	});

	const response = await s3Client.send(command);

	if (!response.Body) {
		throw new Error("Document body is empty");
	}

	// Convert stream to buffer
	const chunks: Uint8Array[] = [];
	for await (const chunk of response.Body as any) {
		chunks.push(chunk);
	}

	return Buffer.concat(chunks);
}

/**
 * Remove an object from the configured S3 bucket.
 *
 * @param key - The S3 object key identifying the file to delete
 */
export async function deleteDocument(key: string): Promise<void> {
	const command = new DeleteObjectCommand({
		Bucket: BUCKET_NAME,
		Key: key,
	});

	await s3Client.send(command);
}

/**
 * Determine whether S3 credentials and bucket are configured.
 *
 * @returns `true` if `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_S3_BUCKET` are set, `false` otherwise.
 */
export function isS3Configured(): boolean {
	return !!(
		process.env.AWS_ACCESS_KEY_ID &&
		process.env.AWS_SECRET_ACCESS_KEY &&
		process.env.AWS_S3_BUCKET
	);
}

/**
 * Decide storage strategy based on file size
 * Small files (<1MB) go to Convex, large files to S3
 */
export const FILE_SIZE_THRESHOLD = 1024 * 1024; /**
 * Decides whether a file should be stored in S3 based on its size and current S3 configuration.
 *
 * @param fileSize - File size in bytes
 * @returns `true` if `fileSize` is greater than `FILE_SIZE_THRESHOLD` and S3 is configured, `false` otherwise.
 */

export function shouldUseS3(fileSize: number): boolean {
	return fileSize > FILE_SIZE_THRESHOLD && isS3Configured();
}