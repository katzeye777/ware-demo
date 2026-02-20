'use client';

import Link from 'next/link';
import { Leaf, Droplets } from 'lucide-react';
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

interface BatchSizeSelectorProps {
  value: number;
  onChange: (value: number) => void;
  format: 'dry' | 'wet';
  onFormatChange: (format: 'dry' | 'wet') => void;
  wetSize?: WetSize;
  onWetSizeChange?: (size: WetSize) => void;
}

export default function BatchSizeSelector({
  value,
  onChange,
  format,
  onFormatChange,
  wetSize = 'pint',
  onWetSizeChange,
}: BatchSizeSelectorProps) {
  const handleDryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(e.target.value));
  };

  const handleWetSelect = (size: WetSize) => {
    onWetSizeChange?.(size);
    onChange(WET_SIZE_GRAMS[size]);
  };

  const currentPrice = format === 'dry'
    ? calculateDryPrice(value)
    : calculateWetPrice(wetSize);

  const currentDiscount = format === 'dry' ? getVolumeDiscount(value) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-clay-700">
          Batch Size
        </label>
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

      {/* Dry: dropdown with 12 sizes */}
      {format === 'dry' && (
        <select
          value={value}
          onChange={handleDryChange}
          className="w-full px-4 py-3 bg-white border border-clay-300 rounded-lg text-clay-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer appearance-none"
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
      {format === 'wet' && (
        <div className="grid grid-cols-3 gap-2">
          {WET_BATCH_SIZES.map((size) => {
            const price = calculateWetPrice(size.key);
            return (
              <button
                key={size.key}
                type="button"
                onClick={() => handleWetSelect(size.key)}
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

      {/* Dry / Wet Format Toggle */}
      <div>
        <label className="text-sm font-medium text-clay-700 mb-2 block">
          Format
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onFormatChange('dry')}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all ${
              format === 'dry'
                ? 'border-green-500 bg-green-50 text-green-800'
                : 'border-clay-200 bg-white text-clay-600 hover:border-clay-300'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>Dry Powder</span>
          </button>
          <button
            type="button"
            onClick={() => onFormatChange('wet')}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all ${
              format === 'wet'
                ? 'border-amber-500 bg-amber-50 text-amber-800'
                : 'border-clay-200 bg-white text-clay-600 hover:border-clay-300'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Pre-Mixed</span>
          </button>
        </div>
      </div>

      {/* Dry benefits (shown when dry is selected) */}
      {format === 'dry' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
          <div className="flex items-start space-x-2">
            <Leaf className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Costs less, ships cheaper</p>
              <p className="text-xs text-green-700 mt-1">
                Lighter package means lower shipping costs. Lasts indefinitely on your shelf — just add water when you&apos;re ready. We include <a href="#" className="underline font-medium">mixing instructions and videos</a>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Wet warning (shown when wet is selected) */}
      {format === 'wet' && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-sm text-amber-900">
          <div className="space-y-2">
            <p className="font-medium">Are you sure?</p>
            <ul className="text-xs text-amber-800 space-y-1.5">
              <li className="flex items-start space-x-1.5">
                <span className="mt-0.5">💰</span>
                <span><strong>Higher cost</strong> — additional mixing and packaging fees apply</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="mt-0.5">📦</span>
                <span><strong>Heavier package</strong> — shipping costs more because you&apos;re paying to ship water</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="mt-0.5">🕐</span>
                <span><strong>Longer lead time</strong> — wet batches require mixing and packaging in plastic containers</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="mt-0.5">🌱</span>
                <span><strong>More waste</strong> — requires a plastic container and uses more energy to ship the extra weight</span>
              </li>
            </ul>
            <p className="text-xs text-amber-700 pt-1 border-t border-amber-200">
              Dry powder mixes easily with water and gives you the same result. We have <a href="#" className="underline font-medium">mixing videos</a> to walk you through it. Most potters prefer dry.
            </p>
          </div>
        </div>
      )}

      {/* Sizing Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <p className="font-medium mb-1">Sizing Guide:</p>
        <ul className="text-xs space-y-1 text-blue-700">
          <li>• Pint (350g): 4–6 small pieces</li>
          <li>• 1 kg: 12–16 medium pieces</li>
          <li>• 5 kg: studio or classroom quantity</li>
          <li>• 5 Gallon Bucket: production runs</li>
        </ul>
      </div>

      {/* Contact for larger orders */}
      <p className="text-xs text-clay-500 text-center">
        Need more than 5 gallons?{' '}
        <Link
          href="/help/contact"
          className="text-brand-600 hover:text-brand-700 underline"
        >
          Contact us
        </Link>
      </p>
    </div>
  );
}
