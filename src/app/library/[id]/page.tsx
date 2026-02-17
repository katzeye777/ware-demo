'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { VISION_BOARD_GLAZES } from '@/app/vision-board/data';
import {
  Star,
  ShoppingCart,
  Share2,
  Heart,
  AlertCircle,
  Palette,
  Loader2,
  Save,
  Check,
} from 'lucide-react';
import Link from 'next/link';

const PRICE_PER_PINT = 15.0;
const PINT_GRAMS = 350;
const WET_SURCHARGE = 1.3;

const BATCH_SIZES = [
  { value: 350, label: 'Pint (350g)' },
  { value: 500, label: '500g' },
  { value: 1000, label: '1 kg' },
  { value: 2000, label: '2 kg' },
  { value: 5000, label: '5 kg' },
];

const GALLERY_VESSELS = ['mug', 'bowl', 'vase'] as const;

function calculatePrice(grams: number, isWet: boolean = false): string {
  const base = (grams / PINT_GRAMS) * PRICE_PER_PINT;
  const total = isWet ? base * WET_SURCHARGE : base;
  return total.toFixed(2);
}

export default function LibraryGlazeDetailPage() {
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
  const [addedToCart, setAddedToCart] = useState(false);

  // Personal rating + review (localStorage-backed)
  const [personalRating, setPersonalRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewSaved, setReviewSaved] = useState(false);

  // Load personal review from localStorage on mount
  useEffect(() => {
    if (!glazeId) return;
    try {
      const stored = localStorage.getItem(`ware_review_${glazeId}`);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.rating) setPersonalRating(data.rating);
        if (data.text) setReviewText(data.text);
      }
    } catch {
      // Ignore parse errors
    }
  }, [glazeId]);

  const handleSaveReview = () => {
    try {
      localStorage.setItem(
        `ware_review_${glazeId}`,
        JSON.stringify({ rating: personalRating, text: reviewText })
      );
      setReviewSaved(true);
      setTimeout(() => setReviewSaved(false), 2000);
    } catch {
      // localStorage full or unavailable
    }
  };

  const handleStarClick = (star: number) => {
    // Click same star to clear
    setPersonalRating(star === personalRating ? 0 : star);
  };

  // Gallery state
  const [galleryImages, setGalleryImages] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  // Generate gallery images on mount
  useEffect(() => {
    if (!glaze) return;

    setGalleryLoading(true);

    Promise.all(
      GALLERY_VESSELS.map((vessel) =>
        fetch('/api/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            color_hex: glaze.color_hex,
            finish: glaze.finish,
            vessel_type: vessel,
          }),
        })
          .then((r) => r.json())
          .then((data) => data.image_url as string)
          .catch(() => null)
      )
    ).then((images) => {
      setGalleryImages(images);
      setGalleryLoading(false);
    });
  }, [glaze]);

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
      price: Number(calculatePrice(batchSize, glazeFormat === 'wet')),
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (!glaze) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-clay-900 mb-2">
            Glaze Not Found
          </h2>
          <p className="text-clay-600 mb-6">
            This glaze does not exist or may have been removed.
          </p>
          <Link href="/library" className="btn-primary">
            Back to My Glazes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Breadcrumb */}
      <Link
        href="/library"
        className="text-brand-600 hover:text-brand-700 text-sm font-medium mb-6 inline-block"
      >
        &larr; Back to My Glazes
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* ── Left Column ── */}
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

            {/* Color Comparison — large swatch */}
            <div className="card">
              <h4 className="text-sm font-medium text-clay-700 mb-3">
                Color Reference
              </h4>
              <div className="flex items-stretch gap-3">
                {/* Software prediction — BIG */}
                <div className="flex-1">
                  <div
                    className="w-full h-32 rounded-lg color-swatch border border-clay-200"
                    style={{ backgroundColor: glaze.color_hex }}
                  />
                  <p className="text-xs text-clay-500 mt-2 text-center">
                    Software prediction
                  </p>
                  <p className="text-sm font-mono font-bold text-clay-900 text-center">
                    {glaze.color_hex.toUpperCase()}
                  </p>
                </div>
                {/* Fired test tile thumbnail */}
                {glaze.preview_image_url && (
                  <div className="flex-1">
                    <div className="w-full h-32 rounded-lg overflow-hidden border border-clay-200">
                      <img
                        src={glaze.preview_image_url}
                        alt="Fired sample"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-clay-500 mt-2 text-center">
                      Fired test tile
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Generated Gallery */}
            <div className="card">
              <h4 className="text-sm font-medium text-clay-700 mb-3">
                Gallery Preview
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {GALLERY_VESSELS.map((vessel, i) => (
                  <div key={vessel} className="space-y-1">
                    <div className="aspect-square rounded-lg overflow-hidden border border-clay-200 bg-clay-50">
                      {galleryLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-clay-300 animate-spin" />
                        </div>
                      ) : galleryImages[i] ? (
                        <img
                          src={galleryImages[i]!}
                          alt={`${glaze.name} on a ${vessel}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{
                            background: `linear-gradient(135deg, ${glaze.color_hex}30, ${glaze.color_hex}60)`,
                          }}
                        />
                      )}
                    </div>
                    <p className="text-[10px] text-clay-400 text-center capitalize">
                      {vessel}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite + Share */}
            <div className="flex gap-3">
              <button
                onClick={handleFavorite}
                className={`btn-outline flex-1 flex items-center justify-center space-x-2 ${
                  isFavorited
                    ? 'bg-red-50 border-red-500 text-red-600'
                    : ''
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`}
                />
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

        {/* ── Right Column ── */}
        <div>
          {/* Name + Rating + Finish */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-clay-900 mb-3">
              {glaze.name}
            </h1>

            <div className="inline-block bg-clay-100 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-clay-700">
                {glaze.finish.charAt(0).toUpperCase() + glaze.finish.slice(1)}{' '}
                Finish
              </span>
            </div>
          </div>

          {/* Your Rating */}
          <div className="card mb-6">
            <h3 className="font-semibold text-clay-900 mb-3">Your Rating</h3>
            <div className="flex items-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 cursor-pointer transition-colors ${
                      star <= (hoverRating || personalRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-clay-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
              {personalRating > 0 && (
                <span className="text-sm text-clay-500 ml-2">
                  {personalRating}/5
                </span>
              )}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Add your notes about this glaze..."
              rows={3}
              className="w-full px-3 py-2 border border-clay-200 rounded-lg text-sm text-clay-900 placeholder:text-clay-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none mb-3"
            />
            <button
              onClick={handleSaveReview}
              disabled={personalRating === 0 && !reviewText.trim()}
              className={`btn-secondary flex items-center justify-center space-x-2 w-full disabled:opacity-40 disabled:cursor-not-allowed transition-all ${
                reviewSaved ? 'bg-green-50 border-green-500 text-green-700' : ''
              }`}
            >
              {reviewSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Notes</span>
                </>
              )}
            </button>
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

          {/* Tweak This Glaze */}
          <div className="mb-6">
            <Link
              href={`/design?color=${encodeURIComponent(glaze.color_hex)}`}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
            >
              <Palette className="w-5 h-5" />
              <span>Tweak This Glaze</span>
            </Link>
            <p className="text-xs text-clay-500 mt-2 text-center">
              Adjust the color, fix glossiness, or work on alleviating crazing
            </p>
          </div>

          {/* Batch Size Selector */}
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-clay-900">Order</h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-brand-600">
                  ${calculatePrice(batchSize, glazeFormat === 'wet')}
                </div>
                <div className="text-xs text-clay-500">estimated price</div>
              </div>
            </div>

            {/* Batch size buttons */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {BATCH_SIZES.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setBatchSize(size.value)}
                  className={`px-2 py-2.5 rounded-lg border-2 font-medium text-xs transition-all text-center ${
                    batchSize === size.value
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-clay-200 bg-white text-clay-600 hover:border-clay-300'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>

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
                addedToCart ? 'bg-green-600 text-white' : 'btn-primary'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{addedToCart ? 'Added!' : 'Add to Cart'}</span>
            </button>
          </div>

          {/* Application Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">
              Application Tips
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>&bull; Apply 2-3 coats for best color saturation</li>
              <li>
                &bull; Allow each coat to dry completely before applying the next
              </li>
              <li>
                &bull; Results may vary based on clay body and kiln atmosphere
              </li>
              <li>
                &bull; Test fire a sample piece before glazing final work
              </li>
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
