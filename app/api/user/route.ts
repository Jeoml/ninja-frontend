import { getUser } from '@/lib/db/queries';

export async function GET() {
  try {
    const user = await getUser();
    return Response.json(user);
  } catch (error) {
    console.error('User API error:', error);
    return Response.json(
      { error: 'Database not available' },
      { status: 503 }
    );
  }
}
