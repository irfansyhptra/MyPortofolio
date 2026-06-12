export const MIN_DRAG_ROTATION_DEG_PER_PX = 0.5;
export const MAX_DRAG_ROTATION_DEG_PER_PX = 2;
export const MIN_MODEL_SCALE = 0.5;
export const MAX_MODEL_SCALE = 3;
export const HOVER_HIGHLIGHT_DELAY_MS = 200;
export const AUTO_RESET_DELAY_MS = 5000;
export const RESET_ANIMATION_DURATION_MS = 1000;

export type ScaleBoundaryFeedback = 'min-scale' | 'max-scale' | null;

export interface DragRotationInput {
  deltaX: number;
  deltaY: number;
  rateDegPerPixel?: number;
}

export interface DragRotationResult {
  rotationXDelta: number;
  rotationYDelta: number;
  rotationXDeltaDeg: number;
  rotationYDeltaDeg: number;
  rateDegPerPixel: number;
}

export interface PinchScaleInput {
  initialScale: number;
  initialDistance: number;
  currentDistance: number;
  minScale?: number;
  maxScale?: number;
}

export interface PinchScaleResult {
  scale: number;
  unclampedScale: number;
  boundaryFeedback: ScaleBoundaryFeedback;
}

export interface KeyboardTransformInput {
  key: string;
  rotationX: number;
  rotationY: number;
  scale: number;
  rotationStepDeg?: number;
  scaleStep?: number;
  minScale?: number;
  maxScale?: number;
}

export interface KeyboardTransformResult {
  handled: boolean;
  exitControls: boolean;
  rotationX: number;
  rotationY: number;
  scale: number;
  boundaryFeedback: ScaleBoundaryFeedback;
}

export interface InteractionIndicator {
  id: 'rotate' | 'zoom' | 'reset';
  ariaLabel: string;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function calculateDragRotation({
  deltaX,
  deltaY,
  rateDegPerPixel = 1,
}: DragRotationInput): DragRotationResult {
  const safeRate = clamp(
    rateDegPerPixel,
    MIN_DRAG_ROTATION_DEG_PER_PX,
    MAX_DRAG_ROTATION_DEG_PER_PX
  );
  const rotationXDeltaDeg = deltaY * safeRate;
  const rotationYDeltaDeg = deltaX * safeRate;

  return {
    rotationXDelta: degreesToRadians(rotationXDeltaDeg),
    rotationYDelta: degreesToRadians(rotationYDeltaDeg),
    rotationXDeltaDeg,
    rotationYDeltaDeg,
    rateDegPerPixel: safeRate,
  };
}

export function calculatePinchScale({
  initialScale,
  initialDistance,
  currentDistance,
  minScale = MIN_MODEL_SCALE,
  maxScale = MAX_MODEL_SCALE,
}: PinchScaleInput): PinchScaleResult {
  const safeInitialDistance = Math.max(initialDistance, 1);
  const unclampedScale = initialScale * (currentDistance / safeInitialDistance);
  const scale = clamp(unclampedScale, minScale, maxScale);

  return {
    scale,
    unclampedScale,
    boundaryFeedback:
      unclampedScale < minScale ? 'min-scale' : unclampedScale > maxScale ? 'max-scale' : null,
  };
}

export function calculateKeyboardTransform({
  key,
  rotationX,
  rotationY,
  scale,
  rotationStepDeg = 10,
  scaleStep = 0.1,
  minScale = MIN_MODEL_SCALE,
  maxScale = MAX_MODEL_SCALE,
}: KeyboardTransformInput): KeyboardTransformResult {
  const step = degreesToRadians(rotationStepDeg);

  switch (key) {
    case 'ArrowUp':
      return {
        handled: true,
        exitControls: false,
        rotationX: rotationX - step,
        rotationY,
        scale,
        boundaryFeedback: null,
      };
    case 'ArrowDown':
      return {
        handled: true,
        exitControls: false,
        rotationX: rotationX + step,
        rotationY,
        scale,
        boundaryFeedback: null,
      };
    case 'ArrowLeft':
      return {
        handled: true,
        exitControls: false,
        rotationX,
        rotationY: rotationY - step,
        scale,
        boundaryFeedback: null,
      };
    case 'ArrowRight':
      return {
        handled: true,
        exitControls: false,
        rotationX,
        rotationY: rotationY + step,
        scale,
        boundaryFeedback: null,
      };
    case '+':
    case '=': {
      const nextScale = clamp(scale + scaleStep, minScale, maxScale);
      return {
        handled: true,
        exitControls: false,
        rotationX,
        rotationY,
        scale: nextScale,
        boundaryFeedback: scale + scaleStep > maxScale ? 'max-scale' : null,
      };
    }
    case '-':
    case '_': {
      const nextScale = clamp(scale - scaleStep, minScale, maxScale);
      return {
        handled: true,
        exitControls: false,
        rotationX,
        rotationY,
        scale: nextScale,
        boundaryFeedback: scale - scaleStep < minScale ? 'min-scale' : null,
      };
    }
    case 'Escape':
      return {
        handled: true,
        exitControls: true,
        rotationX,
        rotationY,
        scale,
        boundaryFeedback: null,
      };
    default:
      return {
        handled: false,
        exitControls: false,
        rotationX,
        rotationY,
        scale,
        boundaryFeedback: null,
      };
  }
}

export function shouldApplyHoverHighlight(hoverDurationMs: number): boolean {
  return hoverDurationMs >= HOVER_HIGHLIGHT_DELAY_MS;
}

export function shouldAutoReset(idleDurationMs: number): boolean {
  return idleDurationMs >= AUTO_RESET_DELAY_MS;
}

export function easeOutCubic(progress: number): number {
  const clampedProgress = clamp(progress, 0, 1);
  return 1 - Math.pow(1 - clampedProgress, 3);
}

export function getInteractionIndicators(): InteractionIndicator[] {
  return [
    { id: 'rotate', ariaLabel: 'Rotation control indicator' },
    { id: 'zoom', ariaLabel: 'Zoom control indicator' },
    { id: 'reset', ariaLabel: 'Reset control indicator' },
  ];
}
