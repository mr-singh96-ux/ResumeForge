import { sheetsService } from '@/lib/services/sheets';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const message = await sheetsService.createContactMessage({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    });

    return new Response(
      JSON.stringify({ success: true, data: message }),
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] Error creating contact message:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
