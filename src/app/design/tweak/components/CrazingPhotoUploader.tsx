'use client';

import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Loader2, ZoomIn } from 'lucide-react';
import { severityBadge } from '@/lib/tweak-engine';
import type { CrazingSeverity } from '@/lib/tweak-engine';

interface CrazingPhotoUploaderProps {
  onAnalysisComplete: (severity: CrazingSeverity, description: string) => void;
}

/** Resize an image data URL to max 800px wide, JPEG quality 0.7 */
function resizeImage(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const maxW = 800;
      let w = img.width;
      let h = img.height;
      if (w > maxW) {
        h = Math.round(h * (maxW / w));
        w = maxW;
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export default function CrazingPhotoUploader({ onAnalysisComplete }: CrazingPhotoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ severity: CrazingSeverity; description: string } | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const resized = await resizeImage(dataUrl);
      setPreview(resized);
      setResult(null);
      setError('');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  const handleAnalyze = async () => {
    if (!preview) return;
    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch('/api/analyze-crazing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_data: preview }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResult({ severity: data.severity, description: data.description });
      onAnalysisComplete(data.severity, data.description);
    } catch {
      setError('Analysis could not complete. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const badge = result ? severityBadge(result.severity) : null;

  return (
    <div className="space-y-4">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />

      {!preview ? (
        /* Upload area */
        <div className="border-2 border-dashed border-clay-200 rounded-lg p-8 text-center hover:border-brand-300 transition-colors">
          <ZoomIn className="w-10 h-10 text-clay-300 mx-auto mb-3" />
          <p className="text-sm text-clay-600 mb-4">
            Upload a close-up photo of the crazing on your piece
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary flex items-center space-x-2 text-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
            </button>
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="btn-secondary flex items-center space-x-2 text-sm"
            >
              <Camera className="w-4 h-4" />
              <span>Take Photo</span>
            </button>
          </div>
        </div>
      ) : (
        /* Preview + Analyze */
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-clay-200">
            <img
              src={preview}
              alt="Crazing photo"
              className="w-full max-h-64 object-cover"
            />
            <button
              onClick={() => { setPreview(null); setResult(null); }}
              className="absolute top-2 right-2 w-8 h-8 bg-clay-900/60 hover:bg-clay-900/80 text-white rounded-full flex items-center justify-center text-sm"
            >
              ✕
            </button>
          </div>

          {!result && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <ZoomIn className="w-4 h-4" />
                  <span>Analyze Crazing</span>
                </>
              )}
            </button>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {result && badge && (
            <div className="bg-white border border-clay-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${badge.className}`}>
                  {badge.label}
                </span>
              </div>
              <p className="text-sm text-clay-600">{result.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
