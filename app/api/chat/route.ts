import { auth } from '@clerk/nextjs/server';
import { sheetsService } from '@/lib/services/sheets';
import { ApiResponse } from '@/types';

interface ChatRequest {
  message: string;
  feature: 'resume_help' | 'job_search' | 'interview' | 'general';
  conversationHistory?: Array<{ role: string; content: string }>;
}

async function generateChatResponse(
  message: string,
  feature: string,
  history: Array<{ role: string; content: string }>
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  let systemPrompt = '';
  switch (feature) {
    case 'resume_help':
      systemPrompt = 'You are an expert resume writer and career coach. Help users improve their resumes with professional advice.';
      break;
    case 'job_search':
      systemPrompt = 'You are a job search strategist helping Indian professionals find and apply for jobs. Provide practical tips and guidance.';
      break;
    case 'interview':
      systemPrompt = 'You are an interview coach helping professionals prepare for interviews. Provide tips, common questions, and mock interview guidance.';
      break;
    default:
      systemPrompt = 'You are a helpful career assistant for job seekers. Provide practical, actionable advice.';
  }

  const conversationText = history
    .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  const prompt = `${systemPrompt}

Previous conversation:
${conversationText}

User: ${message}
Assistant:`;

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
    console.error('[Chat] Gemini error:', error);
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

    const body: ChatRequest = await req.json();
    const { message, feature, conversationHistory = [] } = body;

    if (!message || !feature) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate response
    const response = await generateChatResponse(
      message,
      feature,
      conversationHistory
    );

    // Save user message
    await sheetsService.createChatMessage({
      userId,
      role: 'user',
      content: message,
      feature,
    });

    // Save assistant response
    const savedResponse = await sheetsService.createChatMessage({
      userId,
      role: 'assistant',
      content: response,
      feature,
    });

    // Record AI usage
    await sheetsService.recordAIUsage({
      userId,
      feature: 'ats',
      tokensUsed: 500,
    });

    const apiResponse: ApiResponse<{ response: string }> = {
      success: true,
      data: { response },
    };

    return Response.json(apiResponse);
  } catch (error) {
    console.error('[Chat] Error:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Chat failed',
      },
      { status: 500 }
    );
  }
}
