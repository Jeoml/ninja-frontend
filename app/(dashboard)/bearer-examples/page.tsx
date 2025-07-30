'use client';

import { useState, useEffect } from 'react';
import { useAuthenticatedSWR, useAuthenticatedAPI, AuthenticatedAPIClient } from '@/lib/auth/api-utils';
import { getAuthHeaders } from '@/lib/auth/token-storage';

export default function BearerTokenExample() {
  const [manualData, setManualData] = useState<any>(null);
  const [apiClientData, setApiClientData] = useState<any>(null);

  // Method 1: Using the custom SWR hook
  const { data: swrData, error: swrError } = useAuthenticatedSWR('/api/user');

  // Method 2: Using the custom API hook
  const { get, post } = useAuthenticatedAPI();

  // Method 3: Using API client class
  const apiClient = new AuthenticatedAPIClient();

  // Method 4: Manual fetch with auth headers
  useEffect(() => {
    async function fetchManually() {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch('/api/user', { headers });
        const data = await response.json();
        setManualData(data);
      } catch (error) {
        console.error('Manual fetch failed:', error);
      }
    }

    fetchManually();
  }, []);

  // Example API client usage
  const handleAPIClientTest = async () => {
    try {
      const data = await apiClient.get('/user');
      setApiClientData(data);
    } catch (error) {
      console.error('API client failed:', error);
    }
  };

  // Example custom hook usage
  const handleCustomHookTest = async () => {
    try {
      const data = await get('/api/user');
      console.log('Custom hook data:', data);
    } catch (error) {
      console.error('Custom hook failed:', error);
    }
  };

  // Example POST request
  const handlePostExample = async () => {
    try {
      const result = await post('/api/user', { 
        message: 'Hello from authenticated request!' 
      });
      console.log('POST result:', result);
    } catch (error) {
      console.error('POST failed:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Bearer Token Usage Examples</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Method 1: SWR Hook */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-3">Method 1: useAuthenticatedSWR</h2>
          {swrError ? (
            <p className="text-red-600">Error: {swrError.message}</p>
          ) : swrData ? (
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(swrData, null, 2)}
            </pre>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Method 2: Manual Fetch */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-3">Method 2: Manual getAuthHeaders()</h2>
          {manualData ? (
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(manualData, null, 2)}
            </pre>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Method 3: Custom Hook */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-3">Method 3: useAuthenticatedAPI</h2>
          <button 
            onClick={handleCustomHookTest}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
          >
            Test Custom Hook
          </button>
          <button 
            onClick={handlePostExample}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
          >
            Test POST
          </button>
          <p className="text-sm text-gray-600">Check console for results</p>
        </div>

        {/* Method 4: API Client */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-3">Method 4: AuthenticatedAPIClient</h2>
          <button 
            onClick={handleAPIClientTest}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mb-3"
          >
            Test API Client
          </button>
          {apiClientData ? (
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(apiClientData, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-gray-600">Click button to test</p>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Code Examples</h3>
        <div className="text-sm space-y-2">
          <div>
            <strong>Method 1:</strong> <code>const &#123;data&#125; = useAuthenticatedSWR('/api/endpoint');</code>
          </div>
          <div>
            <strong>Method 2:</strong> <code>const headers = await getAuthHeaders(); fetch(url, &#123;headers&#125;);</code>
          </div>
          <div>
            <strong>Method 3:</strong> <code>const &#123;get, post&#125; = useAuthenticatedAPI(); await get('/api/endpoint');</code>
          </div>
          <div>
            <strong>Method 4:</strong> <code>const client = new AuthenticatedAPIClient(); await client.get('/endpoint');</code>
          </div>
        </div>
      </div>
    </div>
  );
}
