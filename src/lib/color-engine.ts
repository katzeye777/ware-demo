/**
 * Color Engine v4 — Confidence-weighted k-NN with CIEDE2000.
 *
 * Built on 2-dip master points: expert-selected color data from fired test tiles.
 * Each data point carries a confidence score (agreement between master pick
 * and image average). The engine uses confidence to weight its predictions.
 *
 * Models are separated by cone and atmosphere — never cross-pollinated.
 * Cone 6 oxidation, cone 10 oxidation, cone 6 reduction, etc. are independent.
 *
 * Prediction approach:
 *   - k-NN search in CIE Lab space using CIEDE2000 (perceptual distance)
 *   - Confidence-weighted IDW recipe interpolation from neighbors
 *   - Forward prediction validates the interpolated recipe
 *   - No component model or interaction corrections — clean k-NN only
 *
 * Runs entirely in the browser — no server needed.
 */

import type { ColorDataPoint, StainComponent } from './color-data';

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
  const rL = linearize(r / 255);
  const gL = linearize(g / 255);
  const bL = linearize(b / 255);

  let x = rL * 0.4124564 + gL * 0.3575761 + bL * 0.1804375;
  let y = rL * 0.2126729 + gL * 0.7151522 + bL * 0.0721750;
  let z = rL * 0.0193339 + gL * 0.1191920 + bL * 0.9503041;

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

export type Recipe = StainComponent[];

export interface ColorMatch {
  recipe: Recipe;
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

export interface DetailedNeighbor {
  recipe: Recipe;
  lab: [number, number, number];
  hex: string;
  delta_e: number;
  weight: number;
  confidence: number;
  generatable: boolean;
  cone: number;
}

export interface DetailedMatchResult {
  target_hex: string;
  target_lab: [number, number, number];
  interpolated_recipe: Recipe;
  predicted_lab: [number, number, number];
  predicted_hex: string;
  predicted_delta_e: number;
  nearest_neighbors: DetailedNeighbor[];
  stain_codes: string[];
  cone: number;
  atmosphere: string;
  data_points: number;
}

// ─── Stain name lookup ───────────────────────────────

const STAIN_NAMES: Record<string, string> = {
  '6000': 'Shell Pink',
  '6001': 'Alpine Rose',
  '6003': 'Crimson',
  '6006': 'Deep Crimson',
  '6020': 'Manganese Alumina Pink',
  '6021': 'Dark Red',
  '6025': 'Coral Red',
  '6026': 'Lobster',
  '6027': 'Tangerine',
  '6028': 'Orange',
  '6030': 'Mango',
  '6032': 'Coral',
  '6065': 'Chrome Alumina (Pink)',
  '6069': 'Dark Coral',
  '6088': 'Dark Red',
  '6097': 'Dark Red',
  '6100': 'Woodland',
  '6101': 'Chestnut',
  '6103': 'Golden',
  '6107': 'Dark Golden',
  '6264': 'Victoria Green',
  '6364': 'Turquoise',
  '6388': 'Mazzerine',
  '6450': 'Praseodymium',
  '6600': 'Black',
  'zircopax': 'Zircopax',
};

export function stainDisplayName(code: string): string {
  return STAIN_NAMES[code] || code;
}

// ─── Color Engine ────────────────────────────────────

const DELTA_E_THRESHOLD = 5.0;
const MAX_STAIN_PCT = 15.0;
const K_NEIGHBORS = 8;

export class ColorEngine {
  static readonly VERSION = '4.3.0';

  // All data points (generatable + reference) for Lab-space neighbor search
  private labPoints: [number, number, number][] = [];
  private recipes: Recipe[] = [];
  private confidences: number[] = [];
  private generatable: boolean[] = [];

  // Only base stain codes are used for recipe vectors
  private stainCodes: string[] = [];
  private recipeVectors: number[][] = [];

  private loaded = false;
  private _cone: number = 6;
  private _atmosphere: string = 'ox';
  private _dataPointCount = 0;
  private _generatableCount = 0;
  private _referenceCount = 0;

  /**
   * Base stains — the only stains the engine can output in recipes.
   * Extra stain data is kept for color landscape awareness but never
   * appears in generated recipes.
   */
  static readonly BASE_STAINS = new Set(['6026', '6264', '6364', '6388', '6450', '6600', 'zircopax']);

  /**
   * Load data filtered by cone and atmosphere.
   * Only matching data is loaded — models are never mixed.
   *
   * ALL data points participate in Lab-space neighbor search.
   * Only generatable points (base stains) are used for recipe interpolation.
   */
  loadDataset(data: ColorDataPoint[], cone: number = 6, atmosphere: string = 'ox'): number {
    this._cone = cone;
    this._atmosphere = atmosphere;

    const filtered = data.filter(d => d.cone === cone && d.atmosphere === atmosphere);

    // Recipe vectors use only the base stain codes
    this.stainCodes = [...ColorEngine.BASE_STAINS].sort();
    const codeIndex = new Map<string, number>();
    this.stainCodes.forEach((c, i) => codeIndex.set(c, i));
    const dim = this.stainCodes.length;

    this.labPoints = [];
    this.recipes = [];
    this.confidences = [];
    this.generatable = [];
    this.recipeVectors = [];

    for (const d of filtered) {
      this.labPoints.push([d.lab[0], d.lab[1], d.lab[2]]);
      this.recipes.push(d.recipe);
      this.confidences.push(d.confidence);
      this.generatable.push(d.generatable);

      // Recipe vector: only base stains get slots.
      // Reference points get zero vectors (they can't contribute recipes).
      const vec = new Array(dim).fill(0);
      if (d.generatable) {
        for (const s of d.recipe) {
          const idx = codeIndex.get(s.code);
          if (idx !== undefined) vec[idx] = s.pct;
        }
      }
      this.recipeVectors.push(vec);
    }

    this._dataPointCount = filtered.length;
    this._generatableCount = filtered.filter(d => d.generatable).length;
    this._referenceCount = this._dataPointCount - this._generatableCount;
    this.loaded = true;
    return filtered.length;
  }

  /**
   * Convert a recipe to a fixed-length vector in recipe space.
   */
  private recipeToVector(recipe: Recipe): number[] {
    const vec = new Array(this.stainCodes.length).fill(0);
    for (const s of recipe) {
      const idx = this.stainCodes.indexOf(s.code);
      if (idx >= 0) vec[idx] = s.pct;
    }
    return vec;
  }

  /**
   * Convert a recipe vector back to a sparse Recipe.
   */
  private vectorToRecipe(vec: number[]): Recipe {
    const recipe: Recipe = [];
    for (let i = 0; i < vec.length; i++) {
      if (vec[i] > 0.01) {
        recipe.push({
          code: this.stainCodes[i],
          pct: round3(Math.max(0, Math.min(MAX_STAIN_PCT, vec[i]))),
        });
      }
    }
    recipe.sort((a, b) => b.pct - a.pct);
    return recipe;
  }

  /**
   * Find the k nearest neighbors to a target Lab color.
   * ALL data points (generatable + reference) participate in the search.
   * Returns neighbors sorted by ΔE with confidence-weighted IDW weights.
   */
  private findNeighbors(
    targetLab: [number, number, number],
    k: number = K_NEIGHBORS,
  ): { index: number; de: number; weight: number; generatable: boolean }[] {
    const distances = this.labPoints.map((pt, i) => ({
      de: deltaE2000(targetLab, pt),
      index: i,
    }));

    distances.sort((a, b) => a.de - b.de);
    const nearest = distances.slice(0, Math.min(k, distances.length));

    // Confidence-weighted IDW: weight = confidence / (ΔE² + ε)
    // High-confidence tiles get more influence. Variable tiles get less.
    const weights = nearest.map(n => {
      const conf = this.confidences[n.index];
      return conf / (n.de * n.de + 1e-6);
    });
    const wSum = weights.reduce((a, b) => a + b, 0);

    return nearest.map((n, j) => ({
      index: n.index,
      de: n.de,
      weight: weights[j] / wSum,
      generatable: this.generatable[n.index],
    }));
  }

  /**
   * Interpolate a recipe from weighted neighbors.
   * ONLY generatable neighbors contribute to recipe interpolation.
   * Reference points (extra stains) have zero recipe vectors and are skipped.
   */
  private interpolateRecipe(
    neighbors: { index: number; de: number; weight: number; generatable: boolean }[],
  ): number[] {
    const dim = this.stainCodes.length;
    const vec = new Array(dim).fill(0);

    // Re-weight using only generatable neighbors
    const genNeighbors = neighbors.filter(n => n.generatable);
    if (genNeighbors.length === 0) {
      // No generatable neighbors — return empty recipe
      return vec;
    }

    const genWSum = genNeighbors.reduce((s, n) => s + n.weight, 0);

    for (const n of genNeighbors) {
      const w = n.weight / genWSum; // Re-normalized weight among generatable only
      const rv = this.recipeVectors[n.index];
      for (let i = 0; i < dim; i++) {
        vec[i] += w * rv[i];
      }
    }

    // Clamp
    for (let i = 0; i < dim; i++) {
      vec[i] = Math.max(0, Math.min(MAX_STAIN_PCT, vec[i]));
    }

    return vec;
  }

  /**
   * Predict Lab color directly from the weighted neighbor average.
   * Uses the same neighbors that produced the recipe — no second-pass lookup.
   * The neighbors' Lab values are real measured colors from fired tiles,
   * so their weighted average is the best estimate of what the recipe will produce.
   */
  private predictLabFromNeighbors(
    neighbors: { index: number; de: number; weight: number; generatable: boolean }[],
  ): [number, number, number] {
    let L = 0, a = 0, b = 0;
    for (const n of neighbors) {
      const pt = this.labPoints[n.index];
      L += n.weight * pt[0];
      a += n.weight * pt[1];
      b += n.weight * pt[2];
    }
    return [L, a, b];
  }

  /**
   * Main matching: target Lab → recipe + alternatives.
   */
  matchColor(targetLab: [number, number, number]): ColorMatchResult {
    if (!this.loaded) throw new Error('Color engine not loaded');

    const neighbors = this.findNeighbors(targetLab);
    const dim = this.stainCodes.length;

    // Interpolated recipe from confidence-weighted neighbors
    const primaryVec = this.interpolateRecipe(neighbors);
    const interpolatedRecipe = this.vectorToRecipe(primaryVec);
    // Predicted color = weighted average of neighbors' actual measured Lab values
    const predictedLab = this.predictLabFromNeighbors(neighbors);
    const predictedHex = rgbToHex(...labToRgb(...predictedLab));
    const interpolatedDe = deltaE2000(targetLab, predictedLab);

    // Average confidence of the neighborhood
    const avgConfidence = neighbors.slice(0, 5).reduce((s, n) => s + this.confidences[n.index] * n.weight, 0)
      / neighbors.slice(0, 5).reduce((s, n) => s + n.weight, 0);

    const candidates: ColorMatch[] = [];

    // Interpolated result
    candidates.push({
      recipe: interpolatedRecipe,
      predicted_lab: predictedLab,
      predicted_hex: predictedHex,
      delta_e: round2(interpolatedDe),
      confidence: round3(avgConfidence * deToConfidence(interpolatedDe)),
      explanation: 'Interpolated blend from nearest tested colors.',
    });

    // Individual nearest neighbors as alternatives
    for (let j = 0; j < Math.min(8, neighbors.length); j++) {
      const n = neighbors[j];
      const pt = this.labPoints[n.index];
      const altLab: [number, number, number] = [pt[0], pt[1], pt[2]];
      const altHex = rgbToHex(...labToRgb(...altLab));

      candidates.push({
        recipe: this.recipes[n.index],
        predicted_lab: altLab,
        predicted_hex: altHex,
        delta_e: round2(n.de),
        confidence: round3(this.confidences[n.index] * deToConfidence(n.de)),
        explanation: `Tested color #${j + 1} (ΔE=${n.de.toFixed(1)})`,
      });
    }

    // Sort by ΔE, deduplicate by hex
    candidates.sort((a, b) => a.delta_e - b.delta_e);
    const seen = new Set<string>();
    const unique: ColorMatch[] = [];
    for (const c of candidates) {
      if (!seen.has(c.predicted_hex)) {
        seen.add(c.predicted_hex);
        unique.push(c);
      }
    }

    const primary = unique[0];
    const alternatives = unique.slice(1, 4);

    return {
      primary_match: primary,
      alternatives,
      is_out_of_gamut: primary.delta_e > DELTA_E_THRESHOLD,
      gamut_explanation: primary.delta_e > DELTA_E_THRESHOLD
        ? `Best achievable ΔE is ${primary.delta_e.toFixed(1)} — this color may be outside our stain gamut.`
        : '',
    };
  }

  matchFromHex(hex: string): ColorMatchResult {
    const [r, g, b] = hexToRgb(hex);
    const lab = rgbToLab(r, g, b);
    return this.matchColor(lab);
  }

  /**
   * Detailed match for the recipe report — exposes neighbors, weights, confidences.
   */
  matchDetailedFromHex(hex: string): DetailedMatchResult {
    const [r, g, b] = hexToRgb(hex);
    const targetLab = rgbToLab(r, g, b);

    const neighbors = this.findNeighbors(targetLab);
    const primaryVec = this.interpolateRecipe(neighbors);
    const interpolatedRecipe = this.vectorToRecipe(primaryVec);
    // Predicted color = weighted average of neighbors' actual measured Lab values
    const predictedLab = this.predictLabFromNeighbors(neighbors);
    const predictedHex = rgbToHex(...labToRgb(...predictedLab));
    const predictedDe = deltaE2000(targetLab, predictedLab);

    const detailedNeighbors: DetailedNeighbor[] = neighbors.map(n => ({
      recipe: this.recipes[n.index],
      lab: [...this.labPoints[n.index]] as [number, number, number],
      hex: rgbToHex(...labToRgb(...this.labPoints[n.index])),
      delta_e: round2(n.de),
      weight: round3(n.weight),
      confidence: round3(this.confidences[n.index]),
      generatable: n.generatable,
      cone: this._cone,
    }));

    return {
      target_hex: hex,
      target_lab: targetLab,
      interpolated_recipe: interpolatedRecipe,
      predicted_lab: predictedLab,
      predicted_hex: predictedHex,
      predicted_delta_e: round2(predictedDe),
      nearest_neighbors: detailedNeighbors,
      stain_codes: [...this.stainCodes],
      cone: this._cone,
      atmosphere: this._atmosphere,
      data_points: this._dataPointCount,
    };
  }

  get isLoaded(): boolean { return this.loaded; }
  get dataPointCount(): number { return this._dataPointCount; }
  get generatablePointCount(): number { return this._generatableCount; }
  get referencePointCount(): number { return this._referenceCount; }
  get cone(): number { return this._cone; }
  get atmosphere(): string { return this._atmosphere; }
  get discoveredStainCodes(): string[] { return [...this.stainCodes]; }
}

// ─── Utilities ───────────────────────────────────────

function round2(n: number): number { return Math.round(n * 100) / 100; }
function round3(n: number): number { return Math.round(n * 1000) / 1000; }

/** Map ΔE to a 0–1 confidence score. ΔE < 1 → ~96%, ΔE 5 → ~80%, ΔE 20 → ~50%. */
function deToConfidence(de: number): number {
  return Math.max(0.1, Math.min(0.99, 1.0 / (1.0 + de * 0.04)));
}

// ─── Singleton ───────────────────────────────────────

export const colorEngine = new ColorEngine();
