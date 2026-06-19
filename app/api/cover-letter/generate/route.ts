import { auth } from '@clerk/nextjs/server';
import { sheetsService } from '@/lib/services/sheets';
import { ApiResponse } from '@/types';

interface GenerateCoverLetterRequest {
  resumeId?: string;
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
  userBackground?: string;
}

async function generateCoverLetterWithGemini(
  jobTitle: string,
  companyName: string,
  jobDescription: string,
  userBackground: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `Write a professional cover letter for the following position:

Job Title: ${jobTitle}
Company: ${companyName}

Job Description:
${jobDescription}

Applicant Background:
${userBackground}

Write a compelling, professional cover letter that:
1. Opens with enthusiasm about the company and role
2. Highlights relevant skills and experience from the background
3. Shows alignment with company values (based on job description)
4. Includes specific examples and achievements
5. Closes with a call to action

Format as a proper cover letter with greeting, body paragraphs, and closing.`;

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

    return content.trim();
  } catch (error) {
    console.error('[Cover Letter] Gemini error:', error);
    throw error;
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

    const body: GenerateCoverLetterRequest = await req.json();
    const { resumeId, jobTitle, companyName, jobDescription = '', userBackground = '' } = body;

    if (!jobTitle || !companyName) {
      return Response.json(
        { success: false, error: 'Job title and company name are required' },
        { status: 400 }
      );
    }

    let background = userBackground;

    // If no background provided, get from resume
    if (!background && resumeId) {
      const resume = await sheetsService.getResume(resumeId);
      if (resume) {
        background = formatResumeForCoverLetter(resume.content);
      }
    }

    if (!background) {
      background = 'A dedicated professional with diverse skills and experience.';
    }

    // Generate cover letter
    const coverLetterContent = await generateCoverLetterWithGemini(
      jobTitle,
      companyName,
      jobDescription,
      background
    );

    // Save cover letter
    const coverLetter = await sheetsService.createCoverLetter({
      userId,
      resumeId,
      jobTitle,
      companyName,
      content: coverLetterContent,
      isAIGenerated: true,
    });

    // Record AI usage
    await sheetsService.recordAIUsage({
      userId,
      feature: 'cover_letter',
      tokensUsed: 1500,
    });

    const response: ApiResponse<typeof coverLetter> = {
      success: true,
      data: coverLetter,
    };

    return Response.json(response);
  } catch (error) {
    console.error('[Cover Letter] Error:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed',
      },
      { status: 500 }
    );
  }
}

function formatResumeForCoverLetter(content: any): string {
  const parts: string[] = [];

  if (content.personal?.fullName) {
    parts.push(`Name: ${content.personal.fullName}`);
  }

  if (content.professional?.summary) {
    parts.push(`Summary: ${content.professional.summary}`);
  }

  if (Array.isArray(content.experience)) {
    const expSummary = content.experience
      .slice(0, 3)
      .map(
        (exp: any) =>
          `${exp.position} at ${exp.company}: ${exp.description || ''}`
      )
      .join('; ');
    if (expSummary) {
      parts.push(`Experience: ${expSummary}`);
    }
  }

  if (Array.isArray(content.skills)) {
    const skillNames = content.skills.map((s: any) => s.name).join(', ');
    if (skillNames) {
      parts.push(`Skills: ${skillNames}`);
    }
  }

  return parts.join('\n');
}
