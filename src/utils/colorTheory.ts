import { SANDTEX_PALETTE, type SwatchColor } from '../data/showroomData';

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert Hex string to RGB
 */
export function hexToRgb(hex: string): RGB {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Convert RGB to Hex string
 */
export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl({ r, g, b }: RGB): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb({ h, s, l }: HSL): RGB {
  h = (h % 360 + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex));
}

export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Find the closest official Sandtex paint swatch from a hex color
 */
export function findClosestSandtexColor(hex: string): SwatchColor {
  const target = hexToRgb(hex);
  let closest = SANDTEX_PALETTE[0];
  let minDiff = Infinity;

  for (const swatch of SANDTEX_PALETTE) {
    const sRgb = hexToRgb(swatch.hex);
    // Euclidean distance in RGB color space
    const diff = Math.sqrt(
      Math.pow(target.r - sRgb.r, 2) +
      Math.pow(target.g - sRgb.g, 2) +
      Math.pow(target.b - sRgb.b, 2)
    );
    if (diff < minDiff) {
      minDiff = diff;
      closest = swatch;
    }
  }

  return closest;
}

export interface GeneratedHarmonies {
  complementary: {
    name: string;
    mainWall: string;
    accentWall: string;
    ceiling: string;
    trim: string;
    accents: string;
  };
  monochromatic: {
    name: string;
    mainWall: string;
    accentWall: string;
    ceiling: string;
    trim: string;
    accents: string;
  };
  analogous: {
    name: string;
    mainWall: string;
    accentWall: string;
    ceiling: string;
    trim: string;
    accents: string;
  };
  triadic: {
    name: string;
    mainWall: string;
    accentWall: string;
    ceiling: string;
    trim: string;
    accents: string;
  };
}

/**
 * Generate 4 mathematically harmonious palettes based on an active base hex
 */
export function generateHarmoniesFromBase(baseHex: string): GeneratedHarmonies {
  const hsl = hexToHsl(baseHex);

  // Complementary (Opposite 180 deg)
  const compHsl = { ...hsl, h: (hsl.h + 180) % 360 };
  const ceilingHsl = { ...hsl, s: Math.min(15, hsl.s), l: 96 };
  const trimHsl = { ...hsl, s: Math.min(20, hsl.s), l: 92 };

  // Monochromatic (Same hue, varied lightness/saturation)
  const monoLight = { ...hsl, l: Math.min(90, hsl.l + 25), s: Math.max(10, hsl.s - 15) };
  const monoDark = { ...hsl, l: Math.max(15, hsl.l - 30), s: Math.min(90, hsl.s + 10) };
  const monoMid = { ...hsl, l: Math.max(25, hsl.l - 15) };

  // Analogous (+30 deg, -30 deg)
  const ana1 = { ...hsl, h: (hsl.h + 30) % 360 };
  const ana2 = { ...hsl, h: (hsl.h - 30 + 360) % 360 };

  // Triadic (+120 deg, +240 deg)
  const tri1 = { ...hsl, h: (hsl.h + 120) % 360 };
  const tri2 = { ...hsl, h: (hsl.h + 240) % 360 };

  return {
    complementary: {
      name: 'Dynamic Complementary',
      mainWall: baseHex,
      accentWall: hslToHex(compHsl),
      ceiling: hslToHex(ceilingHsl),
      trim: hslToHex(trimHsl),
      accents: hslToHex({ ...compHsl, l: Math.min(85, compHsl.l + 15) }),
    },
    monochromatic: {
      name: 'Architectural Monochrome',
      mainWall: hslToHex(monoLight),
      accentWall: hslToHex(monoDark),
      ceiling: hslToHex(ceilingHsl),
      trim: hslToHex({ ...hsl, l: 95 }),
      accents: hslToHex(monoMid),
    },
    analogous: {
      name: 'Serene Analogous',
      mainWall: baseHex,
      accentWall: hslToHex(ana1),
      ceiling: hslToHex(ceilingHsl),
      trim: hslToHex(trimHsl),
      accents: hslToHex(ana2),
    },
    triadic: {
      name: 'Vibrant Triadic Balance',
      mainWall: baseHex,
      accentWall: hslToHex(tri1),
      ceiling: hslToHex(ceilingHsl),
      trim: hslToHex(trimHsl),
      accents: hslToHex(tri2),
    },
  };
}
