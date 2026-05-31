import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

// ---------------------------------------------------------------------------
// Prop interface
// ---------------------------------------------------------------------------
export interface BadgeProps {
  count: number;
  muted?: boolean;
  style?: ViewStyle;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Badge({ count, muted = false, style }: BadgeProps) {
  const theme = useTheme();

  if (count === 0) return null;

  const label = count > 99 ? '99+' : String(count);
  // Wider pill for 3-char labels like "99+"
  const minWidth = label.length > 2 ? 30 : 20;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: muted ? theme.colors.textTertiary : theme.colors.unreadBadge,
          minWidth,
        },
        style,
      ]}
      accessibilityLabel={`${count} unread message${count !== 1 ? 's' : ''}`}
      accessibilityRole="text"
    >
      <Text style={styles.text} allowFontScaling={false}>
        {label}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  badge: {
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
    includeFontPadding: false,
  },
});
