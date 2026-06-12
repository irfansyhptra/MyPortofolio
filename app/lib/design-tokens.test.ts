import { describe, it, expect } from 'vitest';
import {
  designTokens,
  getSpacing,
  getBlur,
  getShadowLevel,
  cssVars,
} from './design-tokens';

describe('Design Tokens', () => {
  describe('Neumorphism Tokens', () => {
    it('should have correct light source angle', () => {
      expect(designTokens.neumorphism.lightSourceAngle).toBe(145);
    });

    it('should have shadow blur range between 10px and 30px', () => {
      expect(designTokens.neumorphism.shadow.blurMin).toBe(10);
      expect(designTokens.neumorphism.shadow.blurMax).toBe(30);
    });

    it('should have shadow spread range between -5px and 5px', () => {
      expect(designTokens.neumorphism.shadow.spreadMin).toBe(-5);
      expect(designTokens.neumorphism.shadow.spreadMax).toBe(5);
    });

    it('should have shadow opacity between 0.1 and 0.2', () => {
      expect(designTokens.neumorphism.shadow.opacity).toBeGreaterThanOrEqual(0.1);
      expect(designTokens.neumorphism.shadow.opacity).toBeLessThanOrEqual(0.2);
    });

    it('should have highlight opacity between 0.1 and 0.2', () => {
      expect(designTokens.neumorphism.highlight.opacity).toBeGreaterThanOrEqual(0.1);
      expect(designTokens.neumorphism.highlight.opacity).toBeLessThanOrEqual(0.2);
    });

    it('should have hover transition of 200ms', () => {
      expect(designTokens.neumorphism.transition.hover).toBe(200);
    });

    it('should have active transition of 100ms', () => {
      expect(designTokens.neumorphism.transition.active).toBe(100);
    });
  });

  describe('Glassmorphism Tokens', () => {
    it('should have background opacity range between 0.05 and 0.3', () => {
      expect(designTokens.glassmorphism.background.opacityMin).toBe(0.05);
      expect(designTokens.glassmorphism.background.opacityMax).toBe(0.3);
    });

    it('should have blur range between 8px and 24px', () => {
      expect(designTokens.glassmorphism.blur.min).toBe(8);
      expect(designTokens.glassmorphism.blur.max).toBe(24);
    });

    it('should have border opacity between 0.1 and 0.3', () => {
      expect(designTokens.glassmorphism.border.opacity).toBeGreaterThanOrEqual(0.1);
      expect(designTokens.glassmorphism.border.opacity).toBeLessThanOrEqual(0.3);
    });

    it('should have shadow blur between 20px and 40px', () => {
      expect(designTokens.glassmorphism.shadow.blur).toBeGreaterThanOrEqual(20);
      expect(designTokens.glassmorphism.shadow.blur).toBeLessThanOrEqual(40);
    });
  });

  describe('Breakpoints', () => {
    it('should have mobile breakpoint at 768px', () => {
      expect(designTokens.breakpoints.mobile).toBe(768);
    });

    it('should have tablet breakpoint at 1024px', () => {
      expect(designTokens.breakpoints.tablet).toBe(1024);
    });
  });

  describe('Spacing Scale', () => {
    it('should have spacing values from 0 to 96px', () => {
      expect(designTokens.spacing).toEqual([0, 4, 8, 12, 16, 24, 32, 48, 64, 96]);
    });

    it('should have spacing in 4px increments', () => {
      const spacing = designTokens.spacing;
      for (let i = 1; i < spacing.length; i++) {
        const diff = spacing[i] - spacing[i - 1];
        expect(diff).toBeGreaterThanOrEqual(4);
      }
    });
  });

  describe('Blur Scale', () => {
    it('should have blur values from 0 to 24px', () => {
      expect(designTokens.blur).toEqual([0, 4, 8, 12, 16, 20, 24]);
    });

    it('should have blur in 4px increments', () => {
      const blur = designTokens.blur;
      for (let i = 1; i < blur.length; i++) {
        const diff = blur[i] - blur[i - 1];
        expect(diff).toBe(4);
      }
    });
  });

  describe('Shadow Levels', () => {
    it('should have 4 shadow levels (0-3)', () => {
      expect(designTokens.shadowLevels).toHaveLength(4);
    });

    it('should have level 0 as none', () => {
      expect(designTokens.shadowLevels[0]).toBe('none');
    });
  });

  describe('Helper Functions', () => {
    describe('getSpacing', () => {
      it('should return correct spacing value for valid index', () => {
        expect(getSpacing(0)).toBe(0);
        expect(getSpacing(4)).toBe(16);
        expect(getSpacing(9)).toBe(96);
      });

      it('should return 0 and log error for invalid index', () => {
        expect(getSpacing(-1)).toBe(0);
        expect(getSpacing(100)).toBe(0);
      });
    });

    describe('getBlur', () => {
      it('should return correct blur value for valid index', () => {
        expect(getBlur(0)).toBe(0);
        expect(getBlur(3)).toBe(12);
        expect(getBlur(6)).toBe(24);
      });

      it('should return 0 and log error for invalid index', () => {
        expect(getBlur(-1)).toBe(0);
        expect(getBlur(100)).toBe(0);
      });
    });

    describe('getShadowLevel', () => {
      it('should return correct shadow for valid index', () => {
        expect(getShadowLevel(0)).toBe('none');
        expect(getShadowLevel(1)).toContain('rgba');
      });

      it('should return "none" and log error for invalid index', () => {
        expect(getShadowLevel(-1)).toBe('none');
        expect(getShadowLevel(100)).toBe('none');
      });
    });
  });

  describe('CSS Variable Names', () => {
    it('should provide correct neumorphism CSS variable names', () => {
      expect(cssVars.neuroLightSourceAngle).toBe('var(--neuro-light-source-angle)');
      expect(cssVars.neuroShadowOpacity).toBe('var(--neuro-shadow-opacity)');
    });

    it('should provide correct glassmorphism CSS variable names', () => {
      expect(cssVars.glassBgOpacityMin).toBe('var(--glass-bg-opacity-min)');
      expect(cssVars.glassBlurMax).toBe('var(--glass-blur-max)');
    });

    it('should generate correct spacing variable names', () => {
      expect(cssVars.space(0)).toBe('var(--space-0)');
      expect(cssVars.space(4)).toBe('var(--space-4)');
    });

    it('should generate correct blur variable names', () => {
      expect(cssVars.blur(0)).toBe('var(--blur-0)');
      expect(cssVars.blur(6)).toBe('var(--blur-6)');
    });

    it('should generate correct shadow variable names', () => {
      expect(cssVars.shadow(0)).toBe('var(--shadow-0)');
      expect(cssVars.shadow(3)).toBe('var(--shadow-3)');
    });
  });
});
