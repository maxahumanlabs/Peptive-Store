'use client';

import { useCartStore } from '@/store/cartStore';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/products/ProductCard';
import { useRecommendedProducts } from './useRecommendedProducts';

export default function CartPageRecommendations() {
  const { items } = useCartStore();
  const { t } = useLanguage();
  const excludeIds = items.map((i) => i.id);
  const { products } = useRecommendedProducts(excludeIds, 8);

  if (products.length === 0) return null;

  return (
    <div className="mt-16 lg:mt-20">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-8 lg:mb-10">
        {t('cart.you_may_also_like')}
      </h2>
      <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex-shrink-0 w-60 sm:w-64 lg:w-72 snap-start"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
