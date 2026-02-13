/**
 * Color Engine — TypeScript port of the Python color engine.
 *
 * Takes a target color and returns a 5-stain recipe with confidence, ΔE,
 * and alternatives. Uses CIE Lab color space with CIEDE2000 for perceptual accuracy.
 *
 * Runs entirely in the browser — no server needed.
 */

// ─── Color Conversions ───────────────────────────────

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [clamp(r), clamp(g), clamp(b)]
    .map(v => v.toString(16).padStart(2, '0'))
    .join('');
}

function linearize(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function gamma(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

export function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  // Normalize to 0-1 and linearize
  const rL = linearize(r / 255);
  const gL = linearize(g / 255);
  const bL = linearize(b / 255);

  // sRGB to XYZ (D65)
  let x = rL * 0.4124564 + gL * 0.3575761 + bL * 0.1804375;
  let y = rL * 0.2126729 + gL * 0.7151522 + bL * 0.0721750;
  let z = rL * 0.0193339 + gL * 0.1191920 + bL * 0.9503041;

  // D65 reference white
  x /= 0.95047;
  y /= 1.0;
  z /= 1.08883;

  const f = (t: number) => t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116;

  const L = 116 * f(y) - 16;
  const a = 500 * (f(x) - f(y));
  const bVal = 200 * (f(y) - f(z));

  return [L, a, bVal];
}

export function labToRgb(L: number, a: number, bVal: number): [number, number, number] {
  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - bVal / 200;

  const invF = (t: number) => {
    const t3 = t * t * t;
    return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787;
  };

  const x = invF(fx) * 0.95047;
  const y = invF(fy) * 1.0;
  const z = invF(fz) * 1.08883;

  // XYZ to linear sRGB
  const rL = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  const gL = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
  const bL = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(Math.max(0, Math.min(1, gamma(v))) * 255)));

  return [clamp(rL), clamp(gL), clamp(bL)];
}

// ─── CIEDE2000 ΔE ────────────────────────────────────

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

export function deltaE2000(
  lab1: [number, number, number],
  lab2: [number, number, number]
): number {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;

  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const Cavg = (C1 + C2) / 2;
  const Cavg7 = Math.pow(Cavg, 7);
  const G = 0.5 * (1 - Math.sqrt(Cavg7 / (Cavg7 + Math.pow(25, 7))));

  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);

  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);

  let h1p = Math.atan2(b1, a1p) * DEG;
  if (h1p < 0) h1p += 360;
  let h2p = Math.atan2(b2, a2p) * DEG;
  if (h2p < 0) h2p += 360;

  const dL = L2 - L1;
  const dC = C2p - C1p;

  let dh: number;
  if (C1p * C2p === 0) {
    dh = 0;
  } else if (Math.abs(h2p - h1p) <= 180) {
    dh = h2p - h1p;
  } else if (h2p - h1p > 180) {
    dh = h2p - h1p - 360;
  } else {
    dh = h2p - h1p + 360;
  }

  const dH = 2 * Math.sqrt(C1p * C2p) * Math.sin((dh / 2) * RAD);

  const Lavg = (L1 + L2) / 2;
  const Cavgp = (C1p + C2p) / 2;

  let havg: number;
  if (C1p * C2p === 0) {
    havg = h1p + h2p;
  } else if (Math.abs(h1p - h2p) <= 180) {
    havg = (h1p + h2p) / 2;
  } else if (h1p + h2p < 360) {
    havg = (h1p + h2p + 360) / 2;
  } else {
    havg = (h1p + h2p - 360) / 2;
  }

  const T = 1
    - 0.17 * Math.cos((havg - 30) * RAD)
    + 0.24 * Math.cos(2 * havg * RAD)
    + 0.32 * Math.cos((3 * havg + 6) * RAD)
    - 0.20 * Math.cos((4 * havg - 63) * RAD);

  const SL = 1 + 0.015 * Math.pow(Lavg - 50, 2) / Math.sqrt(20 + Math.pow(Lavg - 50, 2));
  const SC = 1 + 0.045 * Cavgp;
  const SH = 1 + 0.015 * Cavgp * T;

  const Cavgp7 = Math.pow(Cavgp, 7);
  const RT = -2 * Math.sqrt(Cavgp7 / (Cavgp7 + Math.pow(25, 7)))
    * Math.sin(60 * Math.exp(-Math.pow((havg - 275) / 25, 2)) * RAD);

  return Math.sqrt(
    Math.pow(dL / SL, 2)
    + Math.pow(dC / SC, 2)
    + Math.pow(dH / SH, 2)
    + RT * (dC / SC) * (dH / SH)
  );
}

// ─── Data Structures ─────────────────────────────────

export interface StainRecipe {
  red_pct: number;
  blue_pct: number;
  yellow_pct: number;
  black_pct: number;
  white_pct: number;
}

export interface ColorMatch {
  recipe: StainRecipe;
  predicted_lab: [number, number, number];
  predicted_hex: string;
  delta_e: number;
  confidence: number;
  explanation: string;
}

export interface ColorMatchResult {
  primary_match: ColorMatch;
  alternatives: ColorMatch[];
  is_out_of_gamut: boolean;
  gamut_explanation: string;
}

export interface ColorTestDataPoint {
  stain_red_pct: number;
  stain_blue_pct: number;
  stain_yellow_pct: number;
  stain_black_pct: number;
  stain_white_pct: number;
  result_lab_l: number;
  result_lab_a: number;
  result_lab_b: number;
}

// ─── Color Engine ────────────────────────────────────

const DELTA_E_THRESHOLD = 5.0;
const MAX_STAIN_PCT = 15.0;

export class ColorEngine {
  static readonly VERSION = '0.1.0';

  private labPoints: number[][] = [];      // [N][3] Lab values
  private stainRecipes: number[][] = [];   // [N][5] stain percentages
  private loaded = false;

  loadDataset(data: ColorTestDataPoint[]): number {
    this.labPoints = data.map(d => [d.result_lab_l, d.result_lab_a, d.result_lab_b]);
    this.stainRecipes = data.map(d => [
      d.stain_red_pct, d.stain_blue_pct, d.stain_yellow_pct,
      d.stain_black_pct, d.stain_white_pct,
    ]);
    this.loaded = true;
    return data.length;
  }

  private predictLabFromRecipe(recipe: number[]): [number, number, number] {
    if (!this.loaded) throw new Error('Color engine not loaded');

    // Compute distances in recipe space
    const dists = this.stainRecipes.map(sr => {
      let sum = 0;
      for (let i = 0; i < 5; i++) sum += (sr[i] - recipe[i]) ** 2;
      return Math.sqrt(sum);
    });

    const k = Math.min(5, dists.length);
    const indices = dists
      .map((d, i) => ({ d, i }))
      .sort((a, b) => a.d - b.d)
      .slice(0, k);

    // Exact match check
    if (indices[0].d < 1e-6) {
      const pt = this.labPoints[indices[0].i];
      return [pt[0], pt[1], pt[2]];
    }

    // Inverse-distance weighted interpolation
    const weights = indices.map(x => 1 / (x.d + 1e-8));
    const wSum = weights.reduce((a, b) => a + b, 0);

    let L = 0, a = 0, b = 0;
    for (let j = 0; j < k; j++) {
      const w = weights[j] / wSum;
      const pt = this.labPoints[indices[j].i];
      L += w * pt[0];
      a += w * pt[1];
      b += w * pt[2];
    }

    return [L, a, b];
  }

  matchColor(targetLab: [number, number, number]): ColorMatchResult {
    if (!this.loaded) throw new Error('Color engine not loaded with dataset');

    const k = Math.min(8, this.labPoints.length);

    // Find k nearest neighbors in Lab space
    const distances = this.labPoints.map((pt, i) => ({
      dist: Math.sqrt(
        (pt[0] - targetLab[0]) ** 2 +
        (pt[1] - targetLab[1]) ** 2 +
        (pt[2] - targetLab[2]) ** 2
      ),
      index: i,
    })).sort((a, b) => a.dist - b.dist).slice(0, k);

    // Primary: IDW interpolation of top-k
    const weights = distances.map(d => 1 / (d.dist + 1e-8));
    const wSum = weights.reduce((a, b) => a + b, 0);

    const primaryRecipe = [0, 0, 0, 0, 0];
    for (let j = 0; j < k; j++) {
      const w = weights[j] / wSum;
      const sr = this.stainRecipes[distances[j].index];
      for (let i = 0; i < 5; i++) {
        primaryRecipe[i] += w * sr[i];
      }
    }
    // Clamp
    for (let i = 0; i < 5; i++) {
      primaryRecipe[i] = Math.max(0, Math.min(MAX_STAIN_PCT, primaryRecipe[i]));
    }

    const predictedLab = this.predictLabFromRecipe(primaryRecipe);
    const predictedHex = rgbToHex(...labToRgb(...predictedLab));
    const de = deltaE2000(targetLab, predictedLab);
    const confidence = Math.max(0.1, Math.min(1.0, 1.0 - distances[0].dist / 50));

    const primary: ColorMatch = {
      recipe: {
        red_pct: round3(primaryRecipe[0]),
        blue_pct: round3(primaryRecipe[1]),
        yellow_pct: round3(primaryRecipe[2]),
        black_pct: round3(primaryRecipe[3]),
        white_pct: round3(primaryRecipe[4]),
      },
      predicted_lab: predictedLab,
      predicted_hex: predictedHex,
      delta_e: round2(de),
      confidence: round3(confidence),
      explanation: 'Best interpolated match from tested color data.',
    };

    // Alternatives: individual nearest neighbors
    const alternatives: ColorMatch[] = [];
    for (let j = 0; j < Math.min(5, k); j++) {
      const idx = distances[j].index;
      const sr = this.stainRecipes[idx];
      const altLab: [number, number, number] = [
        this.labPoints[idx][0],
        this.labPoints[idx][1],
        this.labPoints[idx][2],
      ];
      const altHex = rgbToHex(...labToRgb(...altLab));
      const altDe = deltaE2000(targetLab, altLab);
      const altConf = Math.max(0.1, Math.min(1.0, 1.0 - distances[j].dist / 50));

      alternatives.push({
        recipe: {
          red_pct: round3(Math.max(0, Math.min(MAX_STAIN_PCT, sr[0]))),
          blue_pct: round3(Math.max(0, Math.min(MAX_STAIN_PCT, sr[1]))),
          yellow_pct: round3(Math.max(0, Math.min(MAX_STAIN_PCT, sr[2]))),
          black_pct: round3(Math.max(0, Math.min(MAX_STAIN_PCT, sr[3]))),
          white_pct: round3(Math.max(0, Math.min(MAX_STAIN_PCT, sr[4]))),
        },
        predicted_lab: altLab,
        predicted_hex: altHex,
        delta_e: round2(altDe),
        confidence: round3(altConf),
        explanation: `Nearest tested color #${j + 1} (ΔE=${altDe.toFixed(1)})`,
      });
    }

    // Sort alternatives by ΔE, take top 4
    alternatives.sort((a, b) => a.delta_e - b.delta_e);
    const topAlternatives = alternatives.slice(0, 4);

    // Out-of-gamut check
    const isOog = de > DELTA_E_THRESHOLD;
    const gamutMsg = isOog
      ? `The target color is outside the achievable gamut of our current stain set. The closest match has a ΔE of ${de.toFixed(1)} (perceptible difference). Alternatives are ranked by closeness.`
      : '';

    return {
      primary_match: primary,
      alternatives: topAlternatives,
      is_out_of_gamut: isOog,
      gamut_explanation: gamutMsg,
    };
  }

  matchFromHex(hex: string): ColorMatchResult {
    const [r, g, b] = hexToRgb(hex);
    const lab = rgbToLab(r, g, b);
    return this.matchColor(lab);
  }

  get isLoaded(): boolean {
    return this.loaded;
  }

  get dataPointCount(): number {
    return this.labPoints.length;
  }
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function round3(n: number): number { return Math.round(n * 1000) / 1000; }

// ─── Singleton ───────────────────────────────────────

export const colorEngine = new ColorEngine();
