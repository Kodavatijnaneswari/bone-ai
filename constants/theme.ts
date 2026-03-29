import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Colors = {
  dark: {
    background: '#04070D', // Deeper cinematic black
    surface: '#0E1521',    // Slightly lighter for cards
    surfaceElevated: '#151E2E',
    primary: '#46FFD2',    // Signature Mint Green
    secondary: '#232E42',
    accent: '#818CF8',      // Soft Indigo for variety
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: 'rgba(255, 255, 255, 0.08)',
    error: '#EF4444',
    success: '#10B981',
    admin: '#3B82F6',
    glass: 'rgba(14, 21, 33, 0.8)',
  },
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    primary: '#0D9488',
    text: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
  }
};

export const Layout = {
  window: { width, height },
  isSmallDevice: width < 375,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 24,
    full: 9999,
  }
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    mono: 'Courier',
  },
  android: {
    sans: 'sans-serif',
    mono: 'monospace',
  },
  default: {
    sans: 'System',
  }
});
