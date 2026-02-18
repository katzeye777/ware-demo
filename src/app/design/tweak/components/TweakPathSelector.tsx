'use client';

import { Thermometer, Layers, ZoomIn } from 'lucide-react';
import type { TweakPath } from '@/lib/tweak-engine';

interface TweakPathSelectorProps {
  onSelect: (path: TweakPath) => void;
}

const PATHS: {
  id: TweakPath;
  icon: typeof Thermometer;
  title: string;
  description: string;
  symptoms: string;
}[] = [
  {
    id: 'temperature',
    icon: Thermometer,
    title: 'Temperature',
    description: 'The glaze is running or looks overfired',
    symptoms: 'Drips, pooling at the base, thin spots on vertical surfaces',
  },
  {
    id: 'texture',
    icon: Layers,
    title: 'Texture',
    description: 'The glaze surface isn\'t smooth enough',
    symptoms: 'Rough, underfired, orange-peel texture, not glossy enough',
  },
  {
    id: 'crazing',
    icon: ZoomIn,
    title: 'Crazing',
    description: 'There are fine cracks in the glaze surface',
    symptoms: 'Hairline cracks, crack network, glaze lifting at edges',
  },
];

export default function TweakPathSelector({ onSelect }: TweakPathSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-clay-900 mb-1">
          What's happening with your glaze?
        </h2>
        <p className="text-sm text-clay-500">
          Select the issue you're seeing so we can walk through the diagnosis together.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PATHS.map((path) => {
          const Icon = path.icon;
          return (
            <button
              key={path.id}
              onClick={() => onSelect(path.id)}
              className="card text-left hover:shadow-lg hover:border-brand-300 border-2 border-transparent transition-all group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center group-hover:bg-brand-200 transition-colors">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-clay-900">
                  {path.title}
                </h3>
              </div>
              <p className="text-sm text-clay-700 mb-2">{path.description}</p>
              <p className="text-xs text-clay-400">{path.symptoms}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
