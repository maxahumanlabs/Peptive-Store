'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCartStore } from '@/store/cartStore';

export default function StackPage() {
  const { t, language } = useLanguage();
  const [stackProducts, setStackProducts] = useState<Product[]>([]);
  const [stackItems, setStackItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    // Load stack from localStorage
    const savedStack = localStorage.getItem('peptive-stack');
    if (savedStack) {
      try {
        setStackItems(JSON.parse(savedStack));
      } catch (error) {
        console.error('Error loading stack:', error);
      }
    }
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { woocommerce } = await import('@/lib/woocommerce');
        const products = await woocommerce.getProducts({ category: 'stack', perPage: 100 });
        setStackProducts(products);
      } catch (error) {
        console.error('Error fetching stack products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const addToStack = (product: Product) => {
    const updatedStack = [...stackItems, product];
    setStackItems(updatedStack);
    localStorage.setItem('peptive-stack', JSON.stringify(updatedStack));
  };

  const removeFromStack = (productId: number) => {
    const updatedStack = stackItems.filter((item) => item.id !== productId);
    setStackItems(updatedStack);
    localStorage.setItem('peptive-stack', JSON.stringify(updatedStack));
  };

  const handleAddStackToCart = () => {
    stackItems.forEach((item) => {
      addToCart(item);
    });
    // Clear stack
    setStackItems([]);
    localStorage.setItem('peptive-stack', JSON.stringify([]));
  };

  const stackTotal = stackItems.reduce((total, item) => total + parseFloat(item.price), 0);

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
                <li className="text-white font-medium">{t('stack.title')}</li>
              </ol>
            </nav>
            
            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold text-white">
              {t('stack.title')}
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mt-4 max-w-2xl">
              {t('stack.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-12">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Your Stack Sidebar - Left Side */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white border-4 border-gray-900 rounded-3xl p-8 sticky top-24 min-h-[400px] flex flex-col">
              <h3 className="text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-gray-900 mb-4">
                {t('stack.your_stack')}
              </h3>
              
              {/* Stack Items */}
              <div className="flex-grow overflow-y-auto max-h-[300px] mb-4">
                {stackItems.length > 0 ? (
                  <div className="space-y-3">
                    {stackItems.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                        {/* Product Image */}
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          {item.image || (item.images && item.images.length > 0) ? (
                            <img 
                              src={item.image || item.images[0]} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-500">Dhs. {parseFloat(item.price).toFixed(2)}</p>
                        </div>
                        
                        {/* Remove Button */}
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
              
              {/* Total Section */}
              <div className="flex justify-between items-center mb-6 pt-4 border-t-2 border-gray-200">
                <span className="text-gray-900 font-semibold text-lg lg:text-lg xl:text-xl 2xl:text-2xl">
                  {t('stack.total')}
                </span>
                <span className="text-red-500 font-bold text-xl lg:text-xl xl:text-2xl 2xl:text-3xl">
                  Dhs. {stackTotal.toFixed(2)}
                </span>
              </div>
              
              {/* Add to Cart Button */}
              <button
                onClick={handleAddStackToCart}
                disabled={stackItems.length === 0}
                className={`w-full py-4 px-6 rounded-full font-bold text-base lg:text-base xl:text-lg 2xl:text-xl transition-all ${
                  stackItems.length > 0
                    ? 'bg-black text-white hover:bg-gray-800 hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('stack.add_to_cart')}
              </button>
            </div>
          </div>

          {/* Products Grid - Right Side */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-gray-500 mt-4">{t('products.loading')}</p>
              </div>
            ) : stackProducts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {stackProducts.map((product) => (
                    <div key={product.id} className="relative bg-white rounded-xl overflow-hidden shadow-sm">
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        {product.onSale && product.regularPrice && product.salePrice && (
                          <span className="bg-red-500 text-white text-xs lg:text-xs xl:text-sm 2xl:text-sm font-bold px-4 py-1.5 rounded-full">
                            Save {Math.round(((parseFloat(product.regularPrice) - parseFloat(product.salePrice)) / parseFloat(product.regularPrice)) * 100)}%
                          </span>
                        )}
                        {product.stockStatus !== 'instock' && (
                          <span className="bg-gray-400 text-white text-xs lg:text-xs xl:text-sm 2xl:text-sm font-bold px-4 py-1.5 rounded-full">
                            {t('stack.sold_out')}
                          </span>
                        )}
                      </div>

                      {/* Product Image */}
                      <div className="relative bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0] || '/placeholder.jpg'} 
                            alt={language === 'ar' && (product as any).arabic_name ? (product as any).arabic_name : product.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="bg-gray-50 p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-gray-500 text-xs lg:text-xs xl:text-sm 2xl:text-sm mb-1 uppercase tracking-wide">
                              Peptive
                            </p>
                            <h3 className="text-gray-900 text-base lg:text-base xl:text-lg 2xl:text-xl font-medium">{language === 'ar' && (product as any).arabic_name ? (product as any).arabic_name : product.name}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-red-500 font-semibold text-base lg:text-base xl:text-lg 2xl:text-xl">
                              Dhs. {parseFloat(product.price).toFixed(2)}
                            </p>
                            {product.onSale && product.regularPrice && parseFloat(product.regularPrice) > parseFloat(product.price) && (
                              <p className="text-gray-400 text-sm lg:text-sm xl:text-base 2xl:text-lg line-through">
                                Dhs. {parseFloat(product.regularPrice).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Add to Stack or Sold Out Button */}
                        {product.stockStatus === 'instock' ? (
                          <button 
                            onClick={() => addToStack(product)}
                            className="w-full bg-gray-900 text-white font-semibold py-3 text-base lg:text-base xl:text-base 2xl:text-lg rounded-full hover:bg-gray-800 transition-colors"
                          >
                            {t('stack.add_button')}
                          </button>
                        ) : (
                          <button 
                            className="w-full bg-gray-600 text-white font-semibold py-3 text-base lg:text-base xl:text-base 2xl:text-lg rounded-full cursor-not-allowed" 
                            disabled
                          >
                            {t('stack.sold_out')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Results Count */}
                <div className="mt-12 text-center text-gray-600">
                  {t('products.showing')} {stackProducts.length} {stackProducts.length === 1 ? t('products.product') : t('products.products')}
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
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {t('products.no_products_title')}
                </h3>
                <p className="text-gray-500">
                  {t('products.no_products_message')}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
