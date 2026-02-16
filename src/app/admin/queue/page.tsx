'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import StatusBadge, { ManufacturingStatus } from '../components/StatusBadge';

interface ManufacturingOrder {
  id: string;
  glaze_name: string;
  color_hex?: string;
  batch_size_g: number;
  status: ManufacturingStatus;
  created_at: string;
  customer_name?: string;
}

type StatusFilter = ManufacturingStatus | 'all';

export default function ManufacturingQueue() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<ManufacturingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');

  const statusFilters: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending_qc', label: 'Pending QC' },
    { value: 'qc_passed', label: 'QC Passed' },
    { value: 'sds_ready', label: 'SDS Ready' },
    { value: 'ready_to_batch', label: 'Ready to Batch' },
    { value: 'batched', label: 'Batched' },
    { value: 'labeled', label: 'Labeled' },
    { value: 'shipped', label: 'Shipped' },
  ];

  useEffect(() => {
    const status = searchParams.get('status');
    if (status) {
      setActiveFilter(status as StatusFilter);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, [activeFilter]);

  const fetchOrders = async () => {
    try {
      const url =
        activeFilter === 'all'
          ? 'http://localhost:8000/api/manufacturing/queue'
          : `http://localhost:8000/api/manufacturing/queue?status=${activeFilter}`;
      const response = await fetch(url);
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
          color_hex: '#87CEEB',
          batch_size_g: 5000,
          status: 'ready_to_batch',
          created_at: new Date().toISOString(),
          customer_name: 'John Doe',
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          glaze_name: 'Tenmoku Black',
          color_hex: '#2C1810',
          batch_size_g: 3000,
          status: 'pending_qc',
          created_at: new Date().toISOString(),
          customer_name: 'Jane Smith',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status: StatusFilter) => {
    setActiveFilter(status);
    if (status === 'all') {
      router.push('/admin/queue');
    } else {
      router.push(`/admin/queue?status=${status}`);
    }
  };

  const getActionButton = (order: ManufacturingOrder) => {
    switch (order.status) {
      case 'pending_qc':
      case 'qc_needs_review':
        return (
          <Link
            href={`/admin/qc?orderId=${order.id}`}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
          >
            Review QC
          </Link>
        );
      case 'qc_passed':
        return (
          <Link
            href={`/admin/queue/${order.id}/sds`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Generate SDS
          </Link>
        );
      case 'sds_ready':
      case 'ready_to_batch':
        return (
          <Link
            href={`/admin/queue/${order.id}/batch`}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Start Batching
          </Link>
        );
      case 'batched':
        return (
          <Link
            href={`/admin/queue/${order.id}/label`}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            Print Label
          </Link>
        );
      case 'labeled':
        return (
          <Link
            href={`/admin/queue/${order.id}/ship`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Ship Order
          </Link>
        );
      case 'shipped':
        return (
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
            Shipped ✓
          </span>
        );
      default:
        return null;
    }
  };

  const truncateId = (id: string) => {
    return id.substring(0, 8);
  };

  if (loading) {
    return <div className="text-center py-12">Loading queue...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manufacturing Queue</h1>
          <p className="text-gray-600 mt-2">Production pipeline status and actions</p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <span>🔄</span>
          Refresh
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg shadow-md p-2">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
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
                  Color
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
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No orders found for this status
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {truncateId(order.id)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.glaze_name}
                    </td>
                    <td className="px-6 py-4">
                      {order.color_hex && (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border-2 border-gray-300"
                            style={{ backgroundColor: order.color_hex }}
                          />
                          <span className="text-xs text-gray-600 font-mono">
                            {order.color_hex}
                          </span>
                        </div>
                      )}
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
                    <td className="px-6 py-4">{getActionButton(order)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-gray-500 text-right">
        Auto-refreshes every 30 seconds
      </div>
    </div>
  );
}
