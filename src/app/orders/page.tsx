'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api, Order } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import { Package, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadOrders();
    }
  }, [user, authLoading, router]);

  const loadOrders = async () => {
    try {
      const data = await api.getUserOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          <p className="mt-4 text-clay-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-clay-900">My Orders</h1>
        <Link href="/design" className="btn-primary">
          Create New Order
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-clay-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-clay-900 mb-2">
            No Orders Yet
          </h3>
          <p className="text-clay-600 mb-6">
            Start designing your first custom glaze!
          </p>
          <Link href="/design" className="btn-primary">
            Design a Glaze
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <div className="card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg text-clay-900">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </h3>
                      <StatusBadge status={order.status} type="order" />
                    </div>

                    <div className="text-sm text-clay-600 space-y-1">
                      <p>
                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p>
                        {order.items.length} item{order.items.length > 1 ? 's' : ''} • ${order.total_amount.toFixed(2)}
                      </p>
                      {order.shipping_address && (
                        <p>
                          Shipping to {order.shipping_address.city}, {order.shipping_address.state}
                        </p>
                      )}
                    </div>

                    {/* Order Items Preview */}
                    {order.items.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-2 bg-clay-50 rounded-lg px-3 py-2"
                          >
                            <div
                              className="w-8 h-8 rounded color-swatch"
                              style={{ backgroundColor: '#ccc' }}
                            />
                            <div className="text-sm">
                              <p className="font-medium text-clay-900">{item.glaze_name}</p>
                              <p className="text-xs text-clay-600">{item.batch_size_grams}g</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <ChevronRight className="w-6 h-6 text-clay-400 flex-shrink-0 ml-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
