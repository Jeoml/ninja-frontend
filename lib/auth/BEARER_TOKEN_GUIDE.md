# Bearer Token Usage Guide

This guide shows you how to use bearer tokens throughout your application using the functions in `lib/auth/token-storage.ts`.

## Available Functions

```typescript
// Client-side functions
getBearerToken(): Promise<string | null>
getAuthHeaders(): Promise<Record<string, string>>

// Server-side functions  
getBearerTokenServer(): Promise<string | null>
getAuthHeadersServer(): Promise<Record<string, string>>
```

## Usage Examples

### 1. Client-Side API Calls

#### Basic Fetch with Auth Headers
```typescript
import { getAuthHeaders } from '@/lib/auth/token-storage';

async function fetchUserData() {
  const headers = await getAuthHeaders();
  const response = await fetch('/api/user', { headers });
  return response.json();
}
```

#### External API Calls
```typescript
async function callExternalAPI(endpoint: string, data?: any) {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`https://api.example.com${endpoint}`, {
    method: data ? 'POST' : 'GET',
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });
  
  return response.json();
}
```

### 2. React Component Usage

#### In useEffect Hook
```typescript
import { getAuthHeaders } from '@/lib/auth/token-storage';
import { useEffect, useState } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    async function loadData() {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch('/api/my-endpoint', { headers });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    }
    
    loadData();
  }, []);
  
  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}
```

#### In Event Handlers
```typescript
function SubmitForm() {
  const handleSubmit = async (formData: FormData) => {
    const headers = await getAuthHeaders();
    
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers,
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    
    if (response.ok) {
      alert('Success!');
    }
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(new FormData(e.currentTarget));
    }}>
      {/* form fields */}
    </form>
  );
}
```

### 3. Server-Side Usage

#### In API Routes
```typescript
// app/api/protected/route.ts
import { getBearerTokenServer } from '@/lib/auth/token-storage';

export async function GET() {
  const token = await getBearerTokenServer();
  
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Use token for external API calls
  const response = await fetch('https://external-api.com/data', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return Response.json({ data: await response.json() });
}
```

#### In Server Components
```typescript
import { getAuthHeadersServer } from '@/lib/auth/token-storage';

export default async function ServerComponent() {
  const headers = await getAuthHeadersServer();
  
  const response = await fetch('http://localhost:3000/api/protected-data', {
    headers
  });
  
  const data = await response.json();
  
  return <div>{JSON.stringify(data)}</div>;
}
```

### 4. Custom Hooks

#### Authenticated SWR Hook
```typescript
import useSWR from 'swr';
import { getAuthHeaders } from '@/lib/auth/token-storage';

export function useAuthenticatedSWR(url: string) {
  const fetcher = async (url: string) => {
    const headers = await getAuthHeaders();
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    
    return response.json();
  };
  
  return useSWR(url, fetcher);
}

// Usage in component:
// const { data, error } = useAuthenticatedSWR('/api/user');
```

#### Custom API Hook
```typescript
export function useAuthenticatedAPI() {
  const makeRequest = async (url: string, options: RequestInit = {}) => {
    const authHeaders = await getAuthHeaders();
    
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...authHeaders,
      },
    });
  };

  return { makeRequest };
}
```

### 5. API Client Class

```typescript
export class AuthenticatedAPIClient {
  private baseURL: string;
  
  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }
  
  async get(endpoint: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, { headers });
    return response.json();
  }
  
  async post(endpoint: string, data: any) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return response.json();
  }
  
  async put(endpoint: string, data: any) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return response.json();
  }
  
  async delete(endpoint: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return response.json();
  }
}

// Usage:
// const api = new AuthenticatedAPIClient();
// await api.get('/users');
// await api.post('/users', userData);
```

## Key Points

1. **Client vs Server**: Use client functions (`getBearerToken`, `getAuthHeaders`) in React components and client-side code. Use server functions (`getBearerTokenServer`, `getAuthHeadersServer`) in API routes and server components.

2. **Token Source**: The bearer token comes from `session.accessToken` which is provided by NextAuth when users sign in via OAuth (Google/GitHub).

3. **Automatic Headers**: The `getAuthHeaders()` functions return an object with both `Content-Type: application/json` and `Authorization: Bearer ${token}` headers.

4. **Error Handling**: Always wrap token-dependent calls in try-catch blocks since token retrieval can fail.

5. **Token Persistence**: Tokens are stored in HTTP-only cookies by NextAuth for security, not in localStorage.

## Testing

You can test bearer token functionality using the debug tools at `/dashboard/test-auth` in your application.
