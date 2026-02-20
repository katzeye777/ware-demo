'use client';

interface VesselOption {
  value: string;
  label: string;
  icon: string;
}

const vesselOptions: VesselOption[] = [
  { value: 'mug', label: 'Mug', icon: '☕' },
  { value: 'bowl', label: 'Bowl', icon: '🥣' },
  { value: 'vase', label: 'Vase', icon: '🏺' },
  { value: 'plate', label: 'Plate', icon: '🍽️' },
];

interface VesselSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function VesselSelector({ value, onChange }: VesselSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-clay-700 mb-2">
        Preview Shape
      </label>
      <div className="grid grid-cols-4 gap-2">
        {vesselOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex flex-col items-center py-3 px-2 rounded-lg border-2 transition-all ${
              value === option.value
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-clay-200 hover:border-clay-300 text-clay-600'
            }`}
          >
            <span className="text-xl mb-1">{option.icon}</span>
            <span className="text-xs font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
