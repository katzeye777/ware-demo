/**
 * Color Engine v3 — Multi-component predictive blending.
 *
 * Takes a target color and returns an interpolated stain recipe with
 * confidence, ΔE, and alternatives. Uses CIE Lab with CIEDE2000.
 *
 * Key features:
 *   - Stain codes discovered from data — no hardcoded list
 *   - Recipes are variable-length arrays of {code, pct} pairs
 *   - Multi-component prediction: can predict three-way+ blends from
 *     two-way training data using component contribution modeling
 *   - k-NN with CIEDE2000 + IDW recipe interpolation
 *   - Forward prediction validates interpolated recipes
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

/** A recipe as returned by the engine — array of stain components. */
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

/** TEMPORARY: Detailed match result for recipe report / calibration review. */
export interface DetailedNeighbor {
  recipe: Recipe;
  lab: [number, number, number];
  hex: string;
  delta_e: number;
  weight: number;
  cone: number;
}

export interface StainContributionDetail {
  code: string;
  name: string;
  pct: number;
  delta_L: number;
  delta_a: number;
  delta_b: number;
}

export interface DetailedMatchResult {
  target_hex: string;
  target_lab: [number, number, number];
  interpolated_recipe: Recipe;
  knn_prediction: { lab: [number, number, number]; hex: string };
  component_prediction: { lab: [number, number, number]; hex: string } | null;
  additive_prediction: { lab: [number, number, number]; hex: string };
  base_lab: [number, number, number];
  stain_contributions: StainContributionDetail[];
  interaction_correction: { dL: number; da: number; db: number };
  hybrid_weights: { knn: number; component: number };
  nearest_neighbors: DetailedNeighbor[];
  stain_codes: string[];
}

// ─── Stain name lookup (for display) ─────────────────

const STAIN_NAMES: Record<string, string> = {
  '6026': 'Lobster',
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

/**
 * Stain contribution model: for each stain, we learn how it shifts Lab
 * values as a function of percentage. Built from single-stain data and
 * refined with two-way blend interaction data.
 */
interface StainContribution {
  code: string;
  /** Single-stain Lab curves: pct → Lab delta from base white */
  singleCurve: { pct: number; dL: number; da: number; db: number }[];
  /** Interaction corrections: stainB → pct pairs → Lab correction */
  interactions: Map<string, { pctA: number; pctB: number; dL: number; da: number; db: number }[]>;
}

export class ColorEngine {
  static readonly VERSION = '3.0.0';

  private labPoints: number[][] = [];
  private recipeVectors: number[][] = [];  // [N][numStainCodes] flattened recipe vectors
  private recipes: Recipe[] = [];          // [N] original recipes
  private stainCodes: string[] = [];       // ordered list of discovered stain codes
  private loaded = false;

  /** Base white Lab (glaze with no stain) — estimated from lightest data points */
  private baseLab: [number, number, number] = [92, -1, 5];

  /** Per-stain contribution models */
  private stainModels: Map<string, StainContribution> = new Map();

  /**
   * Load real test data. Discovers stain codes from the data itself.
   * Each recipe is flattened into a fixed-length vector for distance calculations.
   * Also builds per-stain contribution models for multi-component prediction.
   */
  loadDataset(data: ColorDataPoint[]): number {
    // Discover all stain codes
    const codeSet = new Set<string>();
    for (const d of data) {
      for (const s of d.recipe) codeSet.add(s.code);
    }
    this.stainCodes = [...codeSet].sort();

    // Build lookup: code → index
    const codeIndex = new Map<string, number>();
    this.stainCodes.forEach((c, i) => codeIndex.set(c, i));
    const dim = this.stainCodes.length;

    this.labPoints = [];
    this.recipeVectors = [];
    this.recipes = [];

    for (const d of data) {
      this.labPoints.push([d.lab[0], d.lab[1], d.lab[2]]);
      this.recipes.push(d.recipe);

      // Flatten recipe to vector
      const vec = new Array(dim).fill(0);
      for (const s of d.recipe) {
        const idx = codeIndex.get(s.code);
        if (idx !== undefined) vec[idx] = s.pct;
      }
      this.recipeVectors.push(vec);
    }

    // Build stain contribution models
    this.buildStainModels(data);

    this.loaded = true;
    return data.length;
  }

  /**
   * Build per-stain contribution models from the dataset.
   * - Single-stain entries give us direct pct → Lab curves
   * - Two-way blends give us interaction correction data
   * - Base white is a constant for our glaze system (clear glaze on porcelain)
   */
  private buildStainModels(data: ColorDataPoint[]) {
    // Base white: pure clear glaze on porcelain — a known constant.
    // L*~90, slightly warm. We do NOT estimate this from low-concentration
    // data because even 0.1% of some stains (e.g. Mazzerine) produce strong color.
    // This is the "zero point" from which all stain additions push.
    this.baseLab = [90, -1, 5];

    // Separate single-stain and two-way blend data
    const singleStainData = new Map<string, { pct: number; lab: number[] }[]>();
    const twoWayData: { codes: [string, string]; pcts: [number, number]; lab: number[] }[] = [];

    for (const d of data) {
      const stains = d.recipe.filter(s => s.pct > 0);
      if (stains.length === 1) {
        const code = stains[0].code;
        if (!singleStainData.has(code)) singleStainData.set(code, []);
        singleStainData.get(code)!.push({ pct: stains[0].pct, lab: d.lab });
      } else if (stains.length === 2) {
        const sorted = stains.sort((a, b) => a.code.localeCompare(b.code));
        twoWayData.push({
          codes: [sorted[0].code, sorted[1].code],
          pcts: [sorted[0].pct, sorted[1].pct],
          lab: d.lab,
        });
      }
    }

    // Build single-stain curves
    for (const code of this.stainCodes) {
      const entries = singleStainData.get(code) || [];
      const curve = entries.map(e => ({
        pct: e.pct,
        dL: e.lab[0] - this.baseLab[0],
        da: e.lab[1] - this.baseLab[1],
        db: e.lab[2] - this.baseLab[2],
      })).sort((a, b) => a.pct - b.pct);

      const model: StainContribution = {
        code,
        singleCurve: curve,
        interactions: new Map(),
      };

      this.stainModels.set(code, model);
    }

    // Build interaction corrections from two-way blends:
    // interaction = actual Lab - (base + singleA contribution + singleB contribution)
    for (const tw of twoWayData) {
      const [codeA, codeB] = tw.codes;
      const [pctA, pctB] = tw.pcts;

      const predA = this.interpolateSingleCurve(codeA, pctA);
      const predB = this.interpolateSingleCurve(codeB, pctB);

      if (predA && predB) {
        // Predicted without interaction
        const predL = this.baseLab[0] + predA.dL + predB.dL;
        const preda = this.baseLab[1] + predA.da + predB.da;
        const predb = this.baseLab[2] + predA.db + predB.db;

        // Correction = actual - predicted
        const correction = {
          pctA, pctB,
          dL: tw.lab[0] - predL,
          da: tw.lab[1] - preda,
          db: tw.lab[2] - predb,
        };

        const modelA = this.stainModels.get(codeA)!;
        if (!modelA.interactions.has(codeB)) modelA.interactions.set(codeB, []);
        modelA.interactions.get(codeB)!.push(correction);
      }
    }
  }

  /**
   * Interpolate a single-stain contribution curve at a given percentage.
   */
  private interpolateSingleCurve(code: string, pct: number): { dL: number; da: number; db: number } | null {
    const model = this.stainModels.get(code);
    if (!model || model.singleCurve.length === 0) return null;

    const curve = model.singleCurve;

    // Exact match
    const exact = curve.find(c => Math.abs(c.pct - pct) < 0.01);
    if (exact) return { dL: exact.dL, da: exact.da, db: exact.db };

    // Interpolate between nearest points
    let below = curve[0];
    let above = curve[curve.length - 1];

    for (const c of curve) {
      if (c.pct <= pct && c.pct >= below.pct) below = c;
      if (c.pct >= pct && c.pct <= above.pct) above = c;
    }

    if (below.pct === above.pct) {
      return { dL: below.dL, da: below.da, db: below.db };
    }

    // Linear scale — for extrapolation beyond our data range, scale linearly
    if (pct < curve[0].pct) {
      const scale = pct / curve[0].pct;
      return { dL: curve[0].dL * scale, da: curve[0].da * scale, db: curve[0].db * scale };
    }
    if (pct > curve[curve.length - 1].pct) {
      const last = curve[curve.length - 1];
      const scale = pct / last.pct;
      return { dL: last.dL * scale, da: last.da * scale, db: last.db * scale };
    }

    const t = (pct - below.pct) / (above.pct - below.pct);
    return {
      dL: below.dL + t * (above.dL - below.dL),
      da: below.da + t * (above.da - below.da),
      db: below.db + t * (above.db - below.db),
    };
  }

  /**
   * Predict color from a recipe using the component contribution model.
   * For multi-component recipes, sums individual stain contributions
   * and adds learned pairwise interaction corrections where available.
   *
   * This allows us to predict three-way+ blends from two-way data.
   */
  predictLabFromComponents(recipe: Recipe): [number, number, number] | null {
    const stains = recipe.filter(s => s.pct > 0);
    if (stains.length === 0) return [...this.baseLab] as [number, number, number];

    // Sum individual contributions
    let totalDL = 0, totalDa = 0, totalDb = 0;
    let hasContribution = false;

    for (const s of stains) {
      const contrib = this.interpolateSingleCurve(s.code, s.pct);
      if (contrib) {
        totalDL += contrib.dL;
        totalDa += contrib.da;
        totalDb += contrib.db;
        hasContribution = true;
      }
    }

    if (!hasContribution) return null;

    // Add pairwise interaction corrections (learned from two-way blends)
    for (let i = 0; i < stains.length; i++) {
      for (let j = i + 1; j < stains.length; j++) {
        const [sA, sB] = [stains[i], stains[j]].sort((a, b) => a.code.localeCompare(b.code));
        const modelA = this.stainModels.get(sA.code);
        if (!modelA) continue;

        const corrections = modelA.interactions.get(sB.code);
        if (!corrections || corrections.length === 0) continue;

        // Find nearest interaction correction by pct distance
        const correction = this.interpolateInteraction(corrections, sA.pct, sB.pct);
        if (correction) {
          totalDL += correction.dL;
          totalDa += correction.da;
          totalDb += correction.db;
        }
      }
    }

    return [
      Math.max(0, Math.min(100, this.baseLab[0] + totalDL)),
      this.baseLab[1] + totalDa,
      this.baseLab[2] + totalDb,
    ];
  }

  /**
   * Interpolate a pairwise interaction correction at given percentages.
   */
  private interpolateInteraction(
    corrections: { pctA: number; pctB: number; dL: number; da: number; db: number }[],
    pctA: number,
    pctB: number,
  ): { dL: number; da: number; db: number } | null {
    if (corrections.length === 0) return null;

    // IDW in 2D pct space
    let wSum = 0;
    let dL = 0, da = 0, db = 0;

    for (const c of corrections) {
      const dist = Math.sqrt((c.pctA - pctA) ** 2 + (c.pctB - pctB) ** 2);
      const w = 1 / (dist + 0.1);
      wSum += w;
      dL += w * c.dL;
      da += w * c.da;
      db += w * c.db;
    }

    return { dL: dL / wSum, da: da / wSum, db: db / wSum };
  }

  /** Convert a Recipe to a vector in recipe space. */
  private recipeToVector(recipe: Recipe): number[] {
    const vec = new Array(this.stainCodes.length).fill(0);
    for (const s of recipe) {
      const idx = this.stainCodes.indexOf(s.code);
      if (idx >= 0) vec[idx] = s.pct;
    }
    return vec;
  }

  /** Convert a recipe vector back to a Recipe (sparse representation). */
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
    // Sort by percentage descending
    recipe.sort((a, b) => b.pct - a.pct);
    return recipe;
  }

  /**
   * Forward prediction: recipe → predicted Lab color.
   *
   * Uses a hybrid approach:
   *   1. k-NN in recipe space (works great when training data is close)
   *   2. Component contribution model (works for novel combinations)
   *   3. Blend of both, weighted by k-NN distance (closer neighbors → more k-NN)
   */
  private predictLabFromRecipe(recipeVec: number[]): [number, number, number] {
    if (!this.loaded) throw new Error('Color engine not loaded');

    const dim = recipeVec.length;
    const dists = this.recipeVectors.map(rv => {
      let sum = 0;
      for (let i = 0; i < dim; i++) sum += (rv[i] - recipeVec[i]) ** 2;
      return Math.sqrt(sum);
    });

    const k = Math.min(5, dists.length);
    const nearest = dists
      .map((d, i) => ({ d, i }))
      .sort((a, b) => a.d - b.d)
      .slice(0, k);

    // Exact match
    if (nearest[0].d < 1e-6) {
      const pt = this.labPoints[nearest[0].i];
      return [pt[0], pt[1], pt[2]];
    }

    // k-NN IDW interpolation
    const weights = nearest.map(x => 1 / (x.d + 1e-8));
    const wSum = weights.reduce((a, b) => a + b, 0);

    let knnL = 0, knnA = 0, knnB = 0;
    for (let j = 0; j < k; j++) {
      const w = weights[j] / wSum;
      const pt = this.labPoints[nearest[j].i];
      knnL += w * pt[0];
      knnA += w * pt[1];
      knnB += w * pt[2];
    }

    // Component model prediction
    const recipe = this.vectorToRecipe(recipeVec);
    const componentPred = this.predictLabFromComponents(recipe);

    // If component model fails, fall back to k-NN only
    if (!componentPred) return [knnL, knnA, knnB];

    // Blend based on k-NN distance: close neighbors → trust k-NN more
    // Far from any training data → trust component model more
    const minDist = nearest[0].d;
    // At distance 0 → 100% k-NN, at distance 5+ → 50/50, at distance 15+ → 80% component
    const knnWeight = Math.max(0.2, Math.min(1.0, 1.0 / (1.0 + minDist * 0.15)));
    const compWeight = 1 - knnWeight;

    return [
      knnL * knnWeight + componentPred[0] * compWeight,
      knnA * knnWeight + componentPred[1] * compWeight,
      knnB * knnWeight + componentPred[2] * compWeight,
    ];
  }

  /** Main matching: target Lab → interpolated recipe + alternatives. */
  matchColor(targetLab: [number, number, number]): ColorMatchResult {
    if (!this.loaded) throw new Error('Color engine not loaded with dataset');

    const k = Math.min(12, this.labPoints.length);
    const dim = this.stainCodes.length;

    // Find k nearest neighbors using CIEDE2000 (perceptual distance)
    const distances = this.labPoints.map((pt, i) => ({
      de: deltaE2000(targetLab, [pt[0], pt[1], pt[2]]),
      index: i,
    })).sort((a, b) => a.de - b.de).slice(0, k);

    // IDW interpolation of top-k recipes (power=2 via 1/de²)
    const weights = distances.map(d => 1 / (d.de * d.de + 1e-8));
    const wSum = weights.reduce((a, b) => a + b, 0);

    const primaryVec = new Array(dim).fill(0);
    for (let j = 0; j < k; j++) {
      const w = weights[j] / wSum;
      const rv = this.recipeVectors[distances[j].index];
      for (let i = 0; i < dim; i++) {
        primaryVec[i] += w * rv[i];
      }
    }
    // Clamp
    for (let i = 0; i < dim; i++) {
      primaryVec[i] = Math.max(0, Math.min(MAX_STAIN_PCT, primaryVec[i]));
    }

    const interpolatedRecipe = this.vectorToRecipe(primaryVec);
    const predictedLab = this.predictLabFromRecipe(primaryVec);
    const predictedHex = rgbToHex(...labToRgb(...predictedLab));
    const interpolatedDe = deltaE2000(targetLab, predictedLab);

    // Build candidate list: interpolated + component model + individual nearest neighbors
    const candidates: ColorMatch[] = [];

    // Add the interpolated result
    candidates.push({
      recipe: interpolatedRecipe,
      predicted_lab: predictedLab,
      predicted_hex: predictedHex,
      delta_e: round2(interpolatedDe),
      confidence: round3(deToConfidence(interpolatedDe)),
      explanation: 'Interpolated blend from nearest tested colors.',
    });

    // Component model prediction for the interpolated recipe
    // This may give a better result for multi-component recipes
    const componentLab = this.predictLabFromComponents(interpolatedRecipe);
    if (componentLab) {
      const compHex = rgbToHex(...labToRgb(...componentLab));
      const compDe = deltaE2000(targetLab, componentLab);
      if (compHex !== predictedHex) {
        candidates.push({
          recipe: interpolatedRecipe,
          predicted_lab: componentLab,
          predicted_hex: compHex,
          delta_e: round2(compDe),
          confidence: round3(deToConfidence(compDe)),
          explanation: 'Predicted from component contribution model.',
        });
      }
    }

    // Add individual nearest neighbors
    for (let j = 0; j < Math.min(8, k); j++) {
      const idx = distances[j].index;
      const altLab: [number, number, number] = [
        this.labPoints[idx][0],
        this.labPoints[idx][1],
        this.labPoints[idx][2],
      ];
      const altHex = rgbToHex(...labToRgb(...altLab));
      const altDe = distances[j].de;

      candidates.push({
        recipe: this.recipes[idx],
        predicted_lab: altLab,
        predicted_hex: altHex,
        delta_e: round2(altDe),
        confidence: round3(deToConfidence(altDe)),
        explanation: `Tested color #${j + 1} (ΔE=${altDe.toFixed(1)})`,
      });
    }

    // Sort all candidates by ΔE — best match wins, whether interpolated or tested
    candidates.sort((a, b) => a.delta_e - b.delta_e);

    // Deduplicate by hex (keep lowest ΔE version)
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

    // Out-of-gamut: based on the best match we can actually produce
    const bestDe = primary.delta_e;
    const isOog = bestDe > DELTA_E_THRESHOLD;

    return {
      primary_match: primary,
      alternatives,
      is_out_of_gamut: isOog,
      gamut_explanation: '',
    };
  }

  matchFromHex(hex: string): ColorMatchResult {
    const [r, g, b] = hexToRgb(hex);
    const lab = rgbToLab(r, g, b);
    return this.matchColor(lab);
  }

  /**
   * Detailed match for the recipe report — exposes all compositional reasoning.
   * Returns the k-NN neighbors used, their weights, the interpolation math,
   * and the component model's per-stain contributions.
   *
   * TEMPORARY: for calibration review. Will be removed at deployment.
   */
  matchDetailedFromHex(hex: string): DetailedMatchResult {
    const [r, g, b] = hexToRgb(hex);
    const targetLab = rgbToLab(r, g, b);

    const k = Math.min(12, this.labPoints.length);
    const dim = this.stainCodes.length;

    // k-NN with CIEDE2000
    const distances = this.labPoints.map((pt, i) => ({
      de: deltaE2000(targetLab, [pt[0], pt[1], pt[2]]),
      index: i,
    })).sort((a, b) => a.de - b.de).slice(0, k);

    // IDW weights
    const weights = distances.map(d => 1 / (d.de * d.de + 1e-8));
    const wSum = weights.reduce((a, b) => a + b, 0);
    const normalizedWeights = weights.map(w => w / wSum);

    // Neighbors detail
    const neighbors: DetailedNeighbor[] = distances.map((d, j) => ({
      recipe: this.recipes[d.index],
      lab: [this.labPoints[d.index][0], this.labPoints[d.index][1], this.labPoints[d.index][2]] as [number, number, number],
      hex: rgbToHex(...labToRgb(this.labPoints[d.index][0], this.labPoints[d.index][1], this.labPoints[d.index][2])),
      delta_e: round2(d.de),
      weight: round3(normalizedWeights[j]),
      cone: 6, // We only show cone 6 in the engine currently
    }));

    // Interpolated recipe vector
    const primaryVec = new Array(dim).fill(0);
    for (let j = 0; j < k; j++) {
      const w = normalizedWeights[j];
      const rv = this.recipeVectors[distances[j].index];
      for (let i = 0; i < dim; i++) {
        primaryVec[i] += w * rv[i];
      }
    }
    for (let i = 0; i < dim; i++) {
      primaryVec[i] = Math.max(0, Math.min(MAX_STAIN_PCT, primaryVec[i]));
    }

    const interpolatedRecipe = this.vectorToRecipe(primaryVec);
    const knnLab = this.predictLabFromRecipe(primaryVec);
    const knnHex = rgbToHex(...labToRgb(...knnLab));

    // Component model breakdown
    const stains = interpolatedRecipe.filter(s => s.pct > 0);
    const stainContributions: StainContributionDetail[] = [];
    let sumDL = 0, sumDa = 0, sumDb = 0;

    for (const s of stains) {
      const contrib = this.interpolateSingleCurve(s.code, s.pct);
      if (contrib) {
        stainContributions.push({
          code: s.code,
          name: stainDisplayName(s.code),
          pct: round2(s.pct),
          delta_L: round2(contrib.dL),
          delta_a: round2(contrib.da),
          delta_b: round2(contrib.db),
        });
        sumDL += contrib.dL;
        sumDa += contrib.da;
        sumDb += contrib.db;
      }
    }

    // Additive prediction (before interaction corrections)
    const additiveLab: [number, number, number] = [
      Math.max(0, Math.min(100, this.baseLab[0] + sumDL)),
      this.baseLab[1] + sumDa,
      this.baseLab[2] + sumDb,
    ];

    // Full component prediction (with interaction corrections)
    const componentLab = this.predictLabFromComponents(interpolatedRecipe);
    const componentHex = componentLab ? rgbToHex(...labToRgb(...componentLab)) : null;

    // Interaction corrections total
    let interDL = 0, interDa = 0, interDb = 0;
    if (componentLab) {
      interDL = componentLab[0] - additiveLab[0];
      interDa = componentLab[1] - additiveLab[1];
      interDb = componentLab[2] - additiveLab[2];
    }

    // Hybrid blend info
    const minDist = distances[0].de;
    const knnWeight = Math.max(0.2, Math.min(1.0, 1.0 / (1.0 + minDist * 0.15)));

    return {
      target_hex: hex,
      target_lab: targetLab,
      interpolated_recipe: interpolatedRecipe,
      knn_prediction: { lab: knnLab, hex: knnHex },
      component_prediction: componentLab ? { lab: componentLab, hex: componentHex! } : null,
      additive_prediction: { lab: additiveLab, hex: rgbToHex(...labToRgb(...additiveLab)) },
      base_lab: [...this.baseLab] as [number, number, number],
      stain_contributions: stainContributions,
      interaction_correction: { dL: round2(interDL), da: round2(interDa), db: round2(interDb) },
      hybrid_weights: { knn: round3(knnWeight), component: round3(1 - knnWeight) },
      nearest_neighbors: neighbors,
      stain_codes: [...this.stainCodes],
    };
  }

  get isLoaded(): boolean {
    return this.loaded;
  }

  get dataPointCount(): number {
    return this.labPoints.length;
  }

  get discoveredStainCodes(): string[] {
    return [...this.stainCodes];
  }
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function round3(n: number): number { return Math.round(n * 1000) / 1000; }

/** Map ΔE to a 0–1 confidence score. ΔE < 1 → ~98%, ΔE 5 → ~75%, ΔE 20 → ~40%. */
function deToConfidence(de: number): number {
  return Math.max(0.1, Math.min(0.99, 1.0 / (1.0 + de * 0.04)));
}

// ─── Multi-component prediction utilities ───────────

/**
 * Predict what color a given recipe will produce, using the component
 * contribution model. Public API for testing multi-component blends.
 */
export function predictRecipeColor(
  engine: ColorEngine,
  recipe: Recipe,
): { lab: [number, number, number]; hex: string } | null {
  const lab = engine.predictLabFromComponents(recipe);
  if (!lab) return null;
  const hex = rgbToHex(...labToRgb(...lab));
  return { lab, hex };
}

// ─── Singleton ───────────────────────────────────────

export const colorEngine = new ColorEngine();
