export const WEBGL_LOADING_DELAY_MS = 2000;
export const WEBGL_INITIALIZATION_TIMEOUT_MS = 5000;

export interface WebGLInitializationStateInput {
  elapsedMs: number;
  initialized: boolean;
  failed: boolean;
  loadingDelayMs?: number;
  timeoutMs?: number;
}

export function shouldShowWebGLLoadingIndicator({
  elapsedMs,
  initialized,
  failed,
  loadingDelayMs = WEBGL_LOADING_DELAY_MS,
  timeoutMs = WEBGL_INITIALIZATION_TIMEOUT_MS,
}: WebGLInitializationStateInput): boolean {
  return !initialized && !failed && elapsedMs > loadingDelayMs && elapsedMs < timeoutMs;
}

export function shouldShowWebGLFallback({
  elapsedMs,
  initialized,
  failed,
  timeoutMs = WEBGL_INITIALIZATION_TIMEOUT_MS,
}: WebGLInitializationStateInput): boolean {
  return !initialized && (failed || elapsedMs > timeoutMs);
}
