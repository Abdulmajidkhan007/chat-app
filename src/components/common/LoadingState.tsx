import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

// ---------------------------------------------------------------------------
// Prop interface
// ---------------------------------------------------------------------------
export interface LoadingStateProps {
  message?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LoadingState({ message }: LoadingStateProps) {
  const theme = useTheme();

  return (
    <View
      style={styles.container}
      accessibilityRole="none"
      accessibilityLabel={message ?? 'Loading'}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        accessibilityElementsHidden
      />
      {message != null && (
        <Text
          style={[
            theme.textStyles.bodyMedium,
            {
              color: theme.colors.textSecondary,
              marginTop: theme.spacing.md,
              textAlign: 'center',
            },
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
