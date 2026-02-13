'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface OrderData {
  id: string;
  glaze_name: string;
  batch_size_g: number;
  customer_name: string;
  customer_email?: string;
  shipping_address?: string;
  lot_number: string;
  status: string;
}

export default function ShipPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [shipped, setShipped] = useState(false);

  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('USPS');

  const carriers = ['USPS', 'UPS', 'FedEx', 'DHL'];

  useEffect(() => {
    fetchOrderData();
  }, [orderId]);

  const fetchOrderData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/manufacturing/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrderData(data);
        setShipped(data.status === 'shipped');
      }
    } catch (error) {
      console.error('Failed to fetch order data:', error);
      // Mock data for development
      setOrderData({
        id: orderId,
        glaze_name: 'Celadon Blue',
        batch_size_g: 5000,
        customer_name: 'John Doe',
        customer_email: 'john.doe@example.com',
        shipping_address: '123 Main St, Anytown, ST 12345',
        lot_number: 'LOT240212-001',
        status: 'labeled',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShip = async () => {
    if (!trackingNumber.trim()) {
      alert('Please enter a tracking number.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/manufacturing/orders/${orderId}/ship`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tracking_number: trackingNumber,
            carrier: carrier,
          }),
        }
      );

      if (response.ok) {
        setShipped(true);
        alert('Order marked as shipped successfully!');
      } else {
        alert('Failed to mark order as shipped. Please try again.');
      }
    } catch (error) {
      console.error('Failed to ship order:', error);
      alert('Error shipping order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading order data...</div>;
  }

  if (!orderData) {
    return <div className="text-center py-12">Order not found</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ship Order</h1>
        <p className="text-gray-600 mt-2">
          Order ID: {orderId.substring(0, 8)} | {orderData.glaze_name}
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-600">Glaze Name:</span>
            <p className="text-lg font-semibold text-gray-900">{orderData.glaze_name}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">Batch Size:</span>
            <p className="text-lg font-semibold text-gray-900">
              {(orderData.batch_size_g / 1000).toFixed(1)} kg
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">Customer:</span>
            <p className="text-lg font-semibold text-gray-900">{orderData.customer_name}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">Lot Number:</span>
            <p className="text-lg font-semibold text-gray-900 font-mono">{orderData.lot_number}</p>
          </div>
        </div>

        {orderData.shipping_address && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-600">Shipping Address:</span>
            <p className="text-gray-900 mt-1">{orderData.shipping_address}</p>
          </div>
        )}
      </div>

      {!shipped ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carrier <span className="text-red-600">*</span>
              </label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                {carriers.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono"
                placeholder="Enter tracking number"
                required
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-blue-800 text-sm">
                <strong>Reminder:</strong> Ensure the package is properly sealed and the label is
                securely attached before shipping.
              </p>
            </div>

            <button
              onClick={handleShip}
              disabled={submitting || !trackingNumber.trim()}
              className={`w-full px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${
                submitting || !trackingNumber.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {submitting ? 'Processing...' : 'Mark as Shipped 📦'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Order Shipped!</h2>
            <p className="text-green-800 mb-4">
              This order has been marked as shipped and the customer has been notified.
            </p>

            <div className="bg-white rounded-lg p-4 max-w-md mx-auto mb-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-sm font-medium text-gray-600">Carrier:</span>
                  <p className="font-semibold text-gray-900">{carrier}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Tracking:</span>
                  <p className="font-semibold text-gray-900 font-mono text-sm">
                    {trackingNumber || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/admin/queue')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Queue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
