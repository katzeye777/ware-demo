/**
 * SDS Recipe Computation — parse vision board filenames into
 * full ingredient lists for the SDS generator API.
 */

import type { StainComponent } from './color-data';

// Base glaze formula — percentages of the base (before stain additions).
// Raw values sum to 94.0; we normalize to 100% internally.
const BASE_GLAZE_RAW = [
  { material_name: 'Nepheline Syenite', pct: 35.2 },
  { material_name: 'Whiting',           pct: 18.5 },
  { material_name: 'Kaolin',            pct: 12.0 },
  { material_name: 'Silica',            pct: 15.8 },
  { material_name: 'Ferro Frit 3195',   pct: 10.5 },
  { material_name: 'Bentonite',         pct:  2.0 },
];

const BASE_SUM = BASE_GLAZE_RAW.reduce((s, m) => s + m.pct, 0);

const STAIN_DISPLAY_NAMES: Record<string, string> = {
  '6026': 'Mason 6026',
  '6300': 'Mason 6300',
  '6388': 'Mason 6388',
  '6450': 'Mason 6450',
  '6600': 'Mason 6600',
  '6790': 'Zircopax',
};

export interface SdsIngredient {
  material_name: string;
  target_weight_g: number;
  category: 'base' | 'stain';
}

/**
 * Parse a vision board image URL/path to extract stain recipe.
 *
 * Filename pattern: {stain1}_{pct1}_{stain2}_{pct2}_{cone}_{atm}_{dips}.JPG
 * Example: "6450_3.75_6026_1.25_6_ox_2.JPG" → [{code:'6450', pct:3.75}, {code:'6026', pct:1.25}]
 *
 * Returns null if the filename cannot be parsed.
 */
export function parseRecipeFromFilename(url: string): StainComponent[] | null {
  const filename = url.split('/').pop();
  if (!filename) return null;

  const stem = filename.replace(/\.\w+$/, '');
  const match = stem.match(
    /^(\d{4})_([\d.]+)_(\d{4})_([\d.]+)_(\d+)_(ox|red)_(\d+)$/
  );
  if (!match) return null;

  const stains: StainComponent[] = [];

  const pct1 = parseFloat(match[2]);
  if (pct1 > 0) stains.push({ code: match[1], pct: pct1 });

  const pct2 = parseFloat(match[4]);
  if (pct2 > 0) stains.push({ code: match[3], pct: pct2 });

  return stains.length > 0 ? stains : null;
}

/**
 * Build the full ingredient list with absolute gram weights for the SDS API.
 *
 * Stain percentages are additions on top of 100 parts base.
 * So total parts = 100 + sum(stain pcts), then scale to batchSizeGrams.
 */
export function buildSdsIngredients(
  stains: StainComponent[],
  batchSizeGrams: number
): SdsIngredient[] {
  const totalStainPct = stains.reduce((s, st) => s + st.pct, 0);
  const totalParts = 100 + totalStainPct;
  const gramsPerPart = batchSizeGrams / totalParts;

  // Base ingredients (normalized so their % sums to 100 of the base portion)
  const ingredients: SdsIngredient[] = BASE_GLAZE_RAW.map((mat) => ({
    material_name: mat.material_name,
    target_weight_g: Math.round(((mat.pct / BASE_SUM) * 100 * gramsPerPart) * 100) / 100,
    category: 'base' as const,
  }));

  // Stain additions
  for (const stain of stains) {
    ingredients.push({
      material_name: STAIN_DISPLAY_NAMES[stain.code] || `Mason ${stain.code}`,
      target_weight_g: Math.round((stain.pct * gramsPerPart) * 100) / 100,
      category: 'stain' as const,
    });
  }

  return ingredients;
}
