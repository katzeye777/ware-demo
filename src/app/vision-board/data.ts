/**
 * Static Vision Board Data
 *
 * Community-style gallery of glazes across the full color spectrum.
 * Names feel like real makers created them. Ratings and dates are
 * spread realistically. Replace preview_image_url with real images
 * once the Stable Diffusion pipeline is live.
 */

import type { PublicGlaze } from '@/lib/api';

export const VISION_BOARD_GLAZES: PublicGlaze[] = [
  // ── Reds & Warm Pinks ──
  { id: 'vb-coral-sunset', name: 'Coral Sunset', color_hex: '#e4533d', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.8, rating_count: 24, created_at: '2026-01-15T10:00:00Z' },
  { id: 'vb-cherry-slip', name: 'Cherry Slip', color_hex: '#a4243b', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.7, rating_count: 19, created_at: '2026-02-03T14:20:00Z' },
  { id: 'vb-raku-blush', name: 'Raku Blush', color_hex: '#d4807d', finish: 'satin', preview_image_url: undefined, rating_avg: 4.5, rating_count: 11, created_at: '2026-01-22T09:15:00Z' },
  { id: 'vb-kiln-ember', name: 'Kiln Ember', color_hex: '#c0392b', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.9, rating_count: 37, created_at: '2025-12-18T16:00:00Z' },
  { id: 'vb-rosehip', name: 'Rosehip', color_hex: '#e8888a', finish: 'matte', preview_image_url: undefined, rating_avg: 4.3, rating_count: 8, created_at: '2026-02-10T11:30:00Z' },
  { id: 'vb-cranberry-field', name: 'Cranberry Field', color_hex: '#8b1a2b', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.6, rating_count: 14, created_at: '2026-01-05T08:45:00Z' },

  // ── Oranges & Ambers ──
  { id: 'vb-ember-glow', name: 'Ember Glow', color_hex: '#d4710e', finish: 'satin', preview_image_url: undefined, rating_avg: 4.4, rating_count: 12, created_at: '2026-01-02T10:00:00Z' },
  { id: 'vb-pumpkin-bisque', name: 'Pumpkin Bisque', color_hex: '#e07b39', finish: 'matte', preview_image_url: undefined, rating_avg: 4.6, rating_count: 21, created_at: '2025-11-28T13:00:00Z' },
  { id: 'vb-burnt-sienna', name: 'Burnt Sienna', color_hex: '#a0522d', finish: 'satin', preview_image_url: undefined, rating_avg: 4.8, rating_count: 33, created_at: '2025-12-09T10:30:00Z' },
  { id: 'vb-honey-drip', name: 'Honey Drip', color_hex: '#d4a03c', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.7, rating_count: 26, created_at: '2026-01-19T15:45:00Z' },
  { id: 'vb-autumn-leaf', name: 'Autumn Leaf', color_hex: '#c86b3a', finish: 'satin', preview_image_url: undefined, rating_avg: 4.4, rating_count: 9, created_at: '2026-02-07T12:00:00Z' },

  // ── Yellows & Golds ──
  { id: 'vb-sahara-sand', name: 'Sahara Sand', color_hex: '#c4a35a', finish: 'matte', preview_image_url: undefined, rating_avg: 4.5, rating_count: 15, created_at: '2026-01-06T10:00:00Z' },
  { id: 'vb-buttercream', name: 'Buttercream', color_hex: '#f5e6a8', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.6, rating_count: 18, created_at: '2026-01-28T09:00:00Z' },
  { id: 'vb-sunflower-field', name: 'Sunflower Field', color_hex: '#f0c14b', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.8, rating_count: 29, created_at: '2025-12-21T14:15:00Z' },
  { id: 'vb-ochre-trail', name: 'Ochre Trail', color_hex: '#b8860b', finish: 'matte', preview_image_url: undefined, rating_avg: 4.3, rating_count: 7, created_at: '2026-02-12T16:30:00Z' },
  { id: 'vb-lemon-curd', name: 'Lemon Curd', color_hex: '#ffe066', finish: 'satin', preview_image_url: undefined, rating_avg: 4.5, rating_count: 13, created_at: '2026-01-31T10:00:00Z' },

  // ── Greens ──
  { id: 'vb-forest-canopy', name: 'Forest Canopy', color_hex: '#2e7d32', finish: 'satin', preview_image_url: undefined, rating_avg: 4.6, rating_count: 18, created_at: '2026-01-10T10:00:00Z' },
  { id: 'vb-celadon-mist', name: 'Celadon Mist', color_hex: '#a8c5a0', finish: 'satin', preview_image_url: undefined, rating_avg: 4.8, rating_count: 20, created_at: '2025-12-30T10:00:00Z' },
  { id: 'vb-moss-garden', name: 'Moss Garden', color_hex: '#5e7a52', finish: 'matte', preview_image_url: undefined, rating_avg: 4.7, rating_count: 23, created_at: '2025-12-14T11:00:00Z' },
  { id: 'vb-jade-pool', name: 'Jade Pool', color_hex: '#4a9e7a', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.9, rating_count: 41, created_at: '2025-11-20T09:30:00Z' },
  { id: 'vb-sage-brush', name: 'Sage Brush', color_hex: '#8fae82', finish: 'matte', preview_image_url: undefined, rating_avg: 4.4, rating_count: 10, created_at: '2026-02-05T13:15:00Z' },
  { id: 'vb-eucalyptus', name: 'Eucalyptus', color_hex: '#6b9e8a', finish: 'satin', preview_image_url: undefined, rating_avg: 4.6, rating_count: 16, created_at: '2026-01-17T10:45:00Z' },
  { id: 'vb-spring-fern', name: 'Spring Fern', color_hex: '#7cb342', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.5, rating_count: 12, created_at: '2026-02-14T08:00:00Z' },

  // ── Teals & Turquoise ──
  { id: 'vb-tidal-pool', name: 'Tidal Pool', color_hex: '#2aa198', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.8, rating_count: 35, created_at: '2025-12-05T15:00:00Z' },
  { id: 'vb-sea-glass', name: 'Sea Glass', color_hex: '#7ec8b8', finish: 'satin', preview_image_url: undefined, rating_avg: 4.7, rating_count: 27, created_at: '2026-01-09T10:20:00Z' },
  { id: 'vb-copper-patina', name: 'Copper Patina', color_hex: '#4a8c7f', finish: 'matte', preview_image_url: undefined, rating_avg: 4.9, rating_count: 44, created_at: '2025-11-15T12:00:00Z' },

  // ── Blues ──
  { id: 'vb-ocean-depth', name: 'Ocean Depth', color_hex: '#1a5276', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.9, rating_count: 31, created_at: '2026-01-12T10:00:00Z' },
  { id: 'vb-arctic-frost', name: 'Arctic Frost', color_hex: '#cce5ff', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.9, rating_count: 28, created_at: '2026-01-04T10:00:00Z' },
  { id: 'vb-cobalt-dip', name: 'Cobalt Dip', color_hex: '#1b4f8a', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.8, rating_count: 38, created_at: '2025-12-02T09:00:00Z' },
  { id: 'vb-winter-sky', name: 'Winter Sky', color_hex: '#6fa3c7', finish: 'satin', preview_image_url: undefined, rating_avg: 4.5, rating_count: 14, created_at: '2026-01-26T14:00:00Z' },
  { id: 'vb-indigo-night', name: 'Indigo Night', color_hex: '#2c3e6b', finish: 'matte', preview_image_url: undefined, rating_avg: 4.7, rating_count: 22, created_at: '2025-12-25T10:00:00Z' },
  { id: 'vb-robin-egg', name: 'Robin Egg', color_hex: '#7ec8e3', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.6, rating_count: 17, created_at: '2026-02-01T11:00:00Z' },
  { id: 'vb-storm-cloud', name: 'Storm Cloud', color_hex: '#4a6a8a', finish: 'satin', preview_image_url: undefined, rating_avg: 4.4, rating_count: 9, created_at: '2026-02-09T15:30:00Z' },
  { id: 'vb-denim-wash', name: 'Denim Wash', color_hex: '#5b82a6', finish: 'matte', preview_image_url: undefined, rating_avg: 4.3, rating_count: 6, created_at: '2026-02-15T10:00:00Z' },

  // ── Purples & Violets ──
  { id: 'vb-midnight-plum', name: 'Midnight Plum', color_hex: '#5b2c6f', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.7, rating_count: 22, created_at: '2026-01-08T10:00:00Z' },
  { id: 'vb-lavender-haze', name: 'Lavender Haze', color_hex: '#b39ddb', finish: 'satin', preview_image_url: undefined, rating_avg: 4.6, rating_count: 19, created_at: '2026-01-20T09:45:00Z' },
  { id: 'vb-grape-skin', name: 'Grape Skin', color_hex: '#6a1b5e', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.5, rating_count: 11, created_at: '2026-02-06T13:00:00Z' },
  { id: 'vb-wisteria', name: 'Wisteria', color_hex: '#9575cd', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.8, rating_count: 30, created_at: '2025-12-12T10:30:00Z' },
  { id: 'vb-plum-shadow', name: 'Plum Shadow', color_hex: '#4a235a', finish: 'matte', preview_image_url: undefined, rating_avg: 4.4, rating_count: 8, created_at: '2026-02-11T16:00:00Z' },

  // ── Browns & Earthtones ──
  { id: 'vb-iron-rust', name: 'Iron Rust', color_hex: '#7b3f00', finish: 'matte', preview_image_url: undefined, rating_avg: 4.7, rating_count: 25, created_at: '2025-12-07T10:00:00Z' },
  { id: 'vb-chestnut-shell', name: 'Chestnut Shell', color_hex: '#6b4226', finish: 'satin', preview_image_url: undefined, rating_avg: 4.5, rating_count: 13, created_at: '2026-01-24T12:30:00Z' },
  { id: 'vb-clay-body', name: 'Clay Body', color_hex: '#b07d62', finish: 'matte', preview_image_url: undefined, rating_avg: 4.6, rating_count: 20, created_at: '2025-12-16T09:15:00Z' },
  { id: 'vb-walnut-stain', name: 'Walnut Stain', color_hex: '#5c4033', finish: 'satin', preview_image_url: undefined, rating_avg: 4.8, rating_count: 32, created_at: '2025-11-25T14:00:00Z' },
  { id: 'vb-terra-cotta', name: 'Terra Cotta', color_hex: '#c67a4b', finish: 'matte', preview_image_url: undefined, rating_avg: 4.4, rating_count: 10, created_at: '2026-02-08T11:00:00Z' },

  // ── Neutrals, Whites & Creams ──
  { id: 'vb-porcelain-white', name: 'Porcelain White', color_hex: '#f5f0e8', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.9, rating_count: 46, created_at: '2025-11-10T10:00:00Z' },
  { id: 'vb-raw-linen', name: 'Raw Linen', color_hex: '#e8dcc8', finish: 'matte', preview_image_url: undefined, rating_avg: 4.7, rating_count: 24, created_at: '2025-12-20T13:00:00Z' },
  { id: 'vb-bone-dry', name: 'Bone Dry', color_hex: '#d9cdb8', finish: 'matte', preview_image_url: undefined, rating_avg: 4.5, rating_count: 15, created_at: '2026-01-14T10:30:00Z' },
  { id: 'vb-oatmeal', name: 'Oatmeal', color_hex: '#c8b99a', finish: 'satin', preview_image_url: undefined, rating_avg: 4.6, rating_count: 18, created_at: '2026-01-30T09:00:00Z' },

  // ── Grays & Dark Neutrals ──
  { id: 'vb-slate-hearth', name: 'Slate Hearth', color_hex: '#5d6d7e', finish: 'matte', preview_image_url: undefined, rating_avg: 4.6, rating_count: 16, created_at: '2025-12-28T11:45:00Z' },
  { id: 'vb-charcoal-kiln', name: 'Charcoal Kiln', color_hex: '#3a3a3a', finish: 'satin', preview_image_url: undefined, rating_avg: 4.8, rating_count: 34, created_at: '2025-11-30T10:00:00Z' },
  { id: 'vb-ash-glaze', name: 'Ash Glaze', color_hex: '#8e8e8e', finish: 'satin', preview_image_url: undefined, rating_avg: 4.7, rating_count: 21, created_at: '2026-01-11T14:30:00Z' },
  { id: 'vb-iron-black', name: 'Iron Black', color_hex: '#1c1c1c', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.9, rating_count: 39, created_at: '2025-12-01T09:00:00Z' },
  { id: 'vb-pewter', name: 'Pewter', color_hex: '#6e6e6e', finish: 'matte', preview_image_url: undefined, rating_avg: 4.3, rating_count: 7, created_at: '2026-02-13T15:00:00Z' },
  { id: 'vb-woodfire-ash', name: 'Woodfire Ash', color_hex: '#a09880', finish: 'matte', preview_image_url: undefined, rating_avg: 4.5, rating_count: 11, created_at: '2026-02-04T10:15:00Z' },

  // ── Pinks & Soft Tones ──
  { id: 'vb-peony', name: 'Peony', color_hex: '#e8a0bf', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.7, rating_count: 26, created_at: '2025-12-22T10:00:00Z' },
  { id: 'vb-blush-slip', name: 'Blush Slip', color_hex: '#f0c9c9', finish: 'satin', preview_image_url: undefined, rating_avg: 4.5, rating_count: 14, created_at: '2026-01-27T11:30:00Z' },
  { id: 'vb-dusty-rose', name: 'Dusty Rose', color_hex: '#c4878e', finish: 'matte', preview_image_url: undefined, rating_avg: 4.6, rating_count: 17, created_at: '2026-01-03T09:45:00Z' },
  { id: 'vb-flamingo', name: 'Flamingo', color_hex: '#e07090', finish: 'glossy', preview_image_url: undefined, rating_avg: 4.4, rating_count: 10, created_at: '2026-02-16T12:00:00Z' },
];
