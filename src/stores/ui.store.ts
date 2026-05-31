import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeMode } from '@/theme';

interface UIState {
  themeMode: ThemeMode;
  isKeyboardVisible: boolean;
  activeBottomSheet: string | null;
  setThemeMode: (mode: ThemeMode) => void;
  setKeyboardVisible: (visible: boolean) => void;
  openBottomSheet: (id: string) => void;
  closeBottomSheet: () => void;
}

const THEME_STORAGE_KEY = '@pulse/theme_mode';

export const useUIStore = create<UIState>((set) => ({
  themeMode: 'dark',
  isKeyboardVisible: false,
  activeBottomSheet: null,

  setThemeMode: async (mode) => {
    set({ themeMode: mode });
    await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  },

  setKeyboardVisible: (visible) => set({ isKeyboardVisible: visible }),
  openBottomSheet: (id) => set({ activeBottomSheet: id }),
  closeBottomSheet: () => set({ activeBottomSheet: null }),
}));

export async function initUIStore(): Promise<void> {
  const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'dark' || stored === 'light' || stored === 'system') {
    useUIStore.setState({ themeMode: stored });
  }
}
