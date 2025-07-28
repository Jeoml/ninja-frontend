import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users, teams, teamMembers } from '@/lib/db/schema';
import { setSession } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Since Stripe is removed, just redirect or handle accordingly
  return NextResponse.redirect(new URL('/pricing', request.url));
}
