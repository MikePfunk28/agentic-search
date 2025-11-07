/**
 * Web Crypto API Utilities for Secure API Key Encryption
 * Uses AES-GCM encryption with PBKDF2 key derivation
 */

// Encryption configuration constants
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_HASH = 'SHA-256';
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

/**
 * Check if Web Crypto API is available
 */
export function isCryptoAvailable(): boolean {
  return typeof window !== 'undefined' &&
         window.crypto &&
         window.crypto.subtle !== undefined;
}

/**
 * Generate a random salt for key derivation
 */
export function generateSalt(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Generate a random IV for encryption
 */
function generateIV(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

/**
 * Derive an encryption key from a password using PBKDF2
 * @param password - User password or session key
 * @param salt - Random salt (should be stored with encrypted data)
 * @returns CryptoKey for AES-GCM encryption
 */
export async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  if (!isCryptoAvailable()) {
    throw new Error('Web Crypto API is not available in this browser');
  }

  // Convert password to key material
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive the actual encryption key
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: PBKDF2_HASH
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt an API key using AES-GCM
 * @param apiKey - The API key to encrypt (e.g., "sk-ant-...")
 * @param password - User password or session key
 * @returns Base64-encoded encrypted data with salt and IV
 */
export async function encryptApiKey(
  apiKey: string,
  password: string
): Promise<string> {
  if (!isCryptoAvailable()) {
    throw new Error('Web Crypto API is not available in this browser');
  }

  if (!apiKey || !password) {
    throw new Error('API key and password are required');
  }

  try {
    // Generate salt and IV
    const salt = generateSalt();
    const iv = generateIV();

    // Derive encryption key
    const key = await deriveKey(password, salt);

    // Encrypt the API key
    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);

    const encryptedData = await window.crypto.subtle.encrypt(
      { name: ALGORITHM, iv: iv },
      key,
      data
    );

    // Combine salt, IV, and encrypted data
    const combined = new Uint8Array(
      salt.length + iv.length + encryptedData.byteLength
    );
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

    // Return as base64
    return arrayBufferToBase64(combined.buffer);
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt API key');
  }
}

/**
 * Decrypt an API key using AES-GCM
 * @param encryptedData - Base64-encoded encrypted data (from encryptApiKey)
 * @param password - User password or session key (must match encryption password)
 * @returns Decrypted API key
 */
export async function decryptApiKey(
  encryptedData: string,
  password: string
): Promise<string> {
  if (!isCryptoAvailable()) {
    throw new Error('Web Crypto API is not available in this browser');
  }

  if (!encryptedData || !password) {
    throw new Error('Encrypted data and password are required');
  }

  try {
    // Decode base64 to array buffer
    const combined = base64ToArrayBuffer(encryptedData);
    const combinedArray = new Uint8Array(combined);

    // Extract salt, IV, and encrypted data
    const salt = combinedArray.slice(0, SALT_LENGTH);
    const iv = combinedArray.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const encrypted = combinedArray.slice(SALT_LENGTH + IV_LENGTH);

    // Derive decryption key (same as encryption key)
    const key = await deriveKey(password, salt);

    // Decrypt
    const decrypted = await window.crypto.subtle.decrypt(
      { name: ALGORITHM, iv: iv },
      key,
      encrypted
    );

    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt API key - invalid password or corrupted data');
  }
}

/**
 * Mask an API key for display purposes
 * Shows only first 7 and last 4 characters
 * @param apiKey - The API key to mask
 * @returns Masked API key (e.g., "sk-ant-***-xyz")
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey) return '';

  if (apiKey.length <= 11) {
    // Too short to mask effectively
    return '***' + apiKey.slice(-2);
  }

  const prefix = apiKey.slice(0, 7); // "sk-ant-"
  const suffix = apiKey.slice(-4);   // last 4 chars

  return `${prefix}***${suffix}`;
}

/**
 * Generate a random session password for encryption
 * Used when user doesn't provide a password
 * WARNING: Session passwords should be stored securely in sessionStorage
 */
export function generateSessionPassword(): string {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return arrayBufferToBase64(array.buffer);
}

/**
 * Convert ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Validate that a string looks like an encrypted blob
 * (Basic sanity check, not cryptographic validation)
 */
export function isEncryptedData(data: string): boolean {
  if (!data || typeof data !== 'string') return false;

  try {
    const buffer = base64ToArrayBuffer(data);
    const array = new Uint8Array(buffer);

    // Should be at least: salt (16) + IV (12) + some encrypted data
    return array.length >= (SALT_LENGTH + IV_LENGTH + 16);
  } catch {
    return false;
  }
}
