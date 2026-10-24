/**
 * Amar Dokan - Premium Dark E-Commerce Design System Constants
 * Core Color Palette:
 * - Background: #10131F
 * - Cards: #22283A
 * - Accent Lime: #C6F36A
 * - Accent Coral: #FF8066
 * - Text: #F4F3ED
 */

export const THEME_COLORS = {
  background: "#10131F",
  card: "#22283A",
  cardHover: "#2B334B",
  cardBorder: "#2E364F",
  accentLime: "#C6F36A",
  accentLimeHover: "#D5F788",
  accentCoral: "#FF8066",
  accentCoralHover: "#FF9580",
  textPrimary: "#F4F3ED",
  textMuted: "#9AA3B8",
  textSubtle: "#657189",
  borderDefault: "#2E364F",
  borderSubtle: "#1C2233",
} as const;

export const THEME_CONFIG = {
  name: "Amar Dokan Dark Luxury",
  version: "1.0.0",
  mode: "dark",
  colors: THEME_COLORS,
} as const;

export type ThemeColors = typeof THEME_COLORS;
