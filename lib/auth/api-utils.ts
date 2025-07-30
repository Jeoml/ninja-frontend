import { getAuthHeaders, getAuthHeadersServer } from './token-storage';
import useSWR from 'swr';

/**
 * Authenticated API Client Class
 * Use this for making API calls with automatic bearer token inclusion
 */
export class AuthenticatedAPIClient {
  private baseURL: string;
  
  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }
  
  async get(endpoint: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, { 
      method: 'GET',
      headers 
    });
    
    if (!response.ok) {
      throw new Error(`GET ${endpoint} failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async post(endpoint: string, data: any) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async put(endpoint: string, data: any) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`PUT ${endpoint} failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async delete(endpoint: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`DELETE ${endpoint} failed: ${response.statusText}`);
    }
    
    return response.json();
  }
}

/**
 * Custom hook for authenticated SWR requests
 * Automatically includes bearer token in requests
 */
export function useAuthenticatedSWR<T = any>(url: string | null) {
  const fetcher = async (url: string) => {
    const headers = await getAuthHeaders();
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    
    return response.json();
  };
  
  return useSWR<T>(url, fetcher);
}

/**
 * Custom hook for authenticated API calls
 * Returns functions to make authenticated requests
 */
export function useAuthenticatedAPI() {
  const makeRequest = async (url: string, options: RequestInit = {}) => {
    const authHeaders = await getAuthHeaders();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...authHeaders,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }
    
    return response;
  };

  const get = async (url: string) => {
    const response = await makeRequest(url, { method: 'GET' });
    return response.json();
  };

  const post = async (url: string, data: any) => {
    const response = await makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  };

  const put = async (url: string, data: any) => {
    const response = await makeRequest(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  };

  const del = async (url: string) => {
    const response = await makeRequest(url, { method: 'DELETE' });
    return response.json();
  };

  return { makeRequest, get, post, put, delete: del };
}

/**
 * Helper function for calling external APIs with bearer token
 */
export async function callExternalAPI(
  baseURL: string, 
  endpoint: string, 
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    headers?: Record<string, string>;
  } = {}
) {
  const { method = 'GET', data, headers: customHeaders = {} } = options;
  
  const authHeaders = await getAuthHeaders();
  
  const response = await fetch(`${baseURL}${endpoint}`, {
    method,
    headers: {
      ...authHeaders,
      ...customHeaders,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`External API call failed: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Server-side helper for making authenticated API calls
 * Use this in API routes or server components
 */
export async function serverAPICall(
  url: string, 
  options: RequestInit = {}
) {
  const headers = await getAuthHeadersServer();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Server API call failed: ${response.statusText}`);
  }
  
  return response.json();
}
