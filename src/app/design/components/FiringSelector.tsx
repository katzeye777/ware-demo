'use client';

import { Flame } from 'lucide-react';

interface FiringSelectorProps {
  cone: string;
  atmosphere: string;
  onConeChange: (cone: string) => void;
  onAtmosphereChange: (atmosphere: string) => void;
}

// Full cone chart from low-fire to high-fire
// value is string to preserve leading zeros (e.g. "04" ≠ "4")
const CONE_OPTIONS: { value: string; label: string; tempF: string; tempC: string; available: boolean }[] = [
  { value: '04', label: 'Cone 04',  tempF: '1945°F', tempC: '1063°C', available: false },
  { value: '03', label: 'Cone 03',  tempF: '2014°F', tempC: '1101°C', available: false },
  { value: '02', label: 'Cone 02',  tempF: '2048°F', tempC: '1120°C', available: false },
  { value: '01', label: 'Cone 01',  tempF: '2079°F', tempC: '1137°C', available: false },
  { value: '1',  label: 'Cone 1',   tempF: '2109°F', tempC: '1154°C', available: false },
  { value: '2',  label: 'Cone 2',   tempF: '2127°F', tempC: '1164°C', available: false },
  { value: '3',  label: 'Cone 3',   tempF: '2138°F', tempC: '1170°C', available: false },
  { value: '4',  label: 'Cone 4',   tempF: '2167°F', tempC: '1186°C', available: true },
  { value: '5',  label: 'Cone 5',   tempF: '2185°F', tempC: '1196°C', available: true },
  { value: '6',  label: 'Cone 6',   tempF: '2232°F', tempC: '1222°C', available: true },
  { value: '7',  label: 'Cone 7',   tempF: '2264°F', tempC: '1240°C', available: true },
  { value: '8',  label: 'Cone 8',   tempF: '2300°F', tempC: '1260°C', available: true },
  { value: '9',  label: 'Cone 9',   tempF: '2336°F', tempC: '1280°C', available: true },
  { value: '10', label: 'Cone 10',  tempF: '2381°F', tempC: '1305°C', available: true },
  { value: '11', label: 'Cone 11',  tempF: '2399°F', tempC: '1315°C', available: false },
  { value: '12', label: 'Cone 12',  tempF: '2419°F', tempC: '1326°C', available: false },
  { value: '13', label: 'Cone 13',  tempF: '2455°F', tempC: '1346°C', available: false },
  { value: '14', label: 'Cone 14',  tempF: '2491°F', tempC: '1366°C', available: false },
];

const ATMOSPHERE_OPTIONS: { value: string; label: string; available: boolean }[] = [
  { value: 'ox', label: 'Oxidation', available: true },
  { value: 'red', label: 'Reduction', available: false },
];

export default function FiringSelector({
  cone,
  atmosphere,
  onConeChange,
  onAtmosphereChange,
}: FiringSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-clay-700">
        <span className="flex items-center space-x-1.5">
          <Flame className="w-4 h-4" />
          <span>Firing</span>
        </span>
      </label>

      {/* Cone Temperature — Dropdown for 18 options */}
      <div>
        <div className="text-xs text-clay-500 mb-2">Temperature</div>
        <select
          value={cone}
          onChange={(e) => onConeChange(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-clay-300 rounded-lg text-clay-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
          }}
        >
          {CONE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={!opt.available}>
              {opt.label} ({opt.tempF} / {opt.tempC})
            </option>
          ))}
        </select>

      </div>

      {/* Atmosphere */}
      <div>
        <div className="text-xs text-clay-500 mb-2">Atmosphere</div>
        <div className="grid grid-cols-2 gap-2">
          {ATMOSPHERE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={!opt.available}
              onClick={() => onAtmosphereChange(opt.value)}
              className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                !opt.available
                  ? 'border-clay-100 bg-clay-50 text-clay-400 cursor-not-allowed'
                  : atmosphere === opt.value
                  ? 'border-brand-500 bg-brand-50 text-brand-800'
                  : 'border-clay-200 bg-white text-clay-600 hover:border-clay-300'
              }`}
            >
              {opt.label}
              {!opt.available && (
                <span className="text-[10px] ml-1 opacity-60">(Soon)</span>
              )}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
