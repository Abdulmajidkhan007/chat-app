import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from '@/navigation/RootNavigator';
import { initAuthStore, useAuthStore } from '@/stores/auth.store';
import { initUIStore, useUIStore } from '@/stores/ui.store';
import { darkTheme, lightTheme } from '@/theme';
import { AuthService } from '@/services/auth.service';

function AppContent(): React.JSX.Element {
  const themeMode = useUIStore((s) => s.themeMode);
  const systemScheme = useColorScheme();
  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && systemScheme !== 'light');
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.unreadBadge,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '800' },
        },
      }}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App(): React.JSX.Element {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let unsubscribeFirebase: (() => void) | null = null;

    async function bootstrap() {
      // 1. Load cached user + theme (instant)
      await Promise.all([initAuthStore(), initUIStore()]);

      // 2. Wire up Firebase auth state listener
      //    This keeps the store in sync when the token refreshes or user signs out
      //    from another device
      unsubscribeFirebase = AuthService.onAuthStateChanged(
        async (firebaseUser) => {
          const existing = useAuthStore.getState().currentUser;
          if (!existing || existing.id !== firebaseUser.uid) {
            // Fetch fresh profile from Firestore
            const profile = await AuthService.getProfile(firebaseUser.uid);
            if (profile) {
              useAuthStore.getState().setCurrentUser(profile);
            }
          }
        },
        () => {
          // Firebase says signed out — clear store
          useAuthStore.getState().logout();
        }
      );

      setIsReady(true);
    }

    bootstrap();

    return () => {
      unsubscribeFirebase?.();
    };
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F1923', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#3D9AE8" size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
