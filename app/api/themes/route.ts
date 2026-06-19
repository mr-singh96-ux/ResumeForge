import { auth } from '@clerk/nextjs/server';
import { sheetsService } from '@/lib/services/sheets';
import { ApiResponse } from '@/types';

const PRESET_THEMES = [
  {
    id: 'professional-blue',
    name: 'Professional Blue',
    colors: {
      primary: '#1e40af',
      secondary: '#93c5fd',
      accent: '#3b82f6',
      text: '#1f2937',
      background: '#f9fafb',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    colors: {
      primary: '#1e293b',
      secondary: '#64748b',
      accent: '#22d3ee',
      text: '#f1f5f9',
      background: '#0f172a',
    },
    fonts: {
      heading: 'Poppins',
      body: 'Poppins',
    },
  },
  {
    id: 'tech-minimal',
    name: 'Tech Minimal',
    colors: {
      primary: '#111827',
      secondary: '#e5e7eb',
      accent: '#6366f1',
      text: '#374151',
      background: '#ffffff',
    },
    fonts: {
      heading: 'Courier New',
      body: 'Courier New',
    },
  },
  {
    id: 'creative-gradient',
    name: 'Creative Gradient',
    colors: {
      primary: '#ec4899',
      secondary: '#f97316',
      accent: '#f43f5e',
      text: '#1e1e1e',
      background: '#fef2f2',
    },
    fonts: {
      heading: 'Georgia',
      body: 'Georgia',
    },
  },
  {
    id: 'corporate-green',
    name: 'Corporate Green',
    colors: {
      primary: '#047857',
      secondary: '#a7f3d0',
      accent: '#10b981',
      text: '#111827',
      background: '#f0fdf4',
    },
    fonts: {
      heading: 'Arial',
      body: 'Arial',
    },
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    colors: {
      primary: '#6d28d9',
      secondary: '#c4b5fd',
      accent: '#a78bfa',
      text: '#2e1065',
      background: '#faf5ff',
    },
    fonts: {
      heading: 'Garamond',
      body: 'Garamond',
    },
  },
];

export async function GET(req: Request): Promise<Response> {
  try {
    const response: ApiResponse<typeof PRESET_THEMES> = {
      success: true,
      data: PRESET_THEMES,
    };

    return Response.json(response);
  } catch (error) {
    console.error('[Themes] Error:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch themes',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { resumeId, themeId } = body;

    if (!resumeId || !themeId) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const theme = PRESET_THEMES.find((t) => t.id === themeId);
    if (!theme) {
      return Response.json(
        { success: false, error: 'Theme not found' },
        { status: 404 }
      );
    }

    const appliedTheme = await sheetsService.applyTheme(resumeId, themeId);

    const response: ApiResponse<typeof appliedTheme> = {
      success: true,
      data: appliedTheme,
    };

    return Response.json(response);
  } catch (error) {
    console.error('[Themes] Error:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to apply theme',
      },
      { status: 500 }
    );
  }
}
