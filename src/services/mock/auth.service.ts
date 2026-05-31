import type { AuthUser } from '@/stores/auth.store';

const SIMULATE_DELAY = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const AuthService = {
  async requestOTP(phone: string): Promise<{ success: boolean; message: string }> {
    await SIMULATE_DELAY(1500);
    if (phone.length < 7) {
      return { success: false, message: 'Invalid phone number' };
    }
    return { success: true, message: `Code sent to ${phone}` };
  },

  async verifyOTP(
    phone: string,
    code: string
  ): Promise<{ success: boolean; isNewUser: boolean; message: string }> {
    await SIMULATE_DELAY(1000);
    if (code === '12345') {
      return { success: true, isNewUser: true, message: 'Verified' };
    }
    return { success: false, isNewUser: false, message: 'Incorrect code' };
  },

  async createProfile(data: {
    phone: string;
    firstName: string;
    lastName?: string;
    username?: string;
    bio?: string;
    avatarUri?: string;
  }): Promise<AuthUser> {
    await SIMULATE_DELAY(800);
    return {
      id: 'me',
      phone: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      bio: data.bio,
      avatarUrl: data.avatarUri ?? `https://i.pravatar.cc/150?img=33`,
      isVerified: false,
    };
  },

  async logout(): Promise<void> {
    await SIMULATE_DELAY(300);
  },
};
