"use client";

import { ConfigProvider, theme as antdTheme, App as AntdApp } from "antd";
import { useState, useEffect, createContext, useContext } from "react";
import { designTokens } from "../design-tokens";

// Create theme context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

const AntdThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
    } else if (!savedTheme) {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
    }
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            // Gemini-inspired Color tokens
            colorPrimary: designTokens.colors.primary[500],
            colorSuccess: designTokens.colors.success,
            colorWarning: designTokens.colors.warning,
            colorError: designTokens.colors.error,
            colorInfo: designTokens.colors.info,
            colorTextBase: designTokens.colors.neutral[900],
            colorText: designTokens.colors.neutral[900],
            colorTextSecondary: designTokens.colors.neutral[700],
            colorTextTertiary: designTokens.colors.neutral[600],
            colorBgLayout: designTokens.colors.neutral[50],
            colorBgContainer: designTokens.colors.neutral[0],
            colorBorder: designTokens.colors.neutral[300],
            colorBorderSecondary: designTokens.colors.neutral[200],

            // Typography - Google Sans inspired
            fontFamily: designTokens.typography.fontFamily.sans,
            fontSize: 15,
            fontSizeHeading1: 48,
            fontSizeHeading2: 36,
            fontSizeHeading3: 28,
            fontSizeHeading4: 24,
            fontSizeHeading5: 20,
            fontSizeLG: 18,
            fontSizeSM: 13,
            fontSizeXL: 20,
            lineHeight: 1.6,
            lineHeightHeading1: 1.2,
            lineHeightHeading2: 1.3,
            lineHeightHeading3: 1.4,

            // Spacing - More generous
            marginXS: 8,
            marginSM: 12,
            margin: 16,
            marginMD: 20,
            marginLG: 24,
            marginXL: 32,
            marginXXL: 48,
            paddingXS: 8,
            paddingSM: 12,
            padding: 16,
            paddingMD: 20,
            paddingLG: 24,
            paddingXL: 32,

            // Border radius - More rounded
            borderRadius: 12,
            borderRadiusLG: 16,
            borderRadiusSM: 8,
            borderRadiusXS: 6,

            // Shadows - Soft and subtle
            boxShadow: designTokens.shadows.base,
            boxShadowSecondary: designTokens.shadows.sm,

            // Animation
            motionDurationSlow: "0.3s",
            motionDurationMid: "0.2s",
            motionDurationFast: "0.15s",
            motionEaseInOut: designTokens.animation.easing.easeInOut,
            motionEaseOut: designTokens.animation.easing.easeOut,
          },
          components: {
            Layout: {
              headerBg: designTokens.colors.neutral[0],
              headerHeight: 72,
              headerPadding: "0 32px",
              bodyBg: designTokens.colors.neutral[50],
              footerBg: designTokens.colors.neutral[0],
              footerPadding: "20px 32px",
            },
            Button: {
              borderRadius: 24,
              borderRadiusLG: 28,
              borderRadiusSM: 20,
              controlHeight: 44,
              controlHeightLG: 52,
              controlHeightSM: 36,
              fontWeight: 500,
              primaryShadow: designTokens.shadows.md,
              defaultShadow: designTokens.shadows.sm,
            },
            Input: {
              borderRadius: 12,
              borderRadiusLG: 16,
              borderRadiusSM: 8,
              controlHeight: 48,
              controlHeightLG: 56,
              controlHeightSM: 40,
              paddingBlock: 12,
              paddingInline: 16,
              fontSize: 15,
            },
            Card: {
              borderRadiusLG: 20,
              paddingLG: 28,
              boxShadowTertiary: designTokens.shadows.md,
            },
            Message: {
              contentBg: designTokens.colors.neutral[0],
              contentPadding: "16px 20px",
              borderRadiusLG: 16,
            },
            Drawer: {
              paddingLG: 28,
              borderRadiusLG: 20,
            },
            Modal: {
              borderRadiusLG: 20,
              paddingLG: 28,
            },
            Tabs: {
              horizontalMargin: "0 32px 0 0",
              cardPadding: "16px 24px",
              borderRadiusLG: 16,
            },
            Badge: {
              fontSize: 12,
              fontSizeSM: 11,
            },
            Avatar: {
              borderRadius: 9999,
            },
            FloatButton: {
              borderRadiusLG: 24,
              boxShadow: designTokens.shadows.lg,
            },
          },
        }}
      >
        <AntdApp>
          {children}
        </AntdApp>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default AntdThemeProvider;
