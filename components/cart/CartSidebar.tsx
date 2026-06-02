'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { openWhatsAppOrder } from '@/lib/whatsapp';
import CartItem from './CartItem';
import CartRecommendations from './CartRecommendations';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CartSidebar() {
  const { items, isOpen, closeCart, getSubtotal } = useCartStore();
  const { t, language } = useLanguage();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const subtotal = getSubtotal();

  return (
    <>
      {/* Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-full w-[85%] sm:w-[75%] md:w-[55%] lg:w-[32%] xl:w-[26%] bg-white shadow-2xl z-[60] flex flex-col transition-all duration-500 ease-in-out rounded-l-[2rem] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-normal text-gray-900">{t('cart.title')}</h2>
          <button
            onClick={closeCart}
            className="text-gray-900 hover:text-gray-600 transition-colors p-1 -mr-1"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="mb-8 max-w-sm">
                <h3 className="text-base font-normal text-gray-900 mb-2">
                  {t('cart.empty_title')}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{t('cart.empty_subtitle_1')}</p>
                <p className="text-sm text-gray-600">{t('cart.empty_subtitle_2')}</p>
              </div>
              <button
                onClick={closeCart}
                className="inline-flex items-center gap-2 text-sm font-normal text-gray-900 hover:gap-3 transition-all group"
              >
                <span>{t('cart.continue_shopping')}</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <CartItem key={item.cartItemId || `${item.id}-${Math.random()}`} item={item} />
              ))}
              <CartRecommendations onNavigate={closeCart} />
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4 sm:p-5 space-y-3 bg-gray-50">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 font-normal">{t('cart.subtotal')}</span>
              <span className="text-base font-normal text-gray-900">{formatPrice(subtotal)}</span>
            </div>

            <p className="text-xs text-gray-500">
              {t('cart.shipping_taxes')}
            </p>

            {/* Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  openWhatsAppOrder(
                    items.map((i) => ({
                      name: i.name,
                      arabicName: i.arabicName,
                      price: i.price,
                      quantity: i.quantity,
                      bundleLabel: i.bundleLabel,
                    })),
                    language
                  );
                  closeCart();
                }}
                className="w-full bg-gray-900 text-white font-normal py-3 text-sm rounded-full hover:bg-gray-800 transition-colors"
              >
                {t('cart.proceed_to_checkout')}
              </button>
              <Link href="/cart" onClick={closeCart} className="block">
                <button className="w-full border-2 border-gray-900 text-gray-900 font-normal py-3 text-sm rounded-full hover:bg-gray-50 transition-colors">
                  {t('cart.view_cart')}
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
