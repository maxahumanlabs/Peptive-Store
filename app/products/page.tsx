'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Product } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';
import StackBuilder from '@/components/products/StackBuilder';
import { useLanguage } from '@/contexts/LanguageContext';

const CATEGORY = 'all';
const PER_PAGE = 12;

export default function ProductsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { woocommerce } = await import('@/lib/woocommerce');
        const data = await woocommerce.getProducts({ category: CATEGORY, page: 1, perPage: PER_PAGE });
        setProducts(data);
        setHasMore(data.length === PER_PAGE);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const { woocommerce } = await import('@/lib/woocommerce');
      const next = page + 1;
      const data = await woocommerce.getProducts({ category: CATEGORY, page: next, perPage: PER_PAGE });
      setProducts((prev) => [...prev, ...data]);
      setPage(next);
      setHasMore(data.length === PER_PAGE);
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div>
      {/* Banner Section */}
      <section className="pb-0">
        <div className="relative  text-white overflow-hidden rounded-t-3xl min-h-[300px] md:min-h-[400px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: "url('/banner.png')" }}
          />
          <div className="absolute inset-0 bg-black/75" />
          <div className="relative px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 pt-32 w-full">
            <nav className="mb-6">
              <ol className="flex items-center gap-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                    {t('products.breadcrumb_home')}
                  </Link>
                </li>
                <li className="text-gray-500">/</li>
                <li className="text-white font-medium">{t('products.title')}</li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold text-white">
              {t('products.title')}
            </h1>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-500 mt-4">{t('products.loading')}</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <ProductGrid products={products} />

            {/* Show more */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 border-2 border-gray-900 text-gray-900 font-semibold px-10 py-3.5 rounded-full hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-60"
                >
                  {loadingMore ? t('products.loading') : t('products.show_more')}
                </button>
              </div>
            )}

            {/* Results Count */}
            <div className="mt-6 text-center text-gray-600">
              {t('products.showing')} {products.length} {products.length === 1 ? t('products.product') : t('products.products')}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">{t('products.no_products_title')}</h2>
            <p className="text-gray-500">{t('products.no_products_message')}</p>
          </div>
        )}
      </section>

      {/* Build Your Stack — only products from this category */}
      <StackBuilder category={CATEGORY} />
    </div>
  );
}
