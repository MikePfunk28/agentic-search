/**
 * Encrypted Storage Wrapper
 * Provides automatic encryption/decryption for localStorage
 * Uses session-based password management
 */

import {
  encryptApiKey,
  decryptApiKey,
  generateSessionPassword,
  isCryptoAvailable,
  isEncryptedData,
  maskApiKey
} from './crypto-utils';

const SESSION_PASSWORD_KEY = '__crypto_session_password__';
const MIGRATION_FLAG_KEY = '__crypto_migrated__';

/**
 * Get or create session password for encryption
 * Password is stored in sessionStorage and cleared on browser close
 */
function getSessionPassword(): string {
  if (typeof window === 'undefined') {
    throw new Error('Storage operations require browser environment');
  }

  // Check if we already have a session password
  let password = sessionStorage.getItem(SESSION_PASSWORD_KEY);

  if (!password) {
    // Generate new session password
    password = generateSessionPassword();
    sessionStorage.setItem(SESSION_PASSWORD_KEY, password);
  }

  return password;
}

/**
 * Clear session password (e.g., on logout)
 */
export function clearSessionPassword(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SESSION_PASSWORD_KEY);
  }
}

/**
 * Securely store an encrypted value in localStorage
 * @param key - Storage key
 * @param value - Value to encrypt and store
 */
export async function secureSetItem(key: string, value: string): Promise<void> {
  if (!isCryptoAvailable()) {
    console.warn('Web Crypto API not available, storing data unencrypted');
    localStorage.setItem(key, value);
    return;
  }

  try {
    const password = getSessionPassword();
    const encrypted = await encryptApiKey(value, password);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error('Failed to encrypt and store data:', error);
    throw new Error('Storage encryption failed');
  }
}

/**
 * Retrieve and decrypt a value from localStorage
 * @param key - Storage key
 * @returns Decrypted value or null if not found
 */
export async function secureGetItem(key: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(key);
  if (!stored) return null;

  // Check if data is encrypted
  if (!isEncryptedData(stored)) {
    // Legacy unencrypted data - migrate it
    console.warn(`Migrating unencrypted data for key: ${key}`);
    if (isCryptoAvailable()) {
      try {
        await secureSetItem(key, stored);
      } catch (error) {
        console.error('Failed to migrate data:', error);
      }
    }
    return stored;
  }

  if (!isCryptoAvailable()) {
    throw new Error('Cannot decrypt data: Web Crypto API not available');
  }

  try {
    const password = getSessionPassword();
    return await decryptApiKey(stored, password);
  } catch (error) {
    console.error('Failed to decrypt data:', error);
    throw new Error('Decryption failed - data may be corrupted');
  }
}

/**
 * Remove item from secure storage
 */
export function secureRemoveItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

/**
 * Check if secure storage is available
 */
export function isSecureStorageAvailable(): boolean {
  return typeof window !== 'undefined' &&
         localStorage !== undefined &&
         sessionStorage !== undefined &&
         isCryptoAvailable();
}

/**
 * Migrate all API keys in storage to encrypted format
 * Should be called once on application startup
 */
export async function migrateToEncryptedStorage(
  keys: string[]
): Promise<{ success: string[], failed: string[] }> {
  const results = { success: [] as string[], failed: [] as string[] };

  if (!isCryptoAvailable()) {
    console.warn('Web Crypto API not available - skipping migration');
    return results;
  }

  // Check if already migrated
  if (localStorage.getItem(MIGRATION_FLAG_KEY) === 'true') {
    console.log('Storage already migrated to encrypted format');
    return results;
  }

  for (const key of keys) {
    try {
      const value = localStorage.getItem(key);
      if (value && !isEncryptedData(value)) {
        // Migrate unencrypted data
        await secureSetItem(key, value);
        results.success.push(key);
      }
    } catch (error) {
      console.error(`Failed to migrate key ${key}:`, error);
      results.failed.push(key);
    }
  }

  // Set migration flag
  localStorage.setItem(MIGRATION_FLAG_KEY, 'true');

  console.log(`Migration complete: ${results.success.length} succeeded, ${results.failed.length} failed`);
  return results;
}

/**
 * Export encrypted data for backup
 * Returns base64-encoded encrypted data
 */
export async function exportEncryptedData(keys: string[]): Promise<Record<string, string>> {
  const exported: Record<string, string> = {};

  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value) {
      exported[key] = value; // Already encrypted
    }
  }

  return exported;
}

/**
 * Import encrypted data from backup
 * Assumes data is already encrypted
 */
export async function importEncryptedData(data: Record<string, string>): Promise<void> {
  for (const [key, value] of Object.entries(data)) {
    localStorage.setItem(key, value);
  }
}

/**
 * Get masked version of stored API key for display
 */
export async function getMaskedApiKey(key: string): Promise<string | null> {
  try {
    const apiKey = await secureGetItem(key);
    return apiKey ? maskApiKey(apiKey) : null;
  } catch (error) {
    console.error('Failed to get masked API key:', error);
    return null;
  }
}

/**
 * Test encryption/decryption to verify functionality
 */
export async function testEncryption(): Promise<boolean> {
  if (!isCryptoAvailable()) {
    console.error('Web Crypto API not available');
    return false;
  }

  try {
    const testKey = '__crypto_test__';
    const testValue = 'test-api-key-12345';

    await secureSetItem(testKey, testValue);
    const retrieved = await secureGetItem(testKey);
    secureRemoveItem(testKey);

    return retrieved === testValue;
  } catch (error) {
    console.error('Encryption test failed:', error);
    return false;
  }
}
