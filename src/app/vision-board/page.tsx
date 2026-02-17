'use client';

import { useState, useMemo, useCallback } from 'react';
import { VISION_BOARD_GLAZES } from './data';
import GlazeCard from '@/components/GlazeCard';
import { Search, Palette, X, Type, Pipette } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { descriptionToHex, getColorSuggestions } from '@/lib/color-names';
import { hexToRgb, rgbToLab, deltaE2000 } from '@/lib/color-engine';

type Finish = 'glossy' | 'matte' | 'satin';

function hexToLabSafe(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex);
  return rgbToLab(r, g, b);
}

export default function VisionBoardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [finishFilter, setFinishFilter] = useState<Finish | null>(null);
  const [colorSearch, setColorSearch] = useState('');
  const [colorHex, setColorHex] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorMode, setColorMode] = useState<'describe' | 'picker'>('describe');
  const [suggestions, setSuggestions] = useState<{ name: string; hex: string }[]>([]);

  const glazes = VISION_BOARD_GLAZES;

  const handleDescriptionChange = useCallback((text: string) => {
    setColorSearch(text);
    if (text.trim().length >= 2) {
      setSuggestions(getColorSuggestions(text, 6));
      const hex = descriptionToHex(text);
      if (hex) {
        setColorHex(hex);
      }
    } else {
      setSuggestions([]);
      if (text.trim().length === 0) {
        setColorHex(null);
      }
    }
  }, []);

  const handleSuggestionClick = (hex: string) => {
    setColorHex(hex);
  };

  const handlePickerChange = (hex: string) => {
    setColorHex(hex);
  };

  const clearColorSearch = () => {
    setColorSearch('');
    setColorHex(null);
    setSuggestions([]);
    setShowColorPicker(false);
  };

  const hasActiveFilters = searchQuery || finishFilter || colorHex;

  const clearAllFilters = () => {
    setSearchQuery('');
    setFinishFilter(null);
    clearColorSearch();
  };

  // Filter and sort glazes
  const filteredGlazes = useMemo(() => {
    let result = [...glazes];

    // Name search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g => g.name.toLowerCase().includes(q));
    }

    // Finish filter
    if (finishFilter) {
      result = result.filter(g => g.finish === finishFilter);
    }

    // Color sort — sort by ΔE (closest first)
    if (colorHex) {
      const targetLab = hexToLabSafe(colorHex);
      result = result
        .map(g => ({
          glaze: g,
          distance: deltaE2000(targetLab, hexToLabSafe(g.color_hex)),
        }))
        .sort((a, b) => a.distance - b.distance)
        .map(item => item.glaze);
    }

    return result;
  }, [glazes, searchQuery, finishFilter, colorHex]);

  const finishes: { value: Finish; label: string }[] = [
    { value: 'glossy', label: 'Glossy' },
    { value: 'matte', label: 'Matte' },
    { value: 'satin', label: 'Satin' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-clay-50 to-brand-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-brand-100 rounded-full p-4">
              <Palette className="w-12 h-12 text-brand-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-clay-900 mb-4">
            Vision Board
          </h1>
          <p className="text-lg text-clay-600 max-w-2xl mx-auto">
            Browse colors that other makers have brought to life. Find the spark for your next piece.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="card max-w-4xl mx-auto mb-8 space-y-4">
          {/* Row 1: Name search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-clay-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Row 2: Color search + Finish filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Color Search */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-clay-600 mb-1.5">
                Find by Color
              </label>
              <div className="flex items-center gap-2">
                {/* Mode toggle */}
                <div className="flex bg-clay-100 rounded-lg p-0.5 flex-shrink-0">
                  <button
                    onClick={() => {
                      setColorMode('describe');
                      setShowColorPicker(false);
                    }}
                    className={`p-2 rounded-md transition-colors ${
                      colorMode === 'describe'
                        ? 'bg-white text-brand-600 shadow-sm'
                        : 'text-clay-500 hover:text-clay-700'
                    }`}
                    title="Describe a color"
                  >
                    <Type className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setColorMode('picker');
                      setShowColorPicker(true);
                    }}
                    className={`p-2 rounded-md transition-colors ${
                      colorMode === 'picker'
                        ? 'bg-white text-brand-600 shadow-sm'
                        : 'text-clay-500 hover:text-clay-700'
                    }`}
                    title="Pick a color"
                  >
                    <Pipette className="w-4 h-4" />
                  </button>
                </div>

                {colorMode === 'describe' ? (
                  <input
                    type="text"
                    value={colorSearch}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    className="input-field flex-1"
                    placeholder="e.g., ocean blue, dusty rose..."
                  />
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={colorHex || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                          setColorHex(val);
                        }
                      }}
                      className="input-field flex-1 font-mono uppercase"
                      placeholder="#000000"
                    />
                    {colorHex && (
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-clay-200 flex-shrink-0"
                        style={{ backgroundColor: colorHex }}
                      />
                    )}
                  </div>
                )}

                {colorHex && (
                  <button
                    onClick={clearColorSearch}
                    className="p-2 text-clay-400 hover:text-clay-600 flex-shrink-0"
                    title="Clear color"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Finish Filter */}
            <div className="sm:w-auto">
              <label className="block text-xs font-medium text-clay-600 mb-1.5">
                Finish
              </label>
              <div className="flex gap-2">
                {finishes.map((f) => (
                  <button
                    key={f.value}
                    onClick={() =>
                      setFinishFilter(finishFilter === f.value ? null : f.value)
                    }
                    className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                      finishFilter === f.value
                        ? 'border-brand-500 bg-brand-50 text-brand-800'
                        : 'border-clay-200 bg-white text-clay-600 hover:border-clay-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color picker (inline, only when picker mode active) */}
          {colorMode === 'picker' && showColorPicker && (
            <div className="flex justify-center pt-2">
              <HexColorPicker
                color={colorHex || '#e4533d'}
                onChange={handlePickerChange}
              />
            </div>
          )}

          {/* Color suggestions (describe mode) */}
          {colorMode === 'describe' && suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s.hex + s.name}
                  onClick={() => handleSuggestionClick(s.hex)}
                  className={`flex items-center space-x-2 rounded-full border-2 pl-1 pr-3 py-1 text-xs font-medium transition-all hover:scale-105 ${
                    colorHex?.toLowerCase() === s.hex.toLowerCase()
                      ? 'border-brand-500 bg-brand-50 text-brand-800'
                      : 'border-clay-200 bg-white text-clay-700 hover:border-brand-300'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full border border-clay-200"
                    style={{ backgroundColor: s.hex }}
                  />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Active filter swatch + clear */}
          {colorHex && colorMode === 'describe' && (
            <div className="flex items-center gap-3 bg-brand-50 rounded-lg p-2">
              <div
                className="w-8 h-8 rounded-lg border-2 border-brand-200 flex-shrink-0"
                style={{ backgroundColor: colorHex }}
              />
              <span className="text-sm text-brand-800 font-medium">
                Sorted by closest match to {colorHex.toUpperCase()}
              </span>
            </div>
          )}

          {/* Clear all filters */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-1">
              <p className="text-sm text-clay-500">
                {filteredGlazes.length} glaze{filteredGlazes.length !== 1 ? 's' : ''} found
              </p>
              <button
                onClick={clearAllFilters}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Glazes Grid */}
        {filteredGlazes.length === 0 ? (
          <div className="text-center py-12">
            <Palette className="w-16 h-16 text-clay-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-clay-900 mb-2">
              No glazes found
            </h3>
            <p className="text-clay-600 mb-4">Try adjusting your search or filters</p>
            <button onClick={clearAllFilters} className="btn-secondary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGlazes.map((glaze) => (
              <GlazeCard
                key={glaze.id}
                id={glaze.id}
                name={glaze.name}
                colorHex={glaze.color_hex}
                previewImageUrl={glaze.preview_image_url}
                rating={glaze.rating_avg}
                ratingCount={glaze.rating_count}
                showRating={true}
              />
            ))}
          </div>
        )}

        {/* Call to Action */}
        {filteredGlazes.length > 0 && (
          <div className="mt-16 text-center">
            <div className="card max-w-2xl mx-auto bg-gradient-to-r from-brand-500 to-brand-600 text-white">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Create Your Own?
              </h2>
              <p className="mb-6 text-brand-100">
                Turn the color in your head into a glaze on your shelf
              </p>
              <a
                href="/design"
                className="inline-block bg-white text-brand-600 hover:bg-clay-50 font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Start Designing
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
