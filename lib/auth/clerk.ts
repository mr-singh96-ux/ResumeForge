import { clerkClient } from '@clerk/nextjs/server';
import { auth } from '@clerk/nextjs/server';

export async function getCurrentUser() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const user = await clerkClient.users.getUser(userId);
    return {
      id: userId,
      email: user.emailAddresses[0]?.emailAddress || '',
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      profileImage: user.profileImageUrl,
      clerkId: userId,
    };
  } catch (error) {
    console.error('[Auth] Error getting current user:', error);
    return null;
  }
}

export async function createUserMetadata(
  userId: string,
  metadata: Record<string, any>
) {
  try {
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: metadata,
    });
  } catch (error) {
    console.error('[Auth] Error updating user metadata:', error);
  }
}

export async function getUserMetadata(userId: string) {
  try {
    const user = await clerkClient.users.getUser(userId);
    return user.privateMetadata;
  } catch (error) {
    console.error('[Auth] Error getting user metadata:', error);
    return null;
  }
}
