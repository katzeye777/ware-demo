/**
 * Synthetic Color Test Dataset
 *
 * 25 data points mapping stain percentages → Lab color values.
 * These are approximate values for demo/development purposes.
 *
 * When real fired-test data is available, replace this file's
 * contents with the measured values from CSV import.
 */

import { ColorTestDataPoint } from './color-engine';

export const SYNTHETIC_COLOR_DATA: ColorTestDataPoint[] = [
  // ── Pure white (no stains) ──
  {
    stain_red_pct: 0, stain_blue_pct: 0, stain_yellow_pct: 0,
    stain_black_pct: 0, stain_white_pct: 0,
    result_lab_l: 92, result_lab_a: -1, result_lab_b: 3,
  },

  // ── White stain ──
  {
    stain_red_pct: 0, stain_blue_pct: 0, stain_yellow_pct: 0,
    stain_black_pct: 0, stain_white_pct: 10,
    result_lab_l: 95, result_lab_a: 0, result_lab_b: 1,
  },

  // ── Red only ──
  {
    stain_red_pct: 2, stain_blue_pct: 0, stain_yellow_pct: 0,
    stain_black_pct: 0, stain_white_pct: 0,
    result_lab_l: 65, result_lab_a: 25, result_lab_b: 15,
  },
  {
    stain_red_pct: 5, stain_blue_pct: 0, stain_yellow_pct: 0,
    stain_black_pct: 0, stain_white_pct: 0,
    result_lab_l: 50, result_lab_a: 40, result_lab_b: 25,
  },
  {
    stain_red_pct: 10, stain_blue_pct: 0, stain_yellow_pct: 0,
    stain_black_pct: 0, stain_white_pct: 0,
    result_lab_l: 38, result_lab_a: 48, result_lab_b: 30,
  },

  // ── Blue only ──
  {
    stain_red_pct: 0, stain_blue_pct: 2, stain_yellow_pct: 0,
    stain_black_pct: 0, stain_white_pct: 0,
    result_lab_l: 70, result_lab_a: -5, result_lab_b: -20,
  },
  {
    stain_red_pct: 0, stain_blue_pct: 5, stain_yellow_pct: 0,
    stain_black_pct: 0, stain_white_pct: 0,
    result_lab_l: 50, result_lab_a: -10, result_lab_b: -40,
  },
  {
    stain_red_pct: 0, stain_blue_pct: 10, stain_yellow_pct: 0,
    stain_black_pct: 0, stain_white_pct: 0,
    result_lab_l: 35, result_lab_a: -5, result_lab_b: -50,
  },

  // ── Yellow only ──
  {
    stain_red_pct: 0, stain_blue_pct: 0, stain_yellow_pct: 3,
    stain_black_pct: 0, stain_white_pct: 0,
    result_lab_l: 80, result_lab_a: 0, result_lab_b: 40,
  },
  {
    stain_red_pct: 0, stain_blue_pct: 0, stain_yellow_pct: 8,
    stain_black_pct: 0, stain_white_pct: 0,
    result_lab_l: 75, result_lab_a: 5, result_lab_b: 65,
  },

  // ── Black only ──
  {
    stain_red_pct: 0, stain_blue_pct: 0, stain_yellow_pct: 0,
    stain_black_pct: 2, stain_white_pct: 0,
    result_lab_l: 55, result_lab_a: 0, result_lab_b: 0,
  },
  {
    stain_red_pct: 0, stain_blue_pct: 0, stain_yellow_pct: 0,
    stain_black_pct: 5, stain_white_pct: 0,
    result_lab_l: 35, result_lab_a: 0, result_lab_b: -2,
  },
  {
    stain_red_pct: 0, stain_blue_pct: 0, stain_yellow_pct: 0,
    stain_black_pct: 10, stain_white_pct: 0,
    result_lab_l: 18, result_lab_a: 0, result_lab_b: -3,
  },

  // ── Mixes: red + blue (purple) ──
  {
    stain_red_pct: 3, stain_blue_pct: 3, stain_yellow_pct: 0,
    stain_black_pct: 0, stain_white_pct: 0,
    result_lab_l: 45, result_lab_a: 20, result_lab_b: -25,
  },
  {
    stain_red_pct: 5, stain_blue_pct: 2, stain_yellow_pct: 0,
    stain_black_pct: 0, stain_white_pct: 0,
    result_lab_l: 42, result_lab_a: 35, result_lab_b: -10,
  },

  // ── Mixes: blue + yellow (green) ──
  {
    stain_red_pct: 0, stain_blue_pct: 3, stain_yellow_pct: 5,
    stain_black_pct: 0, stain_white_pct: 0,
    result_lab_l: 60, result_lab_a: -20, result_lab_b: 15,
  },
  {
    stain_red_pct: 0, stain_blue_pct: 5, stain_yellow_pct: 3,
    stain_black_pct: 0, stain_white_pct: 0,
    result_lab_l: 55, result_lab_a: -15, result_lab_b: -5,
  },

  // ── Mixes: red + yellow (orange) ──
  {
    stain_red_pct: 3, stain_blue_pct: 0, stain_yellow_pct: 5,
    stain_black_pct: 0, stain_white_pct: 0,
    result_lab_l: 65, result_lab_a: 20, result_lab_b: 45,
  },
  {
    stain_red_pct: 5, stain_blue_pct: 0, stain_yellow_pct: 3,
    stain_black_pct: 0, stain_white_pct: 0,
    result_lab_l: 55, result_lab_a: 35, result_lab_b: 35,
  },

  // ── Pastel (stain + white) ──
  {
    stain_red_pct: 2, stain_blue_pct: 0, stain_yellow_pct: 0,
    stain_black_pct: 0, stain_white_pct: 8,
    result_lab_l: 78, result_lab_a: 15, result_lab_b: 5,
  },
  {
    stain_red_pct: 0, stain_blue_pct: 2, stain_yellow_pct: 0,
    stain_black_pct: 0, stain_white_pct: 8,
    result_lab_l: 80, result_lab_a: -3, result_lab_b: -12,
  },

  // ── Teal ──
  {
    stain_red_pct: 0, stain_blue_pct: 4, stain_yellow_pct: 2,
    stain_black_pct: 0, stain_white_pct: 2,
    result_lab_l: 62, result_lab_a: -18, result_lab_b: -8,
  },

  // ── Warm gray ──
  {
    stain_red_pct: 1, stain_blue_pct: 0, stain_yellow_pct: 1,
    stain_black_pct: 3, stain_white_pct: 2,
    result_lab_l: 52, result_lab_a: 5, result_lab_b: 8,
  },

  // ── Cool gray ──
  {
    stain_red_pct: 0, stain_blue_pct: 1, stain_yellow_pct: 0,
    stain_black_pct: 3, stain_white_pct: 3,
    result_lab_l: 55, result_lab_a: -2, result_lab_b: -5,
  },

  // ── Deep teal ──
  {
    stain_red_pct: 0, stain_blue_pct: 6, stain_yellow_pct: 3,
    stain_black_pct: 1, stain_white_pct: 0,
    result_lab_l: 42, result_lab_a: -18, result_lab_b: -12,
  },

  // ── Burgundy ──
  {
    stain_red_pct: 8, stain_blue_pct: 2, stain_yellow_pct: 0,
    stain_black_pct: 2, stain_white_pct: 0,
    result_lab_l: 28, result_lab_a: 30, result_lab_b: 5,
  },
];
