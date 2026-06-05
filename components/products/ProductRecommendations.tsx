'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/products/ProductCard';
import { useRecommendedProducts } from '@/components/cart/useRecommendedProducts';

interface ProductRecommendationsProps {
  currentProductId: number;
}

export default function ProductRecommendations({ currentProductId }: ProductRecommendationsProps) {
  const { t } = useLanguage();
  const { products } = useRecommendedProducts([currentProductId], 10);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div id="more-results" className="mt-16 lg:mt-24">
      <div className="flex items-start justify-between gap-4 mb-8 lg:mb-10">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
          {t('product_detail.more_results')}
        </h2>
        <div className="hidden md:flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous"
            className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next"
            className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 snap-x scroll-smooth"
      >
        {products.map((p) => (
          <div key={p.id} className="flex-shrink-0 w-60 sm:w-64 lg:w-72 snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Link
          href="/collections/all"
          className="inline-flex items-center gap-2 border border-gray-900 rounded-full px-8 py-3 text-sm md:text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
        >
          {t('product_detail.view_all')}
        </Link>
      </div>
    </div>
  );
}
