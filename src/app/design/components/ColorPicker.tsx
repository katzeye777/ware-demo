'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Camera, Image as ImageIcon, Pipette, Type, Search, Crosshair } from 'lucide-react';
import { descriptionToHex, getColorSuggestions } from '@/lib/color-names';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [activeTab, setActiveTab] = useState<'picker' | 'describe' | 'camera' | 'image'>('picker');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [colorDescription, setColorDescription] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; hex: string }[]>([]);
  const [descriptionApplied, setDescriptionApplied] = useState(false);
  const [sampledColor, setSampledColor] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Store full-res image data separately from the display canvas
  const fullImageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const rgb = hexToRgb(value);

  const handleRgbChange = (channel: 'r' | 'g' | 'b', val: number) => {
    const newRgb = { ...rgb, [channel]: val };
    onChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImagePreview(src);
        setImageLoaded(false);
        setSampledColor(null);
        setCursorPos(null);
        setHoverColor(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Draw image to canvas at correct display size so click coordinates match pixel data
  const drawImageToCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !imagePreview) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.onload = () => {
      fullImageRef.current = img;

      // Get the container width to size the canvas
      const maxWidth = container.clientWidth;
      const maxHeight = 600; // generous max height

      // Scale image to fit container while maintaining aspect ratio
      let drawWidth = img.width;
      let drawHeight = img.height;

      if (drawWidth > maxWidth) {
        const scale = maxWidth / drawWidth;
        drawWidth = maxWidth;
        drawHeight = img.height * scale;
      }
      if (drawHeight > maxHeight) {
        const scale = maxHeight / drawHeight;
        drawHeight = maxHeight;
        drawWidth = drawWidth * scale;
      }

      // Set canvas internal resolution to match display size exactly
      // This is the key fix: canvas pixel dimensions === CSS display dimensions
      canvas.width = Math.round(drawWidth);
      canvas.height = Math.round(drawHeight);
      canvas.style.width = `${Math.round(drawWidth)}px`;
      canvas.style.height = `${Math.round(drawHeight)}px`;

      // Draw image scaled to canvas
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      setImageLoaded(true);
    };
    img.src = imagePreview;
  }, [imagePreview]);

  // Redraw when image changes or tab switches to image
  useEffect(() => {
    if (imagePreview && activeTab === 'image') {
      // Small delay to ensure container is rendered and has correct width
      const timer = setTimeout(drawImageToCanvas, 50);
      return () => clearTimeout(timer);
    }
  }, [imagePreview, activeTab, drawImageToCanvas]);

  // Also redraw on window resize
  useEffect(() => {
    if (!imagePreview || activeTab !== 'image') return;
    const handleResize = () => drawImageToCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imagePreview, activeTab, drawImageToCanvas]);

  const getColorAtPosition = (e: React.MouseEvent<HTMLCanvasElement>): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // Bounds check
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return null;

    // Sample a small area (3×3) and average for more stable color
    const sampleSize = 3;
    const halfSample = Math.floor(sampleSize / 2);
    let rSum = 0, gSum = 0, bSum = 0, count = 0;

    for (let dx = -halfSample; dx <= halfSample; dx++) {
      for (let dy = -halfSample; dy <= halfSample; dy++) {
        const sx = x + dx;
        const sy = y + dy;
        if (sx >= 0 && sx < canvas.width && sy >= 0 && sy < canvas.height) {
          const pixel = ctx.getImageData(sx, sy, 1, 1).data;
          rSum += pixel[0];
          gSum += pixel[1];
          bSum += pixel[2];
          count++;
        }
      }
    }

    if (count === 0) return null;
    return rgbToHex(
      Math.round(rSum / count),
      Math.round(gSum / count),
      Math.round(bSum / count)
    );
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const color = getColorAtPosition(e);
    if (color) {
      onChange(color);
      setSampledColor(color);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });

    const color = getColorAtPosition(e);
    if (color) setHoverColor(color);
  };

  const handleCanvasMouseLeave = () => {
    setCursorPos(null);
    setHoverColor(null);
  };

  const handleCameraActivation = () => {
    fileInputRef.current?.click();
  };

  const handleDescriptionChange = useCallback((text: string) => {
    setColorDescription(text);
    setDescriptionApplied(false);
    if (text.trim().length >= 2) {
      setSuggestions(getColorSuggestions(text, 8));
    } else {
      setSuggestions([]);
    }
  }, []);

  const handleDescriptionSubmit = () => {
    const hex = descriptionToHex(colorDescription);
    if (hex) {
      onChange(hex);
      setDescriptionApplied(true);
    }
  };

  const handleSuggestionClick = (hex: string) => {
    onChange(hex);
    setDescriptionApplied(true);
  };

  const tabs = [
    { id: 'picker' as const, label: 'Picker', icon: Pipette },
    { id: 'describe' as const, label: 'Describe', icon: Type },
    { id: 'camera' as const, label: 'Camera', icon: Camera },
    { id: 'image' as const, label: 'From Image', icon: ImageIcon },
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-clay-700">
        Select Your Color
      </label>

      {/* Tabs */}
      <div className="flex space-x-1 bg-clay-100 p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-clay-600 hover:text-clay-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'picker' && (
          <div className="space-y-4">
            {/* Color Picker — large for easy selection */}
            <div className="flex justify-center color-picker-large">
              <HexColorPicker color={value} onChange={onChange} />
            </div>

            {/* Hex Input */}
            <div>
              <label className="block text-xs font-medium text-clay-600 mb-1">
                Hex Code
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^#[0-9A-F]{6}$/i.test(val)) {
                    onChange(val);
                  }
                }}
                className="input-field font-mono uppercase"
                placeholder="#000000"
              />
            </div>

            {/* RGB Sliders */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-clay-600 mb-1">
                  <span>Red</span>
                  <span>{rgb.r}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgb.r}
                  onChange={(e) => handleRgbChange('r', Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-black to-red-500 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-clay-600 mb-1">
                  <span>Green</span>
                  <span>{rgb.g}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgb.g}
                  onChange={(e) => handleRgbChange('g', Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-black to-green-500 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-clay-600 mb-1">
                  <span>Blue</span>
                  <span>{rgb.b}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgb.b}
                  onChange={(e) => handleRgbChange('b', Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-black to-blue-500 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'describe' && (
          <div className="space-y-4">
            <p className="text-sm text-clay-600">
              Describe the color you&apos;re looking for and we&apos;ll find the closest match.
            </p>

            {/* Description Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={colorDescription}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleDescriptionSubmit();
                }}
                className="input-field flex-1"
                placeholder="e.g., Chestnut brown, Robin's egg blue, Dusty sage..."
              />
              <button
                onClick={handleDescriptionSubmit}
                disabled={!colorDescription.trim()}
                className="btn-primary disabled:opacity-50 flex items-center space-x-2 px-4"
              >
                <Search className="w-4 h-4" />
                <span>Find</span>
              </button>
            </div>

            {/* Applied confirmation */}
            {descriptionApplied && (
              <div className="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-lg p-3">
                <div
                  className="w-10 h-10 rounded-lg color-swatch flex-shrink-0"
                  style={{ backgroundColor: value }}
                />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Color applied: {value.toUpperCase()}
                  </p>
                  <p className="text-xs text-green-600">
                    You can fine-tune it with the Picker tab
                  </p>
                </div>
              </div>
            )}

            {/* Suggestions grid */}
            {suggestions.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-clay-600 mb-2">
                  Matching colors — click to select
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s.hex + s.name}
                      onClick={() => handleSuggestionClick(s.hex)}
                      className={`group relative rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        value.toLowerCase() === s.hex.toLowerCase()
                          ? 'border-brand-500 shadow-md'
                          : 'border-clay-200 hover:border-brand-300'
                      }`}
                    >
                      <div
                        className="w-full h-16"
                        style={{ backgroundColor: s.hex }}
                      />
                      <div className="px-2 py-1.5 bg-white">
                        <p className="text-xs font-medium text-clay-800 truncate">
                          {s.name}
                        </p>
                        <p className="text-[10px] font-mono text-clay-500">
                          {s.hex.toUpperCase()}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Prompt ideas */}
            {suggestions.length === 0 && !descriptionApplied && (
              <div className="bg-clay-50 rounded-lg p-4">
                <p className="text-xs font-medium text-clay-600 mb-2">Try describing colors like:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Chestnut brown',
                    'Ocean blue',
                    'Sage green',
                    'Dusty rose',
                    'Burnt sienna',
                    'Midnight blue',
                    'Coral pink',
                    'Forest green',
                    'Lavender',
                    'Terracotta',
                  ].map(example => (
                    <button
                      key={example}
                      onClick={() => {
                        setColorDescription(example);
                        handleDescriptionChange(example);
                      }}
                      className="text-xs bg-white border border-clay-200 rounded-full px-3 py-1 text-clay-700 hover:border-brand-300 hover:text-brand-600 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'camera' && (
          <div className="flex flex-col items-center justify-center space-y-4 py-16 border-2 border-dashed border-clay-300 rounded-xl bg-clay-50">
            <Camera className="w-16 h-16 text-clay-400" />
            <p className="text-clay-600 text-center">
              Take a photo of a glaze, ceramic piece, or any color reference
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                handleImageUpload(e);
                // Switch to From Image tab to show the sampler
                setActiveTab('image');
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleCameraActivation}
              className="btn-primary"
            >
              Open Camera
            </button>
            <p className="text-xs text-clay-400">
              On mobile, this opens your camera. On desktop, use &ldquo;From Image&rdquo; instead.
            </p>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="space-y-4" ref={containerRef}>
            {/* Upload area — shown when no image */}
            {!imagePreview && (
              <div className="flex flex-col items-center justify-center space-y-4 py-16 border-2 border-dashed border-clay-300 rounded-xl bg-clay-50">
                <ImageIcon className="w-16 h-16 text-clay-400" />
                <p className="text-clay-600 text-center">
                  Upload a photo of a ceramic piece, glaze sample, or any color reference
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="btn-primary cursor-pointer">
                  Choose Image
                </label>
              </div>
            )}

            {/* Image canvas — the single source of truth */}
            {imagePreview && (
              <div className="space-y-3">
                {/* Toolbar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-clay-600">
                    <Crosshair className="w-4 h-4" />
                    <span>Click anywhere on the image to sample a color</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload-replace"
                    />
                    <label
                      htmlFor="image-upload-replace"
                      className="text-sm text-brand-600 hover:text-brand-700 cursor-pointer font-medium"
                    >
                      Change Image
                    </label>
                  </div>
                </div>

                {/* Canvas with hover loupe */}
                <div className="relative inline-block w-full">
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseLeave={handleCanvasMouseLeave}
                    className="rounded-xl border-2 border-clay-200 cursor-crosshair block"
                    style={{ maxWidth: '100%' }}
                  />

                  {/* Hover color preview loupe — follows cursor */}
                  {cursorPos && hoverColor && imageLoaded && (
                    <div
                      className="pointer-events-none absolute z-10"
                      style={{
                        left: cursorPos.x + 20,
                        top: cursorPos.y - 60,
                      }}
                    >
                      <div className="bg-white rounded-lg shadow-xl border border-clay-200 p-1.5 flex items-center space-x-2">
                        <div
                          className="w-10 h-10 rounded-md border border-clay-300"
                          style={{ backgroundColor: hoverColor }}
                        />
                        <div>
                          <p className="text-xs font-mono font-bold text-clay-900">
                            {hoverColor.toUpperCase()}
                          </p>
                          <p className="text-[10px] text-clay-500">Click to select</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sampled color confirmation */}
                {sampledColor && (
                  <div className="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-lg p-3">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-green-300 flex-shrink-0"
                      style={{ backgroundColor: sampledColor }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">
                        Sampled: {sampledColor.toUpperCase()}
                      </p>
                      <p className="text-xs text-green-600">
                        Color applied — fine-tune it with the Picker tab if needed
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
