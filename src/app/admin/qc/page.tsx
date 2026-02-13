'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QCReportDisplay, { QCReport } from '../components/QCReportDisplay';

interface QCPendingItem {
  order_id: string;
  glaze_name: string;
  qc_status: 'pending' | 'pass' | 'warn' | 'fail' | 'needs_review';
  failure_reasons?: string[];
  created_at: string;
  qc_report?: QCReport;
}

export default function QCReviewPage() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<QCPendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (orderId) {
      setExpandedOrderId(orderId);
    }
    fetchPendingItems();
  }, [searchParams]);

  const fetchPendingItems = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/qc/pending');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch QC items:', error);
      // Mock data for development
      setItems([
        {
          order_id: '123e4567-e89b-12d3-a456-426614174000',
          glaze_name: 'Celadon Blue',
          qc_status: 'fail',
          failure_reasons: ['Total materials sum is 99.2%, outside acceptable range (99.5-100.5%)'],
          created_at: new Date().toISOString(),
          qc_report: {
            id: 'qc-001',
            order_id: '123e4567-e89b-12d3-a456-426614174000',
            overall_status: 'fail',
            failure_reasons: ['Total materials sum is 99.2%, outside acceptable range (99.5-100.5%)'],
            checks: [
              {
                check_name: 'Material Sum',
                status: 'fail',
                value: 99.2,
                threshold: '99.5-100.5',
                message: 'Total is outside acceptable range',
              },
              {
                check_name: 'Flux Balance',
                status: 'pass',
                value: 0.42,
                threshold: '0.4-0.6',
                message: 'Within acceptable range',
              },
              {
                check_name: 'SiO2:Al2O3 Ratio',
                status: 'pass',
                value: 5.8,
                threshold: '5.0-8.0',
                message: 'Good ratio for glaze stability',
              },
            ],
            created_at: new Date().toISOString(),
          },
        },
        {
          order_id: '123e4567-e89b-12d3-a456-426614174001',
          glaze_name: 'Tenmoku Black',
          qc_status: 'warn',
          failure_reasons: [],
          created_at: new Date().toISOString(),
          qc_report: {
            id: 'qc-002',
            order_id: '123e4567-e89b-12d3-a456-426614174001',
            overall_status: 'warn',
            failure_reasons: [],
            checks: [
              {
                check_name: 'Material Sum',
                status: 'pass',
                value: 100.0,
                threshold: '99.5-100.5',
                message: 'Perfect sum',
              },
              {
                check_name: 'Iron Oxide Content',
                status: 'warn',
                value: 12.5,
                threshold: '<10',
                message: 'High iron content - monitor for running',
              },
            ],
            created_at: new Date().toISOString(),
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (orderId: string, status: 'approve' | 'reject') => {
    const notes = reviewNotes[orderId] || '';

    setSubmitting(orderId);
    try {
      const response = await fetch(
        `http://localhost:8000/api/qc/reports/${orderId}/review`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: status === 'approve' ? 'pass' : 'fail',
            notes,
          }),
        }
      );

      if (response.ok) {
        alert(`Order ${status === 'approve' ? 'approved' : 'rejected'} successfully!`);
        fetchPendingItems();
        setReviewNotes({ ...reviewNotes, [orderId]: '' });
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setSubmitting(null);
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      pass: 'bg-green-100 text-green-800',
      warn: 'bg-orange-100 text-orange-800',
      fail: 'bg-red-100 text-red-800',
      needs_review: 'bg-purple-100 text-purple-800',
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-12">Loading QC items...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">QC Review Queue</h1>
          <p className="text-gray-600 mt-2">Review and approve quality control reports</p>
        </div>
        <button
          onClick={fetchPendingItems}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <span>🔄</span>
          Refresh
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Clear!</h2>
          <p className="text-gray-600">No orders pending QC review at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.order_id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Item Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(item.order_id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-bold text-gray-900">{item.glaze_name}</h3>
                      {getStatusBadge(item.qc_status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Order ID: {item.order_id.substring(0, 8)} | Created:{' '}
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                    {item.failure_reasons && item.failure_reasons.length > 0 && (
                      <div className="mt-2 flex items-start gap-2">
                        <span className="text-red-600 font-semibold">⚠️</span>
                        <ul className="list-disc list-inside text-sm text-red-800">
                          {item.failure_reasons.map((reason, idx) => (
                            <li key={idx}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="text-2xl text-gray-400">
                    {expandedOrderId === item.order_id ? '▼' : '▶'}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrderId === item.order_id && item.qc_report && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  {item.qc_status === 'fail' && (
                    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
                      <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                        <span className="text-2xl">⚠️</span>
                        This order failed automated QC. Review carefully.
                      </h4>
                      <p className="text-red-800 text-sm">
                        Consider whether this order should be approved with override, adjusted, or
                        rejected.
                      </p>
                    </div>
                  )}

                  <QCReportDisplay report={item.qc_report} showHeader={false} />

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review Notes
                      </label>
                      <textarea
                        value={reviewNotes[item.order_id] || ''}
                        onChange={(e) =>
                          setReviewNotes({ ...reviewNotes, [item.order_id]: e.target.value })
                        }
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add any notes about this review decision..."
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => handleReview(item.order_id, 'approve')}
                        disabled={submitting === item.order_id}
                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                          submitting === item.order_id
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        ✓ Approve {item.qc_status === 'fail' && '(Override)'}
                      </button>
                      <button
                        onClick={() => handleReview(item.order_id, 'reject')}
                        disabled={submitting === item.order_id}
                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                          submitting === item.order_id
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
