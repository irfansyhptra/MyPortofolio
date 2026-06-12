import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import {
  SCROLL_DEGRADE_DURATION_MS,
  SCROLL_DEGRADE_FPS,
  SCROLL_EASING_CONTROL_POINTS,
  SCROLL_RECOVERY_DURATION_MS,
  SCROLL_RECOVERY_FPS,
  SCROLL_REDUCED_PARTICLE_RATIO,
  getScrollPerformanceState,
  isValidScrollEasingControlPoints,
  mapScrollToProgress,
} from './scroll-sync-3d';

describe('ScrollSync3D properties', () => {
  it('Property 14: maps element viewport position linearly to 0-1 progress', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 4000, noNaN: true }),
        fc.double({ min: 1, max: 4000, noNaN: true }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        (viewportHeight, elementHeight, expectedProgress) => {
          const elementTop =
            viewportHeight - expectedProgress * (viewportHeight + elementHeight);
          const progress = mapScrollToProgress({
            elementTop,
            elementHeight,
            viewportHeight,
          });

          expect(progress).toBeCloseTo(expectedProgress, 6);
        }
      )
    );
  });

  it('Property 15: reduces particles by 50% and disables secondary effects after low FPS persists', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: SCROLL_DEGRADE_FPS - 1 }),
        fc.integer({ min: SCROLL_DEGRADE_DURATION_MS + 1, max: 60_000 }),
        (fps, lowFpsDurationMs) => {
          const state = getScrollPerformanceState({
            fps,
            lowFpsDurationMs,
            recoveryDurationMs: 0,
          });

          expect(state.reduced).toBe(true);
          expect(state.particleRatio).toBe(SCROLL_REDUCED_PARTICLE_RATIO);
          expect(state.secondaryEffectsEnabled).toBe(false);
        }
      )
    );
  });

  it('Property 16: restores full complexity after FPS recovers to 50+ for 2s', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: SCROLL_RECOVERY_FPS, max: 240 }),
        fc.integer({ min: SCROLL_RECOVERY_DURATION_MS, max: 60_000 }),
        (fps, recoveryDurationMs) => {
          const state = getScrollPerformanceState({
            fps,
            lowFpsDurationMs: 0,
            recoveryDurationMs,
            currentlyReduced: true,
          });

          expect(state.reduced).toBe(false);
          expect(state.particleRatio).toBe(1);
          expect(state.secondaryEffectsEnabled).toBe(true);
        }
      )
    );
  });

  it('uses cubic-bezier control points inside the required bounds', () => {
    expect(isValidScrollEasingControlPoints(SCROLL_EASING_CONTROL_POINTS)).toBe(true);
  });
});
