/**
 * Vision Board Data — Real Fired Test Tiles (Oxidation Only)
 *
 * Every glaze shown here was actually fired in our kilns.
 * Colors are measured from the color engine (CIE Lab → hex).
 * Images are double-thickness (2-dip) test tiles photographed
 * under controlled studio lighting.
 *
 * All tiles are cone 6 oxidation — clean, craze-free surfaces.
 * Finish is 'glossy' for all — our base glaze is a glossy formulation.
 */

import type { PublicGlaze } from '@/lib/api';

export const VISION_BOARD_GLAZES: PublicGlaze[] = [
  // ── Blues & Indigos ──
  { id: 'vb-midnight-ink', name: 'Midnight Ink', color_hex: '#201d54', finish: 'glossy', preview_image_url: '/vision-board/6388_1_6026_0.5_6_ox_2.JPG', rating_avg: 4.9, rating_count: 42, created_at: '2025-12-01T10:00:00Z' },
  { id: 'vb-storm-navy', name: 'Storm Navy', color_hex: '#2f2759', finish: 'glossy', preview_image_url: '/vision-board/6388_1_6026_1.25_6_ox_2.JPG', rating_avg: 4.9, rating_count: 40, created_at: '2025-11-30T09:00:00Z' },
  { id: 'vb-cobalt-sapphire', name: 'Cobalt Sapphire', color_hex: '#262766', finish: 'glossy', preview_image_url: '/vision-board/6026_0.75_6388_0.5_6_ox_2.JPG', rating_avg: 4.8, rating_count: 35, created_at: '2025-12-10T09:00:00Z' },
  { id: 'vb-ink-wash', name: 'Ink Wash', color_hex: '#2c2646', finish: 'glossy', preview_image_url: '/vision-board/6388_1_6026_1.5_6_ox_2.JPG', rating_avg: 4.9, rating_count: 43, created_at: '2025-11-15T10:00:00Z' },
  { id: 'vb-royal-grape', name: 'Royal Grape', color_hex: '#322a4f', finish: 'glossy', preview_image_url: '/vision-board/6388_1_6026_1.75_6_ox_2.JPG', rating_avg: 4.8, rating_count: 36, created_at: '2025-12-16T09:15:00Z' },
  { id: 'vb-electric-cobalt', name: 'Electric Cobalt', color_hex: '#25256f', finish: 'glossy', preview_image_url: '/vision-board/6388_1_6450_1.5_6_ox_2.JPG', rating_avg: 4.9, rating_count: 39, created_at: '2025-11-20T14:00:00Z' },
  { id: 'vb-twilight-blue', name: 'Twilight Blue', color_hex: '#282868', finish: 'glossy', preview_image_url: '/vision-board/6026_0.875_6388_0.5_6_ox_2.JPG', rating_avg: 4.8, rating_count: 33, created_at: '2025-12-30T10:00:00Z' },

  // ── Teals & Deep Ocean ──
  { id: 'vb-deep-ocean', name: 'Deep Ocean', color_hex: '#294053', finish: 'glossy', preview_image_url: '/vision-board/6450_3.75_6388_0.5_6_ox_2.JPG', rating_avg: 4.8, rating_count: 35, created_at: '2025-12-05T12:00:00Z' },
  { id: 'vb-deep-petrol', name: 'Deep Petrol', color_hex: '#2d4756', finish: 'glossy', preview_image_url: '/vision-board/6450_3.75_6388_0.45_6_ox_2.JPG', rating_avg: 4.8, rating_count: 35, created_at: '2025-12-12T10:30:00Z' },
  { id: 'vb-deep-teal', name: 'Deep Teal', color_hex: '#2d4642', finish: 'glossy', preview_image_url: '/vision-board/6450_7.5_6388_0.9_6_ox_2.JPG', rating_avg: 4.8, rating_count: 33, created_at: '2025-12-28T11:45:00Z' },
  { id: 'vb-dark-cypress', name: 'Dark Cypress', color_hex: '#213535', finish: 'glossy', preview_image_url: '/vision-board/6388_1_6450_6.75_6_ox_2.JPG', rating_avg: 4.7, rating_count: 28, created_at: '2026-01-14T10:30:00Z' },
  { id: 'vb-midnight-sea', name: 'Midnight Sea', color_hex: '#1f2e41', finish: 'glossy', preview_image_url: '/vision-board/6388_1_6450_4.5_6_ox_2.JPG', rating_avg: 4.8, rating_count: 33, created_at: '2025-12-09T10:30:00Z' },
  { id: 'vb-abyss', name: 'Abyss', color_hex: '#202e37', finish: 'glossy', preview_image_url: '/vision-board/6388_1_6450_5.25_6_ox_2.JPG', rating_avg: 4.6, rating_count: 24, created_at: '2026-02-01T11:00:00Z' },
  { id: 'vb-tidal-slate', name: 'Tidal Slate', color_hex: '#395c65', finish: 'glossy', preview_image_url: '/vision-board/6450_3.75_6388_0.4_6_ox_2.JPG', rating_avg: 4.6, rating_count: 24, created_at: '2026-02-13T15:00:00Z' },

  // ── Greens ──
  { id: 'vb-river-jade', name: 'River Jade', color_hex: '#3b5d4c', finish: 'glossy', preview_image_url: '/vision-board/6450_7.5_6388_0.7_6_ox_2.JPG', rating_avg: 4.8, rating_count: 35, created_at: '2025-12-14T10:00:00Z' },
  { id: 'vb-evergreen-deep', name: 'Evergreen Deep', color_hex: '#334b3b', finish: 'glossy', preview_image_url: '/vision-board/6450_7.5_6388_0.6_6_ox_2.JPG', rating_avg: 4.6, rating_count: 20, created_at: '2026-02-07T12:00:00Z' },
  { id: 'vb-thundercloud', name: 'Thundercloud', color_hex: '#3d5741', finish: 'glossy', preview_image_url: '/vision-board/6450_7.5_6388_0.5_6_ox_2.JPG', rating_avg: 4.6, rating_count: 21, created_at: '2026-02-14T08:00:00Z' },
  { id: 'vb-moss-floor', name: 'Moss Floor', color_hex: '#4d633a', finish: 'glossy', preview_image_url: '/vision-board/6450_7.5_6388_0.3_6_ox_2.JPG', rating_avg: 4.6, rating_count: 19, created_at: '2026-02-10T11:00:00Z' },
  { id: 'vb-garden-sage', name: 'Garden Sage', color_hex: '#82946c', finish: 'glossy', preview_image_url: '/vision-board/6450_3.75_6388_0.1_6_ox_2.JPG', rating_avg: 4.7, rating_count: 28, created_at: '2026-01-17T10:45:00Z' },
  { id: 'vb-lichen-stone', name: 'Lichen Stone', color_hex: '#60806c', finish: 'glossy', preview_image_url: '/vision-board/6450_3.75_6388_0.2_6_ox_2.JPG', rating_avg: 4.6, rating_count: 24, created_at: '2026-01-19T15:45:00Z' },
  { id: 'vb-fern-shadow', name: 'Fern Shadow', color_hex: '#698162', finish: 'glossy', preview_image_url: '/vision-board/6450_3.75_6388_0.15_6_ox_2.JPG', rating_avg: 4.6, rating_count: 20, created_at: '2026-02-08T11:00:00Z' },
  { id: 'vb-spring-meadow', name: 'Spring Meadow', color_hex: '#828b38', finish: 'glossy', preview_image_url: '/vision-board/6450_7.5_6388_0.1_6_ox_2.JPG', rating_avg: 4.7, rating_count: 26, created_at: '2026-01-22T09:15:00Z' },

  // ── Olives & Chartreuse ──
  { id: 'vb-olive-grove', name: 'Olive Grove', color_hex: '#4a502f', finish: 'glossy', preview_image_url: '/vision-board/6450_7.5_6600_1.4_6_ox_2.JPG', rating_avg: 4.8, rating_count: 34, created_at: '2025-12-08T15:00:00Z' },
  { id: 'vb-deep-olive', name: 'Deep Olive', color_hex: '#515831', finish: 'glossy', preview_image_url: '/vision-board/6450_7.5_6600_1.2_6_ox_2.JPG', rating_avg: 4.7, rating_count: 26, created_at: '2026-01-12T10:30:00Z' },
  { id: 'vb-dark-spruce', name: 'Dark Spruce', color_hex: '#474d2e', finish: 'glossy', preview_image_url: '/vision-board/6450_7.5_6600_1.6_6_ox_2.JPG', rating_avg: 4.7, rating_count: 27, created_at: '2026-01-26T14:00:00Z' },
  { id: 'vb-woodland-floor', name: 'Woodland Floor', color_hex: '#43492f', finish: 'glossy', preview_image_url: '/vision-board/6450_7.5_6600_1.8_6_ox_2.JPG', rating_avg: 4.7, rating_count: 29, created_at: '2026-01-06T10:00:00Z' },
  { id: 'vb-chartreuse', name: 'Chartreuse', color_hex: '#7e8235', finish: 'glossy', preview_image_url: '/vision-board/6450_7.5_6600_0.4_6_ox_2.JPG', rating_avg: 4.7, rating_count: 30, created_at: '2026-01-20T11:00:00Z' },
  { id: 'vb-golden-olive', name: 'Golden Olive', color_hex: '#969638', finish: 'glossy', preview_image_url: '/vision-board/6450_7.5_6600_0.2_6_ox_2.JPG', rating_avg: 4.7, rating_count: 28, created_at: '2026-01-15T09:00:00Z' },
  { id: 'vb-olive-ochre', name: 'Olive Ochre', color_hex: '#747b38', finish: 'glossy', preview_image_url: '/vision-board/6450_7.5_6600_0.6_6_ox_2.JPG', rating_avg: 4.6, rating_count: 22, created_at: '2026-02-03T10:00:00Z' },

  // ── Yellows & Golds ──
  { id: 'vb-canyon-gold', name: 'Canyon Gold', color_hex: '#ca9930', finish: 'glossy', preview_image_url: '/vision-board/6450_7.5_6026_0.25_6_ox_2.JPG', rating_avg: 4.8, rating_count: 31, created_at: '2026-01-08T10:00:00Z' },
  { id: 'vb-honey-amber', name: 'Honey Amber', color_hex: '#c5ab57', finish: 'glossy', preview_image_url: '/vision-board/6450_3.75_6026_0.125_6_ox_2.JPG', rating_avg: 4.7, rating_count: 27, created_at: '2026-01-28T14:00:00Z' },
  { id: 'vb-butterscotch', name: 'Butterscotch', color_hex: '#d09551', finish: 'glossy', preview_image_url: '/vision-board/6450_3.75_6026_0.375_6_ox_2.JPG', rating_avg: 4.6, rating_count: 22, created_at: '2026-02-01T10:00:00Z' },
  { id: 'vb-golden-peach', name: 'Golden Peach', color_hex: '#c98144', finish: 'glossy', preview_image_url: '/vision-board/6450_3.75_6026_0.5_6_ox_2.JPG', rating_avg: 4.7, rating_count: 25, created_at: '2026-01-03T13:00:00Z' },

  // ── Oranges & Terracottas ──
  { id: 'vb-burnt-ember', name: 'Burnt Ember', color_hex: '#c35122', finish: 'glossy', preview_image_url: '/vision-board/6450_7.5_6026_2.25_6_ox_2.JPG', rating_avg: 4.8, rating_count: 36, created_at: '2025-12-03T14:20:00Z' },
  { id: 'vb-warm-apricot', name: 'Warm Apricot', color_hex: '#c8743c', finish: 'glossy', preview_image_url: '/vision-board/6450_3.75_6026_0.625_6_ox_2.JPG', rating_avg: 4.8, rating_count: 32, created_at: '2025-12-22T10:00:00Z' },
  { id: 'vb-terra-coral', name: 'Terra Coral', color_hex: '#cd715a', finish: 'glossy', preview_image_url: '/vision-board/6450_0.75_6026_1.25_6_ox_2.JPG', rating_avg: 4.8, rating_count: 34, created_at: '2025-12-20T10:00:00Z' },
  { id: 'vb-tangerine-flame', name: 'Tangerine Flame', color_hex: '#d56635', finish: 'glossy', preview_image_url: '/vision-board/6450_3.75_6026_1.25_6_ox_2.JPG', rating_avg: 4.9, rating_count: 38, created_at: '2025-11-28T13:00:00Z' },

  // ── Purples & Mauves ──
  { id: 'vb-eggplant-velvet', name: 'Eggplant Velvet', color_hex: '#3a2c3f', finish: 'glossy', preview_image_url: '/vision-board/6026_2.5_6388_0.7_6_ox_2.JPG', rating_avg: 4.9, rating_count: 38, created_at: '2025-11-18T16:00:00Z' },
  { id: 'vb-aubergine-night', name: 'Aubergine Night', color_hex: '#362a42', finish: 'glossy', preview_image_url: '/vision-board/6388_1_6026_2.5_6_ox_2.JPG', rating_avg: 4.9, rating_count: 41, created_at: '2025-11-25T14:00:00Z' },
  { id: 'vb-charcoal-plum', name: 'Charcoal Plum', color_hex: '#372738', finish: 'glossy', preview_image_url: '/vision-board/6026_2.5_6388_0.6_6_ox_2.JPG', rating_avg: 4.7, rating_count: 26, created_at: '2026-01-10T10:00:00Z' },
  { id: 'vb-dusty-plum', name: 'Dusty Plum', color_hex: '#604e6c', finish: 'glossy', preview_image_url: '/vision-board/6026_1.25_6388_0.2_6_ox_2.JPG', rating_avg: 4.7, rating_count: 25, created_at: '2026-02-05T09:30:00Z' },
  { id: 'vb-wisteria-field', name: 'Wisteria Field', color_hex: '#7a6176', finish: 'glossy', preview_image_url: '/vision-board/6026_1.25_6388_0.15_6_ox_2.JPG', rating_avg: 4.6, rating_count: 21, created_at: '2026-02-12T16:30:00Z' },
  { id: 'vb-dusty-violet', name: 'Dusty Violet', color_hex: '#473c5e', finish: 'glossy', preview_image_url: '/vision-board/6026_1.25_6388_0.25_6_ox_2.JPG', rating_avg: 4.7, rating_count: 24, created_at: '2026-02-06T13:00:00Z' },

  // ── Reds, Roses & Browns ──
  { id: 'vb-old-mauve', name: 'Old Mauve', color_hex: '#8a5758', finish: 'glossy', preview_image_url: '/vision-board/6026_1.25_6388_0.05_6_ox_2.JPG', rating_avg: 4.8, rating_count: 37, created_at: '2025-12-18T10:00:00Z' },
  { id: 'vb-mulberry', name: 'Mulberry', color_hex: '#926e79', finish: 'glossy', preview_image_url: '/vision-board/6026_1.25_6388_0.1_6_ox_2.JPG', rating_avg: 4.6, rating_count: 22, created_at: '2026-02-04T10:15:00Z' },
  { id: 'vb-iron-tannin', name: 'Iron Tannin', color_hex: '#513137', finish: 'glossy', preview_image_url: '/vision-board/6026_2.5_6388_0.3_6_ox_2.JPG', rating_avg: 4.7, rating_count: 29, created_at: '2026-01-05T08:45:00Z' },
  { id: 'vb-cedar-bark', name: 'Cedar Bark', color_hex: '#462f39', finish: 'glossy', preview_image_url: '/vision-board/6026_2.5_6388_0.4_6_ox_2.JPG', rating_avg: 4.6, rating_count: 23, created_at: '2026-01-31T10:00:00Z' },
  { id: 'vb-shadow-wine', name: 'Shadow Wine', color_hex: '#412c3c', finish: 'glossy', preview_image_url: '/vision-board/6026_2.5_6388_0.5_6_ox_2.JPG', rating_avg: 4.7, rating_count: 27, created_at: '2026-01-24T12:30:00Z' },
  { id: 'vb-brick-dust', name: 'Brick Dust', color_hex: '#89413e', finish: 'glossy', preview_image_url: '/vision-board/6026_2.5_6388_0.1_6_ox_2.JPG', rating_avg: 4.8, rating_count: 31, created_at: '2025-12-25T10:00:00Z' },

  // ── Dark Earth & Chocolate ──
  { id: 'vb-blackened-cherry', name: 'Blackened Cherry', color_hex: '#29201e', finish: 'glossy', preview_image_url: '/vision-board/6026_2.5_6600_1.8_6_ox_2.JPG', rating_avg: 4.9, rating_count: 45, created_at: '2025-11-10T10:00:00Z' },
  { id: 'vb-dark-cocoa', name: 'Dark Cocoa', color_hex: '#4d2b24', finish: 'glossy', preview_image_url: '/vision-board/6026_2.5_6600_0.8_6_ox_2.JPG', rating_avg: 4.9, rating_count: 44, created_at: '2025-11-22T12:30:00Z' },
  { id: 'vb-espresso', name: 'Espresso', color_hex: '#382724', finish: 'glossy', preview_image_url: '/vision-board/6026_2.5_6600_1.4_6_ox_2.JPG', rating_avg: 4.8, rating_count: 37, created_at: '2025-12-02T09:00:00Z' },
];
