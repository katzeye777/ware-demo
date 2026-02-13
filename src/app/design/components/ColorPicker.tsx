'use client';

import { useState, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Camera, Image as ImageIcon, Pipette } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [activeTab, setActiveTab] = useState<'picker' | 'camera' | 'image'>('picker');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColorFromImage = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;

    onChange(rgbToHex(r, g, b));
  };

  const loadImageToCanvas = (src: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = src;
  };

  const handleCameraActivation = () => {
    fileInputRef.current?.click();
  };

  const tabs = [
    { id: 'picker' as const, label: 'Picker', icon: Pipette },
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
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-clay-600 hover:text-clay-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'picker' && (
          <div className="space-y-4">
            {/* Color Picker */}
            <div className="flex justify-center">
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

        {activeTab === 'camera' && (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <Camera className="w-16 h-16 text-clay-400" />
            <p className="text-clay-600 text-center">
              Capture or upload a photo to extract colors
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleCameraActivation}
              className="btn-primary"
            >
              Take Photo / Upload
            </button>
            {imagePreview && (
              <div className="w-full">
                <canvas
                  ref={canvasRef}
                  onClick={extractColorFromImage}
                  className="w-full max-h-64 object-contain cursor-crosshair border-2 border-brand-300 rounded-lg"
                  onLoad={() => loadImageToCanvas(imagePreview)}
                />
                <p className="text-xs text-clay-500 mt-2 text-center">
                  Click on the image to sample a color
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'image' && (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <ImageIcon className="w-16 h-16 text-clay-400" />
            <p className="text-clay-600 text-center">
              Upload an image to sample colors from
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
            {imagePreview && (
              <div className="w-full">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-lg"
                  onLoad={() => loadImageToCanvas(imagePreview)}
                />
                <canvas
                  ref={canvasRef}
                  onClick={extractColorFromImage}
                  className="w-full max-h-64 object-contain cursor-crosshair border-2 border-brand-300 rounded-lg mt-2"
                />
                <p className="text-xs text-clay-500 mt-2 text-center">
                  Click on the canvas to sample a color
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
