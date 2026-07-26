'use client';

import Link from '@/components/ui/LocalizedLink';
import { useEffect, useState } from 'react';
import { Product } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';
import StackBuilder from '@/components/products/StackBuilder';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProductsPage({ params }: { params: { collection: string } }) {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('menu_order');

  let CATEGORY = params.collection;
  if (CATEGORY === 'oral-peptide-supplements') {
    CATEGORY = 'oral';
  }

  useEffect(() => {
    async function loadProducts() {
      try {
        const { woocommerce } = await import('@/lib/woocommerce');
        // Load every product in the category (Store API caps per_page at 100)
        // Sort by menu_order (WordPress catalog order) by default to let WP Admin drag-and-drop work.
        const data = await woocommerce.getProducts({
          category: CATEGORY,
          perPage: 100,
          orderby: 'menu_order',
          order: 'asc'
        });
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [CATEGORY]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return parseFloat(a.price) - parseFloat(b.price);
    }
    if (sortBy === 'price-desc') {
      return parseFloat(b.price) - parseFloat(a.price);
    }
    if (sortBy === 'latest') {
      return b.id - a.id;
    }
    if (sortBy === 'oldest') {
      return a.id - b.id;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0; // Default: 'menu_order' (keeps WooCommerce catalog order)
  });

  return (
    <div>
      {/* Banner Section */}
      <section className="max-w-[1600px] mx-auto pb-0">
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
      <section className="max-w-[1600px] mx-auto px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : products.length > 0 ? (
          <>
            {/* Sorting Dropdown & Showing count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="text-gray-400 text-sm">
                {t('products.showing')} {sortedProducts.length} {sortedProducts.length === 1 ? t('products.product') : t('products.products')}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="sort-select" className="text-sm font-medium text-gray-300 shrink-0">
                  {t('products.sort_by')}:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-zinc-950 text-white text-sm rounded-lg border border-zinc-800 focus:ring-1 focus:ring-white focus:border-white block w-full sm:w-48 p-2.5 outline-none transition-colors cursor-pointer"
                >
                  <option value="menu_order">{t('products.sort_recommended')}</option>
                  <option value="price-asc">{t('products.sort_price_asc')}</option>
                  <option value="price-desc">{t('products.sort_price_desc')}</option>
                  <option value="latest">{t('products.sort_latest')}</option>
                  <option value="oldest">{t('products.sort_oldest')}</option>
                  <option value="rating">{t('products.sort_rating')}</option>
                </select>
              </div>
            </div>

            <ProductGrid products={sortedProducts} collectionSlug={params.collection} />
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
