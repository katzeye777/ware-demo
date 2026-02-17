'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api, SavedGlaze } from '@/lib/api';
import { VISION_BOARD_GLAZES } from '@/app/vision-board/data';
import GlazeCard from '@/components/GlazeCard';
import { Palette, Plus, Lock, Globe } from 'lucide-react';
import Link from 'next/link';

export default function LibraryPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isDemoMode } = useAuth();
  const [glazes, setGlazes] = useState<SavedGlaze[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'private' | 'public'>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadGlazes();
    }
  }, [user, authLoading, router]);

  const loadGlazes = async () => {
    try {
      if (isDemoMode) {
        // In demo mode, populate from the vision board tiles
        const demoGlazes: SavedGlaze[] = VISION_BOARD_GLAZES.map((g) => ({
          id: g.id,
          user_id: 'demo-user',
          name: g.name,
          target_color_hex: g.color_hex,
          finish: g.finish,
          batch_size_grams: 350,
          selected_match_id: g.id,
          is_private: false,
          created_at: g.created_at,
          preview_image_url: g.preview_image_url,
        }));
        setGlazes(demoGlazes);
      } else {
        const data = await api.getUserGlazes();
        setGlazes(data);
      }
    } catch (err: any) {
      if (!isDemoMode) {
        setError(err.message || 'Failed to load glazes');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGlazes = glazes.filter((glaze) => {
    if (filter === 'private') return glaze.is_private;
    if (filter === 'public') return !glaze.is_private;
    return true;
  });

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          <p className="mt-4 text-clay-600">Loading library...</p>
        </div>
      </div>
    );
  }

  const displayName = user?.name || 'My';

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-clay-900 mb-2">
            {displayName}&apos;s Glazes
          </h1>
          <p className="text-clay-600">
            {glazes.length} saved glaze{glazes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/design" className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Create New Glaze</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      {glazes.length > 0 && (
        <div className="flex space-x-1 bg-clay-100 p-1 rounded-lg mb-8 w-full sm:w-auto inline-flex">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-md font-medium text-sm transition-colors ${
              filter === 'all'
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-clay-600 hover:text-clay-900'
            }`}
          >
            All ({glazes.length})
          </button>
          <button
            onClick={() => setFilter('public')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-md font-medium text-sm transition-colors flex items-center justify-center space-x-1 ${
              filter === 'public'
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-clay-600 hover:text-clay-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Public ({glazes.filter((g) => !g.is_private).length})</span>
          </button>
          <button
            onClick={() => setFilter('private')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-md font-medium text-sm transition-colors flex items-center justify-center space-x-1 ${
              filter === 'private'
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-clay-600 hover:text-clay-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Private ({glazes.filter((g) => g.is_private).length})</span>
          </button>
        </div>
      )}

      {/* Glazes Grid */}
      {filteredGlazes.length === 0 ? (
        <div className="text-center py-12">
          <Palette className="w-16 h-16 text-clay-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-clay-900 mb-2">
            {filter === 'all'
              ? 'No Saved Glazes Yet'
              : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Glazes`}
          </h3>
          <p className="text-clay-600 mb-6">
            {filter === 'all'
              ? 'Start designing your first custom glaze!'
              : `You don't have any ${filter} glazes yet.`}
          </p>
          <Link href="/design" className="btn-primary inline-flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create Your First Glaze</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGlazes.map((glaze) => (
            <div key={glaze.id} className="relative">
              {glaze.is_private && (
                <div className="absolute top-4 right-4 z-10 bg-clay-900 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>Private</span>
                </div>
              )}
              <GlazeCard
                id={glaze.id}
                name={glaze.name}
                colorHex={glaze.target_color_hex}
                previewImageUrl={glaze.preview_image_url}
                href={`/vision-board/${glaze.selected_match_id}`}
                showRating={false}
              />
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      {glazes.length > 0 && (
        <div className="mt-12 card max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-brand-50 border-blue-200">
          <h3 className="font-semibold text-clay-900 mb-2">About Your Library</h3>
          <p className="text-sm text-clay-700">
            Your saved glazes are stored here for easy access. Public glazes appear on the Vision
            Board for others to discover. Private glazes remain exclusive to you.
          </p>
        </div>
      )}
    </div>
  );
}
