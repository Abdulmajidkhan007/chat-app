import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthUser {
  id: string;
  phone: string;
  username?: string;
  firstName: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
  isVerified: boolean;
}

interface AuthState {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setCurrentUser: (user: AuthUser) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const AUTH_USER_KEY = '@pulse/current_user';

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setCurrentUser: async (user) => {
    set({ currentUser: user, isAuthenticated: true, error: null });
    await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  logout: async () => {
    set({ currentUser: null, isAuthenticated: false });
    await AsyncStorage.removeItem(AUTH_USER_KEY);
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

/**
 * Bootstrap auth state:
 * 1. Check AsyncStorage cache (instant, for fast startup)
 * 2. Firebase onAuthStateChanged will re-validate asynchronously
 */
export async function initAuthStore(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(AUTH_USER_KEY);
    if (stored) {
      const user = JSON.parse(stored) as AuthUser;
      useAuthStore.setState({ currentUser: user, isAuthenticated: true });
    }
  } finally {
    useAuthStore.setState({ isLoading: false });
  }
}
