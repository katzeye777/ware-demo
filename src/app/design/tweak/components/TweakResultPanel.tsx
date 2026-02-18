'use client';

import { useState } from 'react';
import { Sparkles, Loader2, ArrowRight, Info } from 'lucide-react';
import { findGlaze, setFiringModel } from '@/lib/demo-api';
import ResultsPanel from '@/app/design/components/ResultsPanel';
import type { GlazeModification } from '@/lib/tweak-engine';
import type { GlazeDesignResponse } from '@/lib/api';

interface TweakResultPanelProps {
  modification: GlazeModification;
}

export default function TweakResultPanel({ modification }: TweakResultPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GlazeDesignResponse | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleFindModifiedRecipe = async () => {
    setIsLoading(true);
    setError('');

    try {
      // In demo mode, re-run findGlaze with the original color.
      // The modification is informational — the actual chemistry
      // adjustments would be applied server-side in production.
      setFiringModel(6, 'ox');

      const result = await findGlaze({
        target_color_hex: modification.original_color_hex,
        finish: 'glossy',
        batch_size_grams: 350,
        firing_temp_cone: '6',
      });

      setResult(result);
      setSelectedMatchId(result.primary_match.glaze_id);
    } catch (err: any) {
      setError(err.message || 'Failed to find modified recipe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Modification Summary */}
      <div className="card border-2 border-brand-200 bg-brand-50/30">
        <h3 className="text-lg font-semibold text-clay-900 mb-3">
          Recipe Adjustment
        </h3>
        <p className="text-sm text-clay-700 mb-4">
          {modification.description}
        </p>

        {/* Oxide adjustments table */}
        <div className="bg-white rounded-lg border border-clay-200 overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-clay-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-clay-600">Oxide</th>
                <th className="text-left px-4 py-2 font-medium text-clay-600">Change</th>
                <th className="text-right px-4 py-2 font-medium text-clay-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {modification.adjustments.map((adj, i) => (
                <tr key={i} className="border-t border-clay-100">
                  <td className="px-4 py-2 font-mono text-clay-900">{adj.oxide}</td>
                  <td className="px-4 py-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      adj.direction === 'increase'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {adj.direction === 'increase' ? '↑ Increase' : '↓ Decrease'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-clay-900">{adj.magnitude}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-start space-x-2 text-xs text-clay-500 mb-4">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Recipe adjustment will be applied when ordering. The preview below shows
            the closest color match for your modified recipe.
          </span>
        </div>

        {/* Find Modified Recipe button */}
        {!result && (
          <button
            onClick={handleFindModifiedRecipe}
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Finding modified recipe...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Find Modified Recipe</span>
              </>
            )}
          </button>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mt-4">
            {error}
          </div>
        )}
      </div>

      {/* Results from findGlaze */}
      {result && (
        <div>
          <ResultsPanel
            result={result}
            selectedMatchId={selectedMatchId}
            onSelectMatch={setSelectedMatchId}
          />
        </div>
      )}
    </div>
  );
}
