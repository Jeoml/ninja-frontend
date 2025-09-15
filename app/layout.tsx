import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { NextAuthProvider } from './providers';
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
        <NextAuthProvider>
          {/* <TwitterNavbar /> */}
          {children}
        </NextAuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
