/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Get the API base URL for the current environment
 * In development with Vite, the API is served at /api
 * In production, use the current origin
 */
export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    // Server-side
    return "";
  }

  // Client-side - use relative paths which work in both dev and production
  return "";
}
