'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import axios from 'axios';

// Define the shape of the Store API product we get from the proxy
interface SearchProduct {
  id: number;
  name: string;
  slug: string;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
  };
  images: Array<{ src: string }>;
}

export default function SearchTool() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        // We hit the existing wc-store proxy to fetch products
        const res = await axios.get('/api/proxy/wc-store/products', {
          params: { search: query, per_page: 5 }
        });
        setResults(res.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Format price helper
  const formatPrice = (centsString: string) => {
    const price = parseInt(centsString) / 100;
    return `Dhs. ${price.toFixed(2)}`;
  };

  const getTranslatedName = (product: any) => {
    if (language === 'ar' && product.extensions?.['peptive-bundles']?.arabic_name) {
      return product.extensions['peptive-bundles'].arabic_name;
    }
    // Remove HTML entities from name
    return product.name.replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&#8217;/g, "'");
  };

  return (
    <>
      {/* Search Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:block p-1 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:animate-wiggle"
        aria-label="Search"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Search Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-24 bg-black/40 backdrop-blur-sm transition-opacity">
          <div 
            ref={modalRef}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden mx-4 animate-in fade-in slide-in-from-top-10 duration-300"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Search Input Area */}
            <div className="relative border-b border-gray-100 flex items-center p-4">
              <svg className={`w-6 h-6 text-gray-400 absolute ${language === 'ar' ? 'right-6' : 'left-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === 'ar' ? 'ابحث عن المنتجات...' : 'Search for products...'}
                className={`w-full bg-transparent border-none focus:ring-0 text-lg outline-none ${language === 'ar' ? 'pr-12' : 'pl-12'} text-gray-800 placeholder-gray-400`}
              />
              {isLoading && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
              )}
              {query && !isLoading && (
                <button 
                  onClick={() => setQuery('')}
                  className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} text-gray-400 hover:text-gray-600`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {!query ? (
                <div className="py-8 text-center text-gray-500">
                  {language === 'ar' ? 'ما الذي تبحث عنه؟' : 'What are you looking for?'}
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
                    {language === 'ar' ? 'المنتجات' : 'Products'}
                  </h3>
                  <div className="grid gap-2">
                    {results.map((product) => (
                      <Link 
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                      >
                        <div className="relative w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {product.images[0]?.src ? (
                            <Image 
                              src={product.images[0].src} 
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{getTranslatedName(product)}</h4>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            {product.prices.regular_price && product.prices.regular_price !== product.prices.price ? (
                              <>
                                <span className="text-xs text-black line-through">
                                  {formatPrice(product.prices.regular_price)}
                                </span>
                                <span className="text-sm font-bold text-red-600">
                                  {formatPrice(product.prices.price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-bold text-black">
                                {formatPrice(product.prices.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : !isLoading ? (
                <div className="py-8 text-center text-gray-500">
                  {language === 'ar' ? 'لم يتم العثور على نتائج.' : 'No results found.'}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
