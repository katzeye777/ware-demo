'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FinishOption {
  value: 'glossy' | 'matte' | 'satin';
  label: string;
  available: boolean;
}

const finishOptions: FinishOption[] = [
  { value: 'glossy', label: 'Glossy', available: true },
  { value: 'matte', label: 'Matte', available: false },
  { value: 'satin', label: 'Satin', available: false },
];

interface FinishSelectorProps {
  value: 'glossy' | 'matte' | 'satin';
  onChange: (value: 'glossy' | 'matte' | 'satin') => void;
}

export default function FinishSelector({ value, onChange }: FinishSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = finishOptions.find(opt => opt.value === value);

  const handleSelect = (option: FinishOption) => {
    if (option.available) {
      onChange(option.value);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-clay-700 mb-2">
        Finish
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full input-field flex items-center justify-between"
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-2 bg-white border border-clay-300 rounded-lg shadow-lg overflow-hidden">
            {finishOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                disabled={!option.available}
                className={`w-full px-4 py-3 text-left hover:bg-clay-50 flex items-center justify-between transition-colors ${
                  !option.available ? 'opacity-50 cursor-not-allowed' : ''
                } ${value === option.value ? 'bg-brand-50 text-brand-700' : ''}`}
              >
                <span>{option.label}</span>
                {!option.available && (
                  <span className="text-xs bg-clay-200 text-clay-700 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
