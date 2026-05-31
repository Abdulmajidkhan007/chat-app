export const fontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 36,
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const lineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
} as const;

export const textStyles = {
  displayLarge: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.display * lineHeights.tight,
  },
  displayMedium: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.xxxl * lineHeights.tight,
  },
  headingLarge: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
  },
  headingMedium: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
  },
  headingSmall: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
  },
  bodyLarge: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
  },
  bodyMedium: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
  },
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
  },
  chatMessage: {
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * lineHeights.relaxed,
  },
  chatName: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  chatPreview: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
  },
  chatTimestamp: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
  },
  inputText: {
    fontSize: fontSizes.md,
  },
  buttonLarge: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
  },
  buttonMedium: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
} as const;

export type TextStyleKey = keyof typeof textStyles;
