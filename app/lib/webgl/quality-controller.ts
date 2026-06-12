export const WEBGL_MIN_FPS = 30;
export const WEBGL_LOD_DEGRADATION_DELAY_MS = 500;
export const WEBGL_REDUCED_POLYGON_RATIO = 0.5;
export const WEBGL_REDUCED_TEXTURE_RATIO = 0.5;

export interface LODQualityInput {
  fps: number;
  belowThresholdDurationMs: number;
  fpsThreshold?: number;
  durationThresholdMs?: number;
}

export interface LODQualityState {
  shouldReduceLOD: boolean;
  polygonRatio: number;
  textureRatio: number;
}

export function shouldReduceLOD({
  fps,
  belowThresholdDurationMs,
  fpsThreshold = WEBGL_MIN_FPS,
  durationThresholdMs = WEBGL_LOD_DEGRADATION_DELAY_MS,
}: LODQualityInput): boolean {
  return fps < fpsThreshold && belowThresholdDurationMs > durationThresholdMs;
}

export function getLODQualityState(input: LODQualityInput): LODQualityState {
  const reduceLOD = shouldReduceLOD(input);

  return {
    shouldReduceLOD: reduceLOD,
    polygonRatio: reduceLOD ? WEBGL_REDUCED_POLYGON_RATIO : 1,
    textureRatio: reduceLOD ? WEBGL_REDUCED_TEXTURE_RATIO : 1,
  };
}
