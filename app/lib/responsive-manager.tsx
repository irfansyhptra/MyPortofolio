/**
 * Responsive Design Manager
 * 
 * This module provides a React context for managing responsive breakpoints,
 * touch detection, and reduced motion preferences. It tracks viewport changes
 * and provides this information to all components in the application.
 * 
 * Requirements: 12.1, 12.2, 3.10
 */

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { designTokens } from './design-tokens';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveContextValue {
  breakpoint: Breakpoint;
  isTouch: boolean;
  prefersReducedMotion: boolean;
  viewportWidth: number;
  viewportHeight: number;
}

const ResponsiveContext = createContext<ResponsiveContextValue | undefined>(undefined);

export interface ResponsiveProviderProps {
  children: ReactNode;
}

/**
 * ResponsiveProvider Component
 * 
 * Wraps the application and provides responsive context information to all
 * child components. This includes:
 * - Current breakpoint (mobile/tablet/desktop)
 * - Touch device detection
 * - Reduced motion preference
 * - Viewport dimensions
 */
export function ResponsiveProvider({ children }: ResponsiveProviderProps) {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');
  const [isTouch, setIsTouch] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1920);
  const [viewportHeight, setViewportHeight] = useState(1080);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    /**
     * Updates the current breakpoint based on viewport width
     * Requirements: 3.1, 3.2, 3.3
     */
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      setViewportHeight(window.innerHeight);

      if (width < designTokens.breakpoints.mobile) {
        setBreakpoint('mobile');
      } else if (width < designTokens.breakpoints.tablet) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    /**
     * Checks if the device supports touch input
     * Requirements: 3.6, 3.10
     */
    const checkTouch = () => {
      // Check for coarse pointer (touch device)
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      // Check for no hover capability (typically touch devices)
      const hasNoHover = window.matchMedia('(hover: none)').matches;
      // Check for touch points
      const hasTouchPoints = 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0;

      setIsTouch(hasCoarsePointer || hasNoHover || hasTouchPoints);
    };

    /**
     * Checks if user prefers reduced motion
     * Requirements: 14.2
     */
    const checkMotion = () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setPrefersReducedMotion(prefersReduced);
    };

    // Initial setup
    updateBreakpoint();
    checkTouch();
    checkMotion();

    // Set up event listeners
    window.addEventListener('resize', updateBreakpoint);
    
    // Listen for media query changes
    const touchMediaQuery = window.matchMedia('(pointer: coarse)');
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleTouchChange = (e: MediaQueryListEvent) => {
      const hasCoarsePointer = e.matches;
      const hasNoHover = window.matchMedia('(hover: none)').matches;
      const hasTouchPoints = 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0;
      setIsTouch(hasCoarsePointer || hasNoHover || hasTouchPoints);
    };
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    // Add listeners for media query changes
    if (touchMediaQuery.addEventListener) {
      touchMediaQuery.addEventListener('change', handleTouchChange);
      motionMediaQuery.addEventListener('change', handleMotionChange);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateBreakpoint);
      if (touchMediaQuery.removeEventListener) {
        touchMediaQuery.removeEventListener('change', handleTouchChange);
        motionMediaQuery.removeEventListener('change', handleMotionChange);
      }
    };
  }, []);

  return (
    <ResponsiveContext.Provider
      value={{
        breakpoint,
        isTouch,
        prefersReducedMotion,
        viewportWidth,
        viewportHeight,
      }}
    >
      {children}
    </ResponsiveContext.Provider>
  );
}

/**
 * Hook to access responsive context
 * 
 * Usage:
 * ```tsx
 * const { breakpoint, isTouch, prefersReducedMotion } = useResponsive();
 * ```
 */
export function useResponsive(): ResponsiveContextValue {
  const context = useContext(ResponsiveContext);
  
  if (context === undefined) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  
  return context;
}

/**
 * Helper hooks for specific responsive features
 */

export function useBreakpoint(): Breakpoint {
  const { breakpoint } = useResponsive();
  return breakpoint;
}

export function useIsTouch(): boolean {
  const { isTouch } = useResponsive();
  return isTouch;
}

export function usePrefersReducedMotion(): boolean {
  const { prefersReducedMotion } = useResponsive();
  return prefersReducedMotion;
}

export function useViewportSize(): { width: number; height: number } {
  const { viewportWidth, viewportHeight } = useResponsive();
  return { width: viewportWidth, height: viewportHeight };
}

/**
 * Helper function to get adjusted shadow/blur values based on breakpoint
 * Requirements: 3.1
 */
export function getAdjustedBlur(baseBlur: number, breakpoint: Breakpoint): number {
  switch (breakpoint) {
    case 'mobile':
      return baseBlur * 0.75; // 25% reduction for glassmorphism
    case 'tablet':
      return baseBlur * 0.875; // 12.5% reduction (intermediate)
    case 'desktop':
    default:
      return baseBlur;
  }
}

/**
 * Helper function to get adjusted shadow blur for neumorphism based on breakpoint
 * Requirements: 3.1
 */
export function getAdjustedShadowBlur(baseShadowBlur: number, breakpoint: Breakpoint): number {
  switch (breakpoint) {
    case 'mobile':
      return baseShadowBlur * 0.7; // 30% reduction for neumorphism
    case 'tablet':
      return baseShadowBlur * 0.85; // 15% reduction (intermediate)
    case 'desktop':
    default:
      return baseShadowBlur;
  }
}
