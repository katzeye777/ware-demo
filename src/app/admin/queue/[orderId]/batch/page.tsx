'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RecipeChecklist, { RecipeIngredient } from '../../../components/RecipeChecklist';
import ScaleReader from '../../../components/ScaleReader';

interface RecipeData {
  order_id: string;
  glaze_name: string;
  batch_size_g: number;
  base_ingredients: RecipeIngredient[];
  stain_additions: RecipeIngredient[];
  water: {
    target_weight_g: number;
    notes: string;
  };
  firing_instructions: string;
  lot_number_suggested?: string;
}

export default function BatchingPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lotNumber, setLotNumber] = useState('');
  const [staffInitials, setStaffInitials] = useState('');
  const [notes, setNotes] = useState('');
  const [allChecked, setAllChecked] = useState(false);
  const [hasDeviations, setHasDeviations] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [orderId]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/manufacturing/orders/${orderId}/recipe`);
      if (response.ok) {
        const data = await response.json();
        setRecipe(data);
        setLotNumber(data.lot_number_suggested || generateLotNumber());
      }
    } catch (error) {
      console.error('Failed to fetch recipe:', error);
      // Mock data for development
      setRecipe({
        order_id: orderId,
        glaze_name: 'Celadon Blue',
        batch_size_g: 5000,
        base_ingredients: [
          { material_name: 'Silica', target_weight_g: 2000, category: 'base' },
          { material_name: 'Feldspar', target_weight_g: 1500, category: 'base' },
          { material_name: 'Kaolin', target_weight_g: 800, category: 'base' },
          { material_name: 'Whiting', target_weight_g: 500, category: 'base' },
        ],
        stain_additions: [
          { material_name: 'Copper Carbonate', target_weight_g: 150, category: 'stain' },
          { material_name: 'Cobalt Oxide', target_weight_g: 50, category: 'stain' },
        ],
        water: {
          target_weight_g: 2500,
          notes: 'Add water gradually until desired consistency. Target specific gravity: 1.45-1.50',
        },
        firing_instructions: 'Cone 10 reduction. Slow cool through 1000-800°C for best color development.',
        lot_number_suggested: generateLotNumber(),
      });
      setLotNumber(generateLotNumber());
    } finally {
      setLoading(false);
    }
  };

  const generateLotNumber = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `LOT${year}${month}${day}-${random}`;
  };

  const handleChecklistUpdate = (data: any) => {
    setAllChecked(data.allChecked);
    setHasDeviations(data.hasDeviations);
  };

  const handleCompleteBatch = async () => {
    if (!allChecked) {
      alert('Please check all ingredients before completing the batch.');
      return;
    }

    if (!staffInitials) {
      alert('Please enter your initials.');
      return;
    }

    if (hasDeviations) {
      const confirm = window.confirm(
        'Warning: Some weights have deviations exceeding ±2%. Do you want to proceed anyway?'
      );
      if (!confirm) return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/manufacturing/orders/${orderId}/batch`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            staff_initials: staffInitials,
            lot_number: lotNumber,
            notes,
          }),
        }
      );

      if (response.ok) {
        alert('Batch completed successfully!');
        router.push('/admin/queue');
      } else {
        alert('Failed to complete batch. Please try again.');
      }
    } catch (error) {
      console.error('Failed to complete batch:', error);
      alert('Error completing batch. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center py-12">Loading recipe...</div>;
  }

  if (!recipe) {
    return <div className="text-center py-12">Recipe not found</div>;
  }

  const allIngredients: RecipeIngredient[] = [
    ...recipe.base_ingredients,
    ...recipe.stain_additions,
    { material_name: 'Water', target_weight_g: recipe.water.target_weight_g, category: 'water' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Batching: {recipe.glaze_name}</h1>
          <p className="text-gray-600 mt-2">
            Batch Size: {(recipe.batch_size_g / 1000).toFixed(1)} kg | Order ID: {orderId.substring(0, 8)}
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          🖨️ Print
        </button>
      </div>

      {/* Header for print */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold mb-2">Batching Sheet: {recipe.glaze_name}</h1>
        <p className="text-sm">
          Batch Size: {(recipe.batch_size_g / 1000).toFixed(1)} kg | Order ID: {orderId} | Lot: {lotNumber}
        </p>
        <hr className="my-4" />
      </div>

      {/* USB Scale Integration */}
      <div className="print:hidden">
        <ScaleReader />
      </div>

      {/* Water Content Notes */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💧 Water Addition Notes</h3>
        <p className="text-blue-800">{recipe.water.notes}</p>
      </div>

      {/* Recipe Checklist */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recipe Checklist</h2>
        <RecipeChecklist ingredients={allIngredients} onUpdate={handleChecklistUpdate} />
      </div>

      {/* Firing Instructions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">🔥 Firing Instructions</h2>
        <p className="text-gray-800">{recipe.firing_instructions}</p>
      </div>

      {/* Batch Completion Form */}
      <div className="bg-white rounded-lg shadow-md p-6 print:hidden">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Complete Batch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lot Number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={lotNumber}
              onChange={(e) => setLotNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Staff Initials <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={staffInitials}
              onChange={(e) => setStaffInitials(e.target.value.toUpperCase())}
              maxLength={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 uppercase"
              placeholder="MK"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Batch Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any observations or adjustments made during batching..."
          />
        </div>

        {hasDeviations && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-800 font-semibold">
              ⚠️ Warning: Some weights exceed ±2% deviation. Please verify before completing.
            </p>
          </div>
        )}

        <button
          onClick={handleCompleteBatch}
          disabled={!allChecked || !staffInitials || submitting}
          className={`w-full px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${
            !allChecked || !staffInitials || submitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {submitting ? 'Completing...' : 'Complete Batch ✓'}
        </button>
      </div>
    </div>
  );
}
