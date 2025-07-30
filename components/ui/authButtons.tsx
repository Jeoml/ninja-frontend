"use client";

import Image from "next/image";
import googleLogo from "@/public/google.png";
import githubLogo from "@/public/github.png";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';

export function GoogleSignInButton() {
  const handleClick = () => {
    signIn("google");
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center w-12 h-12 transition-colors duration-300 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
    >
      <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
    </button>
  );
}

export function GithubSignInButton() {
  const handleClick = () => {
    signIn("github");
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center w-12 h-12 transition-colors duration-300 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
    >
      <Image src={githubLogo} alt="Github Logo" width={20} height={20} />
    </button>
  );
}

// New unified authentication component
export function AuthButtons() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
    );
  }

  // Show profile photo with logout dropdown if authenticated
  if (session?.user) {
    const user = session.user;
    const displayName = user.name || user.email || 'User';
    const initials = displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button className="relative w-9 h-9 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all hover:ring-2 hover:ring-gray-300">
            <Avatar className="w-full h-full">
              <AvatarImage 
                src={user.image || undefined} 
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-3 py-2 border-b">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Show login buttons if not authenticated
  return (
    <div className="flex space-x-2">
      <GoogleSignInButton />
      <GithubSignInButton />
    </div>
  );
}
