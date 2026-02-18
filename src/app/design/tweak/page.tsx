'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  RotateCcw,
  Thermometer,
  Layers,
  ZoomIn,
  Sparkles,
} from 'lucide-react';
import ColorPicker from '../components/ColorPicker';
import ResultsPanel from '../components/ResultsPanel';
import TweakPathSelector from './components/TweakPathSelector';
import TemperaturePath from './components/TemperaturePath';
import TexturePath from './components/TexturePath';
import CrazingPath from './components/CrazingPath';
import { findGlaze, setFiringModel } from '@/lib/demo-api';
import type { GlazeDesignResponse } from '@/lib/api';
import type { TweakPath } from '@/lib/tweak-engine';
import type { GlazeModification } from '@/lib/tweak-engine';

export default function TweakPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
            <p className="mt-4 text-clay-600">Loading...</p>
          </div>
        </div>
      }
    >
      <TweakPageContent />
    </Suspense>
  );
}

const PATH_ICONS: Record<TweakPath, typeof Thermometer> = {
  temperature: Thermometer,
  texture: Layers,
  crazing: ZoomIn,
};

const PATH_LABELS: Record<TweakPath, string> = {
  temperature: 'Temperature',
  texture: 'Texture',
  crazing: 'Crazing',
};

function TweakPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read query params for pre-fill
  const initialColor = searchParams.get('color') || '#e4533d';
  const glazeId = searchParams.get('glazeId') || undefined;

  // ── Color state ──
  const [color, setColor] = useState(initialColor);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [designResult, setDesignResult] = useState<GlazeDesignResponse | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  // ── Tweak diagnostic state ──
  const [selectedPath, setSelectedPath] = useState<TweakPath | null>(null);
  const [modification, setModification] = useState<GlazeModification | null>(null);

  // Pre-fill color from query param
  useEffect(() => {
    const colorParam = searchParams.get('color');
    if (colorParam && /^#[0-9A-Fa-f]{6}$/.test(colorParam)) {
      setColor(colorParam);
    }
  }, [searchParams]);

  // ── Handlers ──

  const handleFindGlaze = async () => {
    setError('');
    setIsLoading(true);

    try {
      setFiringModel(6, 'ox');

      const result = await findGlaze({
        target_color_hex: color,
        finish: 'glossy',
        batch_size_grams: 350,
        firing_temp_cone: '6',
      });

      setDesignResult(result);
      setSelectedMatchId(result.primary_match.glaze_id);

      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Failed to find glaze match');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setSelectedPath(null);
    setModification(null);
  };

  const handleModification = (mod: GlazeModification) => {
    setModification(mod);
    setTimeout(() => {
      document.getElementById('tweak-result')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const PathIcon = selectedPath ? PATH_ICONS[selectedPath] : null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={glazeId ? `/library/${glazeId}` : '/design'}
          className="text-brand-600 hover:text-brand-700 text-sm font-medium mb-4 inline-flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{glazeId ? 'Back to Glaze' : 'Back to Design'}</span>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-clay-900 mb-2">
          Tweak Your Glaze
        </h1>
        <p className="text-clay-600">
          Adjust the color, fix glossiness, or work on alleviating crazing
        </p>
      </div>

      {error && (
        <div className="mb-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* ── Color Adjustment ── */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Color Picker */}
          <div className="md:col-span-2">
            <div className="card">
              <ColorPicker value={color} onChange={setColor} />
            </div>
          </div>

          {/* Selected Color Display */}
          <div>
            <div className="card">
              <h3 className="text-sm font-medium text-clay-700 mb-3">
                Selected Color
              </h3>
              <div
                className="w-full h-32 rounded-lg color-swatch mb-3"
                style={{ backgroundColor: color }}
              />
              <div className="text-center">
                <p className="text-2xl font-mono font-bold text-clay-900">
                  {color.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Find My Color Button */}
        <button
          onClick={handleFindGlaze}
          disabled={isLoading}
          className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 py-5 text-xl font-semibold rounded-xl"
        >
          <Sparkles className="w-6 h-6" />
          <span>{isLoading ? 'Finding Your Color...' : 'Find My Color'}</span>
        </button>
      </div>

      {/* ── Results Section ── */}
      {designResult && (
        <div id="results-section" className="border-t border-clay-200 pt-12 mb-12">
          <ResultsPanel
            result={designResult}
            selectedMatchId={selectedMatchId}
            onSelectMatch={setSelectedMatchId}
          />

          <button
            onClick={() => router.push(`/design/report?color=${encodeURIComponent(color)}`)}
            className="w-full mt-8 border-2 border-dashed border-clay-300 text-clay-500 hover:border-brand-400 hover:text-brand-600 font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>Generate Report</span>
          </button>
        </div>
      )}

      {/* ── Troubleshooting Section ── */}
      <div className="border-t border-clay-200 pt-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-clay-900 mb-2">
            Having an issue?
          </h2>
          <p className="text-clay-600">
            If something&apos;s not right with your glaze, walk through a guided diagnostic below.
          </p>
        </div>

        {!selectedPath ? (
          <TweakPathSelector onSelect={setSelectedPath} />
        ) : (
          <div className="space-y-6">
            {/* Path header with start over */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {PathIcon && (
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                    <PathIcon className="w-5 h-5 text-brand-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-clay-900">
                    {PATH_LABELS[selectedPath]} Diagnosis
                  </h2>
                  <p className="text-sm text-clay-500">
                    {selectedPath === 'temperature' && 'Let\'s figure out why your glaze is running.'}
                    {selectedPath === 'texture' && 'Let\'s get your surface where you want it.'}
                    {selectedPath === 'crazing' && 'Let\'s diagnose the crazing and find a fix.'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleStartOver}
                className="btn-secondary flex items-center space-x-2 text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start Over</span>
              </button>
            </div>

            {/* Active path wizard */}
            {selectedPath === 'temperature' && (
              <TemperaturePath
                originalColorHex={color}
                originalGlazeId={glazeId}
                onModification={handleModification}
              />
            )}
            {selectedPath === 'texture' && (
              <TexturePath
                originalColorHex={color}
                originalGlazeId={glazeId}
                onModification={handleModification}
              />
            )}
            {selectedPath === 'crazing' && (
              <CrazingPath
                originalColorHex={color}
                originalGlazeId={glazeId}
                onModification={handleModification}
              />
            )}

            {/* Temporary report button — real recommendations coming later */}
            {modification && (
              <div id="tweak-result">
                <button
                  onClick={() => router.push(`/design/report?color=${encodeURIComponent(color)}`)}
                  className="w-full mt-3 border-2 border-dashed border-clay-300 text-clay-500 hover:border-brand-400 hover:text-brand-600 font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Generate Report</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
