/**
 * Property-based and unit tests for NeumorphicCard component
 *
 * Validates Properties 1-4 from the design specification:
 * - Gradient lightness constraint
 * - Neumorphism consistency (145° light source, opacity range)
 * - Surface contrast for depth perception
 * - Text contrast compliance
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import fc from 'fast-check';
import {
  NeumorphicCard,
  generateNeumorphicGradient,
  generateNeumorphicShadow,
  validateTextContrast,
  validateSurfaceContrast,
} from './NeumorphicCard';
import { designTokens } from '@/app/lib/design-tokens';
import { extractRgbaOpacities } from '@/app/lib/color-utils';
import { ResponsiveProvider } from '@/app/lib/responsive-manager';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div style={style} className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

const breakpoints = ['mobile', 'tablet', 'desktop'] as const;
const variants = ['raised', 'pressed'] as const;

describe('NeumorphicCard Component', () => {
  beforeEach(() => {
    window.innerWidth = 1920;
    window.innerHeight = 1080;
  });

  it('renders children correctly', () => {
    render(
      <ResponsiveProvider>
        <NeumorphicCard>
          <p>Card Content</p>
        </NeumorphicCard>
      </ResponsiveProvider>
    );

    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies raised variant with dual shadows', () => {
    const { container } = render(
      <ResponsiveProvider>
        <NeumorphicCard variant="raised">Content</NeumorphicCard>
      </ResponsiveProvider>
    );

    const card = container.firstChild as HTMLElement;
    expect(card.style.boxShadow).toContain('rgba(255, 255, 255');
    expect(card.style.boxShadow).toContain('rgba(0, 0, 0');
  });

  it('applies pressed variant with inset shadows', () => {
    const { container } = render(
      <ResponsiveProvider>
        <NeumorphicCard variant="pressed">Content</NeumorphicCard>
      </ResponsiveProvider>
    );

    const card = container.firstChild as HTMLElement;
    expect(card.style.boxShadow).toContain('inset');
  });
});

describe('NeumorphicCard Property Tests', () => {
  // Feature: modern-design-system-redesign, Property 1: Gradient Lightness Constraint
  it('should generate gradients with adjacent color stops differing by ≤10% lightness', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 360 }),
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 5, max: 90 }),
        (hue, saturation, lightness) => {
          const baseColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          const gradient = generateNeumorphicGradient(baseColor, 145);

          expect(gradient.angle).toBe(145);
          expect(gradient.colorStops).toHaveLength(3);

          for (let i = 1; i < gradient.colorStops.length; i++) {
            const diff = Math.abs(
              gradient.colorStops[i].lightness - gradient.colorStops[i - 1].lightness
            );
            expect(diff).toBeLessThanOrEqual(10);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: modern-design-system-redesign, Property 2: Neumorphism Consistency
  it('should maintain 145° light source and shadow opacity between 0.1 and 0.2', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...variants),
        fc.constantFrom(...breakpoints),
        (variant, breakpoint) => {
          expect(designTokens.neumorphism.lightSourceAngle).toBe(145);
          expect(designTokens.neumorphism.shadow.opacity).toBeGreaterThanOrEqual(0.1);
          expect(designTokens.neumorphism.shadow.opacity).toBeLessThanOrEqual(0.2);
          expect(designTokens.neumorphism.highlight.opacity).toBeGreaterThanOrEqual(0.1);
          expect(designTokens.neumorphism.highlight.opacity).toBeLessThanOrEqual(0.2);

          const shadow = generateNeumorphicShadow(variant, breakpoint);
          const opacities = extractRgbaOpacities(shadow);

          expect(opacities.length).toBeGreaterThan(0);
          opacities.forEach((opacity) => {
            expect(opacity).toBeGreaterThanOrEqual(0.1);
            expect(opacity).toBeLessThanOrEqual(0.2);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: modern-design-system-redesign, Property 3: Neumorphism Surface Contrast
  it('should maintain ≥1.5:1 contrast between component background and adjacent surface', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 360 }),
        fc.integer({ min: 0, max: 30 }),
        fc.integer({ min: 30, max: 75 }),
        fc.integer({ min: 15, max: 35 }),
        (hue, saturation, cardLightness, lightnessGap) => {
          const surfaceLightness = Math.max(0, cardLightness - lightnessGap);

          const cardColor = `hsl(${hue}, ${saturation}%, ${cardLightness}%)`;
          const surfaceColor = `hsl(${hue}, ${saturation}%, ${surfaceLightness}%)`;

          fc.pre(surfaceLightness >= 0);
          fc.pre(validateSurfaceContrast(cardColor, surfaceColor));

          const gradient = generateNeumorphicGradient(cardColor, 145);

          expect(
            validateSurfaceContrast(gradient.colorStops[1].color, surfaceColor)
          ).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: modern-design-system-redesign, Property 4: Neumorphism Text Contrast
  it('should maintain ≥4.5:1 contrast ratio for text on neumorphic backgrounds', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 85, max: 100 }),
        fc.integer({ min: 5, max: 25 }),
        (textLightness, bgLightness) => {
          const textColor = `hsl(0, 0%, ${textLightness}%)`;
          const bgColor = `hsl(0, 0%, ${bgLightness}%)`;

          expect(validateTextContrast(textColor, bgColor)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
