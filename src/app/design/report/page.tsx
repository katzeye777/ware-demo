'use client';

/**
 * TEMPORARY: Recipe Report Page
 *
 * Shows the full compositional logic behind a color match:
 * - Target color → interpolated recipe
 * - k-NN neighbors used and their weights
 * - Per-stain contributions from the component model
 * - Interaction corrections
 * - Hybrid blend weights (k-NN vs component model)
 *
 * This page will be removed at deployment.
 */

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { colorEngine, stainDisplayName } from '@/lib/color-engine';
import type { DetailedMatchResult } from '@/lib/color-engine';
import { COLOR_TEST_DATA } from '@/lib/color-data';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ReportContent() {
  const searchParams = useSearchParams();
  const targetHex = searchParams.get('color') || '#e4533d';
  const [detail, setDetail] = useState<DetailedMatchResult | null>(null);

  useEffect(() => {
    if (!colorEngine.isLoaded) {
      colorEngine.loadDataset(COLOR_TEST_DATA);
    }
    const result = colorEngine.matchDetailedFromHex(targetHex);
    setDetail(result);
  }, [targetHex]);

  if (!detail) {
    return <div className="p-8 text-center text-clay-500">Loading engine...</div>;
  }

  const fmtLab = (lab: [number, number, number]) =>
    `L*${lab[0].toFixed(1)}  a*${lab[1].toFixed(1)}  b*${lab[2].toFixed(1)}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl print:max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Link href="/design" className="flex items-center space-x-2 text-clay-600 hover:text-clay-900">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Design</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="btn-secondary text-sm"
        >
          Print Report
        </button>
      </div>

      <div className="text-center mb-8">
        <p className="text-xs text-clay-400 uppercase tracking-wider">Temporary Calibration Report</p>
        <h1 className="text-3xl font-bold text-clay-900 mt-1">Recipe Composition Report</h1>
        <p className="text-sm text-clay-500 mt-2">Color Engine v3 &mdash; {COLOR_TEST_DATA.length} data points</p>
      </div>

      {/* ── Section 1: Target → Result ── */}
      <section className="card mb-6">
        <h2 className="text-lg font-bold text-clay-900 mb-4">1. Target &amp; Result</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-clay-500 mb-1">Target Color</p>
            <div className="w-full h-20 rounded-lg color-swatch" style={{ backgroundColor: detail.target_hex }} />
            <p className="text-xs font-mono mt-1">{detail.target_hex.toUpperCase()}</p>
            <p className="text-xs text-clay-500">{fmtLab(detail.target_lab)}</p>
          </div>
          <div>
            <p className="text-xs text-clay-500 mb-1">Hybrid Prediction</p>
            <div className="w-full h-20 rounded-lg color-swatch" style={{ backgroundColor: detail.knn_prediction.hex }} />
            <p className="text-xs font-mono mt-1">{detail.knn_prediction.hex.toUpperCase()}</p>
            <p className="text-xs text-clay-500">{fmtLab(detail.knn_prediction.lab)}</p>
          </div>
          <div>
            <p className="text-xs text-clay-500 mb-1">Component Model</p>
            {detail.component_prediction ? (
              <>
                <div className="w-full h-20 rounded-lg color-swatch" style={{ backgroundColor: detail.component_prediction.hex }} />
                <p className="text-xs font-mono mt-1">{detail.component_prediction.hex.toUpperCase()}</p>
                <p className="text-xs text-clay-500">{fmtLab(detail.component_prediction.lab)}</p>
              </>
            ) : (
              <div className="w-full h-20 rounded-lg bg-clay-100 flex items-center justify-center text-xs text-clay-400">N/A</div>
            )}
          </div>
          <div>
            <p className="text-xs text-clay-500 mb-1">Additive (no interactions)</p>
            <div className="w-full h-20 rounded-lg color-swatch" style={{ backgroundColor: detail.additive_prediction.hex }} />
            <p className="text-xs font-mono mt-1">{detail.additive_prediction.hex.toUpperCase()}</p>
            <p className="text-xs text-clay-500">{fmtLab(detail.additive_prediction.lab)}</p>
          </div>
        </div>

        <div className="mt-4 bg-clay-50 rounded-lg p-3">
          <p className="text-xs font-medium text-clay-700">
            Hybrid Blend: <span className="font-mono">{(detail.hybrid_weights.knn * 100).toFixed(0)}% k-NN</span> + <span className="font-mono">{(detail.hybrid_weights.component * 100).toFixed(0)}% Component Model</span>
          </p>
          <p className="text-xs text-clay-500 mt-1">
            Nearest neighbor distance: {detail.nearest_neighbors[0]?.delta_e.toFixed(2)} &mdash;
            {detail.hybrid_weights.knn > 0.7 ? ' close match, favoring k-NN interpolation' :
              detail.hybrid_weights.knn > 0.4 ? ' moderate distance, balanced blend' :
              ' far from training data, relying more on component model'}
          </p>
        </div>
      </section>

      {/* ── Section 2: Interpolated Recipe (what gets batched) ── */}
      <section className="card mb-6">
        <h2 className="text-lg font-bold text-clay-900 mb-4">2. Interpolated Recipe (Batch Formula)</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-clay-200">
              <th className="text-left py-2 text-clay-600 font-medium">Stain</th>
              <th className="text-left py-2 text-clay-600 font-medium">Code</th>
              <th className="text-right py-2 text-clay-600 font-medium">% by weight</th>
              <th className="text-right py-2 text-clay-600 font-medium">g / 500g batch</th>
            </tr>
          </thead>
          <tbody>
            {detail.interpolated_recipe.filter(s => s.pct > 0).map((s) => (
              <tr key={s.code} className="border-b border-clay-100">
                <td className="py-2 font-medium">{stainDisplayName(s.code)}</td>
                <td className="py-2 font-mono text-clay-600">{s.code}</td>
                <td className="py-2 text-right font-mono">{s.pct.toFixed(2)}%</td>
                <td className="py-2 text-right font-mono">{(s.pct / 100 * 500).toFixed(1)}g</td>
              </tr>
            ))}
            <tr className="border-t-2 border-clay-300 font-semibold">
              <td className="py-2">Base glaze</td>
              <td className="py-2"></td>
              <td className="py-2 text-right font-mono">
                {(100 - detail.interpolated_recipe.reduce((sum, s) => sum + s.pct, 0)).toFixed(2)}%
              </td>
              <td className="py-2 text-right font-mono">
                {((100 - detail.interpolated_recipe.reduce((sum, s) => sum + s.pct, 0)) / 100 * 500).toFixed(1)}g
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── Section 3: Component Model Breakdown ── */}
      <section className="card mb-6">
        <h2 className="text-lg font-bold text-clay-900 mb-4">3. Component Model — Per-Stain Contributions</h2>
        <p className="text-xs text-clay-500 mb-3">
          Base white: L*{detail.base_lab[0].toFixed(1)} a*{detail.base_lab[1].toFixed(1)} b*{detail.base_lab[2].toFixed(1)} (clear glaze on porcelain)
        </p>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-clay-200">
              <th className="text-left py-2 text-clay-600 font-medium">Stain</th>
              <th className="text-right py-2 text-clay-600 font-medium">%</th>
              <th className="text-right py-2 text-clay-600 font-medium">&Delta;L*</th>
              <th className="text-right py-2 text-clay-600 font-medium">&Delta;a*</th>
              <th className="text-right py-2 text-clay-600 font-medium">&Delta;b*</th>
              <th className="text-left py-2 pl-3 text-clay-600 font-medium">Direction</th>
            </tr>
          </thead>
          <tbody>
            {detail.stain_contributions.map((c) => (
              <tr key={c.code} className="border-b border-clay-100">
                <td className="py-2 font-medium">{c.name}</td>
                <td className="py-2 text-right font-mono">{c.pct.toFixed(2)}</td>
                <td className={`py-2 text-right font-mono ${c.delta_L < -5 ? 'text-red-600' : c.delta_L > 5 ? 'text-green-600' : ''}`}>
                  {c.delta_L > 0 ? '+' : ''}{c.delta_L.toFixed(1)}
                </td>
                <td className={`py-2 text-right font-mono ${c.delta_a > 10 ? 'text-red-600' : c.delta_a < -10 ? 'text-green-600' : ''}`}>
                  {c.delta_a > 0 ? '+' : ''}{c.delta_a.toFixed(1)}
                </td>
                <td className={`py-2 text-right font-mono ${c.delta_b > 10 ? 'text-yellow-600' : c.delta_b < -10 ? 'text-blue-600' : ''}`}>
                  {c.delta_b > 0 ? '+' : ''}{c.delta_b.toFixed(1)}
                </td>
                <td className="py-2 pl-3 text-xs text-clay-500">
                  {describeContribution(c)}
                </td>
              </tr>
            ))}
            {/* Interaction correction row */}
            <tr className="border-t-2 border-clay-300 bg-clay-50">
              <td className="py-2 font-medium text-clay-700">Interaction correction</td>
              <td className="py-2"></td>
              <td className="py-2 text-right font-mono">
                {detail.interaction_correction.dL > 0 ? '+' : ''}{detail.interaction_correction.dL.toFixed(1)}
              </td>
              <td className="py-2 text-right font-mono">
                {detail.interaction_correction.da > 0 ? '+' : ''}{detail.interaction_correction.da.toFixed(1)}
              </td>
              <td className="py-2 text-right font-mono">
                {detail.interaction_correction.db > 0 ? '+' : ''}{detail.interaction_correction.db.toFixed(1)}
              </td>
              <td className="py-2 pl-3 text-xs text-clay-500">Learned from two-way blend data</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── Section 4: k-NN Neighbors ── */}
      <section className="card mb-6">
        <h2 className="text-lg font-bold text-clay-900 mb-4">4. Nearest Neighbors (k-NN Input)</h2>
        <p className="text-xs text-clay-500 mb-3">
          The {detail.nearest_neighbors.length} closest tested tiles by CIEDE2000. Weights are inverse-distance-squared.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-clay-200">
                <th className="text-left py-2 text-clay-600 font-medium">#</th>
                <th className="text-left py-2 text-clay-600 font-medium">Color</th>
                <th className="text-left py-2 text-clay-600 font-medium">Recipe</th>
                <th className="text-right py-2 text-clay-600 font-medium">&Delta;E</th>
                <th className="text-right py-2 text-clay-600 font-medium">Weight</th>
                <th className="text-left py-2 text-clay-600 font-medium">Lab</th>
              </tr>
            </thead>
            <tbody>
              {detail.nearest_neighbors.map((n, i) => (
                <tr key={i} className={`border-b border-clay-100 ${n.weight > 0.1 ? 'bg-brand-50' : ''}`}>
                  <td className="py-2 text-clay-500">{i + 1}</td>
                  <td className="py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded color-swatch" style={{ backgroundColor: n.hex }} />
                      <span className="text-xs font-mono">{n.hex.toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="py-2 text-xs">
                    {n.recipe.filter(s => s.pct > 0).map(s =>
                      `${stainDisplayName(s.code)} ${s.pct}%`
                    ).join(' + ')}
                  </td>
                  <td className={`py-2 text-right font-mono ${n.delta_e < 2 ? 'text-green-600 font-bold' : n.delta_e < 5 ? 'text-yellow-600' : 'text-clay-500'}`}>
                    {n.delta_e.toFixed(2)}
                  </td>
                  <td className="py-2 text-right font-mono">
                    {(n.weight * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 text-xs font-mono text-clay-500">
                    {fmtLab(n.lab)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section 5: Engine Info ── */}
      <section className="card mb-6 bg-clay-50">
        <h2 className="text-lg font-bold text-clay-900 mb-4">5. Engine Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-clay-500">Version</p>
            <p className="font-mono font-medium">3.0.0</p>
          </div>
          <div>
            <p className="text-xs text-clay-500">Data Points</p>
            <p className="font-mono font-medium">{COLOR_TEST_DATA.length}</p>
          </div>
          <div>
            <p className="text-xs text-clay-500">Stain Codes</p>
            <p className="font-mono font-medium">{detail.stain_codes.join(', ')}</p>
          </div>
          <div>
            <p className="text-xs text-clay-500">k-NN Neighbors</p>
            <p className="font-mono font-medium">{detail.nearest_neighbors.length}</p>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-clay-400 mt-8 print:hidden">
        This is a temporary calibration page and will be removed at deployment.
      </p>
    </div>
  );
}

function describeContribution(c: { delta_L: number; delta_a: number; delta_b: number }): string {
  const parts: string[] = [];
  if (c.delta_L < -10) parts.push('darkens');
  else if (c.delta_L > 10) parts.push('lightens');
  if (c.delta_a > 10) parts.push('adds red');
  else if (c.delta_a < -10) parts.push('adds green');
  if (c.delta_b > 10) parts.push('adds yellow');
  else if (c.delta_b < -10) parts.push('adds blue');
  return parts.length > 0 ? parts.join(', ') : 'subtle shift';
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-clay-500">Loading...</div>}>
      <ReportContent />
    </Suspense>
  );
}
