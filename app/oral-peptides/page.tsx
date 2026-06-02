'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Product } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';
import { wordpress } from '@/lib/wordpress';
import { useLanguage } from '@/contexts/LanguageContext';

export default function OralPeptidesPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { woocommerce } = await import('@/lib/woocommerce');
        const data = await woocommerce.getProducts({ category: 'oral', perPage: 24 });
        setProducts(data);
      } catch (error) {
        console.error('Error fetching oral peptides:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div>
      {/* Banner Section */}
      <section className="pb-0">
        <div className="relative  text-white overflow-hidden rounded-t-3xl min-h-[300px] md:min-h-[400px] flex items-center">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: "url('/banner.png')",
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/75" />
          
          {/* Content */}
          <div className="relative px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 pt-32 w-full">
            {/* Breadcrumb */}
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
            
            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold text-white">
              {t('oral_peptides.title')}
            </h1>
            
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-500 mt-4">{t('oral_peptides.loading')}</p>
          </div>
        ) : products.length > 0 ? (
          <>
            {/* Products Grid */}
            <ProductGrid products={products} />
            
            {/* Results Count */}
            <div className="mt-12 text-center text-gray-600">
              {t('oral_peptides.showing')} {products.length} {products.length === 1 ? t('oral_peptides.product') : t('oral_peptides.products')}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">{t('oral_peptides.no_products_title')}</h2>
            <p className="text-gray-500">
              {t('oral_peptides.no_products_message')}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
