import * as THREE from 'three';
import { describe, expect, it, vi } from 'vitest';
import fc from 'fast-check';
import {
  DEFAULT_MODEL_LOD_LEVELS,
  ModelLoader,
  getDistanceLODState,
  getModelFormat,
  normalizeLODLevels,
} from './model-loader';

describe('ModelLoader', () => {
  it('detects supported glTF and USD model formats', () => {
    expect(getModelFormat('/models/project.gltf')).toBe('gltf');
    expect(getModelFormat('/models/project.glb?version=1')).toBe('glb');
    expect(getModelFormat('/models/project.usd')).toBe('usd');
    expect(getModelFormat('/models/project.usda')).toBe('usda');
    expect(getModelFormat('/models/project.usdc')).toBe('usdc');
    expect(getModelFormat('/models/project.usdz#preview')).toBe('usdz');
    expect(() => getModelFormat('/models/project.obj')).toThrow(
      'Unsupported 3D model format'
    );
  });

  it('caches model loads by URL and format', async () => {
    const scene = new THREE.Group();
    const loadAsync = vi.fn().mockResolvedValue({ scene });
    const loader = new ModelLoader({
      gltfLoaderFactory: () => ({ loadAsync }),
    });

    const [first, second] = await Promise.all([
      loader.load('/models/project.glb'),
      loader.load('/models/project.glb'),
    ]);

    expect(first).toBe(second);
    expect(first.scene).toBe(scene);
    expect(loader.getCacheSize()).toBe(1);
    expect(loadAsync).toHaveBeenCalledTimes(1);
  });

  it('loads USD formats through the USD loader path', async () => {
    const group = new THREE.Group();
    const loadAsync = vi.fn().mockResolvedValue(group);
    const loader = new ModelLoader({
      usdLoaderFactory: () => ({ loadAsync }),
    });

    const model = await loader.load('/models/product.usdz', { distance: 30 });

    expect(model.format).toBe('usdz');
    expect(model.scene).toBe(group);
    expect(model.lod.polygonRatio).toBeLessThan(1);
    expect(loadAsync).toHaveBeenCalledWith('/models/product.usdz');
  });

  it('normalizes LOD levels and applies stronger reduction at larger distances', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 200, noNaN: true }),
        fc.double({ min: 0, max: 200, noNaN: true }),
        (firstDistance, secondDistance) => {
          const nearDistance = Math.min(firstDistance, secondDistance);
          const farDistance = Math.max(firstDistance, secondDistance);
          const near = getDistanceLODState(nearDistance);
          const far = getDistanceLODState(farDistance);

          expect(far.polygonRatio).toBeLessThanOrEqual(near.polygonRatio);
          expect(far.textureRatio).toBeLessThanOrEqual(near.textureRatio);
        }
      )
    );
  });

  it('falls back to default LOD levels when no valid levels are supplied', () => {
    expect(normalizeLODLevels([])).toEqual(DEFAULT_MODEL_LOD_LEVELS);
  });
});
