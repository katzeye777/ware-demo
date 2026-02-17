'use client';

import { ArrowDownToLine, Paintbrush, SprayCan } from 'lucide-react';

type ApplicationMethod = 'dip' | 'brush' | 'spray';

interface ApplicationSelectorProps {
  value: ApplicationMethod;
  onChange: (value: ApplicationMethod) => void;
}

const options: { value: ApplicationMethod; label: string; icon: typeof ArrowDownToLine }[] = [
  { value: 'dip', label: 'Dip', icon: ArrowDownToLine },
  { value: 'brush', label: 'Brush', icon: Paintbrush },
  { value: 'spray', label: 'Spray', icon: SprayCan },
];

export default function ApplicationSelector({ value, onChange }: ApplicationSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-clay-700 mb-2">
        Application
      </label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-lg border-2 font-medium text-sm transition-all ${
                isActive
                  ? 'border-brand-500 bg-brand-50 text-brand-800'
                  : 'border-clay-200 bg-white text-clay-600 hover:border-clay-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
