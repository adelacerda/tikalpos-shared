"use strict";
/**
 * TIKAL DESIGN TOKENS — single source of truth (Full-Design-V1).
 * ---------------------------------------------------------------------------
 * Derived from Full-Design-V1/Shared/tokens.json. Consumed directly by the RN
 * apps (tablet POS, loyalty) via `import { tokens } from '@tikalpos/shared'`.
 * The web app (Vite + Tailwind v4) mirrors these values in its `@theme` block
 * in app.css. Radius/space are numbers (px) so React Native can use them raw.
 *
 * Brand decisions (jun 2026): dark default everywhere · Space Grotesk + Space
 * Mono · neon #c8f31d = action/active/live · gold #cbbd18 = loyalty/secondary ·
 * forest green #014421 = structure. Text on neon = always #0a1a05.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokens = exports.DEFAULT_MODE = exports.MOTION = exports.SPACE = exports.RADIUS = exports.THEME = exports.COLOR = exports.FONT = void 0;
exports.getThemeColors = getThemeColors;
exports.FONT = {
    sans: {
        family: 'Space Grotesk',
        stack: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
        weights: [300, 400, 500, 600, 700],
    },
    mono: {
        family: 'Space Mono',
        stack: "'Space Mono', ui-monospace, 'SF Mono', Menlo, monospace",
        weights: [400, 700],
    },
};
/** Mode-independent palette (raw brand colors). */
exports.COLOR = {
    brand: {
        50: '#e6f2ec', 100: '#bfd8c7', 200: '#93bea0', 300: '#65a477',
        400: '#2d7a4e', 500: '#014421', 600: '#013a1c', 700: '#012e16',
        800: '#01200f', 900: '#010d06',
    },
    /** Gold/chartreuse — brand accent / loyalty / "warning". */
    accent: { 400: '#d4c820', 500: '#cbbd18', 600: '#b0a214' },
    /** Burnt orange — highlights / "danger" visual. */
    highlight: { 400: '#e0723a', 500: '#d75c1d', 600: '#b84d18' },
    /** Lime neon — ACTION / active / live across all surfaces. */
    neon: {
        400: '#d4f85e', 500: '#c8f31d', 600: '#a9d516',
        /** neon as TEXT on light backgrounds (pure neon only as fill / on dark). */
        ink: '#5c7b0c',
        /** text drawn on top of a neon fill — always this, never white. */
        on: '#0a1a05',
    },
    /** Loyalty tiers (Bronze→Platinum). */
    tier: { bronze: '#b27a45', silver: '#aeb9b6', gold: '#d6a93f', platinum: '#9fe3cc' },
    semantic: {
        success: '#10b981',
        successGlow: 'rgba(16,185,129,0.25)',
        warning: '#cbbd18',
        danger: '#d75c1d',
        info: '#3b82f6',
        error: '#ef4444',
    },
};
exports.THEME = {
    dark: {
        surface: '#080f09',
        surfaceSecondary: '#0e1a10',
        surfaceTertiary: '#152119',
        surfaceElevated: '#111e13',
        surfaceGlass: 'rgba(8,15,9,0.8)',
        borderPrimary: 'rgba(255,255,255,0.07)',
        borderSecondary: 'rgba(255,255,255,0.03)',
        borderGlow: 'rgba(1,150,60,0.4)',
        textPrimary: '#f0f4f1',
        textSecondary: '#9bb8a3',
        textMuted: '#4d6b55',
        fillSubtle: 'rgba(255,255,255,0.03)',
        fillMuted: 'rgba(255,255,255,0.055)',
        fillHover: 'rgba(255,255,255,0.08)',
        shadowCard: '0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)',
        shadowElevated: '0 8px 25px -5px rgba(0,0,0,0.6), 0 4px 10px -3px rgba(0,0,0,0.4)',
        shadowModal: '0 25px 60px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)',
        shadowGlow: '0 0 30px rgba(1,100,40,0.3)',
        shadowGlowSuccess: '0 0 30px rgba(16,185,129,0.25)',
    },
    light: {
        surface: '#f5f0e8',
        surfaceSecondary: '#ffffff',
        surfaceTertiary: '#ede7db',
        surfaceElevated: '#ffffff',
        surfaceGlass: 'rgba(255,255,255,0.75)',
        borderPrimary: 'rgba(1,68,33,0.1)',
        borderSecondary: 'rgba(1,68,33,0.05)',
        borderGlow: 'rgba(1,68,33,0.25)',
        textPrimary: '#111827',
        textSecondary: '#4b5563',
        textMuted: '#9ca3af',
        fillSubtle: 'rgba(1,68,33,0.03)',
        fillMuted: 'rgba(1,68,33,0.06)',
        fillHover: 'rgba(1,68,33,0.08)',
        shadowCard: '0 1px 2px rgba(1,68,33,0.06), 0 1px 3px rgba(1,68,33,0.08)',
        shadowElevated: '0 8px 25px -5px rgba(1,68,33,0.12), 0 4px 10px -3px rgba(0,0,0,0.06)',
        shadowModal: '0 25px 50px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05)',
        shadowGlow: '0 0 20px rgba(1,68,33,0.2)',
        shadowGlowSuccess: '0 0 20px rgba(16,185,129,0.3)',
    },
};
/** Corner radii in px (numbers so React Native can consume them directly). */
exports.RADIUS = { sm: 10, md: 14, lg: 20, xl: 24, pill: 9999 };
/** Spacing scale in px (4px base). */
exports.SPACE = {
    1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64, 20: 80,
};
exports.MOTION = {
    fadeIn: '0.2s ease-out',
    slideUp: '0.25s cubic-bezier(0.16,1,0.3,1)',
    scaleIn: '0.25s cubic-bezier(0.16,1,0.3,1)',
    glowPulse: '2s ease-in-out infinite',
};
exports.DEFAULT_MODE = 'dark';
/** Resolve the full theme color set for a mode. */
function getThemeColors(mode) {
    return exports.THEME[mode];
}
/** Flat token object — convenient single import for app theme contexts. */
exports.tokens = {
    font: exports.FONT,
    color: exports.COLOR,
    theme: exports.THEME,
    radius: exports.RADIUS,
    space: exports.SPACE,
    motion: exports.MOTION,
    defaultMode: exports.DEFAULT_MODE,
};
//# sourceMappingURL=tokens.js.map