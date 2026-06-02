'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { openWhatsAppOrder } from '@/lib/whatsapp';
import CartItem from '@/components/cart/CartItem';
import CartPageRecommendations from '@/components/cart/CartPageRecommendations';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CartPage() {
  const { items, clearCart, getSubtotal } = useCartStore();
  const { t, language } = useLanguage();
  const subtotal = getSubtotal();
  const estimatedTax = subtotal * 0.1; // 10% tax estimate
  const estimatedTotal = subtotal + estimatedTax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-16 md:py-20 lg:py-20 xl:py-20 2xl:py-24">
        <div className="max-w-3xl mx-auto text-center py-16 lg:py-16 xl:py-16 2xl:py-24">
          <svg
            className="w-40 h-40 lg:w-40 xl:w-40 2xl:w-48 2xl:h-48 text-gray-200 mx-auto mb-8 lg:mb-8 xl:mb-8 2xl:mb-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-extrabold text-gray-900 mb-4 lg:mb-4 xl:mb-4 2xl:mb-6">
            Your Cart is Empty
          </h1>
          <p className="text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-2xl text-gray-600 mb-10 lg:mb-10 xl:mb-10 2xl:mb-12">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <Link href="/products">
            <button className="bg-gray-900 text-white text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-2xl font-semibold py-5 lg:py-5 xl:py-5 2xl:py-6 px-10 lg:px-10 xl:px-10 2xl:px-12 rounded-full hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-16 md:py-20 lg:py-20 xl:py-20 2xl:py-24">
      <div className="mb-12 lg:mb-12 xl:mb-12 2xl:mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-extrabold text-gray-900 mb-4 lg:mb-4 xl:mb-4 2xl:mb-6">
          Shopping Cart
        </h1>
        <p className="text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-2xl text-gray-600">
          {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-8 xl:gap-8 2xl:gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 lg:p-10 xl:p-10 2xl:p-12">
            <div className="flex items-center justify-between mb-8 lg:mb-8 xl:mb-8 2xl:mb-10 pb-6 border-b-2 border-gray-100">
              <h2 className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-semibold text-gray-900">
                Cart Items
              </h2>
              <button
                onClick={clearCart}
                className="text-base md:text-lg lg:text-lg xl:text-lg font-semibold text-red-600 hover:text-red-700 hover:underline transition-all"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-6 lg:space-y-6 xl:space-y-6 2xl:space-y-7">
              {items.map((item) => (
                <CartItem key={item.cartItemId || `${item.id}-${Math.random()}`} item={item} />
              ))}
            </div>

            <div className="mt-10 lg:mt-10 xl:mt-10 2xl:mt-12 pt-8 lg:pt-8 xl:pt-8 2xl:pt-10 border-t-2 border-gray-100">
              <Link href="/products">
                <button className="border-2 border-gray-900 text-gray-900 text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-xl font-semibold py-4 lg:py-4 xl:py-4 2xl:py-5 px-8 lg:px-8 xl:px-8 2xl:px-10 rounded-full hover:bg-gray-50 transition-all">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 lg:p-10 xl:p-10 2xl:p-12 sticky top-24">
            <h2 className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-semibold text-gray-900 mb-8 lg:mb-8 xl:mb-8 2xl:mb-10">Order Summary</h2>

            <div className="space-y-5 lg:space-y-5 xl:space-y-5 2xl:space-y-6 mb-8">
              <div className="flex justify-between text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-xl text-gray-700">
                <span className="font-semibold">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-xl text-gray-700">
                <span className="font-semibold">Estimated Tax</span>
                <span className="font-semibold">{formatPrice(estimatedTax)}</span>
              </div>
              <div className="flex justify-between text-base md:text-lg lg:text-lg xl:text-lg text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">At checkout</span>
              </div>
            </div>

            <div className="border-t-2 border-gray-100 pt-6 lg:pt-6 xl:pt-6 2xl:pt-7 mb-8 lg:mb-8 xl:mb-8 2xl:mb-10">
              <div className="flex justify-between items-center">
                <span className="text-xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-semibold text-gray-900">Total</span>
                <span className="text-xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-extrabold text-gray-900">{formatPrice(estimatedTotal)}</span>
              </div>
            </div>

            <button
              onClick={() =>
                openWhatsAppOrder(
                  items.map((i) => ({
                    name: i.name,
                    arabicName: i.arabicName,
                    price: i.price,
                    quantity: i.quantity,
                    bundleLabel: i.bundleLabel,
                  })),
                  language
                )
              }
              className="w-full bg-gray-900 text-white text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-2xl font-semibold py-5 lg:py-5 xl:py-5 2xl:py-6 px-6 rounded-full hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg mb-6"
            >
              {t('cart.proceed_to_checkout')}
            </button>

            <p className="text-sm md:text-base lg:text-base text-gray-500 text-center mb-8">
              Tax and shipping calculated at checkout
            </p>

            {/* Trust Badges */}
            <div className="pt-8 border-t-2 border-gray-100">
              <div className="space-y-4 lg:space-y-4 xl:space-y-4 2xl:space-y-5">
                <div className="flex items-center text-base md:text-lg lg:text-lg xl:text-lg text-gray-700">
                  <svg className="w-6 h-6 lg:w-6 xl:w-6 2xl:w-7 2xl:h-7 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Secure Checkout</span>
                </div>
                <div className="flex items-center text-base md:text-lg lg:text-lg text-gray-700">
                  <svg className="w-6 h-6 lg:w-6 xl:w-7 2xl:h-7 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Free Shipping Over $100</span>
                </div>
                <div className="flex items-center text-base md:text-lg lg:text-lg text-gray-700">
                  <svg className="w-6 h-6 lg:w-6 xl:w-7 2xl:h-7 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CartPageRecommendations />
    </div>
  );
}
