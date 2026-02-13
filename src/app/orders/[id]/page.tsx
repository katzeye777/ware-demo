'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api, Order, FulfillmentStatus } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import {
  Package,
  MapPin,
  CreditCard,
  RefreshCw,
  Edit,
  AlertCircle,
  Star,
  CheckCircle,
  Truck,
  ClipboardCheck,
  Flame,
} from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [fulfillment, setFulfillment] = useState<FulfillmentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const orderId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && orderId) {
      loadOrderDetails();
    }
  }, [user, authLoading, router, orderId]);

  const loadOrderDetails = async () => {
    try {
      const [orderData, fulfillmentData] = await Promise.all([
        api.getOrder(orderId),
        api.getFulfillmentStatus(orderId).catch(() => null), // May not exist yet
      ]);

      setOrder(orderData);
      setFulfillment(fulfillmentData);
    } catch (err: any) {
      setError(err.message || 'Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  const getFulfillmentSteps = () => {
    const steps = [
      { id: 'pending', label: 'Order Received', icon: CheckCircle },
      { id: 'mixing', label: 'Mixing Glaze', icon: Flame },
      { id: 'quality_check', label: 'Quality Check', icon: ClipboardCheck },
      { id: 'packaging', label: 'Packaging', icon: Package },
      { id: 'shipped', label: 'Shipped', icon: Truck },
    ];

    const currentIndex = steps.findIndex(s => s.id === fulfillment?.status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          <p className="mt-4 text-clay-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-clay-900 mb-2">Order Not Found</h2>
          <p className="text-clay-600 mb-6">{error || 'This order does not exist.'}</p>
          <Link href="/orders" className="btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const fulfillmentSteps = getFulfillmentSteps();

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/orders" className="text-brand-600 hover:text-brand-700 text-sm font-medium mb-2 inline-block">
          ← Back to Orders
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-clay-900 mb-2">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-clay-600">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <StatusBadge status={order.status} type="order" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fulfillment Status Timeline */}
          {fulfillment && (
            <div className="card">
              <h2 className="text-xl font-semibold text-clay-900 mb-6">
                Order Progress
              </h2>

              <div className="relative">
                {fulfillmentSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="relative pb-8 last:pb-0">
                      {index < fulfillmentSteps.length - 1 && (
                        <div
                          className={`absolute left-5 top-10 w-0.5 h-full ${
                            step.completed ? 'bg-green-500' : 'bg-clay-200'
                          }`}
                        />
                      )}

                      <div className="relative flex items-center space-x-4">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed
                              ? 'bg-green-500 text-white'
                              : step.current
                              ? 'bg-brand-500 text-white animate-pulse'
                              : 'bg-clay-200 text-clay-500'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              step.completed || step.current
                                ? 'text-clay-900'
                                : 'text-clay-500'
                            }`}
                          >
                            {step.label}
                          </p>
                          {step.current && fulfillment.notes && (
                            <p className="text-sm text-clay-600 mt-1">
                              {fulfillment.notes}
                            </p>
                          )}
                        </div>

                        {step.completed && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tracking Info */}
              {fulfillment.tracking_number && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-medium text-blue-900 mb-1">Tracking Information</p>
                  <p className="text-sm text-blue-800">
                    {fulfillment.carrier}: {fulfillment.tracking_number}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Order Items */}
          <div className="card">
            <h2 className="text-xl font-semibold text-clay-900 mb-4">
              Order Items
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-clay-200 last:border-b-0">
                  {item.preview_image_url ? (
                    <img
                      src={item.preview_image_url}
                      alt={item.glaze_name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-clay-200" />
                  )}

                  <div className="flex-1">
                    <h3 className="font-semibold text-clay-900">{item.glaze_name}</h3>
                    <p className="text-sm text-clay-600">
                      {item.batch_size_grams}g batch
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-clay-900">
                      ${item.unit_price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="btn-secondary flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Reorder</span>
            </button>

            <button className="btn-secondary flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Tweak & Reorder</span>
            </button>

            <button className="btn-secondary flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>Leave Review</span>
            </button>

            <Link href="/support" className="btn-outline flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Report Issue</span>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="card">
            <h3 className="font-semibold text-clay-900 mb-4 flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Order Summary</span>
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-clay-600">Subtotal</span>
                <span className="font-medium">${(order.total_amount * 0.85).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-clay-600">Shipping</span>
                <span className="font-medium">$8.99</span>
              </div>
              <div className="flex justify-between">
                <span className="text-clay-600">Tax</span>
                <span className="font-medium">${(order.total_amount * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-clay-200 pt-2 mt-2">
                <span>Total</span>
                <span className="text-brand-600">${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card">
            <h3 className="font-semibold text-clay-900 mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Shipping Address</span>
            </h3>

            {order.shipping_address && (
              <div className="text-sm text-clay-700">
                <p className="font-medium">{order.shipping_address.name}</p>
                <p>{order.shipping_address.line1}</p>
                {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}{' '}
                  {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
              </div>
            )}
          </div>

          {/* Payment Method */}
          {order.stripe_payment_intent_id && (
            <div className="card">
              <h3 className="font-semibold text-clay-900 mb-4 flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Payment Method</span>
              </h3>

              <div className="text-sm text-clay-700">
                <p>Paid via Stripe</p>
                <p className="text-xs text-clay-500 mt-1 font-mono">
                  {order.stripe_payment_intent_id.slice(0, 20)}...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
