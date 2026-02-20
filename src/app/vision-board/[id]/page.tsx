'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { VISION_BOARD_GLAZES } from '@/app/vision-board/data';
import { Star, ShoppingCart, Share2, Heart, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import {
  DRY_BATCH_SIZES,
  WET_BATCH_SIZES,
  WET_SIZE_GRAMS,
  calculateDryPrice,
  calculateWetPrice,
  getVolumeDiscount,
  formatPrice,
  type WetSize,
} from '@/lib/pricing';

export default function VisionBoardGlazeDetailPage() {
  const params = useParams();
  const addItem = useCartStore((s) => s.addItem);

  const glazeId = params.id as string;

  const glaze = useMemo(
    () => VISION_BOARD_GLAZES.find((g) => g.id === glazeId) ?? null,
    [glazeId]
  );

  const [isFavorited, setIsFavorited] = useState(false);
  const [batchSize, setBatchSize] = useState(350);
  const [glazeFormat, setGlazeFormat] = useState<'dry' | 'wet'>('dry');
  const [wetSize, setWetSize] = useState<WetSize>('pint');
  const [addedToCart, setAddedToCart] = useState(false);

  const currentPrice = glazeFormat === 'dry'
    ? calculateDryPrice(batchSize)
    : calculateWetPrice(wetSize);
  const currentDiscount = glazeFormat === 'dry' ? getVolumeDiscount(batchSize) : 0;

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: glaze?.name,
          text: `Check out this custom glaze: ${glaze?.name}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleAddToCart = () => {
    if (!glaze) return;
    addItem({
      glazeId: glaze.id,
      glazeName: glaze.name,
      batchSizeGrams: batchSize,
      colorHex: glaze.color_hex,
      isPrivate: false,
      price: currentPrice,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (!glaze) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-clay-900 mb-2">Glaze Not Found</h2>
          <p className="text-clay-600 mb-6">This glaze does not exist or may have been removed.</p>
          <Link href="/vision-board" className="btn-primary">
            Back to Vision Board
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Breadcrumb */}
      <Link
        href="/vision-board"
        className="text-brand-600 hover:text-brand-700 text-sm font-medium mb-6 inline-block"
      >
        &larr; Back to Vision Board
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Image + Color */}
        <div>
          <div className="sticky top-24 space-y-4">
            {/* Main Image */}
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-clay-100 shadow-xl">
              {glaze.preview_image_url ? (
                <img
                  src={glaze.preview_image_url}
                  alt={glaze.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: glaze.color_hex }}
                />
              )}
            </div>

            {/* Color Reference */}
            <div className="card">
              <h4 className="text-sm font-medium text-clay-700 mb-3">Color Reference</h4>
              <div className="flex items-stretch gap-3">
                <div className="flex-1">
                  <div
                    className="w-full h-20 rounded-lg color-swatch border border-clay-200"
                    style={{ backgroundColor: glaze.color_hex }}
                  />
                  <p className="text-xs text-clay-500 mt-2 text-center">Software prediction</p>
                  <p className="text-xs font-mono font-bold text-clay-900 text-center">
                    {glaze.color_hex.toUpperCase()}
                  </p>
                </div>
                {glaze.preview_image_url && (
                  <div className="flex-1">
                    <div className="w-full h-20 rounded-lg overflow-hidden border border-clay-200">
                      <img
                        src={glaze.preview_image_url}
                        alt="Fired sample"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-clay-500 mt-2 text-center">Fired test tile</p>
                  </div>
                )}
              </div>
            </div>

            {/* Favorite + Share */}
            <div className="flex gap-3">
              <button
                onClick={handleFavorite}
                className={`btn-outline flex-1 flex items-center justify-center space-x-2 ${
                  isFavorited ? 'bg-red-50 border-red-500 text-red-600' : ''
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                <span>{isFavorited ? 'Saved' : 'Save'}</span>
              </button>
              <button
                onClick={handleShare}
                className="btn-outline flex-1 flex items-center justify-center space-x-2"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Details + Ordering */}
        <div>
          {/* Name + Rating + Finish */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-clay-900 mb-3">{glaze.name}</h1>

            {glaze.rating_avg !== undefined && glaze.rating_avg > 0 && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(glaze.rating_avg || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-clay-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium">{glaze.rating_avg.toFixed(1)}</span>
                {glaze.rating_count !== undefined && (
                  <span className="text-clay-500">({glaze.rating_count} reviews)</span>
                )}
              </div>
            )}

            <div className="inline-block bg-clay-100 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-clay-700">
                {glaze.finish.charAt(0).toUpperCase() + glaze.finish.slice(1)} Finish
              </span>
            </div>
          </div>

          {/* Specifications */}
          <div className="card mb-6">
            <h3 className="font-semibold text-clay-900 mb-4">Specifications</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-clay-600">Finish Type</span>
                <span className="font-medium text-clay-900">
                  {glaze.finish.charAt(0).toUpperCase() + glaze.finish.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-clay-600">Color Code</span>
                <span className="font-medium text-clay-900 font-mono">
                  {glaze.color_hex.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-clay-600">Firing Temperature</span>
                <span className="font-medium text-clay-900">Cone 6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-clay-600">Atmosphere</span>
                <span className="font-medium text-clay-900">Oxidation</span>
              </div>
            </div>
          </div>

          {/* Batch Size Selector */}
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-clay-900">Order</h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-brand-600">
                  {formatPrice(currentPrice)}
                </div>
                <div className="text-xs text-clay-500">
                  {currentDiscount > 0 && (
                    <span className="text-green-600 font-medium">
                      {Math.round(currentDiscount * 100)}% volume discount &middot;{' '}
                    </span>
                  )}
                  estimated price
                </div>
              </div>
            </div>

            {/* Dry: dropdown with volume-discounted prices */}
            {glazeFormat === 'dry' && (
              <select
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-clay-300 rounded-lg text-clay-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer appearance-none mb-4"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                }}
              >
                {DRY_BATCH_SIZES.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label} — {size.imperial}
                    </option>
                ))}
              </select>
            )}

            {/* Wet: 3 card buttons */}
            {glazeFormat === 'wet' && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {WET_BATCH_SIZES.map((size) => {
                  const price = calculateWetPrice(size.key);
                  return (
                    <button
                      key={size.key}
                      onClick={() => {
                        setWetSize(size.key);
                        setBatchSize(WET_SIZE_GRAMS[size.key]);
                      }}
                      className={`flex flex-col items-center px-3 py-3 rounded-lg border-2 text-sm transition-all ${
                        wetSize === size.key
                          ? 'border-amber-500 bg-amber-50 text-amber-900'
                          : 'border-clay-200 bg-white text-clay-600 hover:border-clay-300'
                      }`}
                    >
                      <span className="font-bold">{size.label}</span>
                      <span className="text-xs text-clay-500">{size.sublabel}</span>
                      <span className="font-bold mt-1">{formatPrice(price)}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Dry / Wet toggle */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setGlazeFormat('dry')}
                className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border-2 font-medium text-sm transition-all ${
                  glazeFormat === 'dry'
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-clay-200 bg-white text-clay-600 hover:border-clay-300'
                }`}
              >
                <span>Dry Powder</span>
              </button>
              <button
                onClick={() => setGlazeFormat('wet')}
                className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border-2 font-medium text-sm transition-all ${
                  glazeFormat === 'wet'
                    ? 'border-amber-500 bg-amber-50 text-amber-800'
                    : 'border-clay-200 bg-white text-clay-600 hover:border-clay-300'
                }`}
              >
                <span>Pre-Mixed</span>
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold text-lg transition-all ${
                addedToCart
                  ? 'bg-green-600 text-white'
                  : 'btn-primary'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{addedToCart ? 'Added!' : 'Add to Cart'}</span>
            </button>
          </div>

          {/* Application Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Application Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>&bull; Apply 2-3 coats for best color saturation</li>
              <li>&bull; Allow each coat to dry completely before applying the next</li>
              <li>&bull; Results may vary based on clay body and kiln atmosphere</li>
              <li>&bull; Test fire a sample piece before glazing final work</li>
            </ul>
          </div>

          {/* Sizing Guide */}
          <div className="bg-clay-50 border border-clay-200 rounded-lg p-4">
            <h4 className="font-semibold text-clay-700 mb-2">Sizing Guide</h4>
            <ul className="text-xs space-y-1 text-clay-600">
              <li>&bull; Pint (350g): 4-6 small pieces</li>
              <li>&bull; 1 kg: 12-16 medium pieces</li>
              <li>&bull; 5 kg: studio or classroom quantity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
