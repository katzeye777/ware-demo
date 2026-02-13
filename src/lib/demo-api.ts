/**
 * Demo API Layer
 *
 * Drop-in replacement for api.ts that runs entirely in the browser.
 * Uses the TypeScript color engine instead of the remote backend.
 * Calls the Next.js API route for DALL-E preview images.
 *
 * When Matt is ready for MVP, swap imports back to api.ts.
 */

import { colorEngine, hexToRgb, rgbToLab, rgbToHex, labToRgb } from './color-engine';
import { SYNTHETIC_COLOR_DATA } from './color-data';
import type {
  GlazeDesignRequest,
  GlazeDesignResponse,
  ColorMatch,
  PublicGlaze,
} from './api';

// ── Initialize the color engine on first import ──
let engineReady = false;

function ensureEngine() {
  if (!engineReady) {
    colorEngine.loadDataset(SYNTHETIC_COLOR_DATA);
    engineReady = true;
  }
}

// ── Glaze naming heuristics ──

function generateGlazeName(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const lab = rgbToLab(r, g, b);
  const [L, a, bVal] = lab;

  // Build a name from the color characteristics
  const lightness = L > 75 ? 'Light' : L > 50 ? '' : L > 30 ? 'Deep' : 'Dark';
  let hue = '';

  if (Math.abs(a) < 8 && Math.abs(bVal) < 8) {
    hue = L > 70 ? 'Ivory' : L > 40 ? 'Ash' : 'Charcoal';
  } else if (a > 15 && bVal > 15) {
    hue = bVal > a ? 'Amber' : 'Coral';
  } else if (a > 15 && bVal < -5) {
    hue = 'Plum';
  } else if (a > 5) {
    hue = bVal > 20 ? 'Terracotta' : 'Rose';
  } else if (a < -10 && bVal > 10) {
    hue = 'Jade';
  } else if (a < -10 && bVal < -10) {
    hue = 'Teal';
  } else if (a < -5) {
    hue = bVal > 0 ? 'Celadon' : 'Slate Blue';
  } else if (bVal > 30) {
    hue = 'Honey';
  } else if (bVal < -20) {
    hue = 'Cobalt';
  } else if (bVal > 10) {
    hue = 'Sand';
  } else {
    hue = 'Stone';
  }

  return `${lightness} ${hue}`.trim();
}

// ── Pricing logic ──

function estimatePrice(batchSizeGrams: number, isPrivate: boolean): number {
  // Base price: $0.08/gram, min $25
  const base = Math.max(25, batchSizeGrams * 0.08);
  const privateSurcharge = isPrivate ? 4.99 : 0;
  return Math.round((base + privateSurcharge) * 100) / 100;
}

// ── Main API functions ──

export async function findGlaze(
  data: GlazeDesignRequest
): Promise<GlazeDesignResponse> {
  ensureEngine();

  const hex = data.target_color_hex;
  const result = colorEngine.matchFromHex(hex);

  // Convert engine result to API-compatible format
  const primary = result.primary_match;
  const primaryHex = primary.predicted_hex;
  const primaryName = generateGlazeName(primaryHex);

  const primaryMatch: ColorMatch = {
    glaze_id: `demo-primary-${Date.now()}`,
    glaze_name: primaryName,
    color_hex: primaryHex,
    delta_e: primary.delta_e,
    confidence: primary.confidence,
    preview_image_url: undefined, // Set later if DALL-E is available
  };

  const alternatives: ColorMatch[] = result.alternatives.map((alt, i) => ({
    glaze_id: `demo-alt-${i}-${Date.now()}`,
    glaze_name: generateGlazeName(alt.predicted_hex),
    color_hex: alt.predicted_hex,
    delta_e: alt.delta_e,
    confidence: alt.confidence,
    preview_image_url: undefined,
  }));

  return {
    primary_match: primaryMatch,
    alternatives,
    out_of_gamut: result.is_out_of_gamut,
    out_of_gamut_reason: result.gamut_explanation || undefined,
    estimated_price: estimatePrice(data.batch_size_grams, false),
  };
}

export async function generatePreview(
  colorHex: string,
  finish: string = 'glossy'
): Promise<{ image_url: string; prompt_used: string }> {
  try {
    const response = await fetch('/api/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ color_hex: colorHex, finish }),
    });

    if (!response.ok) {
      throw new Error(`Preview API error: ${response.status}`);
    }

    return await response.json();
  } catch {
    // Fallback to colored placeholder
    const hex = colorHex.replace('#', '');
    return {
      image_url: `https://placehold.co/512x512/${hex}/white?text=Preview`,
      prompt_used: 'Placeholder (API unavailable)',
    };
  }
}

// ── Stub functions for UI compatibility ──

export async function saveGlaze(data: {
  name: string;
  target_color_hex: string;
  finish: string;
  batch_size_grams: number;
  selected_match_id: string;
  is_private: boolean;
}) {
  // In demo mode, save to localStorage
  const saved = {
    id: `saved-${Date.now()}`,
    user_id: 'demo-user',
    ...data,
    created_at: new Date().toISOString(),
    preview_image_url: undefined,
  };

  const existing = JSON.parse(localStorage.getItem('ware_saved_glazes') || '[]');
  existing.push(saved);
  localStorage.setItem('ware_saved_glazes', JSON.stringify(existing));

  return saved;
}

export function getUserGlazes() {
  return JSON.parse(localStorage.getItem('ware_saved_glazes') || '[]');
}

export function getPublicGlazes(): PublicGlaze[] {
  // Static Vision Board data — imported from vision-board/data.ts
  // This function is here for compatibility; the Vision Board page
  // imports its own static data directly.
  return [];
}

// ── Demo API singleton (matches api.ts interface shape) ──

export const demoApi = {
  findGlaze,
  generatePreview,
  saveGlaze,
  getUserGlazes,
  getPublicGlazes,
};
