'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';

interface StackBuilderProps {
  // WooCommerce category slug — only products from this category are shown.
  category: string;
}

export default function StackBuilder({ category }: StackBuilderProps) {
  const { t, language } = useLanguage();
  const [stackProducts, setStackProducts] = useState<Product[]>([]);
  const [stackItems, setStackItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const saved = localStorage.getItem('peptive-stack');
    if (saved) {
      try {
        setStackItems(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading stack:', error);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const { woocommerce } = await import('@/lib/woocommerce');
        const products = await woocommerce.getProducts({ category, perPage: 100 });
        if (active) setStackProducts(products);
      } catch (error) {
        console.error('Error fetching stack products:', error);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [category]);

  const persist = (items: Product[]) => {
    setStackItems(items);
    localStorage.setItem('peptive-stack', JSON.stringify(items));
  };

  const addToStack = (product: Product) => persist([...stackItems, product]);
  const removeFromStack = (id: number) =>
    persist(stackItems.filter((item) => item.id !== id));

  const handleAddStackToCart = () => {
    stackItems.forEach((item) => addToCart(item as any));
    persist([]);
  };

  const stackTotal = stackItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const displayName = (p: Product) =>
    language === 'ar' && (p as any).arabic_name ? (p as any).arabic_name : p.name;

  // Nothing in this category — don't render the section at all.
  if (!loading && stackProducts.length === 0) return null;

  return (
    <section className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-16 border-t border-gray-100">
      {/* Header */}
      <div className="text-center mb-10 lg:mb-12">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-3">
          {t('stack.title')}
        </h2>
        <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">
          {t('stack.description')}
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Products grid */}
        <div className="lg:col-span-3 order-1">
          {loading ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 rounded-xl overflow-hidden">
                  <div className="aspect-square bg-gray-100 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {stackProducts.map((product) => (
                <div key={product.id} className="relative bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {product.onSale && product.regularPrice && product.salePrice && (
                      <span className="bg-red-500 text-white text-xs xl:text-sm font-bold px-4 py-1.5 rounded-full">
                        Save {Math.round(((parseFloat(product.regularPrice) - parseFloat(product.salePrice)) / parseFloat(product.regularPrice)) * 100)}%
                      </span>
                    )}
                    {product.stockStatus !== 'instock' && (
                      <span className="bg-gray-400 text-white text-xs xl:text-sm font-bold px-4 py-1.5 rounded-full">
                        {t('stack.sold_out')}
                      </span>
                    )}
                  </div>

                  {/* Image */}
                  <div className="relative bg-gray-100 aspect-square overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0] || '/placeholder.jpg'}
                        alt={displayName(product)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="bg-gray-50 p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="min-w-0">
                        <p className="text-gray-500 text-xs xl:text-sm mb-1 uppercase tracking-wide">Peptive</p>
                        <h3 className="text-gray-900 text-base lg:text-lg font-medium break-words">
                          {displayName(product)}
                        </h3>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-red-500 font-semibold text-base lg:text-lg whitespace-nowrap">
                          {formatPrice(product.price)}
                        </p>
                        {product.onSale && product.regularPrice && parseFloat(product.regularPrice) > parseFloat(product.price) && (
                          <p className="text-gray-400 text-sm line-through whitespace-nowrap">
                            {formatPrice(product.regularPrice)}
                          </p>
                        )}
                      </div>
                    </div>

                    {product.stockStatus === 'instock' ? (
                      <button
                        onClick={() => addToStack(product)}
                        className="w-full bg-gray-900 text-white font-semibold py-3 text-base rounded-full hover:bg-gray-800 transition-colors"
                      >
                        {t('stack.add_button')}
                      </button>
                    ) : (
                      <button
                        className="w-full bg-gray-600 text-white font-semibold py-3 text-base rounded-full cursor-not-allowed"
                        disabled
                      >
                        {t('stack.sold_out')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Your Stack sidebar */}
        <div className="lg:col-span-1 order-2">
          <div className="bg-white border-4 border-gray-900 rounded-3xl p-6 lg:p-8 sticky top-24 min-h-[380px] flex flex-col">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-4">
              {t('stack.your_stack')}
            </h3>

            <div className="flex-grow overflow-y-auto max-h-[320px] mb-4">
              {stackItems.length > 0 ? (
                <div className="space-y-3">
                  {stackItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                      <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {item.image || (item.images && item.images.length > 0) ? (
                          <img
                            src={item.image || item.images[0]}
                            alt={displayName(item)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{displayName(item)}</p>
                        <p className="text-xs text-gray-500">{formatPrice(item.price)}</p>
                      </div>
                      <button
                        onClick={() => removeFromStack(item.id)}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
                        aria-label="Remove from stack"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-sm text-center">{t('stack.empty')}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-6 pt-4 border-t-2 border-gray-200">
              <span className="text-gray-900 font-semibold text-lg lg:text-xl">{t('stack.total')}</span>
              <span className="text-gray-900 font-bold text-lg lg:text-xl">
                {formatPrice(stackTotal)}
              </span>
            </div>

            <button
              onClick={handleAddStackToCart}
              disabled={stackItems.length === 0}
              className={`w-full py-4 px-6 rounded-full font-bold text-base lg:text-lg transition-all ${
                stackItems.length > 0
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('stack.add_to_cart')} ({stackItems.length})
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
