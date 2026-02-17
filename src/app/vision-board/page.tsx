'use client';

import { useState } from 'react';
import { VISION_BOARD_GLAZES } from './data';
import GlazeCard from '@/components/GlazeCard';
import { Search, Filter, Palette } from 'lucide-react';

export default function VisionBoardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Use static data instead of API call
  const glazes = VISION_BOARD_GLAZES;

  const filteredGlazes = searchQuery
    ? glazes.filter(glaze =>
        glaze.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : glazes;

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

        {/* Search and Filter */}
        <div className="card max-w-3xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-clay-400" />
              <input
                type="text"
                placeholder="Search glazes by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <button className="btn-secondary flex items-center justify-center space-x-2 whitespace-nowrap">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Glazes Grid */}
        {filteredGlazes.length === 0 ? (
          <div className="text-center py-12">
            <Palette className="w-16 h-16 text-clay-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-clay-900 mb-2">
              No glazes found
            </h3>
            <p className="text-clay-600">Try a different search term</p>
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
