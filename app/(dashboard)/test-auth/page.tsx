'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { getBearerToken, getAuthHeaders } from '@/lib/auth/token-storage';
import { AuthButtons } from '@/components/ui/authButtons';

export default function TestAuthPage() {
  const { data: session, status } = useSession();
  const [testResults, setTestResults] = useState<any>({});

  const runAuthTests = async () => {
    const results: any = {};
    
    // Test 1: Session data
    results.sessionStatus = status;
    results.sessionExists = !!session;
    results.hasAccessToken = !!(session as any)?.accessToken;
    results.userEmail = session?.user?.email;
    
    // Test 2: Bearer token retrieval
    try {
      results.bearerToken = await getBearerToken();
    } catch (error) {
      results.bearerTokenError = String(error);
    }
    
    // Test 3: Auth headers
    try {
      results.authHeaders = await getAuthHeaders();
    } catch (error) {
      results.authHeadersError = String(error);
    }
    
    // Test 4: API call with auth
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/user', { headers });
      results.apiCallStatus = response.status;
      results.apiCallSuccess = response.ok;
      if (response.ok) {
        results.apiUserData = await response.json();
      }
    } catch (error) {
      results.apiCallError = String(error);
    }
    
    setTestResults(results);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Testing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Session Info */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-3">Session Status</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Authenticated:</strong> {session ? 'Yes' : 'No'}</p>
            {session && (
              <>
                <p><strong>Email:</strong> {session.user?.email}</p>
                <p><strong>Name:</strong> {session.user?.name}</p>
                <p><strong>Access Token:</strong> {(session as any)?.accessToken ? 'Present' : 'Not available'}</p>
              </>
            )}
          </div>
        </div>

        {/* Auth Actions */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-3">Authentication Actions</h2>
          <div className="flex justify-center">
            <AuthButtons />
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white p-4 rounded-lg border md:col-span-2">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Token & API Tests</h2>
            <button 
              onClick={runAuthTests}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Run Tests
            </button>
          </div>
          
          {Object.keys(testResults).length > 0 && (
            <div className="bg-gray-50 p-4 rounded">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Raw Session Data */}
        {session && (
          <div className="bg-white p-4 rounded-lg border md:col-span-2">
            <h2 className="text-lg font-semibold mb-3">Raw Session Data</h2>
            <details>
              <summary className="cursor-pointer text-blue-500">Show Session Object</summary>
              <pre className="bg-gray-50 p-4 rounded mt-2 text-xs overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">About Bearer Tokens in NextAuth</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>• NextAuth stores session data in HTTP-only cookies for security</p>
          <p>• OAuth access tokens are available in the session object as <code>session.accessToken</code></p>
          <p>• Bearer tokens are NOT stored in localStorage by default</p>
          <p>• Your custom token-storage functions should extract tokens from the session</p>
        </div>
      </div>
    </div>
  );
}
