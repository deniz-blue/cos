export type SpacingName = keyof typeof Spacing;

export const Spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
} as const;

export type ThemeSpacing = SpacingName;
