import { auth } from '@clerk/nextjs/server';
import { sheetsService } from '@/lib/services/sheets';
import { ApiResponse } from '@/types';

interface MatchJobRequest {
  resumeId: string;
  jobTitle: string;
  jobDescription: string;
}

interface MatchResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

async function matchJobDescriptionWithGemini(
  resumeContent: string,
  jobTitle: string,
  jobDescription: string
): Promise<MatchResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `Compare this resume with a job description and provide match analysis:

Resume Content:
${resumeContent}

Job Title: ${jobTitle}

Job Description:
${jobDescription}

Return a JSON object with:
{
  "matchScore": number (0-100),
  "matchedSkills": string[] (skills present in both resume and job description),
  "missingSkills": string[] (skills required for job but missing from resume),
  "recommendations": string[] (specific improvements to improve match)
}`;

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No response from Gemini API');
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('[Matcher] Gemini error:', error);
    throw error;
  }
}

function formatResumeForMatching(content: any): string {
  const lines: string[] = [];

  if (content.personal) {
    lines.push(`${content.personal.fullName}\n${content.personal.email}`);
  }

  if (content.professional) {
    lines.push(`\n${content.professional.summary}`);
  }

  if (content.experience && Array.isArray(content.experience)) {
    content.experience.forEach((exp: any) => {
      lines.push(`${exp.position} at ${exp.company}: ${exp.description}`);
    });
  }

  if (content.skills && Array.isArray(content.skills)) {
    lines.push('Skills: ' + content.skills.map((s: any) => s.name).join(', '));
  }

  if (content.certifications && Array.isArray(content.certifications)) {
    lines.push('Certifications: ' + content.certifications.map((c: any) => c.title).join(', '));
  }

  return lines.join('\n');
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

    const body: MatchJobRequest = await req.json();
    const { resumeId, jobTitle, jobDescription } = body;

    if (!resumeId || !jobTitle || !jobDescription) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get resume from database
    const resume = await sheetsService.getResume(resumeId);
    if (!resume) {
      return Response.json(
        { success: false, error: 'Resume not found' },
        { status: 404 }
      );
    }

    const resumeContent = formatResumeForMatching(resume.content);

    // Match with Gemini
    const matchResult = await matchJobDescriptionWithGemini(
      resumeContent,
      jobTitle,
      jobDescription
    );

    // Save match to database
    const savedMatch = await sheetsService.createJobMatch({
      userId,
      resumeId,
      jobTitle,
      jobDescription,
      ...matchResult,
    });

    // Record AI usage
    await sheetsService.recordAIUsage({
      userId,
      feature: 'ats',
      tokensUsed: 1200,
    });

    const response: ApiResponse<typeof savedMatch> = {
      success: true,
      data: savedMatch,
    };

    return Response.json(response);
  } catch (error) {
    console.error('[Job Matcher] Error:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Matching failed',
      },
      { status: 500 }
    );
  }
}
