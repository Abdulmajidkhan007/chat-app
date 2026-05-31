import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

// ---------------------------------------------------------------------------
// Prop interface
// ---------------------------------------------------------------------------
export interface DividerProps {
  inset?: number;
  style?: ViewStyle;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Divider({ inset = 0, style }: DividerProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.line,
        {
          marginLeft: inset,
          borderBottomColor: theme.colors.border,
        },
        style,
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  line: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
