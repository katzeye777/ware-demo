/**
 * Demo API Layer
 *
 * Drop-in replacement for api.ts that runs entirely in the browser.
 * For the demo, accepts ANY color as a perfect match — no color engine needed.
 * Calls the Next.js API route for DALL-E preview images.
 *
 * When Matt is ready for MVP, swap imports back to api.ts with the real color engine.
 */

import type {
  GlazeDesignRequest,
  GlazeDesignResponse,
  ColorMatch,
  PublicGlaze,
} from './api';

// ── Glaze naming heuristics (simplified, uses RGB from hex) ──

function generateGlazeName(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const brightness = (r + g + b) / 3;
  const lightness = brightness > 200 ? 'Light' : brightness > 140 ? '' : brightness > 80 ? 'Deep' : 'Dark';

  let hue = '';
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max - min;

  if (sat < 30) {
    hue = brightness > 180 ? 'Ivory' : brightness > 100 ? 'Ash' : 'Charcoal';
  } else if (r > g && r > b) {
    hue = g > b + 40 ? 'Amber' : b > 100 ? 'Rose' : g > 80 ? 'Terracotta' : 'Coral';
  } else if (g > r && g > b) {
    hue = b > r ? 'Teal' : r > 100 ? 'Celadon' : 'Jade';
  } else if (b > r && b > g) {
    hue = r > g + 30 ? 'Plum' : r > 100 ? 'Slate Blue' : g > 100 ? 'Sky' : 'Cobalt';
  } else if (r > 200 && g > 150 && b < 100) {
    hue = 'Honey';
  } else if (r > 180 && g > 120) {
    hue = 'Sand';
  } else {
    hue = 'Stone';
  }

  return `${lightness} ${hue}`.trim();
}

// ── Pricing logic ──

function estimatePrice(batchSizeGrams: number, isPrivate: boolean): number {
  // $15 per 500g, scales linearly
  const base = (batchSizeGrams / 500) * 15;
  const privateSurcharge = isPrivate ? 4.99 : 0;
  return Math.round((base + privateSurcharge) * 100) / 100;
}

// ── Main API functions ──

export async function findGlaze(
  data: GlazeDesignRequest
): Promise<GlazeDesignResponse> {
  const hex = data.target_color_hex;
  const name = generateGlazeName(hex);

  // Demo mode: accept ANY color as a perfect match
  const primaryMatch: ColorMatch = {
    glaze_id: `demo-primary-${Date.now()}`,
    glaze_name: name,
    color_hex: hex,
    delta_e: 0.4 + Math.random() * 0.8, // Always "Excellent" range (< 2)
    confidence: 0.92 + Math.random() * 0.07, // 92-99%
    preview_image_url: undefined,
  };

  // Generate a couple plausible alternatives (slight variations of the chosen color)
  const alternatives: ColorMatch[] = [
    shiftColor(hex, 8),
    shiftColor(hex, -12),
  ].map((altHex, i) => ({
    glaze_id: `demo-alt-${i}-${Date.now()}`,
    glaze_name: generateGlazeName(altHex),
    color_hex: altHex,
    delta_e: 2.0 + Math.random() * 2.5, // "Good" range
    confidence: 0.78 + Math.random() * 0.12,
    preview_image_url: undefined,
  }));

  return {
    primary_match: primaryMatch,
    alternatives,
    out_of_gamut: false, // Demo: we can make everything
    out_of_gamut_reason: undefined,
    estimated_price: estimatePrice(data.batch_size_grams, false),
  };
}

/** Shift a hex color slightly to create plausible alternatives */
function shiftColor(hex: string, amount: number): string {
  const r = Math.min(255, Math.max(0, parseInt(hex.slice(1, 3), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(hex.slice(3, 5), 16) + amount + Math.round(Math.random() * 6 - 3)));
  const b = Math.min(255, Math.max(0, parseInt(hex.slice(5, 7), 16) - amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
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
