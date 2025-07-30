import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';
import { NextAuthProvider } from './providers';
import { GithubSignInButton, GoogleSignInButton } from '@/components/ui/authButtons';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Huncy',
  description: 'Get started with Huncy the AI assistant for your Business.'
};

export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">
        {/* <SWRConfig
          value={{
            fallback: {
              // We do NOT await here
              // Only components that read this data will suspend
              '/api/user': getUser(),
              '/api/team': getTeamForUser()
            }
          }}
        >
          {children}
        </SWRConfig> */}
        {/* <GoogleSignInButton />
        <GithubSignInButton /> */}
        <NextAuthProvider>
          {/* <TwitterNavbar /> */}
          {children}
        </NextAuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
