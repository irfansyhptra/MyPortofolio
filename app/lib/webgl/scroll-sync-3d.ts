import { clamp } from './interaction-controls';

export const SCROLL_UPDATE_FRAME_BUDGET_MS = 16;
export const SCROLL_VISIBILITY_THRESHOLD = 0.2;
export const SCROLL_ACTIVATION_DURATION_MS = 800;
export const SCROLL_INACTIVE_SCALE = 0.8;
export const SCROLL_ACTIVE_SCALE = 1;
export const SCROLL_INACTIVE_OPACITY = 0;
export const SCROLL_ACTIVE_OPACITY = 1;
export const SCROLL_HIGH_VELOCITY_PX_PER_SECOND = 1000;
export const SCROLL_MIN_FPS = 30;
export const SCROLL_DEGRADE_FPS = 30;
export const SCROLL_DEGRADE_DURATION_MS = 500;
export const SCROLL_RECOVERY_FPS = 50;
export const SCROLL_RECOVERY_DURATION_MS = 2000;
export const SCROLL_REDUCED_PARTICLE_RATIO = 0.5;
export const SCROLL_EASING_CONTROL_POINTS = [0.25, 0, 0.75, 1] as const;

export interface ScrollMetrics {
  elementTop: number;
  elementHeight: number;
  viewportHeight: number;
}

export interface ScrollAnimationTransform {
  progress: number;
  easedProgress: number;
  visibleRatio: number;
  active: boolean;
  opacity: number;
  scale: number;
}

export interface ScrollPerformanceInput {
  fps: number;
  lowFpsDurationMs: number;
  recoveryDurationMs: number;
  currentlyReduced?: boolean;
}

export interface ScrollPerformanceState {
  reduced: boolean;
  particleRatio: number;
  secondaryEffectsEnabled: boolean;
}

export interface ScrollSync3DOptions {
  easingControlPoints?: readonly [number, number, number, number];
  visibilityThreshold?: number;
  inactiveScale?: number;
  activeScale?: number;
  inactiveOpacity?: number;
  activeOpacity?: number;
}

export type ScrollUpdateListener = (transform: ScrollAnimationTransform) => void;

export class ScrollSync3D {
  private readonly easingControlPoints: readonly [number, number, number, number];
  private readonly visibilityThreshold: number;
  private readonly inactiveScale: number;
  private readonly activeScale: number;
  private readonly inactiveOpacity: number;
  private readonly activeOpacity: number;
  private readonly listeners = new Set<ScrollUpdateListener>();
  private rafId: number | null = null;
  private pendingMetrics: ScrollMetrics | null = null;
  private lastUpdateDelayMs = 0;

  constructor(options: ScrollSync3DOptions = {}) {
    this.easingControlPoints = options.easingControlPoints ?? SCROLL_EASING_CONTROL_POINTS;
    this.visibilityThreshold = options.visibilityThreshold ?? SCROLL_VISIBILITY_THRESHOLD;
    this.inactiveScale = options.inactiveScale ?? SCROLL_INACTIVE_SCALE;
    this.activeScale = options.activeScale ?? SCROLL_ACTIVE_SCALE;
    this.inactiveOpacity = options.inactiveOpacity ?? SCROLL_INACTIVE_OPACITY;
    this.activeOpacity = options.activeOpacity ?? SCROLL_ACTIVE_OPACITY;
  }

  subscribe(listener: ScrollUpdateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  update(metrics: ScrollMetrics): ScrollAnimationTransform {
    const transform = this.mapMetrics(metrics);

    for (const listener of this.listeners) {
      listener(transform);
    }

    return transform;
  }

  requestUpdate(metrics: ScrollMetrics): void {
    this.pendingMetrics = metrics;

    if (this.rafId !== null || typeof window === 'undefined') {
      if (typeof window === 'undefined') {
        this.update(metrics);
      }
      return;
    }

    const start = performance.now();
    this.rafId = window.requestAnimationFrame(() => {
      this.rafId = null;
      this.lastUpdateDelayMs = performance.now() - start;

      if (this.pendingMetrics) {
        this.update(this.pendingMetrics);
        this.pendingMetrics = null;
      }
    });
  }

  cancel(): void {
    if (this.rafId !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(this.rafId);
    }

    this.rafId = null;
    this.pendingMetrics = null;
  }

  mapMetrics(metrics: ScrollMetrics): ScrollAnimationTransform {
    const progress = mapScrollToProgress(metrics);
    const easedProgress = cubicBezier(progress, this.easingControlPoints);
    const visibleRatio = getVisibleRatio(metrics);
    const active = visibleRatio >= this.visibilityThreshold;

    return {
      progress,
      easedProgress,
      visibleRatio,
      active,
      opacity: interpolate(
        this.inactiveOpacity,
        this.activeOpacity,
        active ? easedProgress : 0
      ),
      scale: interpolate(this.inactiveScale, this.activeScale, active ? easedProgress : 0),
    };
  }

  getLastUpdateDelayMs(): number {
    return this.lastUpdateDelayMs;
  }
}

export function mapScrollToProgress({
  elementTop,
  elementHeight,
  viewportHeight,
}: ScrollMetrics): number {
  const safeElementHeight = Math.max(1, elementHeight);
  const safeViewportHeight = Math.max(1, viewportHeight);
  return clamp(
    (safeViewportHeight - elementTop) / (safeViewportHeight + safeElementHeight),
    0,
    1
  );
}

export function getVisibleRatio({
  elementTop,
  elementHeight,
  viewportHeight,
}: ScrollMetrics): number {
  const safeElementHeight = Math.max(1, elementHeight);
  const visibleTop = Math.max(0, elementTop);
  const visibleBottom = Math.min(viewportHeight, elementTop + safeElementHeight);
  return clamp((visibleBottom - visibleTop) / safeElementHeight, 0, 1);
}

export function getScrollAnimationTransform(metrics: ScrollMetrics): ScrollAnimationTransform {
  return new ScrollSync3D().mapMetrics(metrics);
}

export function getScrollPerformanceState({
  fps,
  lowFpsDurationMs,
  recoveryDurationMs,
  currentlyReduced = false,
}: ScrollPerformanceInput): ScrollPerformanceState {
  const shouldReduce = fps < SCROLL_DEGRADE_FPS && lowFpsDurationMs > SCROLL_DEGRADE_DURATION_MS;
  const shouldRecover =
    currentlyReduced && fps >= SCROLL_RECOVERY_FPS && recoveryDurationMs >= SCROLL_RECOVERY_DURATION_MS;
  const reduced = shouldReduce || (currentlyReduced && !shouldRecover);

  return {
    reduced,
    particleRatio: reduced ? SCROLL_REDUCED_PARTICLE_RATIO : 1,
    secondaryEffectsEnabled: !reduced,
  };
}

export function maintainsMinimumFpsForVelocity(fps: number, velocityPxPerSecond: number): boolean {
  return velocityPxPerSecond <= SCROLL_HIGH_VELOCITY_PX_PER_SECOND || fps >= SCROLL_MIN_FPS;
}

export function interpolate(start: number, end: number, progress: number): number {
  return start + (end - start) * clamp(progress, 0, 1);
}

export function isValidScrollEasingControlPoints(
  controlPoints: readonly [number, number, number, number]
): boolean {
  const [x1, y1, x2, y2] = controlPoints;
  return x1 >= 0.2 && y1 >= 0 && x2 <= 0.8 && y2 <= 1 && x1 < x2;
}

export function cubicBezier(
  progress: number,
  [x1, y1, x2, y2]: readonly [number, number, number, number] = SCROLL_EASING_CONTROL_POINTS
): number {
  const targetX = clamp(progress, 0, 1);
  let lower = 0;
  let upper = 1;
  let t = targetX;

  for (let i = 0; i < 8; i++) {
    t = (lower + upper) / 2;
    const x = cubicBezierAxis(t, x1, x2);

    if (Math.abs(x - targetX) < 0.001) {
      break;
    }

    if (x < targetX) {
      lower = t;
    } else {
      upper = t;
    }
  }

  return cubicBezierAxis(t, y1, y2);
}

function cubicBezierAxis(t: number, point1: number, point2: number): number {
  const inverseT = 1 - t;
  return (
    3 * inverseT * inverseT * t * point1 +
    3 * inverseT * t * t * point2 +
    t * t * t
  );
}
