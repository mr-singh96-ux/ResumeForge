import { auth } from '@clerk/nextjs/server';
import { sheetsService } from '@/lib/services/sheets';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const user = await sheetsService.getUserById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, data: user }), { status: 200 });
  } catch (error) {
    console.error('[API] Error fetching user:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const updates = await req.json();
    const user = await sheetsService.updateUser(userId, updates);

    return new Response(JSON.stringify({ success: true, data: user }), { status: 200 });
  } catch (error) {
    console.error('[API] Error updating user:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
