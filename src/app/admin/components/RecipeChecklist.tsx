'use client';

import { useState, useEffect } from 'react';

export interface RecipeIngredient {
  material_name: string;
  target_weight_g: number;
  category?: 'base' | 'stain' | 'water';
}

interface IngredientEntry {
  material_name: string;
  target_weight_g: number;
  actual_weight_g: number;
  checked: boolean;
  category?: string;
}

interface RecipeChecklistProps {
  ingredients: RecipeIngredient[];
  onUpdate?: (data: {
    ingredients: IngredientEntry[];
    allChecked: boolean;
    hasDeviations: boolean;
  }) => void;
  readOnly?: boolean;
}

export default function RecipeChecklist({
  ingredients,
  onUpdate,
  readOnly = false,
}: RecipeChecklistProps) {
  const [entries, setEntries] = useState<IngredientEntry[]>([]);

  useEffect(() => {
    setEntries(
      ingredients.map((ing) => ({
        material_name: ing.material_name,
        target_weight_g: ing.target_weight_g,
        actual_weight_g: 0,
        checked: false,
        category: ing.category,
      }))
    );
  }, [ingredients]);

  const calculateDeviation = (target: number, actual: number): number => {
    if (target === 0) return 0;
    return ((actual - target) / target) * 100;
  };

  const handleWeightChange = (index: number, value: string) => {
    const newEntries = [...entries];
    newEntries[index].actual_weight_g = parseFloat(value) || 0;
    setEntries(newEntries);
    notifyParent(newEntries);
  };

  const handleCheckChange = (index: number, checked: boolean) => {
    const newEntries = [...entries];
    newEntries[index].checked = checked;
    setEntries(newEntries);
    notifyParent(newEntries);
  };

  const notifyParent = (currentEntries: IngredientEntry[]) => {
    if (onUpdate) {
      const allChecked = currentEntries.every((e) => e.checked);
      const hasDeviations = currentEntries.some((e) => {
        const deviation = Math.abs(calculateDeviation(e.target_weight_g, e.actual_weight_g));
        return deviation > 2;
      });
      onUpdate({
        ingredients: currentEntries,
        allChecked,
        hasDeviations,
      });
    }
  };

  const baseIngredients = entries.filter((e) => e.category === 'base' || !e.category);
  const stainIngredients = entries.filter((e) => e.category === 'stain');
  const waterIngredients = entries.filter((e) => e.category === 'water');

  const renderTable = (items: IngredientEntry[], title: string) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-3 text-center">
                  <span className="sr-only">Checkbox</span>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Ingredient
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Target (g)
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Actual (g)
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Deviation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((entry, idx) => {
                const deviation = calculateDeviation(entry.target_weight_g, entry.actual_weight_g);
                const deviationExceeded = Math.abs(deviation) > 2;
                const originalIndex = entries.findIndex((e) => e === entry);

                return (
                  <tr key={idx} className={entry.checked ? 'bg-green-50' : ''}>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={entry.checked}
                        onChange={(e) => handleCheckChange(originalIndex, e.target.checked)}
                        disabled={readOnly}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {entry.material_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono">
                      {entry.target_weight_g.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        value={entry.actual_weight_g || ''}
                        onChange={(e) => handleWeightChange(originalIndex, e.target.value)}
                        disabled={readOnly}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono text-right focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                      />
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-right font-mono font-semibold ${
                        deviationExceeded ? 'text-red-600' : 'text-gray-900'
                      }`}
                    >
                      {entry.actual_weight_g > 0
                        ? `${deviation > 0 ? '+' : ''}${deviation.toFixed(2)}%`
                        : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderTable(baseIngredients, 'Base Glaze Ingredients')}
      {renderTable(stainIngredients, 'Stain Additions')}
      {renderTable(waterIngredients, 'Water')}

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Deviations exceeding ±2% are highlighted in red. Verify all
          weights before completing the batch.
        </p>
      </div>
    </div>
  );
}
