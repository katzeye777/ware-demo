'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface LabelData {
  order_id: string;
  glaze_name: string;
  lot_number: string;
  batch_size_g: number;
  created_at: string;
  customer_name: string;
  label_url?: string;
}

export default function LabelPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [labelData, setLabelData] = useState<LabelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [labelUrl, setLabelUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchLabelData();
  }, [orderId]);

  const fetchLabelData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/manufacturing/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setLabelData(data);
        setLabelUrl(data.label_url || null);
      }
    } catch (error) {
      console.error('Failed to fetch label data:', error);
      // Mock data for development
      setLabelData({
        order_id: orderId,
        glaze_name: 'Celadon Blue',
        lot_number: 'LOT240212-001',
        batch_size_g: 5000,
        created_at: new Date().toISOString(),
        customer_name: 'John Doe',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLabel = async () => {
    setGenerating(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/manufacturing/orders/${orderId}/label`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLabelUrl(data.label_url);
        alert('Label generated successfully!');
      } else {
        alert('Failed to generate label. Please try again.');
      }
    } catch (error) {
      console.error('Failed to generate label:', error);
      alert('Error generating label. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center py-12">Loading label data...</div>;
  }

  if (!labelData) {
    return <div className="text-center py-12">Label data not found</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Label Generation</h1>
          <p className="text-gray-600 mt-2">
            Order ID: {orderId.substring(0, 8)} | {labelData.glaze_name}
          </p>
        </div>
      </div>

      {/* Label Preview */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Label Preview</h2>

        {labelUrl ? (
          <div className="border-2 border-gray-300 rounded-lg p-4">
            <iframe
              src={labelUrl}
              className="w-full h-96 border-0"
              title="Label Preview"
            />
          </div>
        ) : (
          <div className="border-4 border-dashed border-gray-300 rounded-lg p-12">
            {/* HTML Label Preview */}
            <div className="max-w-md mx-auto bg-white border-4 border-black p-6 space-y-4">
              <div className="text-center border-b-2 border-black pb-4">
                <h3 className="text-2xl font-bold">WARE</h3>
                <p className="text-sm">Custom Ceramic Glazes</p>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Glaze Name:</span>
                  <p className="text-lg font-bold">{labelData.glaze_name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-sm">Lot Number:</span>
                    <p className="font-mono">{labelData.lot_number}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Batch Size:</span>
                    <p className="font-mono">{(labelData.batch_size_g / 1000).toFixed(1)} kg</p>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-sm">Date:</span>
                  <p>{new Date(labelData.created_at).toLocaleDateString()}</p>
                </div>

                <div>
                  <span className="font-semibold text-sm">Customer:</span>
                  <p>{labelData.customer_name}</p>
                </div>
              </div>

              <div className="border-t-2 border-black pt-4 text-xs text-gray-600">
                <p>Store in a cool, dry place.</p>
                <p>Keep container tightly closed.</p>
                <p>See SDS for safety information.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
        <div className="flex flex-wrap gap-4">
          {!labelUrl && (
            <button
              onClick={handleGenerateLabel}
              disabled={generating}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                generating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {generating ? 'Generating...' : 'Generate Label PDF'}
            </button>
          )}

          {labelUrl && (
            <>
              <button
                onClick={handlePrint}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                🖨️ Print Label
              </button>
              <a
                href={labelUrl}
                download
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center"
              >
                📥 Download PDF
              </a>
            </>
          )}

          <button
            onClick={() => router.push('/admin/queue')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Back to Queue
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <p className="text-blue-800">
          <strong>Note:</strong> After printing the label, attach it to the container and proceed
          to ship the order.
        </p>
      </div>
    </div>
  );
}
