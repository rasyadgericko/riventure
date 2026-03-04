import type { FigmaColor } from './types.js';

/**
 * Parse a CSS color string (hex or rgba) to Figma's 0–1 RGBA format.
 * Handles: #f1f1f1, #555, rgba(22,22,22,0.12)
 */
export function parseColorToFigma(color: string): FigmaColor {
  color = color.trim();

  // rgba(r, g, b, a) or rgb(r, g, b)
  const rgbaMatch = color.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/,
  );
  if (rgbaMatch) {
    return {
      r: round(parseInt(rgbaMatch[1]) / 255),
      g: round(parseInt(rgbaMatch[2]) / 255),
      b: round(parseInt(rgbaMatch[3]) / 255),
      a: round(rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1),
    };
  }

  // Hex: #fff or #ffffff
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error(`Invalid hex color: "${color}"`);
    }
    return {
      r: round(parseInt(hex.slice(0, 2), 16) / 255),
      g: round(parseInt(hex.slice(2, 4), 16) / 255),
      b: round(parseInt(hex.slice(4, 6), 16) / 255),
      a: 1,
    };
  }

  throw new Error(`Unsupported color format: "${color}"`);
}

function round(n: number): number {
  return Math.round(n * 10000) / 10000;
}
