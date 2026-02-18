/**
 * Commercial Clay Bodies Database
 *
 * A curated list of popular commercial clay bodies used by potters.
 * Grouped by manufacturer/brand. Includes cone range and body color.
 *
 * Note: Thermal expansion coefficients are not yet included — that's a
 * future project requiring data scraping from manufacturer spec sheets.
 * For now, clay body selection is recorded for user context and future
 * crazing analysis improvements.
 */

export interface ClayBody {
  id: string;
  name: string;
  brand: string;
  type: 'stoneware' | 'porcelain' | 'earthenware';
  cone_range: string;
  color: string;
}

export const CLAY_BODIES: ClayBody[] = [
  // Laguna Clay
  {
    id: 'laguna-bmix5',
    name: 'B-Mix 5',
    brand: 'Laguna',
    type: 'stoneware',
    cone_range: '5–10',
    color: 'Off-white',
  },
  {
    id: 'laguna-bmix10',
    name: 'B-Mix with Sand',
    brand: 'Laguna',
    type: 'stoneware',
    cone_range: '5–10',
    color: 'Off-white speckled',
  },
  {
    id: 'laguna-frost',
    name: 'Frost',
    brand: 'Laguna',
    type: 'porcelain',
    cone_range: '6–10',
    color: 'White',
  },
  {
    id: 'laguna-707',
    name: '#707 Dark Brown',
    brand: 'Laguna',
    type: 'stoneware',
    cone_range: '5–10',
    color: 'Dark brown',
  },

  // Standard Ceramic Supply
  {
    id: 'standard-266',
    name: '#266',
    brand: 'Standard',
    type: 'stoneware',
    cone_range: '6–10',
    color: 'Buff',
  },
  {
    id: 'standard-182',
    name: '#182 Speckled Buff',
    brand: 'Standard',
    type: 'stoneware',
    cone_range: '4–6',
    color: 'Buff speckled',
  },
  {
    id: 'standard-365',
    name: '#365 Dark Brown',
    brand: 'Standard',
    type: 'stoneware',
    cone_range: '6–10',
    color: 'Dark brown',
  },
  {
    id: 'standard-130',
    name: '#130',
    brand: 'Standard',
    type: 'porcelain',
    cone_range: '6–10',
    color: 'White',
  },

  // Highwater Clays
  {
    id: 'highwater-loafers',
    name: 'Little Loafers',
    brand: 'Highwater',
    type: 'stoneware',
    cone_range: '6–10',
    color: 'Warm buff',
  },
  {
    id: 'highwater-redfox',
    name: 'Red Fox',
    brand: 'Highwater',
    type: 'stoneware',
    cone_range: '4–6',
    color: 'Terracotta',
  },
  {
    id: 'highwater-phoenix',
    name: 'Phoenix',
    brand: 'Highwater',
    type: 'porcelain',
    cone_range: '6–10',
    color: 'White',
  },

  // Sheffield Pottery / Other
  {
    id: 'coleman-porcelain',
    name: 'Coleman Porcelain',
    brand: 'Coleman',
    type: 'porcelain',
    cone_range: '8–12',
    color: 'Translucent white',
  },
  {
    id: 'aardvark-redrock',
    name: 'Red Rock',
    brand: 'Aardvark',
    type: 'stoneware',
    cone_range: '5–6',
    color: 'Red-brown',
  },

  // Generic catch-all
  {
    id: 'other-stoneware',
    name: 'Other Stoneware',
    brand: 'Other',
    type: 'stoneware',
    cone_range: '—',
    color: 'Varies',
  },
  {
    id: 'other-porcelain',
    name: 'Other Porcelain',
    brand: 'Other',
    type: 'porcelain',
    cone_range: '—',
    color: 'Varies',
  },
];

/** Group clay bodies by brand for display in a select dropdown. */
export function getClayBodiesByBrand(): { brand: string; bodies: ClayBody[] }[] {
  const map = new Map<string, ClayBody[]>();
  for (const body of CLAY_BODIES) {
    const list = map.get(body.brand) || [];
    list.push(body);
    map.set(body.brand, list);
  }
  return Array.from(map.entries()).map(([brand, bodies]) => ({ brand, bodies }));
}
