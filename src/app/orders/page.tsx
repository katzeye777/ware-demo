'use client';

import { useAuth } from '@/lib/auth';
import { VISION_BOARD_GLAZES } from '@/app/vision-board/data';
import StatusBadge from '@/components/StatusBadge';
import { Package, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Demo orders built from actual vision board glazes
const DEMO_ORDERS = [
  {
    id: 'ord-8f2a1b3c',
    status: 'delivered' as const,
    total_amount: 45.0,
    created_at: '2026-02-02T14:30:00Z',
    items: [
      { glazeId: 'vb-tangerine-flame', grams: 500 },
      { glazeId: 'vb-deep-ocean', grams: 500 },
      { glazeId: 'vb-honey-amber', grams: 350 },
    ],
  },
  {
    id: 'ord-3d7e9f1a',
    status: 'shipped' as const,
    total_amount: 30.0,
    created_at: '2026-02-10T09:15:00Z',
    items: [
      { glazeId: 'vb-lobster-red', grams: 1000 },
      { glazeId: 'vb-midnight-ink', grams: 500 },
    ],
  },
  {
    id: 'ord-c4b8e2d6',
    status: 'in_production' as const,
    total_amount: 15.0,
    created_at: '2026-02-15T16:45:00Z',
    items: [
      { glazeId: 'vb-garden-sage', grams: 350 },
    ],
  },
];

function resolveOrderItems(items: { glazeId: string; grams: number }[]) {
  return items.map((item) => {
    const glaze = VISION_BOARD_GLAZES.find((g) => g.id === item.glazeId);
    return {
      id: item.glazeId,
      name: glaze?.name || 'Unknown Glaze',
      color_hex: glaze?.color_hex || '#ccc',
      preview_image_url: glaze?.preview_image_url,
      grams: item.grams,
    };
  });
}

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
          <p className="mt-4 text-clay-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-clay-900">Order History</h1>
        <Link href="/design" className="btn-primary text-sm">
          New Order
        </Link>
      </div>

      <div className="space-y-4">
        {DEMO_ORDERS.map((order) => {
          const items = resolveOrderItems(order.items);
          return (
            <div key={order.id} className="card">
              {/* Order header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-clay-900">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </h3>
                  <StatusBadge status={order.status} type="order" />
                </div>
                <div className="text-right">
                  <p className="font-semibold text-clay-900">
                    ${order.total_amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-clay-500">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Item list */}
              <div className="space-y-3">
                {items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/library/${item.id}`}
                    className="flex items-center space-x-3 p-2 -mx-2 rounded-lg hover:bg-clay-50 transition-colors group"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-clay-200">
                      {item.preview_image_url ? (
                        <img
                          src={item.preview_image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: item.color_hex }}
                        />
                      )}
                    </div>

                    {/* Name + details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-clay-900 text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-clay-500">{item.grams}g • Glossy • Cone 6</p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-clay-300 group-hover:text-brand-500 flex-shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
