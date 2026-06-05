'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import { useRecommendedProducts } from '@/components/cart/useRecommendedProducts';

interface FloatingAddToCartProps {
  currentProductId: number;
}

// A small upsell card that floats at the bottom-right after the user scrolls.
export default function FloatingAddToCart({ currentProductId }: FloatingAddToCartProps) {
  const { t, language } = useLanguage();
  const { products } = useRecommendedProducts([currentProductId], 1);
  const addItem = useCartStore((state) => state.addItem);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const product: Product | undefined = products[0];
  if (!product || dismissed || !visible) return null;

  const name =
    language === 'ar' && (product as any).arabic_name
      ? (product as any).arabic_name
      : product.name;

  const onSale =
    product.onSale &&
    product.regularPrice &&
    parseFloat(product.regularPrice) > parseFloat(product.price);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      bundleType: 'one-month',
      bundleLabel: t('bundle.one_month'),
      arabicName: (product as any).arabic_name || '',
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Close"
        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-white shadow"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-center gap-3">
        <Link href={`/products/${product.slug}`} className="flex-shrink-0">
          <img
            src={product.image || '/placeholder.jpg'}
            alt={name}
            className="h-16 w-16 rounded-lg bg-gray-100 object-cover"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <Link href={`/products/${product.slug}`} className="block">
            <p className="line-clamp-2 text-xs font-medium text-gray-900 hover:underline">
              {name}
            </p>
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm font-semibold text-red-500">
              {formatPrice(product.price)}
            </span>
            {onSale && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.regularPrice)}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex-shrink-0 rounded-full bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-gray-800"
        >
          {t('product_detail.add_to_cart')}
        </button>
      </div>
    </div>
  );
}
