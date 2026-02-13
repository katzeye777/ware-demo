import Link from 'next/link';
import { Star } from 'lucide-react';

interface GlazeCardProps {
  id: string;
  name: string;
  colorHex: string;
  previewImageUrl?: string;
  rating?: number;
  ratingCount?: number;
  href?: string;
  showRating?: boolean;
}

export default function GlazeCard({
  id,
  name,
  colorHex,
  previewImageUrl,
  rating,
  ratingCount,
  href,
  showRating = true,
}: GlazeCardProps) {
  const linkHref = href || `/vision-board/${id}`;

  return (
    <Link href={linkHref}>
      <div className="card hover:shadow-xl transition-shadow cursor-pointer group">
        {/* Preview Image or Color Placeholder */}
        <div className="aspect-square w-full mb-4 rounded-lg overflow-hidden bg-clay-100">
          {previewImageUrl ? (
            <img
              src={previewImageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div
              className="w-full h-full group-hover:scale-105 transition-transform"
              style={{ backgroundColor: colorHex }}
            />
          )}
        </div>

        {/* Glaze Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-clay-900 line-clamp-1">
            {name}
          </h3>

          {/* Color Swatch */}
          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-md color-swatch"
              style={{ backgroundColor: colorHex }}
            />
            <span className="text-sm font-mono text-clay-600">
              {colorHex.toUpperCase()}
            </span>
          </div>

          {/* Rating */}
          {showRating && rating !== undefined && (
            <div className="flex items-center space-x-1 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating.toFixed(1)}</span>
              {ratingCount !== undefined && (
                <span className="text-clay-500">({ratingCount})</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
