export const darkColors = {
  background: '#0F1923',
  surface: '#1A2633',
  surfaceElevated: '#243447',
  surfaceHighlight: '#2E4057',
  primary: '#3D9AE8',
  primaryDark: '#2E7BC4',
  primaryLight: '#6BBCFF',
  secondary: '#4CAF80',
  accent: '#E8963D',
  text: '#FFFFFF',
  textSecondary: '#8899AA',
  textTertiary: '#556677',
  textInverse: '#0F1923',
  border: '#243447',
  borderSubtle: '#1A2633',
  error: '#FF5252',
  warning: '#FFC107',
  success: '#4CAF80',
  mention: '#E8963D',
  link: '#6BBCFF',
  overlay: 'rgba(0,0,0,0.6)',
  messageBubbleOutgoing: '#1E5799',
  messageBubbleIncoming: '#1A2633',
  messageBubbleOutgoingText: '#FFFFFF',
  messageBubbleIncomingText: '#FFFFFF',
  inputBackground: '#1A2633',
  tabBar: '#0F1923',
  tabBarActive: '#3D9AE8',
  tabBarInactive: '#556677',
  statusBar: 'dark' as const,
  unreadBadge: '#3D9AE8',
  onlineDot: '#4CAF80',
} as const;

export const lightColors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceHighlight: '#F0F4F8',
  primary: '#2B7BE0',
  primaryDark: '#1A5FB4',
  primaryLight: '#5BA3F5',
  secondary: '#2E9E5B',
  accent: '#E06B1F',
  text: '#0F1923',
  textSecondary: '#546A7A',
  textTertiary: '#8899AA',
  textInverse: '#FFFFFF',
  border: '#E0E8F0',
  borderSubtle: '#F0F4F8',
  error: '#D32F2F',
  warning: '#F57C00',
  success: '#2E9E5B',
  mention: '#E06B1F',
  link: '#2B7BE0',
  overlay: 'rgba(0,0,0,0.4)',
  messageBubbleOutgoing: '#2B7BE0',
  messageBubbleIncoming: '#FFFFFF',
  messageBubbleOutgoingText: '#FFFFFF',
  messageBubbleIncomingText: '#0F1923',
  inputBackground: '#F0F4F8',
  tabBar: '#FFFFFF',
  tabBarActive: '#2B7BE0',
  tabBarInactive: '#8899AA',
  statusBar: 'light' as const,
  unreadBadge: '#2B7BE0',
  onlineDot: '#2E9E5B',
} as const;

/**
 * ColorPalette uses widened string types so both darkColors and lightColors
 * satisfy the interface despite holding different literal hex values.
 */
export type ColorPalette = {
  [K in keyof typeof darkColors]: (typeof darkColors)[K] extends 'dark' | 'light'
    ? 'dark' | 'light'
    : string;
};

export type ColorKey = keyof ColorPalette;
