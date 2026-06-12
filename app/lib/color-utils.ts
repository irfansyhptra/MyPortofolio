/**
 * Color utilities for WCAG contrast calculations and neumorphic gradient generation.
 * Used by design system components and property-based tests.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

export interface GradientColorStop {
  position: number;
  lightness: number;
  color: string;
}

export interface NeumorphicGradientResult {
  css: string;
  angle: number;
  colorStops: GradientColorStop[];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function hslToString({ h, s, l }: Hsl): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function parseHsl(color: string): Hsl | null {
  const match = color.match(/hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)/i);
  if (!match) return null;

  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  };
}

export function getHslLightness(color: string): number {
  const hsl = parseHsl(color);
  return hsl?.l ?? 0;
}

export function adjustHslLightness(color: string, deltaPercent: number): string {
  const hsl = parseHsl(color);
  if (!hsl) return color;

  return hslToString({
    ...hsl,
    l: clamp(hsl.l + deltaPercent, 0, 100),
  });
}

export function hslToRgb(h: number, s: number, l: number): Rgb {
  const saturation = s / 100;
  const lightness = l / 100;

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = h / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (huePrime >= 0 && huePrime < 1) {
    r1 = chroma;
    g1 = x;
  } else if (huePrime < 2) {
    r1 = x;
    g1 = chroma;
  } else if (huePrime < 3) {
    g1 = chroma;
    b1 = x;
  } else if (huePrime < 4) {
    g1 = x;
    b1 = chroma;
  } else if (huePrime < 5) {
    r1 = x;
    b1 = chroma;
  } else {
    r1 = chroma;
    b1 = x;
  }

  const m = lightness - chroma / 2;

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

export function parseColor(color: string): Rgb {
  const hsl = parseHsl(color);
  if (hsl) {
    return hslToRgb(hsl.h, hsl.s, hsl.l);
  }

  const rgbMatch = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (rgbMatch) {
    return {
      r: parseFloat(rgbMatch[1]),
      g: parseFloat(rgbMatch[2]),
      b: parseFloat(rgbMatch[3]),
    };
  }

  return { r: 0, g: 0, b: 0 };
}

function linearize(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

export function relativeLuminance({ r, g, b }: Rgb): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

export function contrastRatio(luminance1: number, luminance2: number): number {
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getContrastRatio(foreground: string, background: string): number {
  const fgLuminance = relativeLuminance(parseColor(foreground));
  const bgLuminance = relativeLuminance(parseColor(background));
  return contrastRatio(fgLuminance, bgLuminance);
}

export function compositeColors(
  foreground: Rgb,
  foregroundAlpha: number,
  background: Rgb
): Rgb {
  return {
    r: Math.round(foreground.r * foregroundAlpha + background.r * (1 - foregroundAlpha)),
    g: Math.round(foreground.g * foregroundAlpha + background.g * (1 - foregroundAlpha)),
    b: Math.round(foreground.b * foregroundAlpha + background.b * (1 - foregroundAlpha)),
  };
}

export function luminanceFromRgb({ r, g, b }: Rgb): number {
  return relativeLuminance({ r, g, b });
}

export function getGlassCompositeLuminance(
  glassOpacity: number,
  backgroundLuminance: number
): number {
  const backgroundGray = Math.round(backgroundLuminance * 255);
  const background = { r: backgroundGray, g: backgroundGray, b: backgroundGray };
  const foreground = { r: 255, g: 255, b: 255 };
  const composite = compositeColors(foreground, glassOpacity, background);
  return luminanceFromRgb(composite);
}

export function getGlassTextContrast(
  textColor: string,
  glassOpacity: number,
  backgroundLuminance: number
): number {
  const compositeLuminance = getGlassCompositeLuminance(glassOpacity, backgroundLuminance);
  const textLuminance = relativeLuminance(parseColor(textColor));
  return contrastRatio(textLuminance, compositeLuminance);
}

export function extractRgbaOpacities(shadowValue: string): number[] {
  const matches = shadowValue.matchAll(/rgba\([^)]*,\s*([\d.]+)\)/g);
  return Array.from(matches, (match) => parseFloat(match[1]));
}
