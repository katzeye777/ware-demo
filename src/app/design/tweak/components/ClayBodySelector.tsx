'use client';

import { getClayBodiesByBrand } from '@/lib/clay-bodies';

interface ClayBodySelectorProps {
  value: string;
  onChange: (id: string) => void;
}

const groups = getClayBodiesByBrand();

export default function ClayBodySelector({ value, onChange }: ClayBodySelectorProps) {
  return (
    <div>
      <div className="text-xs text-clay-500 mb-2">Clay Body</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-white border border-clay-300 rounded-lg text-clay-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
      >
        <option value="">Select your clay body...</option>
        {groups.map((group) => (
          <optgroup key={group.brand} label={group.brand}>
            {group.bodies.map((body) => (
              <option key={body.id} value={body.id}>
                {body.name} — {body.type}, {body.color} ({body.cone_range})
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
