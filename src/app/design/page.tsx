'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useDesignStore } from '@/lib/store';
import { findGlaze, generatePreview, saveGlaze, setFiringModel } from '@/lib/demo-api';
import ColorPicker from './components/ColorPicker';
import FinishSelector from './components/FinishSelector';
import ApplicationSelector from './components/ApplicationSelector';
import FiringSelector from './components/FiringSelector';
import BatchSizeSelector from './components/BatchSizeSelector';
import ResultsPanel from './components/ResultsPanel';
import { Sparkles, Save, ArrowRight, Image as ImageIcon } from 'lucide-react';

export default function DesignPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    designResult,
    selectedMatchId,
    glazeName,
    setCurrentDesign,
    setDesignResult,
    setSelectedMatchId,
    setGlazeName,
  } = useDesignStore();

  const [color, setColor] = useState('#e4533d');
  const [finish, setFinish] = useState<'glossy' | 'matte' | 'satin'>('glossy');
  const [application, setApplication] = useState<'dip' | 'brush' | 'spray'>('dip');
  const [cone, setCone] = useState('6');
  const [atmosphere, setAtmosphere] = useState('ox');
  const [batchSize, setBatchSize] = useState(350);
  const [glazeFormat, setGlazeFormat] = useState<'dry' | 'wet'>('dry');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFindGlaze = async () => {
    // No login gate in demo mode — anyone can use it
    setError('');
    setIsLoading(true);
    setPreviewImage(null);

    try {
      // Set the firing model before searching
      setFiringModel(Number(cone), atmosphere);

      const design = {
        target_color_hex: color,
        finish,
        batch_size_grams: batchSize,
        firing_temp_cone: cone,
        format: glazeFormat,
      };

      setCurrentDesign(design);

      // Use the local demo API (TypeScript color engine in browser)
      const result = await findGlaze(design);
      setDesignResult(result);

      // Scroll to results
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

  const handleGeneratePreview = async () => {
    if (!designResult) return;
    setIsGeneratingPreview(true);

    try {
      const matchHex = designResult.primary_match.color_hex;
      const result = await generatePreview(matchHex, finish);
      setPreviewImage(result.image_url);
    } catch {
      setError('Failed to generate preview image');
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleAutoName = () => {
    const names = [
      'Sunset Ember', 'Ocean Depth', 'Forest Whisper', 'Desert Dawn',
      'Midnight Sky', 'Coral Dream', 'Sage Mist', 'Plum Velvet',
      'Amber Glow', 'Cedar Smoke', 'Winter Moon', 'Copper Leaf',
    ];
    const randomName = names[Math.floor(Math.random() * names.length)];
    setGlazeName(randomName);
  };

  const handleSaveToLibrary = async () => {
    if (!designResult || !selectedMatchId || !glazeName.trim()) {
      setError('Please provide a name for your glaze');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await saveGlaze({
        name: glazeName,
        target_color_hex: color,
        finish,
        batch_size_grams: batchSize,
        selected_match_id: selectedMatchId,
        is_private: false,
      });

      router.push('/library');
    } catch (err: any) {
      setError(err.message || 'Failed to save glaze');
    } finally {
      setIsSaving(false);
    }
  };

  const handleJoinWaitlist = () => {
    router.push('/waitlist');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-clay-900 mb-4">
          Design Your Perfect Glaze
        </h1>
        <p className="text-lg text-clay-600 max-w-2xl mx-auto">
          Pick your color, choose your finish, and we'll craft a glaze made just for you
        </p>
      </div>

      {error && (
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Design Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column - Color Selection + Find Button */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <ColorPicker value={color} onChange={setColor} />
          </div>

          {/* Find My Color Button — large, under the picker */}
          <button
            onClick={handleFindGlaze}
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 py-5 text-xl font-semibold rounded-xl"
          >
            <Sparkles className="w-6 h-6" />
            <span>{isLoading ? 'Finding Your Color...' : 'Find My Color'}</span>
          </button>
        </div>

        {/* Right Column - Options */}
        <div className="space-y-6">
          {/* Selected Color Display */}
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

          {/* Finish Selector */}
          <div className="card">
            <FinishSelector value={finish} onChange={setFinish} />
          </div>

          {/* Application Method */}
          <div className="card">
            <ApplicationSelector value={application} onChange={setApplication} />
          </div>

          {/* Firing Temperature */}
          <div className="card">
            <FiringSelector
              cone={cone}
              atmosphere={atmosphere}
              onConeChange={setCone}
              onAtmosphereChange={setAtmosphere}
            />
          </div>

          {/* Batch Size */}
          <div className="card">
            <BatchSizeSelector
              value={batchSize}
              onChange={setBatchSize}
              format={glazeFormat}
              onFormatChange={setGlazeFormat}
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      {designResult && (
        <div id="results-section" className="border-t border-clay-200 pt-12">
          <ResultsPanel
            result={designResult}
            selectedMatchId={selectedMatchId}
            onSelectMatch={setSelectedMatchId}
          />

          {/* Preview Image Section */}
          <div className="max-w-3xl mx-auto mt-8">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-clay-900">
                  Glaze Preview
                </h3>
                <button
                  onClick={handleGeneratePreview}
                  disabled={isGeneratingPreview}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>
                    {isGeneratingPreview ? 'Generating...' : 'Generate Preview'}
                  </span>
                </button>
              </div>

              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Glaze preview"
                  className="w-full rounded-lg shadow-lg"
                />
              ) : (
                <div className="aspect-square max-w-md mx-auto rounded-lg bg-clay-100 flex items-center justify-center">
                  <div className="text-center text-clay-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">
                      Click &quot;Generate Preview&quot; to see how this
                      <br />
                      glaze looks on a ceramic bowl
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Name and Save Section */}
          <div className="max-w-3xl mx-auto mt-8 space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-clay-900 mb-4">
                Name Your Glaze
              </h3>

              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={glazeName}
                  onChange={(e) => setGlazeName(e.target.value)}
                  placeholder="e.g., Sunset Ember"
                  className="input-field flex-1"
                />
                <button
                  onClick={handleAutoName}
                  className="btn-secondary whitespace-nowrap"
                >
                  Name it for me
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleSaveToLibrary}
                disabled={isSaving || !glazeName.trim()}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{isSaving ? 'Saving...' : 'Save to Library'}</span>
              </button>

              <button
                onClick={handleJoinWaitlist}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Order This Glaze</span>
              </button>
            </div>

            {/* Generate Report — calibration tool */}
            <button
              onClick={() => router.push(`/design/report?color=${encodeURIComponent(color)}`)}
              className="w-full mt-3 border-2 border-dashed border-clay-300 text-clay-500 hover:border-brand-400 hover:text-brand-600 font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      )}

      {/* Initial State - No Results */}
      {!designResult && !isLoading && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Sparkles className="w-16 h-16 text-clay-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-clay-900 mb-2">
              Ready to Create?
            </h3>
            <p className="text-clay-600">
              Select your color and preferences above, then click &quot;Find My Color&quot; to see matches
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
