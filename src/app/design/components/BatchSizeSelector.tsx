'use client';

import { Leaf, Droplets } from 'lucide-react';

interface BatchSizeSelectorProps {
  value: number;
  onChange: (value: number) => void;
  format: 'dry' | 'wet';
  onFormatChange: (format: 'dry' | 'wet') => void;
}

const PRICE_PER_PINT = 15.0;
const PINT_GRAMS = 350;

// All available batch sizes
const BATCH_SIZES: { value: number; label: string }[] = [
  { value: 350, label: 'Pint (350g)' },
  { value: 500, label: '500g' },
  { value: 1000, label: '1 kg (1,000g)' },
  { value: 1500, label: '1.5 kg (1,500g)' },
  { value: 2000, label: '2 kg (2,000g)' },
  { value: 2500, label: '2.5 kg (2,500g)' },
  { value: 3000, label: '3 kg (3,000g)' },
  { value: 3500, label: '3.5 kg (3,500g)' },
  { value: 4000, label: '4 kg (4,000g)' },
  { value: 4500, label: '4.5 kg (4,500g)' },
  { value: 5000, label: '5 kg (5,000g)' },
  { value: 5500, label: '5.5 kg (5,500g)' },
  { value: 6000, label: '6 kg (6,000g)' },
  { value: 6500, label: '6.5 kg (6,500g)' },
  { value: 7000, label: '7 kg (7,000g)' },
  { value: 7500, label: '7.5 kg (7,500g)' },
  { value: 8000, label: '8 kg (8,000g)' },
  { value: 8500, label: '8.5 kg (8,500g)' },
  { value: 9000, label: '9 kg (9,000g)' },
  { value: 9500, label: '9.5 kg (9,500g)' },
  { value: 10000, label: '10 kg (10,000g)' },
  { value: 10500, label: '10.5 kg (10,500g)' },
  { value: 11000, label: '11 kg (11,000g)' },
  { value: 11500, label: '11.5 kg (11,500g)' },
  { value: 12000, label: '12 kg (12,000g)' },
  { value: 12500, label: '12.5 kg (12,500g)' },
  { value: 13000, label: '13 kg (13,000g)' },
  { value: 13500, label: '13.5 kg (13,500g)' },
  { value: 14000, label: '14 kg (14,000g)' },
  { value: 14500, label: '14.5 kg (14,500g)' },
  { value: 15000, label: '5 Gallon Bucket (15,000g)' },
];

function calculatePrice(grams: number): string {
  return ((grams / PINT_GRAMS) * PRICE_PER_PINT).toFixed(2);
}

export default function BatchSizeSelector({ value, onChange, format, onFormatChange }: BatchSizeSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-clay-700">
          Batch Size
        </label>
        <div className="text-right">
          <div className="text-2xl font-bold text-brand-600">
            ${calculatePrice(value)}
            {format === 'wet' && <span className="text-sm text-amber-600"> + wet fee</span>}
          </div>
          <div className="text-xs text-clay-500">
            estimated price
          </div>
        </div>
      </div>

      {/* Dropdown */}
      <select
        value={value}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-white border border-clay-300 rounded-lg text-clay-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
      >
        {BATCH_SIZES.map((size) => (
          <option key={size.value} value={size.value}>
            {size.label} — ${calculatePrice(size.value)}
          </option>
        ))}
      </select>

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
              <p className="font-medium">The better choice</p>
              <p className="text-xs text-green-700 mt-1">
                Ships lighter, arrives faster, and lasts indefinitely on your shelf. Just add water when you&apos;re ready — we include <a href="#" className="underline font-medium">mixing instructions and videos</a>.
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
        <a
          href="mailto:info@ceramicmaterialsworkshop.com?subject=Large%20Batch%20Order%20Inquiry"
          className="text-brand-600 hover:text-brand-700 underline"
        >
          Contact us
        </a>
      </p>
    </div>
  );
}
