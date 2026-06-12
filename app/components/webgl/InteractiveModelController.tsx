'use client';

import { Html } from '@react-three/drei';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import {
  AUTO_RESET_DELAY_MS,
  HOVER_HIGHLIGHT_DELAY_MS,
  MAX_MODEL_SCALE,
  MIN_MODEL_SCALE,
  RESET_ANIMATION_DURATION_MS,
  type ScaleBoundaryFeedback,
  calculateDragRotation,
  calculateKeyboardTransform,
  calculatePinchScale,
  easeOutCubic,
  getInteractionIndicators,
} from '@/app/lib/webgl/interaction-controls';

type PointerLikeEvent = {
  pointerId: number;
  clientX: number;
  clientY: number;
  stopPropagation?: () => void;
  target?: {
    setPointerCapture?: (pointerId: number) => void;
    releasePointerCapture?: (pointerId: number) => void;
  };
};

interface ActivePointer {
  x: number;
  y: number;
}

export interface InteractiveModelTransform {
  rotationX: number;
  rotationY: number;
  scale: number;
  highlighted: boolean;
  boundaryFeedback: ScaleBoundaryFeedback;
}

export interface InteractiveModelControllerProps {
  children: ReactNode;
  ariaLabel: string;
  rotationRateDegPerPixel?: number;
  minScale?: number;
  maxScale?: number;
  defaultRotation?: [number, number, number];
  defaultScale?: number;
  hoverDelayMs?: number;
  autoResetDelayMs?: number;
  resetDurationMs?: number;
  onTransformChange?: (transform: InteractiveModelTransform) => void;
  onBoundaryFeedback?: (feedback: Exclude<ScaleBoundaryFeedback, null>) => void;
}

export function InteractiveModelController({
  children,
  ariaLabel,
  rotationRateDegPerPixel = 1,
  minScale = MIN_MODEL_SCALE,
  maxScale = MAX_MODEL_SCALE,
  defaultRotation = [0, 0, 0],
  defaultScale = 1,
  hoverDelayMs = HOVER_HIGHLIGHT_DELAY_MS,
  autoResetDelayMs = AUTO_RESET_DELAY_MS,
  resetDurationMs = RESET_ANIMATION_DURATION_MS,
  onTransformChange,
  onBoundaryFeedback,
}: InteractiveModelControllerProps) {
  const [rotation, setRotation] = useState<[number, number, number]>(defaultRotation);
  const [scale, setScale] = useState(defaultScale);
  const [highlighted, setHighlighted] = useState(false);
  const [boundaryFeedback, setBoundaryFeedback] = useState<ScaleBoundaryFeedback>(null);
  const [keyboardActive, setKeyboardActive] = useState(false);

  const activePointersRef = useRef(new Map<number, ActivePointer>());
  const lastPointerRef = useRef<ActivePointer | null>(null);
  const initialPinchDistanceRef = useRef<number | null>(null);
  const initialPinchScaleRef = useRef(defaultScale);
  const hoverTimerRef = useRef<number | null>(null);
  const resetTimerRef = useRef<number | null>(null);
  const resetFrameRef = useRef<number | null>(null);
  const keyboardControlRef = useRef<HTMLDivElement | null>(null);

  const emitTransform = useCallback(
    (
      nextRotation: [number, number, number],
      nextScale: number,
      nextHighlighted: boolean,
      nextBoundaryFeedback: ScaleBoundaryFeedback
    ) => {
      onTransformChange?.({
        rotationX: nextRotation[0],
        rotationY: nextRotation[1],
        scale: nextScale,
        highlighted: nextHighlighted,
        boundaryFeedback: nextBoundaryFeedback,
      });
    },
    [onTransformChange]
  );

  const clearResetAnimation = useCallback(() => {
    if (resetFrameRef.current !== null) {
      window.cancelAnimationFrame(resetFrameRef.current);
      resetFrameRef.current = null;
    }
  }, []);

  const startResetAnimation = useCallback(() => {
    clearResetAnimation();

    const startTime = performance.now();
    const startRotation = rotation;
    const startScale = scale;

    const animate = (time: number) => {
      const progress = easeOutCubic((time - startTime) / resetDurationMs);
      const nextRotation: [number, number, number] = [
        startRotation[0] + (defaultRotation[0] - startRotation[0]) * progress,
        startRotation[1] + (defaultRotation[1] - startRotation[1]) * progress,
        startRotation[2] + (defaultRotation[2] - startRotation[2]) * progress,
      ];
      const nextScale = startScale + (defaultScale - startScale) * progress;

      setRotation(nextRotation);
      setScale(nextScale);
      emitTransform(nextRotation, nextScale, highlighted, null);

      if (progress < 1) {
        resetFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    resetFrameRef.current = window.requestAnimationFrame(animate);
  }, [
    clearResetAnimation,
    defaultRotation,
    defaultScale,
    emitTransform,
    highlighted,
    resetDurationMs,
    rotation,
    scale,
  ]);

  const scheduleAutoReset = useCallback(() => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(startResetAnimation, autoResetDelayMs);
  }, [autoResetDelayMs, startResetAnimation]);

  const setBoundary = useCallback(
    (feedback: ScaleBoundaryFeedback) => {
      setBoundaryFeedback(feedback);

      if (feedback) {
        onBoundaryFeedback?.(feedback);
      }
    },
    [onBoundaryFeedback]
  );

  useEffect(() => {
    scheduleAutoReset();

    return () => {
      if (hoverTimerRef.current !== null) {
        window.clearTimeout(hoverTimerRef.current);
      }
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
      clearResetAnimation();
    };
  }, [clearResetAnimation, scheduleAutoReset]);

  const handleInteraction = useCallback(
    (
      nextRotation: [number, number, number],
      nextScale: number,
      feedback: ScaleBoundaryFeedback
    ) => {
      clearResetAnimation();
      setRotation(nextRotation);
      setScale(nextScale);
      setBoundary(feedback);
      emitTransform(nextRotation, nextScale, highlighted, feedback);
      scheduleAutoReset();
    },
    [clearResetAnimation, emitTransform, highlighted, scheduleAutoReset, setBoundary]
  );

  const handlePointerDown = (event: PointerLikeEvent) => {
    event.stopPropagation?.();
    event.target?.setPointerCapture?.(event.pointerId);
    activePointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    lastPointerRef.current = { x: event.clientX, y: event.clientY };

    if (activePointersRef.current.size === 2) {
      const pointers = Array.from(activePointersRef.current.values());
      initialPinchDistanceRef.current = getPointerDistance(pointers[0], pointers[1]);
      initialPinchScaleRef.current = scale;
    }
  };

  const handlePointerMove = (event: PointerLikeEvent) => {
    if (!activePointersRef.current.has(event.pointerId)) {
      return;
    }

    event.stopPropagation?.();
    activePointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (activePointersRef.current.size >= 2) {
      const pointers = Array.from(activePointersRef.current.values());
      const currentDistance = getPointerDistance(pointers[0], pointers[1]);
      const pinch = calculatePinchScale({
        initialScale: initialPinchScaleRef.current,
        initialDistance: initialPinchDistanceRef.current ?? currentDistance,
        currentDistance,
        minScale,
        maxScale,
      });

      handleInteraction(rotation, pinch.scale, pinch.boundaryFeedback);
      return;
    }

    if (!lastPointerRef.current) {
      lastPointerRef.current = { x: event.clientX, y: event.clientY };
      return;
    }

    const drag = calculateDragRotation({
      deltaX: event.clientX - lastPointerRef.current.x,
      deltaY: event.clientY - lastPointerRef.current.y,
      rateDegPerPixel: rotationRateDegPerPixel,
    });
    const nextRotation: [number, number, number] = [
      rotation[0] + drag.rotationXDelta,
      rotation[1] + drag.rotationYDelta,
      rotation[2],
    ];

    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    handleInteraction(nextRotation, scale, null);
  };

  const handlePointerUp = (event: PointerLikeEvent) => {
    event.stopPropagation?.();
    event.target?.releasePointerCapture?.(event.pointerId);
    activePointersRef.current.delete(event.pointerId);
    lastPointerRef.current = null;

    if (activePointersRef.current.size < 2) {
      initialPinchDistanceRef.current = null;
      initialPinchScaleRef.current = scale;
    }
  };

  const handlePointerOver = () => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
    }

    hoverTimerRef.current = window.setTimeout(() => {
      setHighlighted(true);
      emitTransform(rotation, scale, true, boundaryFeedback);
    }, hoverDelayMs);
  };

  const handlePointerOut = () => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    setHighlighted(false);
    emitTransform(rotation, scale, false, boundaryFeedback);
  };

  const handleKeyboardControl = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (keyboardActive && event.key === 'Tab') {
      event.preventDefault();
      return;
    }

    const next = calculateKeyboardTransform({
      key: event.key,
      rotationX: rotation[0],
      rotationY: rotation[1],
      scale,
      minScale,
      maxScale,
    });

    if (!next.handled) {
      return;
    }

    event.preventDefault();

    if (next.exitControls) {
      setKeyboardActive(false);
      keyboardControlRef.current?.blur();
      return;
    }

    handleInteraction([next.rotationX, next.rotationY, rotation[2]], next.scale, next.boundaryFeedback);
  };

  return (
    <group
      aria-label={ariaLabel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      rotation={rotation}
      scale={scale}
      userData={{
        highlighted,
        boundaryFeedback,
        interactionIndicators: getInteractionIndicators(),
      }}
    >
      {children}
      <InteractionIndicatorMeshes highlighted={highlighted} boundaryFeedback={boundaryFeedback} />
      <Html center={false} transform={false}>
        <div
          ref={keyboardControlRef}
          tabIndex={0}
          role="application"
          aria-label={ariaLabel}
          data-testid="interactive-model-keyboard-controls"
          className="sr-only"
          onFocus={() => setKeyboardActive(true)}
          onKeyDown={handleKeyboardControl}
        />
      </Html>
    </group>
  );
}

function InteractionIndicatorMeshes({
  highlighted,
  boundaryFeedback,
}: {
  highlighted: boolean;
  boundaryFeedback: ScaleBoundaryFeedback;
}) {
  const color = boundaryFeedback ? '#f97316' : highlighted ? '#38bdf8' : '#ffffff';

  return (
    <group name="interactive-model-indicators" data-testid="interactive-model-indicators">
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.01, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
      <mesh position={[1.25, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.18, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, -1.25, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.08, 0.18, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function getPointerDistance(first: ActivePointer, second: ActivePointer): number {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

export default InteractiveModelController;
