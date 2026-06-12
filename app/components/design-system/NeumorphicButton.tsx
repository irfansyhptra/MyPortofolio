/**
 * NeumorphicButton Component
 * 
 * A button component implementing neumorphic design with raised and pressed states.
 * Features spring physics animations and ensures minimum touch target size for accessibility.
 * 
 * Requirements: 1.6, 1.7, 3.6, 11.5
 */

'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, MotionProps } from 'motion/react';
import { designTokens } from '@/app/lib/design-tokens';
import { useResponsive } from '@/app/lib/responsive-manager';

export interface NeumorphicButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /**
   * Visual state of the button
   * - 'raised': Default elevated state with external shadows
   * - 'pressed': Depressed state with inset shadows
   */
  variant?: 'raised' | 'pressed';
  
  /**
   * Size variant of the button
   * - 'sm': Small button (min 44x44px on touch devices)
   * - 'md': Medium button (default)
   * - 'lg': Large button
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * If true, button will take full width of its container
   */
  fullWidth?: boolean;
}

/**
 * NeumorphicButton Component
 * 
 * Implements a neumorphic button with:
 * - Raised/pressed shadow states using 145-degree light source
 * - Spring physics animations (stiffness 200-400, damping 15-30)
 * - Minimum 44x44px touch target for touch devices
 * - Hover and active state transitions
 */
export const NeumorphicButton = forwardRef<HTMLButtonElement, NeumorphicButtonProps>(
  ({ 
    variant = 'raised', 
    size = 'md',
    fullWidth = false,
    children,
    className = '',
    disabled = false,
    ...props 
  }, ref) => {
    const { isTouch, breakpoint, prefersReducedMotion } = useResponsive();
    
    // Calculate shadow values based on light source angle (145 degrees)
    // 145 degrees = 2.53 radians
    // For raised state: offset -8px to -2px (using -6px for medium)
    const lightAngleRad = (designTokens.neumorphism.lightSourceAngle * Math.PI) / 180;
    const shadowOffsetX = Math.cos(lightAngleRad);
    const shadowOffsetY = Math.sin(lightAngleRad);
    
    // Base shadow calculations for raised state
    const highlightOffsetX = Math.round(-6 * shadowOffsetX); // highlight from light source
    const highlightOffsetY = Math.round(-6 * shadowOffsetY);
    const shadowDarkOffsetX = Math.round(8 * shadowOffsetX); // shadow opposite to light
    const shadowDarkOffsetY = Math.round(8 * shadowOffsetY);
    
    // Adjust shadow blur based on breakpoint (30% reduction on mobile)
    const shadowBlur = breakpoint === 'mobile' 
      ? designTokens.neumorphism.shadow.blurMax * 0.7
      : breakpoint === 'tablet'
      ? designTokens.neumorphism.shadow.blurMax * 0.85
      : designTokens.neumorphism.shadow.blurMax;
    
    const insetShadowBlur = breakpoint === 'mobile'
      ? 12 * 0.7 // reduced from 12px
      : breakpoint === 'tablet'
      ? 12 * 0.85
      : 12;
    
    // Shadow styles for raised and pressed states
    const shadowStyles = {
      raised: {
        boxShadow: `
          ${highlightOffsetX}px ${highlightOffsetY}px ${shadowBlur}px rgba(255, 255, 255, ${designTokens.neumorphism.highlight.opacity}),
          ${shadowDarkOffsetX}px ${shadowDarkOffsetY}px ${shadowBlur}px rgba(0, 0, 0, ${designTokens.neumorphism.shadow.opacity})
        `,
      },
      pressed: {
        boxShadow: `
          inset 4px 4px ${insetShadowBlur}px rgba(0, 0, 0, ${designTokens.neumorphism.shadow.opacity}),
          inset -4px -4px ${insetShadowBlur}px rgba(255, 255, 255, 0.05)
        `,
      },
    };
    
    // Size configurations ensuring 44x44px minimum on touch devices
    const sizeStyles = {
      sm: {
        minWidth: isTouch ? '44px' : '32px',
        minHeight: isTouch ? '44px' : '32px',
        padding: '8px 16px',
        fontSize: '14px',
      },
      md: {
        minWidth: '44px', // Always meet 44px minimum
        minHeight: '44px',
        padding: '12px 24px',
        fontSize: '16px',
      },
      lg: {
        minWidth: '56px',
        minHeight: '56px',
        padding: '16px 32px',
        fontSize: '18px',
      },
    };
    
    // Background gradient using 145-degree angle
    const backgroundGradient = `linear-gradient(145deg, hsl(0, 0%, 18%), hsl(0, 0%, 12%))`;
    
    // Base styles
    const baseStyles = {
      borderRadius: '12px',
      background: backgroundGradient,
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: 600,
      color: 'hsl(0, 0%, 90%)',
      opacity: disabled ? 0.5 : 1,
      width: fullWidth ? '100%' : 'auto',
      ...sizeStyles[size],
      ...shadowStyles[variant],
      transition: prefersReducedMotion 
        ? 'none' 
        : `box-shadow ${designTokens.neumorphism.transition.hover}ms ease`,
    };
    
    // Spring physics configuration (stiffness 200-400, damping 15-30)
    const springConfig = {
      type: 'spring' as const,
      stiffness: 300, // Middle of 200-400 range
      damping: 20,    // Middle of 15-30 range
    };
    
    // Animation variants
    const motionProps: MotionProps = prefersReducedMotion 
      ? {} 
      : {
          whileHover: disabled 
            ? undefined 
            : { 
                scale: 1.02,
                boxShadow: variant === 'raised'
                  ? `
                      ${highlightOffsetX}px ${highlightOffsetY}px ${shadowBlur * 1.2}px rgba(255, 255, 255, ${designTokens.neumorphism.highlight.opacity * 1.2}),
                      ${shadowDarkOffsetX}px ${shadowDarkOffsetY}px ${shadowBlur * 1.2}px rgba(0, 0, 0, ${designTokens.neumorphism.shadow.opacity * 1.2})
                    `
                  : shadowStyles.pressed.boxShadow,
              },
          whileTap: disabled 
            ? undefined 
            : { 
                scale: 0.98,
                boxShadow: shadowStyles.pressed.boxShadow,
              },
          transition: springConfig,
        };
    
    return (
      <motion.button
        ref={ref}
        style={baseStyles}
        className={className}
        disabled={disabled}
        {...motionProps}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

NeumorphicButton.displayName = 'NeumorphicButton';
