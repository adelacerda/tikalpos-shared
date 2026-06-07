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
export type ThemeMode = 'dark' | 'light';
export declare const FONT: {
    readonly sans: {
        readonly family: "Space Grotesk";
        readonly stack: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif";
        readonly weights: readonly [300, 400, 500, 600, 700];
    };
    readonly mono: {
        readonly family: "Space Mono";
        readonly stack: "'Space Mono', ui-monospace, 'SF Mono', Menlo, monospace";
        readonly weights: readonly [400, 700];
    };
};
/** Mode-independent palette (raw brand colors). */
export declare const COLOR: {
    readonly brand: {
        readonly 50: "#e6f2ec";
        readonly 100: "#bfd8c7";
        readonly 200: "#93bea0";
        readonly 300: "#65a477";
        readonly 400: "#2d7a4e";
        readonly 500: "#014421";
        readonly 600: "#013a1c";
        readonly 700: "#012e16";
        readonly 800: "#01200f";
        readonly 900: "#010d06";
    };
    /** Gold/chartreuse — brand accent / loyalty / "warning". */
    readonly accent: {
        readonly 400: "#d4c820";
        readonly 500: "#cbbd18";
        readonly 600: "#b0a214";
    };
    /** Burnt orange — highlights / "danger" visual. */
    readonly highlight: {
        readonly 400: "#e0723a";
        readonly 500: "#d75c1d";
        readonly 600: "#b84d18";
    };
    /** Lime neon — ACTION / active / live across all surfaces. */
    readonly neon: {
        readonly 400: "#d4f85e";
        readonly 500: "#c8f31d";
        readonly 600: "#a9d516";
        /** neon as TEXT on light backgrounds (pure neon only as fill / on dark). */
        readonly ink: "#5c7b0c";
        /** text drawn on top of a neon fill — always this, never white. */
        readonly on: "#0a1a05";
    };
    /** Loyalty tiers (Bronze→Platinum). */
    readonly tier: {
        readonly bronze: "#b27a45";
        readonly silver: "#aeb9b6";
        readonly gold: "#d6a93f";
        readonly platinum: "#9fe3cc";
    };
    readonly semantic: {
        readonly success: "#10b981";
        readonly successGlow: "rgba(16,185,129,0.25)";
        readonly warning: "#cbbd18";
        readonly danger: "#d75c1d";
        readonly info: "#3b82f6";
        readonly error: "#ef4444";
    };
};
export interface ThemeColors {
    surface: string;
    surfaceSecondary: string;
    surfaceTertiary: string;
    surfaceElevated: string;
    surfaceGlass: string;
    borderPrimary: string;
    borderSecondary: string;
    borderGlow: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    fillSubtle: string;
    fillMuted: string;
    fillHover: string;
    shadowCard: string;
    shadowElevated: string;
    shadowModal: string;
    shadowGlow: string;
    shadowGlowSuccess: string;
}
export declare const THEME: Record<ThemeMode, ThemeColors>;
/** Corner radii in px (numbers so React Native can consume them directly). */
export declare const RADIUS: {
    readonly sm: 10;
    readonly md: 14;
    readonly lg: 20;
    readonly xl: 24;
    readonly pill: 9999;
};
/** Spacing scale in px (4px base). */
export declare const SPACE: {
    readonly 1: 4;
    readonly 2: 8;
    readonly 3: 12;
    readonly 4: 16;
    readonly 5: 20;
    readonly 6: 24;
    readonly 8: 32;
    readonly 10: 40;
    readonly 12: 48;
    readonly 16: 64;
    readonly 20: 80;
};
export declare const MOTION: {
    readonly fadeIn: "0.2s ease-out";
    readonly slideUp: "0.25s cubic-bezier(0.16,1,0.3,1)";
    readonly scaleIn: "0.25s cubic-bezier(0.16,1,0.3,1)";
    readonly glowPulse: "2s ease-in-out infinite";
};
export declare const DEFAULT_MODE: ThemeMode;
/** Resolve the full theme color set for a mode. */
export declare function getThemeColors(mode: ThemeMode): ThemeColors;
/** Flat token object — convenient single import for app theme contexts. */
export declare const tokens: {
    readonly font: {
        readonly sans: {
            readonly family: "Space Grotesk";
            readonly stack: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif";
            readonly weights: readonly [300, 400, 500, 600, 700];
        };
        readonly mono: {
            readonly family: "Space Mono";
            readonly stack: "'Space Mono', ui-monospace, 'SF Mono', Menlo, monospace";
            readonly weights: readonly [400, 700];
        };
    };
    readonly color: {
        readonly brand: {
            readonly 50: "#e6f2ec";
            readonly 100: "#bfd8c7";
            readonly 200: "#93bea0";
            readonly 300: "#65a477";
            readonly 400: "#2d7a4e";
            readonly 500: "#014421";
            readonly 600: "#013a1c";
            readonly 700: "#012e16";
            readonly 800: "#01200f";
            readonly 900: "#010d06";
        };
        /** Gold/chartreuse — brand accent / loyalty / "warning". */
        readonly accent: {
            readonly 400: "#d4c820";
            readonly 500: "#cbbd18";
            readonly 600: "#b0a214";
        };
        /** Burnt orange — highlights / "danger" visual. */
        readonly highlight: {
            readonly 400: "#e0723a";
            readonly 500: "#d75c1d";
            readonly 600: "#b84d18";
        };
        /** Lime neon — ACTION / active / live across all surfaces. */
        readonly neon: {
            readonly 400: "#d4f85e";
            readonly 500: "#c8f31d";
            readonly 600: "#a9d516";
            /** neon as TEXT on light backgrounds (pure neon only as fill / on dark). */
            readonly ink: "#5c7b0c";
            /** text drawn on top of a neon fill — always this, never white. */
            readonly on: "#0a1a05";
        };
        /** Loyalty tiers (Bronze→Platinum). */
        readonly tier: {
            readonly bronze: "#b27a45";
            readonly silver: "#aeb9b6";
            readonly gold: "#d6a93f";
            readonly platinum: "#9fe3cc";
        };
        readonly semantic: {
            readonly success: "#10b981";
            readonly successGlow: "rgba(16,185,129,0.25)";
            readonly warning: "#cbbd18";
            readonly danger: "#d75c1d";
            readonly info: "#3b82f6";
            readonly error: "#ef4444";
        };
    };
    readonly theme: Record<ThemeMode, ThemeColors>;
    readonly radius: {
        readonly sm: 10;
        readonly md: 14;
        readonly lg: 20;
        readonly xl: 24;
        readonly pill: 9999;
    };
    readonly space: {
        readonly 1: 4;
        readonly 2: 8;
        readonly 3: 12;
        readonly 4: 16;
        readonly 5: 20;
        readonly 6: 24;
        readonly 8: 32;
        readonly 10: 40;
        readonly 12: 48;
        readonly 16: 64;
        readonly 20: 80;
    };
    readonly motion: {
        readonly fadeIn: "0.2s ease-out";
        readonly slideUp: "0.25s cubic-bezier(0.16,1,0.3,1)";
        readonly scaleIn: "0.25s cubic-bezier(0.16,1,0.3,1)";
        readonly glowPulse: "2s ease-in-out infinite";
    };
    readonly defaultMode: "dark";
};
export type Tokens = typeof tokens;
//# sourceMappingURL=tokens.d.ts.map