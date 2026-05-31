import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, AppTheme, ThemeMode } from '@/theme';

/**
 * Shape expected from the UI store. Defined here so the hook compiles before
 * the store module is created; the real store must satisfy this interface.
 */
interface UIStoreState {
  themeMode: ThemeMode;
}

type UIStoreSelector<T> = (state: UIStoreState) => T;
type UIStoreHook = <T>(selector: UIStoreSelector<T>) => T;

// Lazily resolved so the module can be imported before the store exists.
let _useUIStore: UIStoreHook | undefined;

function getUIStore(): UIStoreHook | undefined {
  if (_useUIStore !== undefined) return _useUIStore;
  try {
    // Dynamic require keeps this hook compilable before @/stores/ui.store exists.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('@/stores/ui.store') as { useUIStore: UIStoreHook };
    _useUIStore = mod.useUIStore;
    return _useUIStore;
  } catch {
    return undefined;
  }
}

export function useTheme(): AppTheme {
  const systemScheme = useColorScheme();
  const useUIStore = getUIStore();

  // When the store is unavailable (e.g. during initial bootstrap) fall back to
  // the system colour scheme, defaulting to dark.
  if (useUIStore === undefined) {
    return systemScheme === 'light' ? lightTheme : darkTheme;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const themeMode = useUIStore((s: UIStoreState) => s.themeMode);

  if (themeMode === 'dark') return darkTheme;
  if (themeMode === 'light') return lightTheme;
  return systemScheme === 'light' ? lightTheme : darkTheme;
}
