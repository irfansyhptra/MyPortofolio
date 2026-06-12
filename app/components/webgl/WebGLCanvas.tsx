'use client';

import { Canvas, type CanvasProps } from '@react-three/fiber';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  WEBGL_INITIALIZATION_TIMEOUT_MS,
  WEBGL_LOADING_DELAY_MS,
} from '@/app/lib/webgl/initialization-state';
import { detectWebGLSupport } from '@/app/lib/webgl/scene-manager';

export interface WebGLCanvasProps
  extends Omit<CanvasProps, 'children' | 'className' | 'fallback' | 'onCreated'> {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
  canvasClassName?: string;
  fallbackSrc?: string;
  fallbackAlt?: string;
  fallbackContent?: ReactNode;
  loadingLabel?: string;
  loadingDelayMs?: number;
  timeoutMs?: number;
  webglSupported?: boolean;
  onCreated?: CanvasProps['onCreated'];
  onFallback?: (reason: 'unsupported' | 'timeout') => void;
}

export function WebGLCanvas({
  children,
  ariaLabel,
  className = '',
  canvasClassName = '',
  fallbackSrc,
  fallbackAlt,
  fallbackContent,
  loadingLabel = 'Loading 3D scene',
  loadingDelayMs = WEBGL_LOADING_DELAY_MS,
  timeoutMs = WEBGL_INITIALIZATION_TIMEOUT_MS,
  webglSupported,
  onCreated,
  onFallback,
  ...canvasProps
}: WebGLCanvasProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(
    typeof webglSupported === 'boolean' ? webglSupported : null
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [fallbackReason, setFallbackReason] = useState<'unsupported' | 'timeout' | null>(
    typeof webglSupported === 'boolean' && !webglSupported ? 'unsupported' : null
  );

  const fallbackDescription = fallbackAlt ?? ariaLabel;

  const fallbackMarkup = useMemo(() => {
    const usesImageFallback = Boolean(!fallbackContent && fallbackSrc);

    return (
      <div
        className="flex h-full min-h-[240px] w-full items-center justify-center overflow-hidden rounded-lg border border-white/15 bg-slate-950/80 text-slate-100"
        role={usesImageFallback ? undefined : 'img'}
        aria-label={usesImageFallback ? undefined : fallbackDescription}
        data-testid="webgl-fallback"
      >
        {fallbackContent ??
          (fallbackSrc ? (
            <img
              src={fallbackSrc}
              alt={fallbackDescription}
              className="h-full w-full object-cover"
            />
          ) : (
            <p className="max-w-md px-6 text-center text-sm leading-6">{fallbackDescription}</p>
          ))}
      </div>
    );
  }, [fallbackContent, fallbackDescription, fallbackSrc]);

  useEffect(() => {
    if (typeof webglSupported === 'boolean') {
      setIsSupported(webglSupported);
      setFallbackReason(webglSupported ? null : 'unsupported');
      return;
    }

    const support = detectWebGLSupport();
    setIsSupported(support.supported);
    setFallbackReason(support.supported ? null : 'unsupported');
  }, [webglSupported]);

  useEffect(() => {
    if (!isSupported || isInitialized || fallbackReason) {
      return;
    }

    const loadingTimer = window.setTimeout(() => {
      setShowLoading(true);
    }, loadingDelayMs);

    const timeoutTimer = window.setTimeout(() => {
      setFallbackReason('timeout');
      setShowLoading(false);
      console.error('WebGL initialization timed out');
    }, timeoutMs);

    return () => {
      window.clearTimeout(loadingTimer);
      window.clearTimeout(timeoutTimer);
    };
  }, [fallbackReason, isInitialized, isSupported, loadingDelayMs, timeoutMs]);

  useEffect(() => {
    if (fallbackReason) {
      onFallback?.(fallbackReason);
    }
  }, [fallbackReason, onFallback]);

  if (fallbackReason || isSupported === false) {
    return fallbackMarkup;
  }

  return (
    <div
      className={`relative h-full min-h-[240px] w-full overflow-hidden ${className}`}
      role="img"
      aria-label={ariaLabel}
      data-testid="webgl-scene"
    >
      {showLoading && (
        <div
          className="pointer-events-none absolute inset-x-0 top-4 z-10 mx-auto w-fit rounded-md border border-white/15 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 shadow-lg"
          role="status"
          aria-live="polite"
        >
          {loadingLabel}
        </div>
      )}

      {isSupported && (
        <Canvas
          {...canvasProps}
          className={`h-full w-full ${canvasClassName}`}
          fallback={fallbackMarkup}
          onCreated={state => {
            setIsInitialized(true);
            setShowLoading(false);
            onCreated?.(state);
          }}
        >
          {children}
        </Canvas>
      )}
    </div>
  );
}

export default WebGLCanvas;
