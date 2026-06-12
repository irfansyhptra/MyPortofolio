import { beforeEach, describe, expect, it, vi } from 'vitest';
import type * as THREE from 'three';
import {
  WebGLSceneManager,
  detectWebGLSupport,
  getCappedPixelRatio,
  shouldUseAntialias,
} from './scene-manager';

function createCanvas(width = 640, height = 360): HTMLCanvasElement {
  const canvas = document.createElement('canvas');

  Object.defineProperty(canvas, 'clientWidth', {
    configurable: true,
    value: width,
  });
  Object.defineProperty(canvas, 'clientHeight', {
    configurable: true,
    value: height,
  });

  return canvas;
}

function mockWebGLContext(canvas: HTMLCanvasElement, available = true) {
  return vi.spyOn(canvas, 'getContext').mockImplementation(((contextType: string) => {
    if (available && contextType === 'webgl2') {
      return {};
    }

    return null;
  }) as HTMLCanvasElement['getContext']);
}

function createRendererMock() {
  return {
    setPixelRatio: vi.fn(),
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
  } as unknown as THREE.WebGLRenderer;
}

describe('WebGLSceneManager', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 1,
    });
  });

  it('detects WebGL support before renderer initialization', () => {
    const canvas = createCanvas();
    const getContext = mockWebGLContext(canvas, true);

    const result = detectWebGLSupport(canvas);

    expect(result).toEqual({
      supported: true,
      contextType: 'webgl2',
    });
    expect(getContext).toHaveBeenCalledWith('webgl2', undefined);
  });

  it('returns a graceful fallback result when WebGL is unavailable', async () => {
    const canvas = createCanvas();
    const logger = { error: vi.fn() };
    const rendererFactory = vi.fn(() => createRendererMock());
    mockWebGLContext(canvas, false);

    const manager = new WebGLSceneManager({ logger, rendererFactory });
    const initialized = await manager.initialize(canvas);

    expect(initialized).toBe(false);
    expect(manager.isInitialized()).toBe(false);
    expect(manager.getFallbackReason()).toBe('context-unavailable');
    expect(rendererFactory).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith('WebGL not supported');
  });

  it('caps pixel ratio to 2 and disables antialiasing at high density', async () => {
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 3,
    });

    const canvas = createCanvas(800, 450);
    const renderer = createRendererMock();
    const rendererFactory = vi.fn(() => renderer);
    mockWebGLContext(canvas, true);

    const manager = new WebGLSceneManager({ rendererFactory });
    const initialized = await manager.initialize(canvas);

    expect(initialized).toBe(true);
    expect(rendererFactory).toHaveBeenCalledWith(
      expect.objectContaining({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      })
    );
    expect(renderer.setPixelRatio).toHaveBeenCalledWith(2);
    expect(renderer.setSize).toHaveBeenCalledWith(800, 450, false);
  });

  it('renders only after successful initialization and disposes renderer resources', async () => {
    const canvas = createCanvas();
    const renderer = createRendererMock();
    mockWebGLContext(canvas, true);

    const manager = new WebGLSceneManager({
      rendererFactory: () => renderer,
    });

    expect(manager.render()).toBe(false);

    await manager.initialize(canvas);

    expect(manager.render()).toBe(true);
    expect(renderer.render).toHaveBeenCalledWith(manager.scene, manager.camera);

    manager.dispose();

    expect(renderer.dispose).toHaveBeenCalled();
    expect(manager.isInitialized()).toBe(false);
    expect(manager.getRenderer()).toBeNull();
  });

  it('exposes pure helpers for pixel ratio and antialias decisions', () => {
    expect(getCappedPixelRatio(-1)).toBe(1);
    expect(getCappedPixelRatio(1.5)).toBe(1.5);
    expect(getCappedPixelRatio(4)).toBe(2);
    expect(shouldUseAntialias(1)).toBe(true);
    expect(shouldUseAntialias(2)).toBe(false);
    expect(WebGLSceneManager.getPixelRatio(3)).toBe(2);
    expect(WebGLSceneManager.shouldUseAntialias(1)).toBe(true);
  });
});
