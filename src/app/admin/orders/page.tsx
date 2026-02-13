'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatusBadge, { ManufacturingStatus } from '../components/StatusBadge';

interface Order {
  id: string;
  glaze_name: string;
  customer_name: string;
  customer_email: string;
  batch_size_g: number;
  status: ManufacturingStatus;
  created_at: string;
  updated_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/manufacturing/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Mock data for development
      setOrders([
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          glaze_name: 'Celadon Blue',
          customer_name: 'John Doe',
          customer_email: 'john@example.com',
          batch_size_g: 5000,
          status: 'shipped',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          glaze_name: 'Tenmoku Black',
          customer_name: 'Jane Smith',
          customer_email: 'jane@example.com',
          batch_size_g: 3000,
          status: 'batched',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.glaze_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
          <p className="text-gray-600 mt-2">View and search all manufacturing orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <span>🔄</span>
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          placeholder="Search by glaze name, customer name, or order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Glaze Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Batch Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {order.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.glaze_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>{order.customer_name}</div>
                      <div className="text-xs text-gray-500">{order.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {(order.batch_size_g / 1000).toFixed(1)} kg
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/queue?status=${order.status}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View in Queue →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-gray-500 text-right">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>
    </div>
  );
}
