'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { getBearerToken, getAuthHeaders } from '@/lib/auth/token-storage';

export default function DebugSession() {
  const { data: session, status } = useSession();
  const [debugOpen, setDebugOpen] = useState(false);
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const [headers, setHeaders] = useState<any>(null);

  const testTokenRetrieval = async () => {
    try {
      const token = await getBearerToken();
      setBearerToken(token);
      
      const authHeaders = await getAuthHeaders();
      setHeaders(authHeaders);
    } catch (error) {
      console.error('Token test failed:', error);
      setBearerToken('ERROR: ' + error);
    }
  };

  if (status === 'loading') return null;

  return (
    <div className="bg-blue-50 p-4 border-b">
      <button 
        onClick={() => setDebugOpen(!debugOpen)}
        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
      >
        {debugOpen ? 'Hide' : 'Show'} Auth Debug
      </button>
      
      {debugOpen && (
        <div className="mt-4 bg-white p-4 rounded border text-sm">
          <h3 className="font-semibold mb-2">Authentication Debug Info</h3>
          
          <div className="mb-4">
            <h4 className="font-medium">Session Status: {status}</h4>
            {session ? (
              <div className="bg-green-50 p-2 mt-2 rounded">
                <p><strong>Email:</strong> {session.user?.email}</p>
                <p><strong>Name:</strong> {session.user?.name}</p>
                <p><strong>Access Token:</strong> {(session as any).accessToken ? 'Present' : 'Not available'}</p>
                <details className="mt-2">
                  <summary className="cursor-pointer">Raw Session Data</summary>
                  <pre className="text-xs bg-gray-100 p-2 mt-1 overflow-auto">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <p className="text-red-600">No session found</p>
            )}
          </div>

          <div className="mb-4">
            <button 
              onClick={testTokenRetrieval}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              Test Bearer Token Retrieval
            </button>
            
            {bearerToken !== null && (
              <div className="mt-2 bg-yellow-50 p-2 rounded">
                <p><strong>Bearer Token:</strong> {bearerToken || 'null'}</p>
              </div>
            )}
            
            {headers && (
              <div className="mt-2 bg-purple-50 p-2 rounded">
                <p><strong>Auth Headers:</strong></p>
                <pre className="text-xs bg-gray-100 p-1 mt-1">
                  {JSON.stringify(headers, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-600">
            <p><strong>Note:</strong> In NextAuth, OAuth tokens are typically stored in HTTP-only cookies for security.</p>
            <p>Bearer tokens for API calls should come from the session's accessToken property.</p>
          </div>
        </div>
      )}
    </div>
  );
}
