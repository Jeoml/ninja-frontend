'use client';

import Link from 'next/link';
import Image from 'next/image';
import { use, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { CircleIcon, Home, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/db/schema';
import useSWR, { mutate } from 'swr';
import { GithubSignInButton, GoogleSignInButton, AuthButtons } from '@/components/ui/authButtons';
import { useSession } from 'next-auth/react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Debug component to check session data
function DebugSession() {
  const { data: session, status } = useSession();
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const [headers, setHeaders] = useState<any>(null);
  
  console.log('Session status:', status);
  console.log('Session data:', session);
  console.log('Access token:', (session as any)?.accessToken);

  const testTokenRetrieval = async () => {
    try {
      const { getBearerToken, getAuthHeaders } = await import('@/lib/auth/token-storage');
      const token = await getBearerToken();
      setBearerToken(token);
      
      const authHeaders = await getAuthHeaders();
      setHeaders(authHeaders);
    } catch (error) {
      console.error('Token test failed:', error);
      setBearerToken('ERROR: ' + error);
    }
  };
  
  return (
    <div className="p-4 bg-gray-100 m-4 rounded">
      <h3 className="font-bold mb-2">Debug Session Info</h3>
      <div className="text-xs">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>User ID:</strong> {session?.user?.id || 'None'}</p>
        <p><strong>Email:</strong> {session?.user?.email || 'None'}</p>
        <p><strong>Access Token:</strong> {(session as any)?.accessToken ? 'Present' : 'Missing'}</p>
        
        <div className="mt-3">
          <button 
            onClick={testTokenRetrieval}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
          >
            Test Bearer Token
          </button>
          
          {bearerToken !== null && (
            <div className="mt-2 p-2 bg-yellow-100 rounded">
              <p><strong>Bearer Token:</strong> {bearerToken || 'null'}</p>
            </div>
          )}
          
          {headers && (
            <div className="mt-2 p-2 bg-green-100 rounded">
              <p><strong>Auth Headers:</strong></p>
              <pre className="text-xs">{JSON.stringify(headers, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
      <details className="mt-2">
        <summary className="cursor-pointer text-blue-500">Show Full Session</summary>
        <pre className="bg-white p-2 rounded mt-2 text-xs overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push('/');
  }

  if (!user) {
    return (
      <>
        <GoogleSignInButton />
        <GithubSignInButton />
      </>
    );
  }

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage alt={user.name || ''} />
          <AvatarFallback>
            {user.email
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem className="w-full flex-1 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/huncy_bgremoved.png"
            alt="Huncy Logo"
            className="h-10 w-10"
            height={24}
            width={24}
            priority
          />
          <span className="ml-2 text-xl font-semibold text-gray-900">Huncy</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Suspense fallback={<div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />}>
            <AuthButtons />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {/* <DebugSession /> */}
      {children}
    </section>
  );
}
