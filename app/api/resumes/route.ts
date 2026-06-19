import { auth } from '@clerk/nextjs/server';
import { sheetsService } from '@/lib/services/sheets';
import { generateUUID } from '@/lib/utils/helpers';
import type { Resume } from '@/types';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const resumes = await sheetsService.getUserResumes(userId);
    return new Response(JSON.stringify({ success: true, data: resumes }), { status: 200 });
  } catch (error) {
    console.error('[API] Error fetching resumes:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await req.json();
    const { title, templateId, content } = body;

    if (!title || !templateId) {
      return new Response(
        JSON.stringify({ error: 'Title and templateId are required' }),
        { status: 400 }
      );
    }

    const resume: Resume = {
      id: generateUUID(),
      userId,
      title,
      templateId,
      content: content || {
        personal: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
        },
        professional: {
          headline: '',
          summary: '',
        },
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        projects: [],
        languages: [],
        volunteering: [],
        references: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
    };

    const created = await sheetsService.createResume(resume);
    return new Response(JSON.stringify({ success: true, data: created }), { status: 201 });
  } catch (error) {
    console.error('[API] Error creating resume:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
