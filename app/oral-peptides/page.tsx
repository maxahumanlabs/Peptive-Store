'use client';

import Link from '@/components/ui/LocalizedLink';
import { useEffect, useState } from 'react';
import { Product } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';
import StackBuilder from '@/components/products/StackBuilder';
import { useLanguage } from '@/contexts/LanguageContext';

const CATEGORY = 'oral';

export default function OralPeptidesPage() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('menu_order');

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
        console.error('Error fetching oral peptides:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

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
                <li className="text-white font-medium">{t('oral_peptides.title')}</li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold text-white">
              {t('oral_peptides.title')}
            </h1>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="max-w-[1600px] mx-auto px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-500 mt-4">{t('oral_peptides.loading')}</p>
          </div>
        ) : products.length > 0 ? (
          <>
            {/* Sorting Dropdown & Showing count */}
            <div className="flex flex-row justify-between items-center gap-4 mb-8 w-full">
              <div className="text-gray-400 text-xs">
                {language === 'ar'
                  ? `${sortedProducts.length} منتج`
                  : `${sortedProducts.length} ${sortedProducts.length === 1 ? t('oral_peptides.product') : t('oral_peptides.products')}`}
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor="sort-select" className="text-xs font-medium text-gray-400 shrink-0">
                  {t('products.sort_by')}:
                </label>
                <div className="relative w-48 sm:w-52">
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none w-full bg-[#1f1f1f] hover:bg-zinc-800 text-white text-xs rounded-full border border-zinc-800 focus:border-zinc-500 focus:outline-none py-2.5 pl-4 pr-10 rtl:pl-10 rtl:pr-4 transition-all duration-300 cursor-pointer shadow-md"
                  >
                    <option value="menu_order">{t('products.sort_recommended')}</option>
                    <option value="price-asc">{t('products.sort_price_asc')}</option>
                    <option value="price-desc">{t('products.sort_price_desc')}</option>
                    <option value="latest">{t('products.sort_latest')}</option>
                    <option value="oldest">{t('products.sort_oldest')}</option>
                    <option value="rating">{t('products.sort_rating')}</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 pr-3.5 rtl:left-0 rtl:pl-3.5 rtl:right-auto flex items-center text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <ProductGrid products={sortedProducts} collectionSlug="oral-peptide-supplements" />
          </>
        ) : (
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">{t('oral_peptides.no_products_title')}</h2>
            <p className="text-gray-500">{t('oral_peptides.no_products_message')}</p>
          </div>
        )}
      </section>

      {/* Build Your Stack — only products from this category */}
      <StackBuilder category={CATEGORY} />
    </div>
  );
}
