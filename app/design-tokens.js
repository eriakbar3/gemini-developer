/**
 * Design Tokens - Gemini-Inspired Design System
 *
 * This file contains all design tokens for the application,
 * inspired by Google Gemini's clean, modern aesthetic.
 */

export const designTokens = {
  // Color Palette
  colors: {
    // Primary colors - Blue/Purple gradient theme
    primary: {
      50: '#E8F0FE',
      100: '#D2E3FC',
      200: '#AECBFA',
      300: '#8AB4F8',
      400: '#669DF6',
      500: '#4285F4', // Main brand color
      600: '#1A73E8',
      700: '#1967D2',
      800: '#185ABC',
      900: '#174EA6',
    },

    // Secondary colors - Purple accent
    secondary: {
      50: '#F3E8FD',
      100: '#E9D2FD',
      200: '#D7AEFB',
      300: '#C58AF9',
      400: '#B066F7',
      500: '#9C42F5',
      600: '#8430CE',
      700: '#6C20A7',
      800: '#551080',
      900: '#3E0059',
    },

    // Accent colors - Gemini multicolor palette
    accent: {
      blue: '#4285F4',
      purple: '#9C42F5',
      pink: '#F538A0',
      orange: '#FF9800',
      green: '#0F9D58',
      red: '#EA4335',
      yellow: '#FBBC04',
    },

    // Neutral colors - Backgrounds and text
    neutral: {
      0: '#FFFFFF',
      50: '#F8F9FA',
      100: '#F1F3F4',
      200: '#E8EAED',
      300: '#DADCE0',
      400: '#BDC1C6',
      500: '#9AA0A6',
      600: '#80868B',
      700: '#5F6368',
      800: '#3C4043',
      900: '#202124',
      950: '#1F1F1F',
    },

    // Semantic colors
    success: '#0F9D58',
    warning: '#FBBC04',
    error: '#EA4335',
    info: '#4285F4',

    // Surface colors
    background: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceVariant: '#F1F3F4',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },

  // Typography
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"SF Mono", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace',
      display: '"Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },

    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },

    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },

    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
      wider: '0.05em',
    },
  },

  // Spacing scale (based on 4px grid)
  spacing: {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px',
  },

  // Shadows - Gemini-style soft shadows
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    base: '0 2px 4px rgba(0, 0, 0, 0.06)',
    md: '0 4px 8px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.12)',
    '2xl': '0 16px 32px rgba(0, 0, 0, 0.14)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
    focus: '0 0 0 3px rgba(66, 133, 244, 0.15)',
  },

  // Animation & Transitions
  animation: {
    duration: {
      fast: '150ms',
      base: '200ms',
      medium: '300ms',
      slow: '500ms',
    },

    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // Z-index layers
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },

  // Breakpoints for responsive design
  breakpoints: {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// Helper function to create gradient backgrounds
export const gradients = {
  gemini: `linear-gradient(135deg, ${designTokens.colors.primary[500]} 0%, ${designTokens.colors.secondary[500]} 100%)`,
  geminiSoft: `linear-gradient(135deg, ${designTokens.colors.primary[100]} 0%, ${designTokens.colors.secondary[100]} 100%)`,
  geminiVertical: `linear-gradient(180deg, ${designTokens.colors.primary[500]} 0%, ${designTokens.colors.secondary[500]} 100%)`,
  subtle: `linear-gradient(135deg, ${designTokens.colors.neutral[50]} 0%, ${designTokens.colors.neutral[100]} 100%)`,
  multicolor: `linear-gradient(135deg, ${designTokens.colors.accent.blue} 0%, ${designTokens.colors.accent.purple} 50%, ${designTokens.colors.accent.pink} 100%)`,
};

export default designTokens;
