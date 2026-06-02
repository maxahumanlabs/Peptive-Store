'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const session = searchParams?.get('session_id');
    if (session) {
      setSessionId(session);
      // Clear cart after successful payment
      clearCart();
    }
  }, [searchParams, clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 px-4 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-16 md:py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Order Successful!
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>

        {sessionId && (
          <div className="bg-white rounded-2xl p-6 mb-8 border-2 border-green-200">
            <p className="text-sm text-gray-600 mb-2">Order Reference</p>
            <p className="text-xs font-mono text-gray-900 break-all">{sessionId}</p>
          </div>
        )}

        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
          <p className="text-base text-blue-900">
            <strong>📧 Confirmation email sent!</strong><br />
            Check your inbox for order details and tracking information.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <button className="w-full sm:w-auto bg-gray-900 text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-800 transition-all">
              Continue Shopping
            </button>
          </Link>
          <Link href="/account">
            <button className="w-full sm:w-auto border-2 border-gray-900 text-gray-900 font-semibold px-8 py-4 rounded-full hover:bg-gray-50 transition-all">
              View My Orders
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
