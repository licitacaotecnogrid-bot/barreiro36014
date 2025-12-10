/**
 * Get the API base URL from environment variables
 * Defaults to relative URLs (works in dev with Vite proxy)
 * Falls back to empty string if env var is not set
 */
export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_URL || "";
}

/**
 * Construct a full API URL
 * @param endpoint - The API endpoint (e.g., "/api/login")
 * @returns The full URL to the API endpoint
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}${endpoint}` : endpoint;
}
