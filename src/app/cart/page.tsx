'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { ShoppingCart, Trash2, ArrowRight, Palette } from 'lucide-react';

const SHIPPING = 8.99;

function formatBatchSize(grams: number): string {
  if (grams >= 1000) return `${grams / 1000} kg`;
  return `${grams}g`;
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, clearCart } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = items.length > 0 ? subtotal + SHIPPING : 0;

  const handleCheckout = () => {
    // Demo mode — go straight to success with a generated order ID
    router.push('/checkout/success');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-clay-900 mb-2">Shopping Cart</h1>
      <p className="text-clay-500 mb-8">
        {items.length === 0
          ? 'Your cart is empty'
          : `${items.length} item${items.length !== 1 ? 's' : ''}`}
      </p>

      {items.length === 0 ? (
        /* Empty state */
        <div className="text-center py-16">
          <ShoppingCart className="w-16 h-16 text-clay-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-clay-700 mb-2">
            Nothing here yet
          </h2>
          <p className="text-clay-500 mb-8 max-w-md mx-auto">
            Browse the Vision Board or design a custom glaze to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/vision-board"
              className="btn-primary inline-flex items-center justify-center space-x-2"
            >
              <Palette className="w-5 h-5" />
              <span>Browse Vision Board</span>
            </Link>
            <Link
              href="/design"
              className="btn-outline inline-flex items-center justify-center space-x-2"
            >
              <span>Design a Glaze</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.glazeId}
                className="card flex items-center space-x-4"
              >
                {/* Color swatch */}
                <div
                  className="w-14 h-14 rounded-lg flex-shrink-0 border border-clay-200"
                  style={{ backgroundColor: item.colorHex }}
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-clay-900 truncate">
                    {item.glazeName}
                  </h3>
                  <p className="text-sm text-clay-500">
                    {formatBatchSize(item.batchSizeGrams)} &bull; Cone 6 Oxidation
                  </p>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-clay-900">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.glazeId)}
                  className="text-clay-400 hover:text-red-500 transition-colors flex-shrink-0 p-1"
                  title="Remove from cart"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {/* Clear cart */}
            <div className="flex justify-end pt-2">
              <button
                onClick={clearCart}
                className="text-sm text-clay-400 hover:text-red-500 transition-colors"
              >
                Clear cart
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="card sticky top-24">
              <h2 className="text-lg font-semibold text-clay-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-clay-600">
                    Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})
                  </span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-clay-600">Shipping</span>
                  <span className="font-medium">${SHIPPING.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-lg font-bold border-t border-clay-200 pt-3">
                  <span>Total</span>
                  <span className="text-brand-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-primary mt-6 flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                href="/vision-board"
                className="block text-center text-sm text-brand-600 hover:text-brand-700 font-medium mt-4"
              >
                Continue Shopping
              </Link>

              {/* Delivery note */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <p className="font-medium mb-1">Estimated Delivery</p>
                <p className="text-xs text-blue-700">
                  Custom glazes are mixed and shipped within 5–7 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
