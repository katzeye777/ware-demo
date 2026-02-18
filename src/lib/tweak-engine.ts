/**
 * Tweak Engine — Glaze Modification Types + Demo Logic
 *
 * Defines the GlazeModification type and provides preset adjustments
 * for each troubleshooting path (temperature, texture, crazing).
 *
 * In demo mode: modifications are informational only. The engine
 * re-runs findGlaze() with the original color to show "what the
 * modified recipe would produce."
 *
 * In production: these modifications would be sent to the backend
 * which would adjust the actual oxide percentages in the recipe.
 */

export type ModificationType = 'reduce_boron' | 'increase_boron' | 'reduce_expansion';
export type ModificationIntensity = 'slight' | 'moderate' | 'aggressive';
export type TweakPath = 'temperature' | 'texture' | 'crazing';
export type CrazingSeverity = 'mild' | 'moderate' | 'severe';

export interface OxideAdjustment {
  oxide: string;
  direction: 'increase' | 'decrease';
  magnitude: string; // e.g., "10%", "3%"
}

export interface GlazeModification {
  type: ModificationType;
  intensity: ModificationIntensity;
  source_path: TweakPath;
  original_color_hex: string;
  original_glaze_id?: string;
  crazing_severity?: CrazingSeverity;
  clay_body?: string;
  description: string;
  adjustments: OxideAdjustment[];
}

/**
 * Preset oxide adjustments keyed by modification type + intensity.
 */
const PRESETS: Record<string, OxideAdjustment[]> = {
  'reduce_boron:slight': [
    { oxide: 'B₂O₃', direction: 'decrease', magnitude: '10%' },
    { oxide: 'SiO₂', direction: 'increase', magnitude: '3%' },
  ],
  'reduce_boron:moderate': [
    { oxide: 'B₂O₃', direction: 'decrease', magnitude: '20%' },
    { oxide: 'SiO₂', direction: 'increase', magnitude: '5%' },
    { oxide: 'Al₂O₃', direction: 'increase', magnitude: '2%' },
  ],
  'increase_boron:moderate': [
    { oxide: 'B₂O₃', direction: 'increase', magnitude: '15%' },
    { oxide: 'SiO₂', direction: 'decrease', magnitude: '3%' },
  ],
  'reduce_expansion:mild': [
    { oxide: 'Na₂O', direction: 'decrease', magnitude: '8%' },
    { oxide: 'SiO₂', direction: 'increase', magnitude: '5%' },
  ],
  'reduce_expansion:moderate': [
    { oxide: 'Na₂O', direction: 'decrease', magnitude: '15%' },
    { oxide: 'K₂O', direction: 'decrease', magnitude: '10%' },
    { oxide: 'SiO₂', direction: 'increase', magnitude: '8%' },
  ],
  'reduce_expansion:severe': [
    { oxide: 'Na₂O', direction: 'decrease', magnitude: '20%' },
    { oxide: 'K₂O', direction: 'decrease', magnitude: '15%' },
    { oxide: 'SiO₂', direction: 'increase', magnitude: '12%' },
    { oxide: 'B₂O₃', direction: 'increase', magnitude: '5%' },
  ],
};

/** Human-readable descriptions for each modification. */
const DESCRIPTIONS: Record<string, string> = {
  'reduce_boron:slight': 'Slightly reducing flux to control melting — should make the glaze a bit stiffer',
  'reduce_boron:moderate': 'Moderately reducing flux and adding alumina for better stability on vertical surfaces',
  'increase_boron:moderate': 'Increasing flux to achieve a smoother, more mature surface',
  'reduce_expansion:mild': 'Minor adjustment to lower thermal expansion and reduce crazing tendency',
  'reduce_expansion:moderate': 'Reducing alkali fluxes to bring thermal expansion in line with your clay body',
  'reduce_expansion:severe': 'Significant chemistry adjustment to address persistent crazing — replacing high-expansion alkalis with lower-expansion alternatives',
};

/**
 * Build a GlazeModification from the wizard's conclusion.
 */
export function buildModification(params: {
  type: ModificationType;
  intensity: ModificationIntensity;
  source_path: TweakPath;
  original_color_hex: string;
  original_glaze_id?: string;
  crazing_severity?: CrazingSeverity;
  clay_body?: string;
}): GlazeModification {
  const key = `${params.type}:${params.intensity}`;
  return {
    ...params,
    description: DESCRIPTIONS[key] || 'Recipe adjustment based on your diagnostic results',
    adjustments: PRESETS[key] || [],
  };
}

/**
 * Simulate crazing analysis from an uploaded photo.
 *
 * Without an OPENAI_API_KEY on the server, the API route returns a
 * simulated severity based on image file size. This client-side
 * fallback uses the same approach for pure-demo mode.
 *
 * @param imageDataUrl Base64 data URL of the uploaded photo
 * @returns Simulated severity based on data URL length hash
 */
export function simulateCrazingAnalysis(imageDataUrl: string): CrazingSeverity {
  // Use a simple hash of the data URL length for deterministic results
  const len = imageDataUrl.length;
  const hash = ((len * 2654435761) >>> 0) % 3;
  const severities: CrazingSeverity[] = ['mild', 'moderate', 'severe'];
  return severities[hash];
}

/**
 * Map crazing severity to the appropriate modification intensity.
 */
export function severityToIntensity(severity: CrazingSeverity): ModificationIntensity {
  switch (severity) {
    case 'mild': return 'slight';
    case 'moderate': return 'moderate';
    case 'severe': return 'aggressive';
  }
}

/**
 * Get a human-readable severity label with color class for badges.
 */
export function severityBadge(severity: CrazingSeverity): { label: string; className: string } {
  switch (severity) {
    case 'mild':
      return { label: 'Mild Crazing', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    case 'moderate':
      return { label: 'Moderate Crazing', className: 'bg-orange-100 text-orange-800 border-orange-300' };
    case 'severe':
      return { label: 'Severe Crazing', className: 'bg-red-100 text-red-800 border-red-300' };
  }
}
