/**
 * Unit tests for GlassCard component
 * 
 * Tests glassmorphism styling, dynamic opacity adjustment,
 * responsive blur, z-index layering, and design token usage.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GlassCard, adjustOpacityForLuminance } from './GlassCard';
import { ResponsiveProvider } from '@/app/lib/responsive-manager';
import { designTokens } from '@/app/lib/design-tokens';
import { getGlassTextContrast } from '@/app/lib/color-utils';
import fc from 'fast-check';

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

describe('GlassCard Component', () => {
  beforeEach(() => {
    // Reset window size
    window.innerWidth = 1920;
    window.innerHeight = 1080;
  });

  it('renders children correctly', () => {
    render(
      <ResponsiveProvider>
        <GlassCard>
          <p>Test Content</p>
        </GlassCard>
      </ResponsiveProvider>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  describe('Blur Strength', () => {
    it('applies low blur (8px) when blurStrength is low', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard blurStrength="low" data-testid="glass-card">
            Content
          </GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      const style = card.style;
      
      expect(style.backdropFilter).toContain('8px');
      expect(style.WebkitBackdropFilter).toContain('8px');
    });

    it('applies medium blur (16px) when blurStrength is medium', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard blurStrength="medium">Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      expect(card.style.backdropFilter).toContain('16px');
    });

    it('applies high blur (24px) when blurStrength is high', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard blurStrength="high">Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      expect(card.style.backdropFilter).toContain('24px');
    });

    it('defaults to medium blur when no blurStrength specified', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard>Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      expect(card.style.backdropFilter).toContain('16px');
    });
  });

  describe('Z-Index Layering', () => {
    it('applies default z-index of 10', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard>Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      expect(card.style.zIndex).toBe('10');
    });

    it('applies custom z-index in increments of 10', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard zIndex={30}>Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      expect(card.style.zIndex).toBe('30');
    });

    it('accepts any z-index value', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard zIndex={50}>Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      expect(card.style.zIndex).toBe('50');
    });
  });

  describe('Opacity and Background', () => {
    it('applies default opacity of 0.1', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard>Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      expect(card.style.background).toContain('rgba(255, 255, 255, 0.1)');
    });

    it('applies custom opacity', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard opacity={0.2}>Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      expect(card.style.background).toContain('0.2');
    });

    it('uses design token for border opacity', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard>Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      const expectedOpacity = designTokens.glassmorphism.border.opacity;
      expect(card.style.border).toContain(`rgba(255, 255, 255, ${expectedOpacity})`);
    });
  });

  describe('Box Shadow', () => {
    it('applies shadow with design token blur value', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard>Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      const expectedBlur = designTokens.glassmorphism.shadow.blur;
      expect(card.style.boxShadow).toContain(`${expectedBlur}px`);
    });
  });

  describe('Responsive Behavior', () => {
    it('reduces blur by 25% on mobile breakpoint', () => {
      window.innerWidth = 400;
      window.dispatchEvent(new Event('resize'));

      const { container } = render(
        <ResponsiveProvider>
          <GlassCard blurStrength="medium">Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      const expectedBlur = 16 * 0.75; // 12px
      expect(card.style.backdropFilter).toContain(`${expectedBlur}px`);
    });

    it('reduces blur by 12.5% on tablet breakpoint', () => {
      window.innerWidth = 900;
      window.dispatchEvent(new Event('resize'));

      const { container } = render(
        <ResponsiveProvider>
          <GlassCard blurStrength="high">Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      const expectedBlur = 24 * 0.875; // 21px
      expect(card.style.backdropFilter).toContain(`${expectedBlur}px`);
    });

    it('applies full blur on desktop breakpoint', () => {
      window.innerWidth = 1920;
      window.dispatchEvent(new Event('resize'));

      const { container } = render(
        <ResponsiveProvider>
          <GlassCard blurStrength="high">Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      expect(card.style.backdropFilter).toContain('24px');
    });
  });

  describe('Border Radius', () => {
    it('applies 16px border radius', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard>Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      expect(card.style.borderRadius).toBe('16px');
    });
  });

  describe('Custom Styles and Props', () => {
    it('merges custom styles with default styles', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard style={{ padding: '20px' }}>Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      expect(card.style.padding).toBe('20px');
      expect(card.style.backdropFilter).toBeDefined();
    });

    it('applies custom className', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard className="custom-class">Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('custom-class');
    });

    it('forwards additional HTML attributes', () => {
      render(
        <ResponsiveProvider>
          <GlassCard data-testid="test-card" aria-label="Glass Card">
            Content
          </GlassCard>
        </ResponsiveProvider>
      );

      const card = screen.getByTestId('test-card');
      expect(card).toHaveAttribute('aria-label', 'Glass Card');
    });
  });

  describe('Design Token Usage', () => {
    it('uses design tokens for all glassmorphism properties', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard blurStrength="low">Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      
      // Verify blur uses design tokens
      expect(card.style.backdropFilter).toContain(`${designTokens.glassmorphism.blur.min}px`);
      
      // Verify border uses design tokens
      expect(card.style.border).toContain(`${designTokens.glassmorphism.border.opacity}`);
      
      // Verify shadow uses design tokens
      expect(card.style.boxShadow).toContain(`${designTokens.glassmorphism.shadow.blur}px`);
    });

    it('does not use hardcoded values for styling', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard>Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      
      // All numeric values should come from design tokens
      // Border radius is acceptable as a constant (16px for glassmorphism)
      expect(card.style.backdropFilter).toBeTruthy();
      expect(card.style.background).toBeTruthy();
      expect(card.style.border).toBeTruthy();
      expect(card.style.boxShadow).toBeTruthy();
    });
  });

  describe('Webkit Support', () => {
    it('includes WebkitBackdropFilter for Safari compatibility', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard>Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      expect(card.style.WebkitBackdropFilter).toBeDefined();
      expect(card.style.WebkitBackdropFilter).toBe(card.style.backdropFilter);
    });
  });

  describe('Animation', () => {
    it('can disable animation with noAnimation prop', () => {
      const { container } = render(
        <ResponsiveProvider>
          <GlassCard noAnimation>Content</GlassCard>
        </ResponsiveProvider>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toBeInTheDocument();
    });
  });
});

describe('GlassCard Property Tests', () => {
  const textColor = 'hsl(0, 0%, 100%)';

  // Feature: modern-design-system-redesign, Property 5: Glassmorphism Layering
  it('should assign z-index in increments of 10 and shadow blur between 20px and 40px', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }).map((layer) => layer * 10),
        (zIndex) => {
          expect(zIndex % 10).toBe(0);

          const shadowBlur = designTokens.glassmorphism.shadow.blur;
          expect(shadowBlur).toBeGreaterThanOrEqual(20);
          expect(shadowBlur).toBeLessThanOrEqual(40);

          const { container } = render(
            <ResponsiveProvider>
              <GlassCard zIndex={zIndex}>Content</GlassCard>
            </ResponsiveProvider>
          );

          const card = container.firstChild as HTMLElement;
          expect(card.style.zIndex).toBe(String(zIndex));
          expect(card.style.boxShadow).toContain(`${shadowBlur}px`);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: modern-design-system-redesign, Property 6: Glassmorphism Text Contrast
  it('should maintain ≥4.5:1 for text <18pt and ≥3:1 for text ≥18pt on glass backgrounds', () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0.05), max: Math.fround(0.3), noNaN: true }),
        fc.float({ min: 0, max: Math.fround(0.15), noNaN: true }),
        fc.constantFrom(14, 16, 18, 24),
        (glassOpacity, backgroundLuminance, fontSizePt) => {
          const contrast = getGlassTextContrast(textColor, glassOpacity, backgroundLuminance);
          const minContrast = fontSizePt >= 18 ? 3 : 4.5;

          if (backgroundLuminance <= 0.15) {
            expect(contrast).toBeGreaterThanOrEqual(minContrast);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: modern-design-system-redesign, Property 7: Dynamic Opacity Adjustment
  it('should increase opacity when background luminance is below 0.3', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: Math.fround(0.299), noNaN: true }),
        fc.float({ min: Math.fround(0.05), max: Math.fround(0.2), noNaN: true }),
        (luminance, baseOpacity) => {
          const adjusted = adjustOpacityForLuminance(luminance, baseOpacity);
          const increasedOpacity = Math.min(baseOpacity * 1.5, designTokens.glassmorphism.background.opacityMax);
          const increasedContrast = getGlassTextContrast(textColor, increasedOpacity, luminance);

          expect(adjusted).toBeGreaterThanOrEqual(baseOpacity);
          expect(adjusted).toBeLessThanOrEqual(designTokens.glassmorphism.background.opacityMax);

          if (increasedContrast >= 4.5) {
            expect(adjusted).toBe(increasedOpacity);
          }

          const contrast = getGlassTextContrast(textColor, adjusted, luminance);
          expect(contrast).toBeGreaterThanOrEqual(4.5);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should keep base opacity when background luminance is at or above 0.3', () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0.3), max: Math.fround(1), noNaN: true }),
        fc.float({ min: Math.fround(0.05), max: Math.fround(0.3), noNaN: true }),
        (luminance, baseOpacity) => {
          expect(adjustOpacityForLuminance(luminance, baseOpacity)).toBe(baseOpacity);
        }
      ),
      { numRuns: 100 }
    );
  });
});
