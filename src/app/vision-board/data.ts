/**
 * Static Vision Board Data
 *
 * 8 pre-designed example glazes covering the color spectrum.
 * These showcase what Ware can do for the demo.
 * Preview images use colored placeholders; replace with
 * real DALL-E or SD images once generated.
 */

import type { PublicGlaze } from '@/lib/api';

export const VISION_BOARD_GLAZES: PublicGlaze[] = [
  {
    id: 'vb-coral-sunset',
    name: 'Coral Sunset',
    color_hex: '#e4533d',
    finish: 'glossy',
    preview_image_url: undefined,
    rating_avg: 4.8,
    rating_count: 24,
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'vb-ocean-depth',
    name: 'Ocean Depth',
    color_hex: '#1a5276',
    finish: 'glossy',
    preview_image_url: undefined,
    rating_avg: 4.9,
    rating_count: 31,
    created_at: '2026-01-12T10:00:00Z',
  },
  {
    id: 'vb-forest-canopy',
    name: 'Forest Canopy',
    color_hex: '#2e7d32',
    finish: 'satin',
    preview_image_url: undefined,
    rating_avg: 4.6,
    rating_count: 18,
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'vb-midnight-plum',
    name: 'Midnight Plum',
    color_hex: '#5b2c6f',
    finish: 'glossy',
    preview_image_url: undefined,
    rating_avg: 4.7,
    rating_count: 22,
    created_at: '2026-01-08T10:00:00Z',
  },
  {
    id: 'vb-sahara-sand',
    name: 'Sahara Sand',
    color_hex: '#c4a35a',
    finish: 'matte',
    preview_image_url: undefined,
    rating_avg: 4.5,
    rating_count: 15,
    created_at: '2026-01-06T10:00:00Z',
  },
  {
    id: 'vb-arctic-frost',
    name: 'Arctic Frost',
    color_hex: '#cce5ff',
    finish: 'glossy',
    preview_image_url: undefined,
    rating_avg: 4.9,
    rating_count: 28,
    created_at: '2026-01-04T10:00:00Z',
  },
  {
    id: 'vb-ember-glow',
    name: 'Ember Glow',
    color_hex: '#d4710e',
    finish: 'satin',
    preview_image_url: undefined,
    rating_avg: 4.4,
    rating_count: 12,
    created_at: '2026-01-02T10:00:00Z',
  },
  {
    id: 'vb-celadon-mist',
    name: 'Celadon Mist',
    color_hex: '#a8c5a0',
    finish: 'satin',
    preview_image_url: undefined,
    rating_avg: 4.8,
    rating_count: 20,
    created_at: '2025-12-30T10:00:00Z',
  },
];
