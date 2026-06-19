import { auth } from '@clerk/nextjs/server';
import { sheetsService } from '@/lib/services/sheets';
import { ApiResponse } from '@/types';

interface AnalyzeResumeRequest {
  resumeId?: string;
  resumeContent?: string;
  uploadedFile?: {
    name: string;
    content: string;
  };
}

interface AnalysisResult {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  atsScore: number;
  atsIssues: string[];
  keywordMatches: string[];
  missingKeywords: string[];
}

async function analyzeResumeWithGemini(content: string): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `Analyze this resume and provide detailed feedback in JSON format:
${content}

Return a JSON object with:
{
  "overallScore": number (0-100),
  "strengths": string[] (key strengths found),
  "improvements": string[] (areas to improve),
  "atsScore": number (ATS compatibility 0-100),
  "atsIssues": string[] (ATS compatibility issues),
  "keywordMatches": string[] (relevant industry keywords present),
  "missingKeywords": string[] (recommended keywords to add)
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

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('[Analyzer] Gemini error:', error);
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

    const body: AnalyzeResumeRequest = await req.json();
    let resumeContent = '';

    if (body.resumeId) {
      // Analyze existing resume from database
      const resume = await sheetsService.getResume(body.resumeId);
      if (!resume) {
        return Response.json(
          { success: false, error: 'Resume not found' },
          { status: 404 }
        );
      }
      
      // Convert resume to text format for analysis
      resumeContent = formatResumeForAnalysis(resume.content);
    } else if (body.uploadedFile) {
      // Analyze uploaded file
      resumeContent = body.uploadedFile.content;
    } else if (body.resumeContent) {
      resumeContent = body.resumeContent;
    } else {
      return Response.json(
        { success: false, error: 'No resume content provided' },
        { status: 400 }
      );
    }

    // Analyze with Gemini
    const analysis = await analyzeResumeWithGemini(resumeContent);

    // Save analysis to database
    const savedAnalysis = await sheetsService.createResumeAnalysis({
      userId,
      resumeId: body.resumeId,
      uploadedFileName: body.uploadedFile?.name,
      ...analysis,
    });

    // Record AI usage
    await sheetsService.recordAIUsage({
      userId,
      feature: 'ats',
      tokensUsed: 1500, // Approximate token count
    });

    const response: ApiResponse<typeof savedAnalysis> = {
      success: true,
      data: savedAnalysis,
    };

    return Response.json(response);
  } catch (error) {
    console.error('[Resume Analyzer] Error:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
      },
      { status: 500 }
    );
  }
}

function formatResumeForAnalysis(content: any): string {
  const lines: string[] = [];

  if (content.personal) {
    lines.push(`${content.personal.fullName}\n${content.personal.email}\n${content.personal.phone}`);
  }

  if (content.professional) {
    lines.push(`\nProfessional Summary:\n${content.professional.headline}\n${content.professional.summary}`);
  }

  if (content.experience && Array.isArray(content.experience)) {
    lines.push('\nExperience:');
    content.experience.forEach((exp: any) => {
      lines.push(`${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})`);
      lines.push(exp.description);
      if (Array.isArray(exp.achievements)) {
        exp.achievements.forEach((ach: string) => lines.push(`- ${ach}`));
      }
    });
  }

  if (content.education && Array.isArray(content.education)) {
    lines.push('\nEducation:');
    content.education.forEach((edu: any) => {
      lines.push(`${edu.degree} in ${edu.field} from ${edu.school}`);
    });
  }

  if (content.skills && Array.isArray(content.skills)) {
    lines.push('\nSkills: ' + content.skills.map((s: any) => s.name).join(', '));
  }

  return lines.join('\n');
}
