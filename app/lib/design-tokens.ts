/**
 * Design Token System
 * 
 * This file defines all design tokens as TypeScript constants that match
 * the CSS custom properties defined in globals.css. These tokens ensure
 * consistency across the design system for Neumorphism, Glassmorphism,
 * spacing, blur effects, and responsive breakpoints.
 * 
 * Requirements: 12.1, 12.2
 */

export const designTokens = {
  neumorphism: {
    lightSourceAngle: 145,
    shadow: {
      blurMin: 10,
      blurMax: 30,
      spreadMin: -5,
      spreadMax: 5,
      opacity: 0.15,
    },
    highlight: {
      opacity: 0.1,
    },
    transition: {
      hover: 200,
      active: 100,
    },
  },
  glassmorphism: {
    background: {
      opacityMin: 0.05,
      opacityMax: 0.3,
    },
    blur: {
      min: 8,
      max: 24,
    },
    border: {
      opacity: 0.2,
    },
    shadow: {
      blur: 30,
    },
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
  },
  spacing: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96] as const,
  blur: [0, 4, 8, 12, 16, 20, 24] as const,
  shadowLevels: [
    'none',
    '0 2px 4px rgba(0, 0, 0, 0.1)',
    '0 4px 8px rgba(0, 0, 0, 0.15)',
    '0 8px 16px rgba(0, 0, 0, 0.2)',
  ] as const,
} as const;

/**
 * Type definitions for design tokens
 */
export interface NeumorphismToken {
  lightSourceAngle: number;
  shadow: {
    blurMin: number;
    blurMax: number;
    spreadMin: number;
    spreadMax: number;
    opacity: number;
  };
  highlight: {
    opacity: number;
  };
  transition: {
    hover: number; // milliseconds
    active: number; // milliseconds
  };
}

export interface GlassmorphismToken {
  background: {
    opacityMin: number;
    opacityMax: number;
  };
  blur: {
    min: number;
    max: number;
  };
  border: {
    opacity: number;
  };
  shadow: {
    blur: number;
  };
}

export interface DesignTokens {
  neumorphism: NeumorphismToken;
  glassmorphism: GlassmorphismToken;
  breakpoints: {
    mobile: number;
    tablet: number;
  };
  spacing: readonly number[];
  blur: readonly number[];
  shadowLevels: readonly string[];
}

/**
 * Helper function to get spacing value by index
 */
export function getSpacing(index: number): number {
  if (index < 0 || index >= designTokens.spacing.length) {
    console.error(`Invalid spacing index: ${index}. Falling back to 0.`);
    return 0;
  }
  return designTokens.spacing[index];
}

/**
 * Helper function to get blur value by index
 */
export function getBlur(index: number): number {
  if (index < 0 || index >= designTokens.blur.length) {
    console.error(`Invalid blur index: ${index}. Falling back to 0.`);
    return 0;
  }
  return designTokens.blur[index];
}

/**
 * Helper function to get shadow level by index
 */
export function getShadowLevel(index: number): string {
  if (index < 0 || index >= designTokens.shadowLevels.length) {
    console.error(`Invalid shadow level index: ${index}. Falling back to 'none'.`);
    return 'none';
  }
  return designTokens.shadowLevels[index];
}

/**
 * CSS variable names for use in styled components
 */
export const cssVars = {
  // Neumorphism
  neuroLightSourceAngle: 'var(--neuro-light-source-angle)',
  neuroShadowBlurMin: 'var(--neuro-shadow-blur-min)',
  neuroShadowBlurMax: 'var(--neuro-shadow-blur-max)',
  neuroShadowSpreadMin: 'var(--neuro-shadow-spread-min)',
  neuroShadowSpreadMax: 'var(--neuro-shadow-spread-max)',
  neuroShadowOpacity: 'var(--neuro-shadow-opacity)',
  neuroHighlightOpacity: 'var(--neuro-highlight-opacity)',
  neuroTransitionHover: 'var(--neuro-transition-hover)',
  neuroTransitionActive: 'var(--neuro-transition-active)',
  
  // Glassmorphism
  glassBgOpacityMin: 'var(--glass-bg-opacity-min)',
  glassBgOpacityMax: 'var(--glass-bg-opacity-max)',
  glassBlurMin: 'var(--glass-blur-min)',
  glassBlurMax: 'var(--glass-blur-max)',
  glassBorderOpacity: 'var(--glass-border-opacity)',
  glassShadowBlur: 'var(--glass-shadow-blur)',
  
  // Spacing
  space: (index: number) => `var(--space-${index})`,
  
  // Blur
  blur: (index: number) => `var(--blur-${index})`,
  
  // Shadow
  shadow: (level: number) => `var(--shadow-${level})`,
} as const;
