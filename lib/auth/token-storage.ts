import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth/config";

/**
 * Get the bearer token for API calls (client-side)
 * Use this in your existing FastAPI clients
 */
export async function getBearerToken(): Promise<string | null> {
  try {
    const session = await getSession();
    return session?.accessToken || null;
  } catch (error) {
    console.error("Error getting bearer token:", error);
    return null;
  }
}

/**
 * Get the bearer token for API calls (server-side)
 * Use this in server components or API routes
 */
export async function getBearerTokenServer(): Promise<string | null> {
  try {
    const session = await getServerSession(authConfig);
    return session?.accessToken || null;
  } catch (error) {
    console.error("Error getting bearer token (server):", error);
    return null;
  }
}

/**
 * Get Authorization header with Bearer token (client-side)
 * Returns object ready to spread into fetch headers
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getBearerToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Get Authorization header with Bearer token (server-side)
 * Returns object ready to spread into fetch headers
 */
export async function getAuthHeadersServer(): Promise<Record<string, string>> {
  const token = await getBearerTokenServer();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}
