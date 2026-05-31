import React, { useCallback } from 'react';
import { Pressable, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

// ---------------------------------------------------------------------------
// Prop interface
// ---------------------------------------------------------------------------
export interface PressableRowProps {
  onPress?: () => void;
  onLongPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PressableRow({
  onPress,
  onLongPress,
  children,
  style,
  disabled = false,
}: PressableRowProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 20, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 20, stiffness: 400 });
  }, [scale]);

  return (
    <AnimatedPressable
      style={[
        animatedStyle,
        style,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      android_ripple={{ color: theme.colors.surfaceHighlight }}
    >
      {({ pressed }: { pressed: boolean }) => (
        <Animated.View
          style={{
            backgroundColor: pressed ? theme.colors.surfaceHighlight : 'transparent',
          }}
        >
          {children}
        </Animated.View>
      )}
    </AnimatedPressable>
  );
}
