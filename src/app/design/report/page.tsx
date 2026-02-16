'use client';

/**
 * TEMPORARY: Recipe Report Page
 *
 * Shows the full logic behind a color match:
 * - Target color → predicted result
 * - Interpolated recipe with batch weights
 * - k-NN neighbors, their weights, and confidence scores
 * - Engine info (cone, atmosphere, data point count)
 *
 * This page will be removed at deployment.
 */

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { colorEngine, stainDisplayName } from '@/lib/color-engine';
import type { DetailedMatchResult } from '@/lib/color-engine';
import { COLOR_TEST_DATA } from '@/lib/color-data';
import { getFiringModel } from '@/lib/demo-api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ReportContent() {
  const searchParams = useSearchParams();
  const targetHex = searchParams.get('color') || '#e4533d';
  const [detail, setDetail] = useState<DetailedMatchResult | null>(null);

  useEffect(() => {
    getFiringModel();
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
        <p className="text-sm text-clay-500 mt-2">
          Color Engine v{ColorEngine.VERSION} &mdash; Cone {detail.cone} {detail.atmosphere === 'ox' ? 'Oxidation' : 'Reduction'} &mdash; {detail.data_points} data points (2-dip masters)
        </p>
      </div>

      {/* ── Section 1: Target → Result ── */}
      <section className="card mb-6">
        <h2 className="text-lg font-bold text-clay-900 mb-4">1. Target &amp; Prediction</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-clay-500 mb-1">Target Color</p>
            <div className="w-full h-24 rounded-lg color-swatch" style={{ backgroundColor: detail.target_hex }} />
            <p className="text-xs font-mono mt-1">{detail.target_hex.toUpperCase()}</p>
            <p className="text-xs text-clay-500">{fmtLab(detail.target_lab)}</p>
          </div>
          <div>
            <p className="text-xs text-clay-500 mb-1">Predicted Result</p>
            <div className="w-full h-24 rounded-lg color-swatch" style={{ backgroundColor: detail.predicted_hex }} />
            <p className="text-xs font-mono mt-1">{detail.predicted_hex.toUpperCase()}</p>
            <p className="text-xs text-clay-500">{fmtLab(detail.predicted_lab)}</p>
          </div>
        </div>

        <div className="mt-4 bg-clay-50 rounded-lg p-3">
          <p className="text-xs font-medium text-clay-700">
            Predicted &Delta;E: <span className={`font-mono ${detail.predicted_delta_e < 2 ? 'text-green-600' : detail.predicted_delta_e < 5 ? 'text-yellow-600' : 'text-red-600'}`}>
              {detail.predicted_delta_e.toFixed(2)}
            </span>
            <span className="text-clay-500 ml-2">
              {detail.predicted_delta_e < 2 ? '— imperceptible difference' :
                detail.predicted_delta_e < 5 ? '— noticeable but good match' :
                '— visible difference, may be outside stain gamut'}
            </span>
          </p>
          <p className="text-xs text-clay-500 mt-1">
            Nearest tested tile: &Delta;E {detail.nearest_neighbors[0]?.delta_e.toFixed(2)} &mdash;
            {detail.nearest_neighbors[0]?.delta_e < 2 ? ' very close to existing test data' :
              detail.nearest_neighbors[0]?.delta_e < 5 ? ' moderate distance from test data' :
              ' far from any tested recipe'}
          </p>
        </div>
      </section>

      {/* ── Section 2: Interpolated Recipe ── */}
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

      {/* ── Section 3: k-NN Neighbors ── */}
      <section className="card mb-6">
        <h2 className="text-lg font-bold text-clay-900 mb-4">3. Nearest Neighbors</h2>
        <p className="text-xs text-clay-500 mb-3">
          The {detail.nearest_neighbors.length} closest tested tiles by CIEDE2000. Weights are confidence-adjusted inverse-distance-squared.
          Confidence reflects how consistent the tile color was (master vs image average agreement).
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
                <th className="text-right py-2 text-clay-600 font-medium">Conf.</th>
                <th className="text-left py-2 text-clay-600 font-medium">Lab</th>
              </tr>
            </thead>
            <tbody>
              {detail.nearest_neighbors.map((n, i) => (
                <tr key={i} className={`border-b border-clay-100 ${n.generatable && n.weight > 0.1 ? 'bg-brand-50' : ''} ${!n.generatable ? 'opacity-60' : ''}`}>
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
                    {!n.generatable && <span className="ml-1 text-clay-400 italic">(ref)</span>}
                  </td>
                  <td className={`py-2 text-right font-mono ${n.delta_e < 2 ? 'text-green-600 font-bold' : n.delta_e < 5 ? 'text-yellow-600' : 'text-clay-500'}`}>
                    {n.delta_e.toFixed(2)}
                  </td>
                  <td className="py-2 text-right font-mono">
                    {(n.weight * 100).toFixed(1)}%
                  </td>
                  <td className={`py-2 text-right font-mono ${n.confidence >= 0.8 ? 'text-green-600' : n.confidence >= 0.5 ? 'text-yellow-600' : 'text-red-500'}`}>
                    {(n.confidence * 100).toFixed(0)}%
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

      {/* ── Section 4: Engine Info ── */}
      <section className="card mb-6 bg-clay-50">
        <h2 className="text-lg font-bold text-clay-900 mb-4">4. Engine Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-clay-500">Version</p>
            <p className="font-mono font-medium">{ColorEngine.VERSION}</p>
          </div>
          <div>
            <p className="text-xs text-clay-500">Firing Model</p>
            <p className="font-mono font-medium">
              Cone {detail.cone} {detail.atmosphere === 'ox' ? 'Oxidation' : 'Reduction'}
            </p>
          </div>
          <div>
            <p className="text-xs text-clay-500">Data Points (this model)</p>
            <p className="font-mono font-medium">{detail.data_points}</p>
            <p className="text-xs text-clay-400">
              {colorEngine.generatablePointCount} generatable + {colorEngine.referencePointCount} reference
            </p>
          </div>
          <div>
            <p className="text-xs text-clay-500">Data Source</p>
            <p className="font-mono font-medium">2-dip master points</p>
          </div>
          <div>
            <p className="text-xs text-clay-500">Base Stains</p>
            <p className="font-mono font-medium text-xs">{detail.stain_codes.join(', ')}</p>
          </div>
          <div>
            <p className="text-xs text-clay-500">k-NN Neighbors</p>
            <p className="font-mono font-medium">{detail.nearest_neighbors.length}</p>
          </div>
          <div>
            <p className="text-xs text-clay-500">Total Data (all models)</p>
            <p className="font-mono font-medium">{COLOR_TEST_DATA.length}</p>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-clay-400 mt-8 print:hidden">
        This is a temporary calibration page and will be removed at deployment.
      </p>
    </div>
  );
}

// Need to import ColorEngine class for VERSION access
import { ColorEngine } from '@/lib/color-engine';

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-clay-500">Loading...</div>}>
      <ReportContent />
    </Suspense>
  );
}
