'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useDesignStore } from '@/lib/store';
import { api, ShippingAddress } from '@/lib/api';
import { loadStripe } from '@stripe/stripe-js';
import { Lock, CreditCard } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || '');

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { currentDesign, designResult, selectedMatchId, glazeName, isPrivate } = useDesignStore();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: user?.name || '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedMatch = designResult?.alternatives.find(
    (m) => m.glaze_id === selectedMatchId
  ) || designResult?.primary_match;

  const basePrice = designResult?.estimated_price || 0;
  const privateAddon = isPrivate ? 4.99 : 0;
  const shipping = 8.99;
  const tax = (basePrice + privateAddon) * 0.08;
  const total = basePrice + privateAddon + shipping + tax;

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push('/login');
      return;
    }

    if (!selectedMatchId || !currentDesign) {
      setError('No glaze selected. Please go back and select a glaze.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const session = await api.createCheckoutSession({
        glaze_id: selectedMatchId,
        batch_size_grams: currentDesign.batch_size_grams,
        is_private: isPrivate,
        shipping_address: shippingAddress,
      });

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.session_id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout session');
      setIsLoading(false);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  if (!designResult || !selectedMatchId) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <h1 className="text-2xl font-bold text-clay-900 mb-4">No Glaze Selected</h1>
        <p className="text-clay-600 mb-6">
          Please go back and design your glaze first.
        </p>
        <button onClick={() => router.push('/design')} className="btn-primary">
          Back to Design
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold text-clay-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="card">
            <h2 className="text-xl font-semibold text-clay-900 mb-4">
              Shipping Address
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-clay-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={shippingAddress.name}
                  onChange={handleAddressChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-clay-700 mb-2">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="line1"
                  required
                  value={shippingAddress.line1}
                  onChange={handleAddressChange}
                  className="input-field"
                  placeholder="123 Main St"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-clay-700 mb-2">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="line2"
                  value={shippingAddress.line2 || ''}
                  onChange={handleAddressChange}
                  className="input-field"
                  placeholder="Apt 4B"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-clay-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-clay-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    maxLength={2}
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    className="input-field"
                    placeholder="CA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-clay-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    required
                    value={shippingAddress.postal_code}
                    onChange={handleAddressChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-clay-700 mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleAddressChange}
                    className="input-field"
                  >
                    <option value="US">United States</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>{isLoading ? 'Processing...' : 'Pay with Stripe'}</span>
              </button>

              <div className="flex items-center justify-center space-x-2 text-sm text-clay-500">
                <Lock className="w-4 h-4" />
                <span>Secure checkout powered by Stripe</span>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card sticky top-24">
            <h2 className="text-xl font-semibold text-clay-900 mb-4">
              Order Summary
            </h2>

            {/* Glaze Preview */}
            {selectedMatch && (
              <div className="mb-6">
                <div
                  className="w-full h-32 rounded-lg color-swatch mb-3"
                  style={{ backgroundColor: selectedMatch.color_hex }}
                />
                <h3 className="font-semibold text-clay-900">
                  {glazeName || selectedMatch.glaze_name}
                </h3>
                <p className="text-sm text-clay-600">
                  {currentDesign?.batch_size_grams}g • {currentDesign?.finish}
                </p>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-clay-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-clay-600">Glaze ({currentDesign?.batch_size_grams}g)</span>
                <span className="font-medium">${basePrice.toFixed(2)}</span>
              </div>

              {isPrivate && (
                <div className="flex justify-between text-sm">
                  <span className="text-clay-600">Private Glaze Add-on</span>
                  <span className="font-medium">${privateAddon.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-clay-600">Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-clay-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg font-bold border-t border-clay-200 pt-3">
                <span>Total</span>
                <span className="text-brand-600">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Estimate */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <p className="font-medium mb-1">Estimated Delivery:</p>
              <p className="text-xs text-blue-700">
                Your custom glaze will be mixed and shipped within 5-7 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
