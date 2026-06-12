'use client';

import { useFrame } from '@react-three/fiber';
import { type ReactNode, type RefObject, useEffect, useMemo, useRef, useState } from 'react';
import type * as THREE from 'three';
import {
  SCROLL_ACTIVATION_DURATION_MS,
  SCROLL_ACTIVE_SCALE,
  SCROLL_INACTIVE_SCALE,
  ScrollSync3D,
  type ScrollAnimationTransform,
  type ScrollMetrics,
  getScrollPerformanceState,
  interpolate,
  maintainsMinimumFpsForVelocity,
} from '@/app/lib/webgl/scroll-sync-3d';

export interface ScrollAnimated3DSceneProps {
  children: ReactNode;
  targetRef?: RefObject<HTMLElement | null>;
  metricsProvider?: () => ScrollMetrics;
  particleCount?: number;
  rotationRange?: [number, number, number];
  activationDurationMs?: number;
  onScrollTransform?: (transform: ScrollAnimationTransform) => void;
  onPerformanceChange?: (state: {
    reduced: boolean;
    particleCount: number;
    secondaryEffectsEnabled: boolean;
    maintainsMinimumFps: boolean;
  }) => void;
}

export function ScrollAnimated3DScene({
  children,
  targetRef,
  metricsProvider,
  particleCount = 100,
  rotationRange = [0, Math.PI * 0.5, 0],
  activationDurationMs = SCROLL_ACTIVATION_DURATION_MS,
  onScrollTransform,
  onPerformanceChange,
}: ScrollAnimated3DSceneProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const scrollSync = useMemo(() => new ScrollSync3D(), []);
  const [scrollTransform, setScrollTransform] = useState<ScrollAnimationTransform>(() =>
    scrollSync.mapMetrics(createFallbackMetrics())
  );
  const activeProgressRef = useRef(scrollTransform.active ? 1 : 0);
  const lastScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const lowFpsDurationRef = useRef(0);
  const recoveryDurationRef = useRef(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    const unsubscribe = scrollSync.subscribe(transform => {
      setScrollTransform(transform);
      onScrollTransform?.(transform);
    });

    return () => {
      unsubscribe();
      scrollSync.cancel();
    };
  }, [onScrollTransform, scrollSync]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    lastScrollYRef.current = window.scrollY;
    lastScrollTimeRef.current = performance.now();

    const updateFromScroll = () => {
      const now = performance.now();
      const elapsedSeconds = Math.max((now - lastScrollTimeRef.current) / 1000, 0.001);
      const currentScrollY = window.scrollY;

      scrollVelocityRef.current = Math.abs(currentScrollY - lastScrollYRef.current) / elapsedSeconds;
      lastScrollYRef.current = currentScrollY;
      lastScrollTimeRef.current = now;
      scrollSync.requestUpdate(readMetrics(targetRef, metricsProvider));
    };

    updateFromScroll();
    window.addEventListener('scroll', updateFromScroll, { passive: true });
    window.addEventListener('resize', updateFromScroll);

    return () => {
      window.removeEventListener('scroll', updateFromScroll);
      window.removeEventListener('resize', updateFromScroll);
    };
  }, [metricsProvider, scrollSync, targetRef]);

  useFrame((_, delta) => {
    const fps = delta > 0 ? 1 / delta : 60;
    const deltaMs = delta * 1000;

    if (fps < 30) {
      lowFpsDurationRef.current += deltaMs;
      recoveryDurationRef.current = 0;
    } else if (fps >= 50) {
      recoveryDurationRef.current += deltaMs;
      lowFpsDurationRef.current = 0;
    } else {
      lowFpsDurationRef.current = 0;
      recoveryDurationRef.current = 0;
    }

    const performanceState = getScrollPerformanceState({
      fps,
      lowFpsDurationMs: lowFpsDurationRef.current,
      recoveryDurationMs: recoveryDurationRef.current,
      currentlyReduced: reducedRef.current,
    });
    reducedRef.current = performanceState.reduced;

    const targetActiveProgress = scrollTransform.active ? 1 : 0;
    const step = deltaMs / activationDurationMs;
    activeProgressRef.current =
      activeProgressRef.current < targetActiveProgress
        ? Math.min(targetActiveProgress, activeProgressRef.current + step)
        : Math.max(targetActiveProgress, activeProgressRef.current - step);

    const scale = interpolate(
      SCROLL_INACTIVE_SCALE,
      SCROLL_ACTIVE_SCALE,
      activeProgressRef.current
    );
    const opacity = activeProgressRef.current;

    if (groupRef.current) {
      groupRef.current.scale?.setScalar?.(scale);
      groupRef.current.rotation?.set?.(
        rotationRange[0] * scrollTransform.easedProgress,
        rotationRange[1] * scrollTransform.easedProgress,
        rotationRange[2] * scrollTransform.easedProgress
      );
      applyOpacity(groupRef.current, opacity);
      groupRef.current.userData ??= {};
      groupRef.current.userData.scrollProgress = scrollTransform.progress;
      groupRef.current.userData.scrollVelocity = scrollVelocityRef.current;
      groupRef.current.userData.visibleRatio = scrollTransform.visibleRatio;
      groupRef.current.userData.reduced = performanceState.reduced;
      groupRef.current.userData.particleCount = Math.round(
        particleCount * performanceState.particleRatio
      );
      groupRef.current.userData.secondaryEffectsEnabled =
        performanceState.secondaryEffectsEnabled;
    }

    onPerformanceChange?.({
      reduced: performanceState.reduced,
      particleCount: Math.round(particleCount * performanceState.particleRatio),
      secondaryEffectsEnabled: performanceState.secondaryEffectsEnabled,
      maintainsMinimumFps: maintainsMinimumFpsForVelocity(fps, scrollVelocityRef.current),
    });
  });

  return (
    <group
      ref={groupRef}
      data-testid="scroll-animated-3d-scene"
      scale={scrollTransform.active ? SCROLL_ACTIVE_SCALE : SCROLL_INACTIVE_SCALE}
      userData={{
        scrollProgress: scrollTransform.progress,
        visibleRatio: scrollTransform.visibleRatio,
        active: scrollTransform.active,
      }}
    >
      {children}
    </group>
  );
}

function readMetrics(
  targetRef?: RefObject<HTMLElement | null>,
  metricsProvider?: () => ScrollMetrics
): ScrollMetrics {
  if (metricsProvider) {
    return metricsProvider();
  }

  if (typeof window === 'undefined') {
    return createFallbackMetrics();
  }

  const target = targetRef?.current;

  if (!target) {
    return {
      elementTop: 0,
      elementHeight: window.innerHeight,
      viewportHeight: window.innerHeight,
    };
  }

  const rect = target.getBoundingClientRect();
  return {
    elementTop: rect.top,
    elementHeight: rect.height,
    viewportHeight: window.innerHeight,
  };
}

function createFallbackMetrics(): ScrollMetrics {
  return {
    elementTop: 0,
    elementHeight: 1,
    viewportHeight: 1,
  };
}

function applyOpacity(object: THREE.Object3D, opacity: number): void {
  if (!object.traverse) {
    return;
  }

  object.traverse(child => {
    const material = (child as THREE.Mesh).material;

    if (!material) {
      return;
    }

    const materials = Array.isArray(material) ? material : [material];

    for (const item of materials) {
      item.transparent = opacity < 1;
      item.opacity = opacity;
      item.needsUpdate = true;
    }
  });
}

export default ScrollAnimated3DScene;
