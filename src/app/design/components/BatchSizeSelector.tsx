'use client';

interface BatchSizeSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const PRICE_PER_500G = 15.0;

export default function BatchSizeSelector({ value, onChange }: BatchSizeSelectorProps) {
  const calculatePrice = (grams: number) => {
    return ((grams / 500) * PRICE_PER_500G).toFixed(2);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (newValue >= 500 && newValue <= 5000) {
      onChange(newValue);
    }
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
          </div>
          <div className="text-xs text-clay-500">
            estimated price
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min="500"
          max="5000"
          step="50"
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 bg-clay-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
        />
        <div className="flex justify-between mt-2 text-xs text-clay-500">
          <span>500g</span>
          <span>5000g</span>
        </div>
      </div>

      {/* Input Field */}
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="500"
          max="5000"
          step="50"
          value={value}
          onChange={handleInputChange}
          className="input-field text-center font-mono"
        />
        <span className="text-sm text-clay-600 font-medium">grams</span>
      </div>

      {/* Helpful Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <p className="font-medium mb-1">Sizing Guide:</p>
        <ul className="text-xs space-y-1 text-blue-700">
          <li>• 500g (minimum): 6-8 medium pieces</li>
          <li>• 1000g: 15-20 pieces or large forms</li>
          <li>• 2000g+: studio or classroom quantity</li>
        </ul>
      </div>
    </div>
  );
}
