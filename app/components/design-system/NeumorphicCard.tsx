/**
 * NeumorphicCard Component
 * 
 * A card component implementing the neumorphism design pattern with soft shadows
 * and tactile depth effects. Supports raised and pressed variants with smooth
 * hover and active state transitions powered by Framer Motion.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 1.7, 12.3
 */

'use client';

import { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { designTokens } from '@/app/lib/design-tokens';
import {
  adjustHslLightness,
  getContrastRatio,
  getHslLightness,
  NeumorphicGradientResult,
} from '@/app/lib/color-utils';
import { useBreakpoint, useIsTouch, usePrefersReducedMotion, getAdjustedShadowBlur, Breakpoint } from '@/app/lib/responsive-manager';

export interface NeumorphicCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /**
   * Visual variant of the card
   * - 'raised': Card appears elevated above the surface with outward shadows
   * - 'pressed': Card appears pressed into the surface with inset shadows
   */
  variant?: 'raised' | 'pressed';
  
  /**
   * Whether the card should respond to user interactions (hover, tap)
   */
  interactive?: boolean;
  
  /**
   * Background color for the neumorphic effect
   * Should be a light or dark neutral color for best results
   */
  backgroundColor?: string;
  
  /**
   * Border radius in pixels
   */
  borderRadius?: number;
  
  /**
   * Additional className for custom styling
   */
  className?: string;
}

/**
 * Calculate shadow values based on 145-degree light source angle
 * Requirements: 1.1, 1.2, 1.5
 */
export function calculateShadowOffsets(angle: number): { x: number; y: number } {
  // Convert degrees to radians
  const radians = (angle * Math.PI) / 180;
  
  // Calculate offsets for shadow direction
  // 145 degrees means light coming from top-left, so shadow goes bottom-right
  const x = Math.cos(radians);
  const y = Math.sin(radians);
  
  return { x, y };
}

/**
 * Generate neumorphic shadow styles
 * Requirements: 1.1, 1.2, 1.3, 1.5
 */
export function generateNeumorphicShadow(
  variant: 'raised' | 'pressed',
  breakpoint: Breakpoint
): string {
  const { lightSourceAngle, shadow, highlight } = designTokens.neumorphism;
  
  // Calculate shadow offsets based on light source angle (145 degrees)
  const offsets = calculateShadowOffsets(lightSourceAngle);
  
  // Adjust shadow blur based on breakpoint (30% reduction on mobile)
  const shadowBlur = getAdjustedShadowBlur(shadow.blurMax, breakpoint);
  
  if (variant === 'raised') {
    // Raised variant: dual shadows (highlight and shadow)
    // Highlight shadow comes from the light source direction (negative offsets)
    // Dark shadow goes opposite direction (positive offsets)
    
    const highlightOffsetX = Math.round(offsets.x * -6); // -6px to -8px range
    const highlightOffsetY = Math.round(offsets.y * -6);
    const shadowOffsetX = Math.round(offsets.x * 8); // 6px to 8px range
    const shadowOffsetY = Math.round(offsets.y * 8);
    
    return `
      ${highlightOffsetX}px ${highlightOffsetY}px ${shadowBlur}px rgba(255, 255, 255, ${highlight.opacity}),
      ${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px rgba(0, 0, 0, ${shadow.opacity})
    `.trim();
  } else {
    // Pressed variant: inset shadows
    // Requirements: 1.3
    const insetBlur = getAdjustedShadowBlur(16, breakpoint); // 8-20px range, using mid-point
    const insetOffset = 4; // 2-6px range, using mid-point
    
    return `
      inset ${insetOffset}px ${insetOffset}px ${insetBlur}px rgba(0, 0, 0, ${shadow.opacity}),
      inset -${insetOffset}px -${insetOffset}px ${insetBlur}px rgba(255, 255, 255, ${highlight.opacity})
    `.trim();
  }
}

const GRADIENT_LIGHTNESS_DELTA = 5;

/**
 * Generate gradient background with 0%, 50%, 100% stops
 * Requirements: 1.4, 1.5
 */
export function generateNeumorphicGradient(
  backgroundColor: string,
  angle: number = designTokens.neumorphism.lightSourceAngle
): NeumorphicGradientResult {
  const lighterStop = adjustHslLightness(backgroundColor, GRADIENT_LIGHTNESS_DELTA);
  const darkerStop = adjustHslLightness(backgroundColor, -GRADIENT_LIGHTNESS_DELTA);

  const colorStops = [
    { position: 0, lightness: getHslLightness(lighterStop), color: lighterStop },
    { position: 50, lightness: getHslLightness(backgroundColor), color: backgroundColor },
    { position: 100, lightness: getHslLightness(darkerStop), color: darkerStop },
  ];

  return {
    css: `linear-gradient(${angle}deg, ${lighterStop} 0%, ${backgroundColor} 50%, ${darkerStop} 100%)`,
    angle,
    colorStops,
  };
}

/**
 * NeumorphicCard Component
 */
export function NeumorphicCard({
  variant = 'raised',
  interactive = false,
  backgroundColor = 'hsl(0, 0%, 15%)', // Dark neutral background
  borderRadius = 16,
  children,
  className = '',
  ...props
}: NeumorphicCardProps) {
  const breakpoint = useBreakpoint();
  const isTouch = useIsTouch();
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const { transition } = designTokens.neumorphism;
  
  // Generate shadow styles
  const boxShadow = generateNeumorphicShadow(variant, breakpoint);
  
  // Generate gradient background
  const gradient = generateNeumorphicGradient(
    backgroundColor,
    designTokens.neumorphism.lightSourceAngle
  );
  
  // Base styles
  const baseStyles: React.CSSProperties = {
    borderRadius: `${borderRadius}px`,
    background: gradient.css,
    boxShadow,
    position: 'relative',
  };
  
  // Animation variants for interactive cards
  // Requirements: 1.6, 1.7
  const animationVariants = interactive && !prefersReducedMotion ? {
    hover: {
      scale: 1.02,
      transition: {
        duration: transition.hover / 1000, // Convert ms to seconds
        ease: [0.4, 0, 0.2, 1], // Custom easing curve
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: transition.active / 1000, // Convert ms to seconds
        ease: [0.4, 0, 0.2, 1],
      },
    },
  } : undefined;
  
  // Disable hover effects on touch devices
  // Requirements: 3.10, 11.6
  const shouldEnableHover = interactive && !isTouch && !prefersReducedMotion;
  
  return (
    <motion.div
      style={baseStyles}
      className={className}
      variants={animationVariants}
      whileHover={shouldEnableHover ? 'hover' : undefined}
      whileTap={interactive && !prefersReducedMotion ? 'tap' : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Helper function to ensure proper contrast for text content
 * Requirements: 1.9
 * 
 * This function can be used to validate that text placed on neumorphic
 * cards maintains the required 4.5:1 contrast ratio.
 */
export function validateTextContrast(
  foregroundColor: string,
  backgroundColor: string
): boolean {
  return getContrastRatio(foregroundColor, backgroundColor) >= 4.5;
}

export function validateSurfaceContrast(
  componentColor: string,
  adjacentSurfaceColor: string
): boolean {
  return getContrastRatio(componentColor, adjacentSurfaceColor) >= 1.5;
}

