'use client';

import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 px-4 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-16 md:py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* Cancel Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        {/* Cancel Message */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Your payment was cancelled. No charges have been made to your account.
        </p>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8">
          <p className="text-base text-yellow-900">
            <strong>💡 Your cart items are still saved!</strong><br />
            You can complete your purchase anytime.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/cart">
            <button className="w-full sm:w-auto bg-gray-900 text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-800 transition-all">
              Return to Cart
            </button>
          </Link>
          <Link href="/products">
            <button className="w-full sm:w-auto border-2 border-gray-900 text-gray-900 font-semibold px-8 py-4 rounded-full hover:bg-gray-50 transition-all">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
