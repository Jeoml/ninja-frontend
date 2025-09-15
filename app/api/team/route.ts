import { getTeamForUser } from '@/lib/db/queries';

export async function GET() {
  try {
    const team = await getTeamForUser();
    return Response.json(team);
  } catch (error) {
    console.error('Team API error:', error);
    return Response.json(
      { error: 'Database not available' },
      { status: 503 }
    );
  }
}
