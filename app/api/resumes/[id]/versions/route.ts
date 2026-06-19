import { auth } from '@clerk/nextjs/server';
import { sheetsService } from '@/lib/services/sheets';
import { ApiResponse } from '@/types';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: resumeId } = await params;

    const versions = await sheetsService.getResumeVersions(resumeId);

    const response: ApiResponse<typeof versions> = {
      success: true,
      data: versions,
    };

    return Response.json(response);
  } catch (error) {
    console.error('[Resume Versions] Error:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch versions',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: resumeId } = await params;
    const body = await req.json();
    const { content, changeDescription } = body;

    if (!content) {
      return Response.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    // Get existing versions to determine version number
    const versions = await sheetsService.getResumeVersions(resumeId);
    const versionNumber = versions.length + 1;

    const version = await sheetsService.createResumeVersion({
      resumeId,
      userId,
      content,
      versionNumber,
      changeDescription,
    });

    const response: ApiResponse<typeof version> = {
      success: true,
      data: version,
    };

    return Response.json(response);
  } catch (error) {
    console.error('[Resume Versions] Error:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create version',
      },
      { status: 500 }
    );
  }
}
