/**
 * Pricing engine — single source of truth for all CMW glaze pricing.
 *
 * Dry powder: $15/pint (350g) = $0.04286/g base rate.
 * 500g = $21.43 at base rate. Volume discount (3% compounding per
 * 500g step above 500g, capped at 40%) kicks in at 1kg+.
 *
 * Wet/pre-mixed: fixed flat prices — $25 pint, $150 gallon.
 */

// ─── Constants ───────────────────────────────────────────────────

export const PRICE_PER_PINT = 15.0;   // $15 for a pint (350g)
export const PINT_GRAMS = 350;
export const BASE_RATE = PRICE_PER_PINT / PINT_GRAMS;  // ~$0.04286/g
export const DISCOUNT_THRESHOLD = 500;  // discount kicks in above this
export const STEP_SIZE = 500;
export const DISCOUNT_PER_STEP = 0.03; // 3% compounding per 500g step
export const MAX_DISCOUNT = 0.40;      // 40% cap

export const PRIVATE_SURCHARGE = 4.99;
export const SHIPPING_FLAT = 8.99;
export const TAX_RATE = 0.08;

// ─── Dry Batch Sizes ─────────────────────────────────────────────

export interface BatchSizeOption {
  value: number;
  label: string;
  imperial: string;
}

export const DRY_BATCH_SIZES: BatchSizeOption[] = [
  { value: 350,   label: 'Pint (350g)',             imperial: '12.3 oz' },
  { value: 500,   label: '500g',                    imperial: '1.1 lb' },
  { value: 1000,  label: '1 kg',                    imperial: '2.2 lb' },
  { value: 1500,  label: '1.5 kg',                  imperial: '3.3 lb' },
  { value: 2000,  label: '2 kg',                    imperial: '4.4 lb' },
  { value: 2500,  label: '2.5 kg',                  imperial: '5.5 lb' },
  { value: 3000,  label: '3 kg',                    imperial: '6.6 lb' },
  { value: 4000,  label: '4 kg',                    imperial: '8.8 lb' },
  { value: 5000,  label: '5 kg',                    imperial: '11 lb' },
  { value: 7500,  label: '7.5 kg',                  imperial: '16.5 lb' },
  { value: 10000, label: '10 kg',                   imperial: '22 lb' },
  { value: 15000, label: '5 Gallon Bucket (15 kg)', imperial: '33 lb' },
];

// ─── Wet Batch Sizes (fixed, only 3 options) ────────────────────

export type WetSize = 'pint' | 'gallon';

export interface WetBatchSizeOption {
  key: WetSize;
  label: string;
  sublabel: string;
}

export const WET_BATCH_SIZES: WetBatchSizeOption[] = [
  { key: 'pint',    label: '1 Pint',     sublabel: '~473 ml' },
  { key: 'gallon',  label: '1 Gallon',   sublabel: '~3.8 L' },
];

// Map wet sizes to approximate gram equivalents (for cart/API compatibility)
export const WET_SIZE_GRAMS: Record<WetSize, number> = {
  pint: 350,
  gallon: 3000,
};

// ─── Price Calculations ─────────────────────────────────────────

/**
 * Calculate the volume discount percentage for a given gram amount.
 * Returns 0 for <= 500g, up to MAX_DISCOUNT for large orders.
 */
export function getVolumeDiscount(grams: number): number {
  if (grams <= DISCOUNT_THRESHOLD) return 0;

  const steps = Math.floor((grams - DISCOUNT_THRESHOLD) / STEP_SIZE);
  const rawDiscount = 1 - Math.pow(1 - DISCOUNT_PER_STEP, steps);
  return Math.min(rawDiscount, MAX_DISCOUNT);
}

/**
 * Calculate dry powder price with volume discount.
 * Base rate: $15/350g = ~$0.04286/g (linear up to 500g).
 * Above 500g: 3% compounding discount per 500g step, capped at 40%.
 */
export function calculateDryPrice(grams: number): number {
  if (grams <= DISCOUNT_THRESHOLD) {
    // Linear pricing: $0.04286/g
    return Math.round(grams * BASE_RATE * 100) / 100;
  }

  const discount = getVolumeDiscount(grams);
  const discountedRate = BASE_RATE * (1 - discount);

  return Math.round(grams * discountedRate * 100) / 100;
}

// Flat wet prices by size
const WET_PRICES: Record<WetSize, number> = {
  pint:   25.00,
  gallon: 150.00,
};

/**
 * Get the fixed price for a wet/pre-mixed size.
 */
export function calculateWetPrice(size: WetSize): number {
  return WET_PRICES[size];
}

/**
 * Unified price calculation.
 * For dry: pass grams.
 * For wet: pass the gram equivalent from WET_SIZE_GRAMS.
 */
export function calculatePrice(
  grams: number,
  format: 'dry' | 'wet' = 'dry',
  wetSize?: WetSize,
): number {
  if (format === 'wet' && wetSize) {
    return calculateWetPrice(wetSize);
  }
  return calculateDryPrice(grams);
}

/**
 * Format a price as a display string (e.g., "$15.00").
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Estimate price for the demo API response.
 * Replaces the old estimatePrice function from demo-api.ts.
 */
export function estimatePrice(
  batchSizeGrams: number,
  isPrivate: boolean,
  format: 'dry' | 'wet' = 'dry',
  wetSize?: WetSize,
): number {
  const base = calculatePrice(batchSizeGrams, format, wetSize);
  const privateSurcharge = isPrivate ? PRIVATE_SURCHARGE : 0;
  return Math.round((base + privateSurcharge) * 100) / 100;
}
