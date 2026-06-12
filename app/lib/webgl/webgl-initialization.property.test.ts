import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import {
  WEBGL_INITIALIZATION_TIMEOUT_MS,
  shouldShowWebGLFallback,
} from './initialization-state';
import {
  WEBGL_LOD_DEGRADATION_DELAY_MS,
  WEBGL_MIN_FPS,
  getLODQualityState,
} from './quality-controller';

describe('WebGL initialization properties', () => {
  it('Property 11: reduces LOD when FPS stays below 30 for more than 500ms', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: WEBGL_MIN_FPS - 1 }),
        fc.integer({ min: WEBGL_LOD_DEGRADATION_DELAY_MS + 1, max: 60_000 }),
        (fps, belowThresholdDurationMs) => {
          const quality = getLODQualityState({ fps, belowThresholdDurationMs });

          expect(quality.shouldReduceLOD).toBe(true);
          expect(
            quality.polygonRatio < 1 || quality.textureRatio < 1
          ).toBe(true);
        }
      )
    );
  });

  it('Property 11 guard: keeps full LOD when FPS or duration has not crossed the threshold', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.record({
            fps: fc.integer({ min: WEBGL_MIN_FPS, max: 240 }),
            belowThresholdDurationMs: fc.integer({ min: 0, max: 60_000 }),
          }),
          fc.record({
            fps: fc.integer({ min: 0, max: WEBGL_MIN_FPS - 1 }),
            belowThresholdDurationMs: fc.integer({
              min: 0,
              max: WEBGL_LOD_DEGRADATION_DELAY_MS,
            }),
          })
        ),
        scenario => {
          const quality = getLODQualityState(scenario);

          expect(quality.shouldReduceLOD).toBe(false);
          expect(quality.polygonRatio).toBe(1);
          expect(quality.textureRatio).toBe(1);
        }
      )
    );
  });

  it('Property 12: shows fallback for any initialization failure scenario', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 60_000 }), elapsedMs => {
        expect(
          shouldShowWebGLFallback({
            elapsedMs,
            initialized: false,
            failed: true,
          })
        ).toBe(true);
      })
    );
  });

  it('Property 13: shows fallback for any initialization timeout exceeding 5000ms', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: WEBGL_INITIALIZATION_TIMEOUT_MS + 1, max: 60_000 }),
        elapsedMs => {
          expect(
            shouldShowWebGLFallback({
              elapsedMs,
              initialized: false,
              failed: false,
            })
          ).toBe(true);
        }
      )
    );
  });

  it('Property 13 guard: never replaces an initialized scene with timeout fallback', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 60_000 }), elapsedMs => {
        expect(
          shouldShowWebGLFallback({
            elapsedMs,
            initialized: true,
            failed: false,
          })
        ).toBe(false);
      })
    );
  });
});
