import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { USDLoader } from 'three/examples/jsm/loaders/USDLoader.js';

export type ModelFormat = 'gltf' | 'glb' | 'usd' | 'usda' | 'usdc' | 'usdz';

export interface LoadedModel {
  url: string;
  format: ModelFormat;
  scene: THREE.Group;
  source: GLTF | THREE.Group;
  lod: ModelLODState;
}

export interface ModelLODLevel {
  distance: number;
  polygonRatio: number;
  textureRatio: number;
}

export interface ModelLODState {
  distance: number;
  polygonRatio: number;
  textureRatio: number;
  level: ModelLODLevel;
}

export interface ModelLoaderOptions {
  manager?: THREE.LoadingManager;
  gltfLoaderFactory?: () => Pick<GLTFLoader, 'loadAsync'>;
  usdLoaderFactory?: () => Pick<USDLoader, 'loadAsync'>;
  lodLevels?: ModelLODLevel[];
}

export interface LoadModelOptions {
  format?: ModelFormat;
  distance?: number;
  lodLevels?: ModelLODLevel[];
  cacheKey?: string;
}

export const DEFAULT_MODEL_LOD_LEVELS: ModelLODLevel[] = [
  { distance: 0, polygonRatio: 1, textureRatio: 1 },
  { distance: 15, polygonRatio: 0.75, textureRatio: 0.75 },
  { distance: 30, polygonRatio: 0.5, textureRatio: 0.5 },
  { distance: 60, polygonRatio: 0.25, textureRatio: 0.25 },
];

export class ModelLoader {
  private readonly gltfLoaderFactory: () => Pick<GLTFLoader, 'loadAsync'>;
  private readonly usdLoaderFactory: () => Pick<USDLoader, 'loadAsync'>;
  private readonly lodLevels: ModelLODLevel[];
  private readonly cache = new Map<string, Promise<LoadedModel>>();

  constructor(options: ModelLoaderOptions = {}) {
    const { manager, lodLevels = DEFAULT_MODEL_LOD_LEVELS } = options;

    this.gltfLoaderFactory =
      options.gltfLoaderFactory ?? (() => new GLTFLoader(manager));
    this.usdLoaderFactory =
      options.usdLoaderFactory ?? (() => new USDLoader(manager));
    this.lodLevels = normalizeLODLevels(lodLevels);
  }

  load(url: string, options: LoadModelOptions = {}): Promise<LoadedModel> {
    const format = options.format ?? getModelFormat(url);
    const cacheKey = options.cacheKey ?? `${format}:${url}`;
    const cachedModel = this.cache.get(cacheKey);

    if (cachedModel) {
      return cachedModel;
    }

    const modelPromise = this.loadUncached(url, format, options);
    this.cache.set(cacheKey, modelPromise);
    return modelPromise;
  }

  clearCache(url?: string): void {
    if (!url) {
      this.cache.clear();
      return;
    }

    for (const cacheKey of this.cache.keys()) {
      if (cacheKey.endsWith(`:${url}`)) {
        this.cache.delete(cacheKey);
      }
    }
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  private async loadUncached(
    url: string,
    format: ModelFormat,
    options: LoadModelOptions
  ): Promise<LoadedModel> {
    const source = await this.loadSource(url, format);
    const scene = getSceneFromModelSource(source);
    const lod = getDistanceLODState(options.distance ?? 0, options.lodLevels ?? this.lodLevels);

    applyLODMetadata(scene, lod);

    return {
      url,
      format,
      scene,
      source,
      lod,
    };
  }

  private async loadSource(url: string, format: ModelFormat): Promise<GLTF | THREE.Group> {
    if (format === 'gltf' || format === 'glb') {
      return this.gltfLoaderFactory().loadAsync(url);
    }

    return this.usdLoaderFactory().loadAsync(url);
  }
}

export function getModelFormat(url: string): ModelFormat {
  const cleanUrl = url.split('?')[0]?.split('#')[0] ?? url;
  const extension = cleanUrl.split('.').pop()?.toLowerCase();

  if (
    extension === 'gltf' ||
    extension === 'glb' ||
    extension === 'usd' ||
    extension === 'usda' ||
    extension === 'usdc' ||
    extension === 'usdz'
  ) {
    return extension;
  }

  throw new Error(`Unsupported 3D model format for "${url}"`);
}

export function getDistanceLODState(
  distance: number,
  levels: ModelLODLevel[] = DEFAULT_MODEL_LOD_LEVELS
): ModelLODState {
  const safeDistance = Math.max(0, distance);
  const normalizedLevels = normalizeLODLevels(levels);
  const level = normalizedLevels.reduce((selected, candidate) => {
    return candidate.distance <= safeDistance ? candidate : selected;
  }, normalizedLevels[0]);

  return {
    distance: safeDistance,
    polygonRatio: level.polygonRatio,
    textureRatio: level.textureRatio,
    level,
  };
}

export function normalizeLODLevels(levels: ModelLODLevel[]): ModelLODLevel[] {
  const normalized = levels
    .map(level => ({
      distance: Math.max(0, level.distance),
      polygonRatio: clampRatio(level.polygonRatio),
      textureRatio: clampRatio(level.textureRatio),
    }))
    .sort((a, b) => a.distance - b.distance);

  return normalized.length > 0 ? normalized : DEFAULT_MODEL_LOD_LEVELS;
}

export function applyLODMetadata(scene: THREE.Object3D, lod: ModelLODState): void {
  scene.traverse(object => {
    object.userData.webglLOD = {
      distance: lod.distance,
      polygonRatio: lod.polygonRatio,
      textureRatio: lod.textureRatio,
    };
  });
}

function getSceneFromModelSource(source: GLTF | THREE.Group): THREE.Group {
  if ('scene' in source) {
    return source.scene;
  }

  return source;
}

function clampRatio(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.min(Math.max(value, 0.1), 1);
}
