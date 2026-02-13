'use client';

import { GlazeDesignResponse, ColorMatch } from '@/lib/api';
import { AlertTriangle, Check } from 'lucide-react';

interface ResultsPanelProps {
  result: GlazeDesignResponse;
  selectedMatchId: string | null;
  onSelectMatch: (matchId: string) => void;
}

export default function ResultsPanel({
  result,
  selectedMatchId,
  onSelectMatch,
}: ResultsPanelProps) {
  const renderColorMatch = (match: ColorMatch, isPrimary: boolean = false) => {
    const isSelected = match.glaze_id === selectedMatchId;
    const confidencePercent = Math.round(match.confidence * 100);

    return (
      <div
        key={match.glaze_id}
        onClick={() => onSelectMatch(match.glaze_id)}
        className={`card cursor-pointer transition-all ${
          isSelected
            ? 'ring-2 ring-brand-500 shadow-lg'
            : 'hover:shadow-lg hover:scale-[1.02]'
        }`}
      >
        {isPrimary && (
          <div className="bg-brand-500 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
            Primary Match
          </div>
        )}

        {/* Preview Image */}
        <div className="aspect-square w-full mb-4 rounded-lg overflow-hidden bg-clay-100">
          {match.preview_image_url ? (
            <img
              src={match.preview_image_url}
              alt={match.glaze_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ backgroundColor: match.color_hex }}
            />
          )}
        </div>

        {/* Glaze Info */}
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-lg text-clay-900">
              {match.glaze_name}
            </h4>
            <div className="flex items-center space-x-2 mt-1">
              <div
                className="w-6 h-6 rounded color-swatch"
                style={{ backgroundColor: match.color_hex }}
              />
              <span className="text-sm font-mono text-clay-600">
                {match.color_hex.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Delta E */}
          <div>
            <div className="flex justify-between text-xs font-medium text-clay-600 mb-1">
              <span>Color Accuracy (ΔE: {match.delta_e.toFixed(2)})</span>
              <span className={match.delta_e < 2 ? 'text-green-600' : match.delta_e < 5 ? 'text-yellow-600' : 'text-orange-600'}>
                {match.delta_e < 2 ? 'Excellent' : match.delta_e < 5 ? 'Good' : 'Fair'}
              </span>
            </div>
            <div className="w-full bg-clay-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  match.delta_e < 2
                    ? 'bg-green-500'
                    : match.delta_e < 5
                    ? 'bg-yellow-500'
                    : 'bg-orange-500'
                }`}
                style={{ width: `${Math.max(10, 100 - match.delta_e * 10)}%` }}
              />
            </div>
          </div>

          {/* Confidence */}
          <div>
            <div className="flex justify-between text-xs font-medium text-clay-600 mb-1">
              <span>Confidence</span>
              <span>{confidencePercent}%</span>
            </div>
            <div className="w-full bg-clay-200 rounded-full h-2">
              <div
                className="bg-brand-500 h-2 rounded-full"
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
          </div>

          {/* Selection Indicator */}
          {isSelected && (
            <div className="flex items-center space-x-2 text-brand-600 font-medium text-sm">
              <Check className="w-5 h-5" />
              <span>Selected</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Out of Gamut Warning */}
      {result.out_of_gamut && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">
                Color Outside Available Range
              </h4>
              <p className="text-sm text-yellow-700">
                {result.out_of_gamut_reason ||
                  'The exact color you selected is not achievable with our current glaze palette. We\'ve found the closest possible matches below.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Primary Match */}
      <div>
        <h3 className="text-xl font-semibold text-clay-900 mb-4">
          Best Match
        </h3>
        {renderColorMatch(result.primary_match, true)}
      </div>

      {/* Alternative Matches */}
      {result.alternatives && result.alternatives.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-clay-900 mb-4">
            Alternative Matches
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.alternatives.map(match => renderColorMatch(match))}
          </div>
        </div>
      )}

      {/* Helpful Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-2">About Color Matching:</p>
        <ul className="text-xs space-y-1 text-blue-700">
          <li>• <strong>ΔE (Delta E)</strong>: Lower is better. ΔE &lt; 2 is considered imperceptible to the human eye.</li>
          <li>• <strong>Confidence</strong>: Our algorithm's certainty in this match based on firing consistency data.</li>
          <li>• Colors may vary slightly depending on clay body, firing temperature, and kiln atmosphere.</li>
        </ul>
      </div>
    </div>
  );
}
