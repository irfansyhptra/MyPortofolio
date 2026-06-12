/**
 * Unit tests for GlassPanel component
 * 
 * Tests alternative glassmorphism component variant with blur strength presets,
 * fade-in animations, and responsive behavior.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GlassPanel } from './GlassPanel';
import { ResponsiveProvider } from '@/app/lib/responsive-manager';
import { designTokens } from '@/app/lib/design-tokens';

// Mock Framer Motion
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, style, className, ...props }: any) => (
      <div style={style} className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

describe('GlassPanel Component', () => {
  beforeEach(() => {
    // Reset window size
    window.innerWidth = 1920;
    window.innerHeight = 1080;
  });

  it('renders children correctly', () => {
    render(
      <ResponsiveProvider>
        <GlassPanel>
          <p>Panel Content</p>
        </GlassPanel>
      </ResponsiveProvider>
    );

    expect(screen.getByText('Panel Content')).toBeInTheDocument();
  });

  describe('Blur Strength Presets', () => {
    it('applies low blur preset (8px)', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel blurStrength="low">Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      expect(panel.style.backdropFilter).toContain('8px');
    });

    it('applies medium blur preset (16px) by default', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel>Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      expect(panel.style.backdropFilter).toContain('16px');
    });

    it('applies high blur preset (24px)', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel blurStrength="high">Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      expect(panel.style.backdropFilter).toContain('24px');
    });
  });

  describe('Opacity', () => {
    it('applies default opacity of 0.15', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel>Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      expect(panel.style.background).toContain('0.15');
    });

    it('applies custom opacity', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel opacity={0.25}>Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      expect(panel.style.background).toContain('0.25');
    });

    it('clamps opacity to minimum design token value', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel opacity={0.01}>Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      const minOpacity = designTokens.glassmorphism.background.opacityMin;
      expect(panel.style.background).toContain(`${minOpacity}`);
    });

    it('clamps opacity to maximum design token value', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel opacity={0.9}>Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      const maxOpacity = designTokens.glassmorphism.background.opacityMax;
      expect(panel.style.background).toContain(`${maxOpacity}`);
    });
  });

  describe('Responsive Behavior', () => {
    it('reduces blur by 25% on mobile', () => {
      window.innerWidth = 400;
      window.dispatchEvent(new Event('resize'));

      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel blurStrength="high">Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      const expectedBlur = 24 * 0.75; // 18px
      expect(panel.style.backdropFilter).toContain(`${expectedBlur}px`);
    });

    it('reduces blur by 12.5% on tablet', () => {
      window.innerWidth = 900;
      window.dispatchEvent(new Event('resize'));

      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel blurStrength="medium">Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      const expectedBlur = 16 * 0.875; // 14px
      expect(panel.style.backdropFilter).toContain(`${expectedBlur}px`);
    });

    it('applies full blur on desktop', () => {
      window.innerWidth = 1920;
      window.dispatchEvent(new Event('resize'));

      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel blurStrength="low">Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      expect(panel.style.backdropFilter).toContain('8px');
    });
  });

  describe('Border and Shadow', () => {
    it('applies border with design token opacity', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel>Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      const expectedOpacity = designTokens.glassmorphism.border.opacity;
      expect(panel.style.border).toContain(`rgba(255, 255, 255, ${expectedOpacity})`);
    });

    it('applies subtle box shadow', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel>Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      expect(panel.style.boxShadow).toContain('0 4px 16px');
    });
  });

  describe('Border Radius', () => {
    it('applies 12px border radius', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel>Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      expect(panel.style.borderRadius).toBe('12px');
    });
  });

  describe('Design Token Usage', () => {
    it('uses design tokens for blur values', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel blurStrength="low">Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      expect(panel.style.backdropFilter).toContain(`${designTokens.glassmorphism.blur.min}px`);
    });

    it('uses design tokens for opacity range', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel opacity={0.01}>Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      // Should be clamped to minimum
      expect(panel.style.background).toContain(`${designTokens.glassmorphism.background.opacityMin}`);
    });

    it('uses design tokens for border opacity', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel>Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      expect(panel.style.border).toContain(`${designTokens.glassmorphism.border.opacity}`);
    });
  });

  describe('Webkit Support', () => {
    it('includes WebkitBackdropFilter for Safari', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel>Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      expect(panel.style.WebkitBackdropFilter).toBeDefined();
      expect(panel.style.WebkitBackdropFilter).toBe(panel.style.backdropFilter);
    });
  });

  describe('Custom Styles and Props', () => {
    it('merges custom styles', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel style={{ margin: '10px' }}>Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      expect(panel.style.margin).toBe('10px');
      expect(panel.style.backdropFilter).toBeDefined();
    });

    it('applies custom className', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel className="custom-panel">Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      expect(panel.className).toContain('custom-panel');
    });

    it('forwards HTML attributes', () => {
      render(
        <ResponsiveProvider>
          <GlassPanel data-testid="test-panel" role="region">
            Content
          </GlassPanel>
        </ResponsiveProvider>
      );

      const panel = screen.getByTestId('test-panel');
      expect(panel).toHaveAttribute('role', 'region');
    });
  });

  describe('Animation Props', () => {
    it('can disable animation with noAnimation prop', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel noAnimation>Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      expect(panel).toBeInTheDocument();
    });

    it('accepts delay prop for animation timing', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel delay={0.3}>Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      expect(panel).toBeInTheDocument();
    });
  });

  describe('Comparison with GlassCard', () => {
    it('has simpler styling than GlassCard', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassPanel>Content</GlassPanel>
        </ResponsiveProvider>
      );

      const panel = container.firstChild as HTMLElement;
      
      // GlassPanel has simpler border radius (12px vs 16px)
      expect(panel.style.borderRadius).toBe('12px');
      
      // GlassPanel has simpler shadow (0 4px 16px vs 0 8px 30px)
      expect(panel.style.boxShadow).toContain('0 4px 16px');
    });

    it('provides preset-based blur configuration', () => {
      const { container: lowPanel } = render(
        <ResponsiveProvider>
          <GlassPanel blurStrength="low">Low</GlassPanel>
        </ResponsiveProvider>
      );

      const { container: highPanel } = render(
        <ResponsiveProvider>
          <GlassPanel blurStrength="high">High</GlassPanel>
        </ResponsiveProvider>
      );

      const low = lowPanel.firstChild as HTMLElement;
      const high = highPanel.firstChild as HTMLElement;

      expect(low.style.backdropFilter).toContain('8px');
      expect(high.style.backdropFilter).toContain('24px');
    });
  });
});
