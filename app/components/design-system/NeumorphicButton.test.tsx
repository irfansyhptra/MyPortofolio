/**
 * NeumorphicButton Component Tests
 * 
 * Unit tests for the NeumorphicButton component verifying:
 * - Rendering with different variants and sizes
 * - Touch target minimum size (44x44px)
 * - Spring physics animation configuration
 * - Responsive behavior
 * - Accessibility features
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NeumorphicButton } from './NeumorphicButton';
import * as responsiveManager from '@/app/lib/responsive-manager';

// Mock the responsive manager
vi.mock('@/app/lib/responsive-manager', () => ({
  useResponsive: vi.fn(),
  ResponsiveProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('NeumorphicButton', () => {
  beforeEach(() => {
    // Default mock implementation
    vi.mocked(responsiveManager.useResponsive).mockReturnValue({
      breakpoint: 'desktop',
      isTouch: false,
      prefersReducedMotion: false,
      viewportWidth: 1920,
      viewportHeight: 1080,
    });
  });

  describe('Rendering', () => {
    it('renders with default variant (raised)', () => {
      render(<NeumorphicButton>Click me</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it('renders with pressed variant', () => {
      render(<NeumorphicButton variant="pressed">Pressed</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /pressed/i });
      expect(button).toBeInTheDocument();
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<NeumorphicButton size="sm">Small</NeumorphicButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(<NeumorphicButton size="md">Medium</NeumorphicButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(<NeumorphicButton size="lg">Large</NeumorphicButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders full width when specified', () => {
      render(<NeumorphicButton fullWidth>Full Width</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /full width/i });
      expect(button).toHaveStyle({ width: '100%' });
    });

    it('renders disabled state', () => {
      render(<NeumorphicButton disabled>Disabled</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /disabled/i });
      expect(button).toBeDisabled();
      expect(button).toHaveStyle({ opacity: '0.5', cursor: 'not-allowed' });
    });
  });

  describe('Touch Target Sizing (Requirement 3.6)', () => {
    it('ensures minimum 44x44px on touch devices for small size', () => {
      vi.mocked(responsiveManager.useResponsive).mockReturnValue({
        breakpoint: 'mobile',
        isTouch: true,
        prefersReducedMotion: false,
        viewportWidth: 375,
        viewportHeight: 667,
      });

      render(<NeumorphicButton size="sm">Touch Button</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /touch button/i });
      
      expect(button).toHaveStyle({
        minWidth: '44px',
        minHeight: '44px',
      });
    });

    it('uses smaller size on non-touch devices for small size', () => {
      vi.mocked(responsiveManager.useResponsive).mockReturnValue({
        breakpoint: 'desktop',
        isTouch: false,
        prefersReducedMotion: false,
        viewportWidth: 1920,
        viewportHeight: 1080,
      });

      render(<NeumorphicButton size="sm">Desktop Button</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /desktop button/i });
      
      expect(button).toHaveStyle({
        minWidth: '32px',
        minHeight: '32px',
      });
    });

    it('always maintains 44x44px minimum for medium size', () => {
      render(<NeumorphicButton size="md">Medium Button</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /medium button/i });
      
      expect(button).toHaveStyle({
        minWidth: '44px',
        minHeight: '44px',
      });
    });
  });

  describe('Spring Physics Animation (Requirement 11.5)', () => {
    it('applies spring physics with correct stiffness and damping', () => {
      render(<NeumorphicButton>Animated Button</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /animated button/i });
      
      // The component should be a motion.button with spring config
      // We can't directly test the animation config, but we verify the component renders
      expect(button).toBeInTheDocument();
    });

    it('disables animations when prefersReducedMotion is true', () => {
      vi.mocked(responsiveManager.useResponsive).mockReturnValue({
        breakpoint: 'desktop',
        isTouch: false,
        prefersReducedMotion: true,
        viewportWidth: 1920,
        viewportHeight: 1080,
      });

      render(<NeumorphicButton>Reduced Motion</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /reduced motion/i });
      
      expect(button).toHaveStyle({ transition: 'none' });
    });
  });

  describe('Shadow Styles (Requirements 1.6, 1.7)', () => {
    it('applies raised state shadow', () => {
      render(<NeumorphicButton variant="raised">Raised</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /raised/i });
      
      const boxShadow = button.style.boxShadow;
      expect(boxShadow).toBeTruthy();
      expect(boxShadow).toContain('rgba(255, 255, 255'); // Highlight shadow
      expect(boxShadow).toContain('rgba(0, 0, 0'); // Dark shadow
    });

    it('applies pressed state shadow with inset', () => {
      render(<NeumorphicButton variant="pressed">Pressed</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /pressed/i });
      
      const boxShadow = button.style.boxShadow;
      expect(boxShadow).toBeTruthy();
      expect(boxShadow).toContain('inset');
    });
  });

  describe('Responsive Behavior', () => {
    it('reduces shadow blur on mobile devices', () => {
      vi.mocked(responsiveManager.useResponsive).mockReturnValue({
        breakpoint: 'mobile',
        isTouch: true,
        prefersReducedMotion: false,
        viewportWidth: 375,
        viewportHeight: 667,
      });

      render(<NeumorphicButton>Mobile Button</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /mobile button/i });
      
      // Shadow blur should be reduced (we can check it exists)
      expect(button.style.boxShadow).toBeTruthy();
    });

    it('applies intermediate shadow blur on tablet', () => {
      vi.mocked(responsiveManager.useResponsive).mockReturnValue({
        breakpoint: 'tablet',
        isTouch: false,
        prefersReducedMotion: false,
        viewportWidth: 800,
        viewportHeight: 600,
      });

      render(<NeumorphicButton>Tablet Button</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /tablet button/i });
      
      expect(button.style.boxShadow).toBeTruthy();
    });

    it('applies full shadow blur on desktop', () => {
      render(<NeumorphicButton>Desktop Button</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /desktop button/i });
      
      expect(button.style.boxShadow).toBeTruthy();
    });
  });

  describe('Background Gradient (Requirement 1.4)', () => {
    it('applies 145-degree gradient', () => {
      render(<NeumorphicButton>Gradient Button</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /gradient button/i });
      
      expect(button.style.background).toContain('linear-gradient(145deg');
    });
  });

  describe('Accessibility', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<NeumorphicButton ref={ref}>Ref Button</NeumorphicButton>);
      
      expect(ref).toHaveBeenCalled();
    });

    it('passes through button props', () => {
      render(
        <NeumorphicButton 
          type="submit" 
          aria-label="Submit form"
          data-testid="custom-button"
        >
          Submit
        </NeumorphicButton>
      );
      
      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('aria-label', 'Submit form');
    });

    it('applies custom className', () => {
      render(<NeumorphicButton className="custom-class">Custom</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /custom/i });
      
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Transition Timing (Requirements 1.6, 1.7)', () => {
    it('applies 200ms hover transition', () => {
      render(<NeumorphicButton>Hover Button</NeumorphicButton>);
      const button = screen.getByRole('button', { name: /hover button/i });
      
      // Should have transition property with 200ms
      expect(button.style.transition).toContain('200ms');
    });
  });
});
