import { auth } from '@clerk/nextjs/server';
import { sheetsService } from '@/lib/services/sheets';
import { ApiResponse } from '@/types';

export async function GET(req: Request): Promise<Response> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const letters = await sheetsService.getCoverLetters(userId);

    const response: ApiResponse<typeof letters> = {
      success: true,
      data: letters,
    };

    return Response.json(response);
  } catch (error) {
    console.error('[Cover Letters] Error:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch cover letters',
      },
      { status: 500 }
    );
  }
}
