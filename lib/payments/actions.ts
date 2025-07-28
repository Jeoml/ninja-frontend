'use server';

import { redirect } from 'next/navigation';
import { withTeam } from '@/lib/auth/middleware';

// You can remove or replace these actions as needed
export const checkoutAction = withTeam(async (formData, team) => {
  // Stripe logic removed
  // Implement alternative logic or leave empty
});

export const customerPortalAction = withTeam(async (_, team) => {
  // Stripe logic removed
  // Implement alternative logic or leave empty
  // Example: redirect('/dashboard');
});
