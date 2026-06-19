import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { sheetsService } from '@/lib/services/sheets';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response('Webhook Secret Error', { status: 400 });
  }

  const headersList = await headers();
  const svix_id = headersList.get('svix-id');
  const svix_timestamp = headersList.get('svix-timestamp');
  const svix_signature = headersList.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any;
  } catch (err) {
    console.error('[Webhook] Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  const eventType = evt.type;

  try {
    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      await sheetsService.createUser({
        clerkId: id,
        email: email_addresses[0]?.email_address || '',
        name: `${first_name || ''} ${last_name || ''}`.trim(),
        profileImage: image_url || '',
        subscription: 'free',
      });

      console.log('[Webhook] User created:', id);
    } else if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      await sheetsService.updateUser(id, {
        email: email_addresses[0]?.email_address || '',
        name: `${first_name || ''} ${last_name || ''}`.trim(),
        profileImage: image_url || '',
      });

      console.log('[Webhook] User updated:', id);
    } else if (eventType === 'user.deleted') {
      const { id } = evt.data;
      await sheetsService.deleteUser(id);
      console.log('[Webhook] User deleted:', id);
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('[Webhook] Error processing event:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}
