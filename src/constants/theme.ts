import { TextStyle, ViewStyle } from 'react-native';

export const COLORS = {
  primary: '#8B5CF6',
  primaryLight: 'rgba(139, 92, 246, 0.1)',
  primaryDark: '#7C3AED',

  success: '#10B981',
  successLight: '#D1FAE5',

  error: '#EF4444',
  errorLight: '#FEE2E2',

  warning: '#F59E0B',
  warningLight: '#FEF3C7',

  info: '#3B82F6',
  infoLight: '#DBEAFE',

  background: '#EDEDED',
  white: '#FFFFFF',
  black: '#000000',

  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
} as const;

export const SIZES = {
  // Font sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  // Spacing
  padding: 16,
  margin: 16,
  radius: 12,
  radiusLarge: 16,

  // Icon sizes
  icon: 24,
  iconSmall: 20,
  iconLarge: 32,
} as const;

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  semibold: 'System',
} as const;

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

export type ColorKeys = keyof typeof COLORS;
export type SizeKeys = keyof typeof SIZES;