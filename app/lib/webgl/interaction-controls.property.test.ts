import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import {
  AUTO_RESET_DELAY_MS,
  HOVER_HIGHLIGHT_DELAY_MS,
  MAX_DRAG_ROTATION_DEG_PER_PX,
  MAX_MODEL_SCALE,
  MIN_DRAG_ROTATION_DEG_PER_PX,
  MIN_MODEL_SCALE,
  calculateDragRotation,
  calculatePinchScale,
  getInteractionIndicators,
  shouldApplyHoverHighlight,
  shouldAutoReset,
} from './interaction-controls';

describe('Interactive model control properties', () => {
  it('Property 17: drag rotation rate stays between 0.5 and 2.0 degrees per pixel', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -2000, max: 2000 }).filter(delta => delta !== 0),
        fc.integer({ min: -2000, max: 2000 }).filter(delta => delta !== 0),
        fc.double({ min: -10, max: 10, noNaN: true, noDefaultInfinity: true }),
        (deltaX, deltaY, requestedRate) => {
          const rotation = calculateDragRotation({
            deltaX,
            deltaY,
            rateDegPerPixel: requestedRate,
          });

          expect(rotation.rateDegPerPixel).toBeGreaterThanOrEqual(
            MIN_DRAG_ROTATION_DEG_PER_PX
          );
          expect(rotation.rateDegPerPixel).toBeLessThanOrEqual(
            MAX_DRAG_ROTATION_DEG_PER_PX
          );
          expect(Math.abs(rotation.rotationYDeltaDeg / deltaX)).toBeCloseTo(
            rotation.rateDegPerPixel
          );
          expect(Math.abs(rotation.rotationXDeltaDeg / deltaY)).toBeCloseTo(
            rotation.rateDegPerPixel
          );
        }
      )
    );
  });

  it('Property 18: pinch scaling is proportional and bounded to 0.5x-3.0x', () => {
    fc.assert(
      fc.property(
        fc.double({ min: MIN_MODEL_SCALE, max: MAX_MODEL_SCALE, noNaN: true }),
        fc.double({ min: 1, max: 2000, noNaN: true }),
        fc.double({ min: 1, max: 5000, noNaN: true }),
        (initialScale, initialDistance, currentDistance) => {
          const pinch = calculatePinchScale({
            initialScale,
            initialDistance,
            currentDistance,
          });

          expect(pinch.unclampedScale).toBeCloseTo(
            initialScale * (currentDistance / initialDistance)
          );
          expect(pinch.scale).toBeGreaterThanOrEqual(MIN_MODEL_SCALE);
          expect(pinch.scale).toBeLessThanOrEqual(MAX_MODEL_SCALE);
        }
      )
    );
  });

  it('Property 19: scale boundaries clamp and return boundary feedback', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 2000, noNaN: true }),
        fc.double({ min: 0.001, max: 0.49, noNaN: true }),
        fc.double({ min: 3.01, max: 12, noNaN: true }),
        (initialDistance, tooSmallScale, tooLargeScale) => {
          const minBoundary = calculatePinchScale({
            initialScale: 1,
            initialDistance,
            currentDistance: initialDistance * tooSmallScale,
          });
          const maxBoundary = calculatePinchScale({
            initialScale: 1,
            initialDistance,
            currentDistance: initialDistance * tooLargeScale,
          });

          expect(minBoundary.scale).toBe(MIN_MODEL_SCALE);
          expect(minBoundary.boundaryFeedback).toBe('min-scale');
          expect(maxBoundary.scale).toBe(MAX_MODEL_SCALE);
          expect(maxBoundary.boundaryFeedback).toBe('max-scale');
        }
      )
    );
  });

  it('Property 20: interaction indicators are always present and labeled', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const indicators = getInteractionIndicators();
        const indicatorIds = indicators.map(indicator => indicator.id);

        expect(indicatorIds).toContain('rotate');
        expect(indicatorIds).toContain('zoom');
        expect(indicatorIds).toContain('reset');
        expect(indicators.every(indicator => indicator.ariaLabel.length > 0)).toBe(true);
      })
    );
  });

  it('applies hover highlight and auto-reset only after their required delays', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 10_000 }), elapsedMs => {
        expect(shouldApplyHoverHighlight(elapsedMs)).toBe(
          elapsedMs >= HOVER_HIGHLIGHT_DELAY_MS
        );
        expect(shouldAutoReset(elapsedMs)).toBe(elapsedMs >= AUTO_RESET_DELAY_MS);
      })
    );
  });
});
