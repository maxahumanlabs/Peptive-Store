'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/types';
import { useRecommendedProducts } from './useRecommendedProducts';

interface CartRecommendationsProps {
  // Called when the user navigates to a product (e.g. to close the cart sidebar)
  onNavigate?: () => void;
}

export default function CartRecommendations({ onNavigate }: CartRecommendationsProps) {
  const { items, addItem } = useCartStore();
  const { t, language } = useLanguage();
  const excludeIds = items.map((i) => i.id);
  const { products } = useRecommendedProducts(excludeIds, 3);

  if (products.length === 0) return null;

  const displayName = (p: Product) =>
    language === 'ar' && (p as any).arabic_name ? (p as any).arabic_name : p.name;

  const handleAdd = (p: Product) => {
    addItem({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      image: p.image,
      bundleType: 'one-month',
      bundleLabel: t('bundle.one_month'),
      arabicName: (p as any).arabic_name || '',
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-base font-semibold text-gray-900 mb-3">
        {t('cart.you_might_also_like')}
      </h3>
      <div className="space-y-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 border border-gray-200 rounded-2xl p-3"
          >
            <Link
              href={`/products/${p.slug}`}
              onClick={onNavigate}
              className="flex-shrink-0"
            >
              <img
                src={p.image || '/placeholder.jpg'}
                alt={displayName(p)}
                className="w-14 h-14 rounded-lg object-cover bg-gray-100"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/products/${p.slug}`} onClick={onNavigate} className="block">
                <p className="text-sm text-gray-900 font-medium truncate hover:underline">
                  {displayName(p)}
                </p>
              </Link>
              <p className="text-sm text-gray-900 font-semibold mt-1">
                {formatPrice(p.price)}
              </p>
            </div>
            <button
              onClick={() => handleAdd(p)}
              className="flex-shrink-0 bg-gray-100 text-gray-900 text-sm font-medium px-5 py-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              {t('cart.add')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
