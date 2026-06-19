import { auth } from '@clerk/nextjs/server';
import { sheetsService } from '@/lib/services/sheets';
import { ApiResponse } from '@/types';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; versionId: string }> }
): Promise<Response> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: resumeId, versionId } = await params;

    // Restore version
    const resume = await sheetsService.restoreResumeVersion(versionId);

    // Create a new version entry for the restoration
    await sheetsService.createResumeVersion({
      resumeId,
      userId,
      content: resume.content,
      versionNumber: 0, // Will be calculated by backend
      changeDescription: `Restored from previous version`,
    });

    const response: ApiResponse<typeof resume> = {
      success: true,
      data: resume,
    };

    return Response.json(response);
  } catch (error) {
    console.error('[Resume Restore] Error:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to restore version',
      },
      { status: 500 }
    );
  }
}
