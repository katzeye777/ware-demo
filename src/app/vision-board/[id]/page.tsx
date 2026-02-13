'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, PublicGlaze } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Star, ShoppingCart, Share2, Heart, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function PublicGlazeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [glaze, setGlaze] = useState<PublicGlaze | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);

  const glazeId = params.id as string;

  useEffect(() => {
    if (glazeId) {
      loadGlazeDetails();
    }
  }, [glazeId]);

  const loadGlazeDetails = async () => {
    try {
      const data = await api.getPublicGlaze(glazeId);
      setGlaze(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load glaze details');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    // In a real implementation, this would add to cart or start checkout
    router.push('/checkout');
  };

  const handleFavorite = () => {
    if (!user) {
      router.push('/login');
      return;
    }
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
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          <p className="mt-4 text-clay-600">Loading glaze...</p>
        </div>
      </div>
    );
  }

  if (error || !glaze) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-clay-900 mb-2">Glaze Not Found</h2>
          <p className="text-clay-600 mb-6">{error || 'This glaze does not exist.'}</p>
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
        ← Back to Vision Board
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Preview */}
        <div>
          <div className="sticky top-24">
            {/* Main Image */}
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-clay-100 shadow-xl mb-4">
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

            {/* Color Swatch */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div
                className="w-16 h-16 rounded-lg color-swatch shadow-md"
                style={{ backgroundColor: glaze.color_hex }}
              />
              <div>
                <p className="text-sm text-clay-600">Color Code</p>
                <p className="text-xl font-mono font-bold text-clay-900">
                  {glaze.color_hex.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handlePurchase}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Purchase This Glaze</span>
              </button>

              <button
                onClick={handleFavorite}
                className={`btn-outline flex items-center justify-center ${
                  isFavorited ? 'bg-red-50 border-red-500 text-red-600' : ''
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>

              <button onClick={handleShare} className="btn-outline flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div>
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-clay-900 mb-3">{glaze.name}</h1>

            {/* Rating */}
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

          {/* Description */}
          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold text-clay-900 mb-4">About This Glaze</h2>
            <p className="text-clay-700">
              This beautiful {glaze.finish} glaze features a rich {glaze.color_hex} color tone.
              Perfect for adding a unique touch to your ceramic pieces. Each batch is carefully
              mixed to ensure consistent color matching and quality.
            </p>
          </div>

          {/* Specifications */}
          <div className="card mb-8">
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
                <span className="text-clay-600">Available Batch Sizes</span>
                <span className="font-medium text-clay-900">100g - 5000g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-clay-600">Firing Temperature</span>
                <span className="font-medium text-clay-900">Cone 6 (recommended)</span>
              </div>
            </div>
          </div>

          {/* Application Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h4 className="font-semibold text-blue-900 mb-2">Application Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Apply 2-3 coats for best color saturation</li>
              <li>• Allow each coat to dry completely before applying the next</li>
              <li>• Results may vary based on clay body and kiln atmosphere</li>
              <li>• Test fire a sample piece before glazing final work</li>
            </ul>
          </div>

          {/* Reviews Section */}
          <div>
            <h3 className="text-2xl font-semibold text-clay-900 mb-6">Customer Reviews</h3>

            {/* Review placeholder */}
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 font-semibold">
                    JD
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-clay-900">Jane Doe</h4>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-clay-700">
                      Absolutely love this glaze! The color is exactly as shown and the finish
                      is beautiful. Will definitely order again.
                    </p>
                    <p className="text-xs text-clay-500 mt-2">2 weeks ago</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button className="btn-secondary">
                  Load More Reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
