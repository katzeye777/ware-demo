'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Thermometer, Layers, ZoomIn } from 'lucide-react';
import TweakPathSelector from './components/TweakPathSelector';
import TemperaturePath from './components/TemperaturePath';
import TexturePath from './components/TexturePath';
import CrazingPath from './components/CrazingPath';
import TweakResultPanel from './components/TweakResultPanel';
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
  const searchParams = useSearchParams();

  // Read query params
  const colorHex = searchParams.get('color') || '#e4533d';
  const glazeId = searchParams.get('glazeId') || undefined;
  const finish = searchParams.get('finish') || 'glossy';

  // Local state
  const [selectedPath, setSelectedPath] = useState<TweakPath | null>(null);
  const [modification, setModification] = useState<GlazeModification | null>(null);

  const handleStartOver = () => {
    setSelectedPath(null);
    setModification(null);
  };

  const handleModification = (mod: GlazeModification) => {
    setModification(mod);
    // Scroll to result
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
          Walk through a guided diagnostic to find what's going on — and how to fix it.
        </p>
      </div>

      {/* Original glaze card */}
      <div className="card mb-8 flex items-center space-x-4">
        <div
          className="w-16 h-16 rounded-lg color-swatch border border-clay-200 flex-shrink-0"
          style={{ backgroundColor: colorHex }}
        />
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-clay-900">Original Glaze</h2>
          <div className="flex items-center space-x-3 text-sm text-clay-500">
            <span className="font-mono">{colorHex.toUpperCase()}</span>
            <span>&bull;</span>
            <span className="capitalize">{finish}</span>
            {glazeId && (
              <>
                <span>&bull;</span>
                <span className="truncate">{glazeId}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Path selector or active path */}
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
              originalColorHex={colorHex}
              originalGlazeId={glazeId}
              onModification={handleModification}
            />
          )}
          {selectedPath === 'texture' && (
            <TexturePath
              originalColorHex={colorHex}
              originalGlazeId={glazeId}
              onModification={handleModification}
            />
          )}
          {selectedPath === 'crazing' && (
            <CrazingPath
              originalColorHex={colorHex}
              originalGlazeId={glazeId}
              onModification={handleModification}
            />
          )}

          {/* Modification result */}
          {modification && (
            <div id="tweak-result">
              <TweakResultPanel modification={modification} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
