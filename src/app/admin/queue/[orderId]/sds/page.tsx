'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface RecipeIngredient {
  material_name: string;
  target_weight_g: number;
  category?: 'base' | 'stain' | 'water';
}

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

export default function SDSPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<'dry' | 'liquid'>('dry');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [orderId]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/manufacturing/orders/${orderId}/recipe`
      );
      if (response.ok) {
        const data = await response.json();
        setRecipe(data);
      }
    } catch (error) {
      console.error('Failed to fetch recipe:', error);
      // Mock data for development
      setRecipe({
        order_id: orderId,
        glaze_name: 'Celadon Blue',
        batch_size_g: 5000,
        base_ingredients: [
          { material_name: 'Nepheline Syenite', target_weight_g: 1760, category: 'base' },
          { material_name: 'Whiting', target_weight_g: 925, category: 'base' },
          { material_name: 'Kaolin', target_weight_g: 600, category: 'base' },
          { material_name: 'Silica', target_weight_g: 790, category: 'base' },
          { material_name: 'Ferro Frit 3195', target_weight_g: 525, category: 'base' },
          { material_name: 'Bentonite', target_weight_g: 100, category: 'base' },
        ],
        stain_additions: [
          { material_name: 'Mason 6300', target_weight_g: 225, category: 'stain' },
          { material_name: 'Mason 6790', target_weight_g: 75, category: 'stain' },
        ],
        water: {
          target_weight_g: 2500,
          notes: 'Add water gradually until desired consistency.',
        },
        firing_instructions: 'Cone 6 oxidation.',
        lot_number_suggested: 'LOT260216-001',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSDS = async () => {
    if (!recipe) return;

    setGenerating(true);
    setError('');

    try {
      // Combine all ingredients for the API
      const allIngredients = [
        ...recipe.base_ingredients,
        ...recipe.stain_additions,
      ];

      const response = await fetch('/api/sds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: recipe.glaze_name,
          batch_number: recipe.lot_number_suggested || orderId.substring(0, 8),
          ingredients: allIngredients,
          form,
          batch_size_grams: recipe.batch_size_g,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'SDS generation failed');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = recipe.glaze_name.replace(/[^a-zA-Z0-9_-]/g, '_');
      a.href = url;
      a.download = `CMW_SDS_${safeName}_${recipe.lot_number_suggested || orderId.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setGenerated(true);
    } catch (err: any) {
      console.error('SDS generation error:', err);
      setError(err.message || 'Failed to generate SDS');
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkReady = async () => {
    setAdvancing(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/manufacturing/orders/${orderId}/status`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'sds_ready' }),
        }
      );

      if (response.ok) {
        router.push('/admin/queue');
      } else {
        // In demo mode, just navigate back
        router.push('/admin/queue');
      }
    } catch {
      // In demo mode (no backend), just navigate back
      router.push('/admin/queue');
    } finally {
      setAdvancing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading recipe...</div>;
  }

  if (!recipe) {
    return <div className="text-center py-12">Recipe not found</div>;
  }

  const allDryIngredients = [...recipe.base_ingredients, ...recipe.stain_additions];
  const totalDryWeight = allDryIngredients.reduce((sum, ing) => sum + ing.target_weight_g, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Generate SDS: {recipe.glaze_name}
          </h1>
          <p className="text-gray-600 mt-2">
            Batch Size: {(recipe.batch_size_g / 1000).toFixed(1)} kg | Order ID:{' '}
            {orderId.substring(0, 8)}
          </p>
        </div>
        <Link
          href="/admin/queue"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
        >
          ← Back to Queue
        </Link>
      </div>

      {/* Recipe Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recipe Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  Material
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase">
                  Weight (g)
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase">
                  Dry %
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allDryIngredients.map((ing, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">{ing.material_name}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono">
                    {ing.target_weight_g.toFixed(1)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono">
                    {((ing.target_weight_g / totalDryWeight) * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500 capitalize">
                    {ing.category || 'base'}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-2 text-sm text-gray-900">Total (dry)</td>
                <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono">
                  {totalDryWeight.toFixed(1)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono">100.0%</td>
                <td className="px-4 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">SDS Form Type</h2>
        <p className="text-sm text-gray-600 mb-4">
          Select the form this batch will ship in. This affects safety handling instructions,
          spill procedures, PPE requirements, and the TSCA ingredient inventory.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setForm('dry')}
            className={`px-6 py-4 rounded-lg border-2 font-medium text-left transition-all ${
              form === 'dry'
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-lg mb-1">Dry Powder</div>
            <div className="text-sm opacity-80">
              Includes dust hazard warnings, HEPA vacuum spill procedures, respiratory PPE
              requirements
            </div>
          </button>
          <button
            type="button"
            onClick={() => setForm('liquid')}
            className={`px-6 py-4 rounded-lg border-2 font-medium text-left transition-all ${
              form === 'liquid'
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-lg mb-1">Pre-Mixed (Liquid)</div>
            <div className="text-sm opacity-80">
              Adds Water, CMC, Kathon CG to TSCA. Freeze warnings. No inhalation hazard.
            </div>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-800 font-semibold">Generation Error</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Generate Button */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Generate Safety Data Sheet</h2>
            <p className="text-sm text-gray-600 mt-1">
              Creates a GHS-compliant 6-8 page PDF covering all 16 OSHA HCS 2012 sections
            </p>
          </div>
          <button
            onClick={handleGenerateSDS}
            disabled={generating}
            className={`px-8 py-3 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2 ${
              generating
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {generating ? (
              <>
                <span className="animate-spin">⏳</span>
                Generating...
              </>
            ) : (
              <>
                <span>📄</span>
                Generate SDS PDF
              </>
            )}
          </button>
        </div>

        {generated && (
          <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-green-800 font-semibold">
              ✅ SDS generated and downloaded successfully
            </p>
            <p className="text-green-700 text-sm mt-1">
              The PDF has been saved to your downloads folder. Attach it to the order and include
              with shipment.
            </p>
          </div>
        )}
      </div>

      {/* Advance Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Mark SDS as Complete</h2>
            <p className="text-sm text-gray-600 mt-1">
              Advance this order to &quot;SDS Ready&quot; status in the manufacturing queue
            </p>
          </div>
          <button
            onClick={handleMarkReady}
            disabled={advancing || !generated}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              advancing || !generated
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {advancing ? 'Updating...' : 'Mark SDS Ready →'}
          </button>
        </div>
        {!generated && (
          <p className="text-xs text-amber-600 mt-2">
            Generate the SDS PDF first before marking this step as complete.
          </p>
        )}
      </div>
    </div>
  );
}
