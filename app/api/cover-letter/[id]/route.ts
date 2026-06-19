import { auth } from '@clerk/nextjs/server';
import { sheetsService } from '@/lib/services/sheets';
import { ApiResponse } from '@/types';

export async function DELETE(
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

    const { id } = await params;

    const success = await sheetsService.deleteCoverLetter(id);

    const response: ApiResponse<boolean> = {
      success: true,
      data: success,
    };

    return Response.json(response);
  } catch (error) {
    console.error('[Cover Letter Delete] Error:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete cover letter',
      },
      { status: 500 }
    );
  }
}
