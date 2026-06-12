import * as THREE from 'three';

export const MAX_WEBGL_PIXEL_RATIO = 2;
export const DEFAULT_CAMERA_FOV = 75;
export const DEFAULT_CAMERA_NEAR = 0.1;
export const DEFAULT_CAMERA_FAR = 1000;

export type WebGLFallbackReason =
  | 'not-browser'
  | 'context-unavailable'
  | 'initialization-failed';

export interface WebGLSupportResult {
  supported: boolean;
  contextType: 'webgl2' | 'webgl' | 'experimental-webgl' | null;
  reason?: WebGLFallbackReason;
}

export interface WebGLSceneManagerOptions {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
  alpha?: boolean;
  powerPreference?: WebGLPowerPreference;
  antialiasPixelRatioThreshold?: number;
  contextAttributes?: WebGLContextAttributes;
  logger?: Pick<Console, 'error'>;
  rendererFactory?: (parameters: THREE.WebGLRendererParameters) => THREE.WebGLRenderer;
}

export class WebGLSceneManager {
  private readonly logger: Pick<Console, 'error'>;
  private readonly rendererFactory: (parameters: THREE.WebGLRendererParameters) => THREE.WebGLRenderer;
  private readonly alpha: boolean;
  private readonly powerPreference: WebGLPowerPreference;
  private readonly antialiasPixelRatioThreshold: number;
  private readonly contextAttributes?: WebGLContextAttributes;

  public readonly scene: THREE.Scene;
  public readonly camera: THREE.PerspectiveCamera;

  private renderer: THREE.WebGLRenderer | null = null;
  private initialized = false;
  private fallbackReason: WebGLFallbackReason | null = null;

  constructor(options: WebGLSceneManagerOptions = {}) {
    const {
      fov = DEFAULT_CAMERA_FOV,
      aspect = 1,
      near = DEFAULT_CAMERA_NEAR,
      far = DEFAULT_CAMERA_FAR,
      alpha = true,
      powerPreference = 'high-performance',
      antialiasPixelRatioThreshold = MAX_WEBGL_PIXEL_RATIO,
      contextAttributes,
      logger = console,
      rendererFactory = parameters => new THREE.WebGLRenderer(parameters),
    } = options;

    this.logger = logger;
    this.rendererFactory = rendererFactory;
    this.alpha = alpha;
    this.powerPreference = powerPreference;
    this.antialiasPixelRatioThreshold = antialiasPixelRatioThreshold;
    this.contextAttributes = contextAttributes;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  }

  static detectSupport(canvas?: HTMLCanvasElement): WebGLSupportResult {
    return detectWebGLSupport(canvas);
  }

  static getPixelRatio(devicePixelRatio = getDevicePixelRatio()): number {
    return getCappedPixelRatio(devicePixelRatio);
  }

  static shouldUseAntialias(
    pixelRatio: number,
    threshold = MAX_WEBGL_PIXEL_RATIO
  ): boolean {
    return shouldUseAntialias(pixelRatio, threshold);
  }

  async initialize(canvas: HTMLCanvasElement): Promise<boolean> {
    if (this.initialized) {
      return true;
    }

    const support = detectWebGLSupport(canvas, this.contextAttributes);
    if (!support.supported) {
      this.fallbackReason = support.reason ?? 'context-unavailable';
      this.logger.error('WebGL not supported');
      return false;
    }

    try {
      const pixelRatio = getCappedPixelRatio();
      this.renderer = this.rendererFactory({
        canvas,
        alpha: this.alpha,
        antialias: shouldUseAntialias(pixelRatio, this.antialiasPixelRatioThreshold),
        powerPreference: this.powerPreference,
      });

      this.renderer.setPixelRatio(pixelRatio);
      this.resize(canvas.clientWidth || canvas.width || 1, canvas.clientHeight || canvas.height || 1);

      this.initialized = true;
      this.fallbackReason = null;
      return true;
    } catch (error) {
      this.fallbackReason = 'initialization-failed';
      this.initialized = false;
      this.renderer = null;
      this.logger.error('WebGL initialization failed:', error);
      return false;
    }
  }

  resize(width: number, height: number): void {
    const safeWidth = Math.max(1, Math.floor(width));
    const safeHeight = Math.max(1, Math.floor(height));

    this.camera.aspect = safeWidth / safeHeight;
    this.camera.updateProjectionMatrix();
    this.renderer?.setSize(safeWidth, safeHeight, false);
  }

  render(): boolean {
    if (!this.renderer || !this.initialized) {
      return false;
    }

    this.renderer.render(this.scene, this.camera);
    return true;
  }

  dispose(): void {
    this.renderer?.dispose();
    this.renderer = null;
    this.initialized = false;
  }

  getRenderer(): THREE.WebGLRenderer | null {
    return this.renderer;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getFallbackReason(): WebGLFallbackReason | null {
    return this.fallbackReason;
  }
}

export function detectWebGLSupport(
  canvas?: HTMLCanvasElement,
  attributes?: WebGLContextAttributes
): WebGLSupportResult {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      supported: false,
      contextType: null,
      reason: 'not-browser',
    };
  }

  const targetCanvas = canvas ?? document.createElement('canvas');
  const contextTypes: Array<NonNullable<WebGLSupportResult['contextType']>> = [
    'webgl2',
    'webgl',
    'experimental-webgl',
  ];

  for (const contextType of contextTypes) {
    try {
      const context = targetCanvas.getContext(contextType, attributes);

      if (context) {
        return {
          supported: true,
          contextType,
        };
      }
    } catch {
      continue;
    }
  }

  return {
    supported: false,
    contextType: null,
    reason: 'context-unavailable',
  };
}

export function getCappedPixelRatio(devicePixelRatio = getDevicePixelRatio()): number {
  if (!Number.isFinite(devicePixelRatio) || devicePixelRatio <= 0) {
    return 1;
  }

  return Math.min(devicePixelRatio, MAX_WEBGL_PIXEL_RATIO);
}

export function shouldUseAntialias(
  pixelRatio: number,
  threshold = MAX_WEBGL_PIXEL_RATIO
): boolean {
  return pixelRatio < threshold;
}

function getDevicePixelRatio(): number {
  if (typeof window === 'undefined') {
    return 1;
  }

  return window.devicePixelRatio || 1;
}
