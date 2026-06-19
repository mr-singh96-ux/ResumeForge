import { auth } from '@clerk/nextjs/server';
import { sheetsService } from '@/lib/services/sheets';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const resume = await sheetsService.getResume(params.id);
    if (!resume) {
      return new Response(JSON.stringify({ error: 'Resume not found' }), { status: 404 });
    }

    if (resume.userId !== userId) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    return new Response(JSON.stringify({ success: true, data: resume }), { status: 200 });
  } catch (error) {
    console.error('[API] Error fetching resume:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const resume = await sheetsService.getResume(params.id);
    if (!resume) {
      return new Response(JSON.stringify({ error: 'Resume not found' }), { status: 404 });
    }

    if (resume.userId !== userId) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const body = await req.json();
    const updated = await sheetsService.updateResume(params.id, {
      ...body,
      updatedAt: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true, data: updated }), { status: 200 });
  } catch (error) {
    console.error('[API] Error updating resume:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const resume = await sheetsService.getResume(params.id);
    if (!resume) {
      return new Response(JSON.stringify({ error: 'Resume not found' }), { status: 404 });
    }

    if (resume.userId !== userId) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    await sheetsService.deleteResume(params.id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('[API] Error deleting resume:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
