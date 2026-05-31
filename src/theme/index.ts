import { darkColors, lightColors } from './colors';
import type { ColorPalette } from './colors';
import { fontSizes, fontWeights, textStyles, lineHeights, letterSpacing } from './typography';
import { spacing, radius } from './spacing';
import { shadows } from './shadows';

export type { ColorPalette, ColorKey } from './colors';
export type { TextStyleKey, } from './typography';
export type { SpacingKey, RadiusKey } from './spacing';
export type { ShadowKey } from './shadows';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface AppTheme {
  colors: ColorPalette;
  fontSizes: typeof fontSizes;
  fontWeights: typeof fontWeights;
  textStyles: typeof textStyles;
  lineHeights: typeof lineHeights;
  letterSpacing: typeof letterSpacing;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  isDark: boolean;
}

export const darkTheme: AppTheme = {
  colors: darkColors,
  fontSizes,
  fontWeights,
  textStyles,
  lineHeights,
  letterSpacing,
  spacing,
  radius,
  shadows,
  isDark: true,
};

export const lightTheme: AppTheme = {
  colors: lightColors,
  fontSizes,
  fontWeights,
  textStyles,
  lineHeights,
  letterSpacing,
  spacing,
  radius,
  shadows,
  isDark: false,
};

export { darkColors, lightColors };
export { fontSizes, fontWeights, textStyles };
export { spacing, radius };
export { shadows };
