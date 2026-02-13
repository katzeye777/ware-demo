'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      setOrderId('ORD-' + Date.now());
    }
  }, [searchParams]);

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-clay-900 mb-4">
          Order Confirmed!
        </h1>
        <p className="text-lg text-clay-600 mb-8">
          Thank you for your purchase. Your custom glaze is on its way!
        </p>

        <div className="card text-left mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Package className="w-6 h-6 text-brand-600" />
            <div>
              <h2 className="font-semibold text-clay-900">Order Number</h2>
              <p className="text-sm text-clay-600 font-mono">{orderId}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-medium mb-2">What happens next?</p>
            <ol className="text-xs space-y-2 text-blue-700 list-decimal list-inside">
              <li>We&apos;ll send you an order confirmation email shortly</li>
              <li>Your custom glaze will be mixed by our experts</li>
              <li>Quality checks ensure perfect color matching</li>
              <li>You&apos;ll receive tracking info when it ships (5-7 days)</li>
            </ol>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/orders/${orderId}`} className="btn-primary inline-flex items-center justify-center space-x-2">
            <span>View Order Status</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link href="/design" className="btn-secondary inline-flex items-center justify-center">
            Design Another Glaze
          </Link>
        </div>

        <div className="mt-12 text-sm text-clay-600">
          <p>
            Questions about your order?{' '}
            <Link href="/support" className="text-brand-600 hover:text-brand-700 font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
