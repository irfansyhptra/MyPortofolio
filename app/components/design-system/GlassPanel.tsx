/**
 * GlassPanel Component
 * 
 * Alternative glassmorphism component variant with different blur strength options
 * and fade-in entrance animations. Provides a simpler alternative to GlassCard
 * with preset blur configurations.
 * 
 * Requirements: 2.1, 2.2
 */

'use client';

import { HTMLAttributes } from 'react';
import { motion } from 'motion/react';
import { designTokens } from '@/app/lib/design-tokens';
import { useBreakpoint, getAdjustedBlur } from '@/app/lib/responsive-manager';

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Blur strength preset
   * low: 8px, medium: 16px, high: 24px
   * Requirements: 2.2
   */
  blurStrength?: 'low' | 'medium' | 'high';
  
  /**
   * Background opacity level
   * Requirements: 2.1
   */
  opacity?: number;
  
  /**
   * Disable entrance animation
   */
  noAnimation?: boolean;
  
  /**
   * Animation delay in seconds
   */
  delay?: number;
}

export function GlassPanel({
  blurStrength = 'medium',
  opacity = 0.15,
  noAnimation = false,
  delay = 0,
  children,
  className = '',
  style,
  ...props
}: GlassPanelProps) {
  const breakpoint = useBreakpoint();
  
  // Blur values based on strength preset
  // Requirements: 2.2
  const blurValues = {
    low: designTokens.glassmorphism.blur.min, // 8px
    medium: (designTokens.glassmorphism.blur.min + designTokens.glassmorphism.blur.max) / 2, // 16px
    high: designTokens.glassmorphism.blur.max, // 24px
  };
  
  const baseBlur = blurValues[blurStrength];
  const responsiveBlur = getAdjustedBlur(baseBlur, breakpoint);
  
  // Clamp opacity to design token range
  // Requirements: 2.1
  const clampedOpacity = Math.max(
    designTokens.glassmorphism.background.opacityMin,
    Math.min(opacity, designTokens.glassmorphism.background.opacityMax)
  );
  
  // Styles using design tokens exclusively
  // Requirements: 12.3
  const panelStyles: React.CSSProperties = {
    background: `rgba(255, 255, 255, ${clampedOpacity})`,
    backdropFilter: `blur(${responsiveBlur}px)`,
    WebkitBackdropFilter: `blur(${responsiveBlur}px)`,
    border: `1px solid rgba(255, 255, 255, ${designTokens.glassmorphism.border.opacity})`,
    boxShadow: `0 4px 16px rgba(0, 0, 0, 0.1)`,
    borderRadius: '12px',
    ...style,
  };
  
  // Fade-in animation with 0.6s duration
  // Requirements: 2.2 (entrance animations)
  const animationVariants = noAnimation
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { 
          duration: 0.6, 
          ease: [0.4, 0, 0.2, 1],
          delay,
        },
      };
  
  return (
    <motion.div
      style={panelStyles}
      className={className}
      {...animationVariants}
      {...props as any}
    >
      {children}
    </motion.div>
  );
}
