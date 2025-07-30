"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const getBearerToken = (): string | null => {
    if (session?.accessToken) {
      return session.accessToken;
    }
    return null;
  };

  const getAuthHeaders = (): Record<string, string> => {
    const token = getBearerToken();
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }
    return {};
  };

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const login = async (provider?: string) => {
    await signIn(provider);
  };

  const logout = async () => {
    await signOut();
    router.push("/");
  };

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const authHeaders = getAuthHeaders();
    const headers = {
      ...options.headers,
      ...authHeaders,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };

  return {
    session,
    user: session?.user,
    isAuthenticated,
    isLoading,
    getBearerToken,
    getAuthHeaders,
    login,
    logout,
    authenticatedFetch,
  };
}
