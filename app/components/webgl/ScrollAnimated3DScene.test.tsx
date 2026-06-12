import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollAnimated3DScene } from './ScrollAnimated3DScene';

const frameCallbacks = vi.hoisted(
  () => [] as Array<(state: unknown, delta: number) => void>
);

vi.mock('@react-three/fiber', () => ({
  useFrame: (callback: (state: unknown, delta: number) => void) => {
    frameCallbacks.push(callback);
  },
}));

describe('ScrollAnimated3DScene', () => {
  beforeEach(() => {
    frameCallbacks.length = 0;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      callback(performance.now());
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children inside the scroll animated scene group', () => {
    render(
      <ScrollAnimated3DScene>
        <mesh data-testid="model-mesh" />
      </ScrollAnimated3DScene>
    );

    expect(screen.getByTestId('scroll-animated-3d-scene')).toBeInTheDocument();
    expect(screen.getByTestId('model-mesh')).toBeInTheDocument();
  });

  it('integrates ScrollSync3D metrics and emits active transform at 20% visibility', () => {
    const onScrollTransform = vi.fn();

    render(
      <ScrollAnimated3DScene
        metricsProvider={() => ({
          elementTop: 80,
          elementHeight: 100,
          viewportHeight: 100,
        })}
        onScrollTransform={onScrollTransform}
      >
        <mesh />
      </ScrollAnimated3DScene>
    );

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(onScrollTransform).toHaveBeenCalledWith(
      expect.objectContaining({
        active: true,
        visibleRatio: 0.2,
      })
    );
  });

  it('reports reduced performance state when frame rate stays below 30 FPS for more than 500ms', () => {
    const onPerformanceChange = vi.fn();

    render(
      <ScrollAnimated3DScene particleCount={80} onPerformanceChange={onPerformanceChange}>
        <mesh />
      </ScrollAnimated3DScene>
    );

    act(() => {
      for (const callback of frameCallbacks) {
        callback({}, 0.6);
      }
    });

    expect(onPerformanceChange).toHaveBeenCalledWith(
      expect.objectContaining({
        reduced: true,
        particleCount: 40,
        secondaryEffectsEnabled: false,
      })
    );
  });
});
