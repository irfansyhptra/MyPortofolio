/**
 * GlassCard Component
 * 
 * Implements glassmorphism design pattern with backdrop blur, opacity adjustment,
 * and z-index layering. This component uses design tokens exclusively and adjusts
 * opacity dynamically based on background luminance.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 12.3
 */

'use client';

import { HTMLAttributes, useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { designTokens } from '@/app/lib/design-tokens';
import { getGlassTextContrast } from '@/app/lib/color-utils';
import { useBreakpoint, getAdjustedBlur } from '@/app/lib/responsive-manager';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Blur strength level
   * low: 8px, medium: 16px, high: 24px
   * Requirements: 2.2
   */
  blurStrength?: 'low' | 'medium' | 'high';
  
  /**
   * Z-index for layering (increments of 10)
   * Requirements: 2.3
   */
  zIndex?: number;
  
  /**
   * Base background opacity (will be adjusted based on luminance)
   * Requirements: 2.1, 2.5
   */
  opacity?: number;
  
  /**
   * Enable dynamic opacity adjustment based on background luminance
   * Requirements: 2.5
   */
  dynamicOpacity?: boolean;
  
  /**
   * Disable entrance animation
   */
  noAnimation?: boolean;
}

/**
 * Adjusts glass background opacity when background luminance is low.
 * Requirements: 2.5
 */
export function adjustOpacityForLuminance(
  luminance: number,
  baseOpacity: number,
  maxOpacity: number = designTokens.glassmorphism.background.opacityMax,
  textColor: string = 'hsl(0, 0%, 100%)'
): number {
  if (luminance >= 0.3) {
    return baseOpacity;
  }

  const increasedOpacity = Math.min(baseOpacity * 1.5, maxOpacity);
  const increasedContrast = getGlassTextContrast(textColor, increasedOpacity, luminance);

  if (increasedContrast >= 4.5) {
    return increasedOpacity;
  }

  if (getGlassTextContrast(textColor, baseOpacity, luminance) >= 4.5) {
    return baseOpacity;
  }

  for (let opacity = baseOpacity; opacity <= maxOpacity; opacity += 0.05) {
    if (getGlassTextContrast(textColor, opacity, luminance) >= 4.5) {
      return opacity;
    }
  }

  for (let opacity = baseOpacity; opacity >= designTokens.glassmorphism.background.opacityMin; opacity -= 0.05) {
    if (getGlassTextContrast(textColor, opacity, luminance) >= 4.5) {
      return opacity;
    }
  }

  return baseOpacity;
}

/**
 * Calculates the luminance of the background behind the element
 * Requirements: 2.5
 */
export function calculateBackgroundLuminance(element: HTMLElement): number {
  const style = window.getComputedStyle(element.parentElement || element);
  const bgColor = style.backgroundColor;
  
  const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!rgbMatch) return 0.5;
  
  const r = parseInt(rgbMatch[1]) / 255;
  const g = parseInt(rgbMatch[2]) / 255;
  const b = parseInt(rgbMatch[3]) / 255;
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function GlassCard({
  blurStrength = 'medium',
  zIndex = 10,
  opacity = 0.1,
  dynamicOpacity = true,
  noAnimation = false,
  children,
  className = '',
  style,
  ...props
}: GlassCardProps) {
  const breakpoint = useBreakpoint();
  const elementRef = useRef<HTMLDivElement>(null);
  const [adjustedOpacity, setAdjustedOpacity] = useState(opacity);
  
  const blurValues = {
    low: designTokens.glassmorphism.blur.min,
    medium: (designTokens.glassmorphism.blur.min + designTokens.glassmorphism.blur.max) / 2,
    high: designTokens.glassmorphism.blur.max,
  };
  
  const baseBlur = blurValues[blurStrength];
  const responsiveBlur = getAdjustedBlur(baseBlur, breakpoint);
  
  useEffect(() => {
    if (!dynamicOpacity || !elementRef.current) return;
    
    const adjustOpacity = () => {
      if (!elementRef.current) return;
      
      const luminance = calculateBackgroundLuminance(elementRef.current);
      setAdjustedOpacity(adjustOpacityForLuminance(luminance, opacity));
    };
    
    adjustOpacity();
    
    window.addEventListener('resize', adjustOpacity);
    return () => window.removeEventListener('resize', adjustOpacity);
  }, [opacity, dynamicOpacity]);
  
  const glassStyles: React.CSSProperties = {
    background: `rgba(255, 255, 255, ${adjustedOpacity})`,
    backdropFilter: `blur(${responsiveBlur}px)`,
    WebkitBackdropFilter: `blur(${responsiveBlur}px)`,
    border: `1px solid rgba(255, 255, 255, ${designTokens.glassmorphism.border.opacity})`,
    boxShadow: `0 8px ${designTokens.glassmorphism.shadow.blur}px rgba(0, 0, 0, 0.1)`,
    borderRadius: '16px',
    zIndex,
    ...style,
  };
  
  const animationVariants = noAnimation
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      };
  
  return (
    <motion.div
      ref={elementRef}
      style={glassStyles}
      className={className}
      {...animationVariants}
      {...props as any}
    >
      {children}
    </motion.div>
  );
}
