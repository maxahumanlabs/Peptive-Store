"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/types';
import { wordpress } from '@/lib/wordpress';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
  const { t, language } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [stackProducts, setStackProducts] = useState<Product[]>([]);
  const [stackItems, setStackItems] = useState<Product[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Load stack from localStorage
    const savedStack = localStorage.getItem('peptive-stack');
    if (savedStack) {
      try {
        setStackItems(JSON.parse(savedStack));
      } catch (error) {
        console.error('Error loading stack:', error);
      }
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch products on client side to avoid build errors
    async function loadProducts() {
      try {
        const { woocommerce } = await import('@/lib/woocommerce');
        const products = await woocommerce.getFeaturedProducts(4);
        setFeaturedProducts(products);
        
        // Fetch trending products from "trending" category
        const trending = await woocommerce.getProducts({ category: 'trending', perPage: 10 });
        setTrendingProducts(trending);
        
        // Fetch stack products from "stack" category - only first 3
        const stack = await woocommerce.getProducts({ category: 'stack', perPage: 3 });
        setStackProducts(stack);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    loadProducts();
  }, []);

  const faqs = [
    {
      question: t('faqs.questions.0.question'),
      answer: t('faqs.questions.0.answer')
    },
    {
      question: t('faqs.questions.1.question'),
      answer: t('faqs.questions.1.answer')
    },
    {
      question: t('faqs.questions.2.question'),
      answer: t('faqs.questions.2.answer')
    },
    {
      question: t('faqs.questions.3.question'),
      answer: t('faqs.questions.3.answer')
    },
    {
      question: t('faqs.questions.4.question'),
      answer: t('faqs.questions.4.answer')
    },
    {
      question: t('faqs.questions.5.question'),
      answer: t('faqs.questions.5.answer')
    },
    {
      question: t('faqs.questions.6.question'),
      answer: t('faqs.questions.6.answer')
    },
    {
      question: t('faqs.questions.7.question'),
      answer: t('faqs.questions.7.answer')
    },
    {
      question: t('faqs.questions.8.question'),
      answer: t('faqs.questions.8.answer')
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Add product to stack
  const addToStack = (product: Product) => {
    const updatedStack = [...stackItems, product];
    setStackItems(updatedStack);
    localStorage.setItem('peptive-stack', JSON.stringify(updatedStack));
  };

  // Remove product from stack
  const removeFromStack = (productId: number) => {
    const updatedStack = stackItems.filter(item => item.id !== productId);
    setStackItems(updatedStack);
    localStorage.setItem('peptive-stack', JSON.stringify(updatedStack));
  };

  // Calculate stack total
  const getStackTotal = () => {
    return stackItems.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  // Add all stack items to cart
  const addStackToCart = async () => {
    if (stackItems.length === 0) return;
    
    try {
      const { useCartStore } = await import('@/store/cartStore');
      const addItem = useCartStore.getState().addItem;
      
      stackItems.forEach(product => {
        addItem({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.image,
        });
      });
      
      // Clear stack after adding to cart
      setStackItems([]);
      localStorage.removeItem('peptive-stack');
      
      // Show success message or toggle cart
      const toggleCart = useCartStore.getState().toggleCart;
      toggleCart();
    } catch (error) {
      console.error('Error adding stack to cart:', error);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 pb-0">
        <div className="relative  text-white overflow-hidden rounded-3xl">
          {/* Background Image with Parallax Effect */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: "url('/banner.png')",
              transform: `translateX(${scrollY * 0.15}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/75" />
          
          {/* Content */}
          <div className="relative px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-32 pb-12 md:pb-16 pt-12 md:pt-52">
            <div className="max-w-2xl pb-4">
              <p className="text-yellow-500 text-xs md:text-xs lg:text-xs xl:text-sm 2xl:text-sm font-medium tracking-[0.25em] mb-2 uppercase">
                {t('hero.tagline')}
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4 leading-[1.15]">
                {t('hero.title')}
              </h1>
              <p className="text-gray-200 text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl mb-8 leading-relaxed max-w-lg">
                {t('hero.description')}
              </p>
              <Link href="/products">
                <button className="relative inline-flex items-center bg-white text-gray-900 px-12 py-3.5 text-sm lg:text-sm xl:text-base 2xl:text-lg font-semibold rounded-full overflow-hidden group transition-colors">
                  {/* Liquid fill animation background */}
                  <span className="absolute inset-0 bg-black origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-full"></span>
                  
                  {/* Button content */}
                  <span className="relative z-10 group-hover:text-white transition-colors duration-400">{t('hero.cta')}</span>
                  <svg className="relative z-10 w-4 h-4 ml-2 group-hover:stroke-white transition-colors duration-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    {/* Brand Statement Section */}
      <section className="py-12 bg-white">
        <div className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold text-gray-900 inline-flex items-center justify-center flex-wrap gap-x-3">
            <span>{t('brand.research')}</span>
            <span className="inline-flex items-center justify-center w-14 h-14 lg:w-24 xl:w-24 2xl:w-24 lg:h-24 xl:h-24 2xl:h-24">
              <Image
                src="/logo.avif"
                alt="Peptive Logo"
                width={80}
                height={80}
                className="w-full h-full rounded-lg object-cover"
              />
            </span>
            <span>{t('brand.starts_with')}</span>
            <span className="relative inline-block">
              {t('brand.peptive')}
              <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-500 to-transparent w-full animate-underline-slide"></span>
            </span>
          </h2>
        </div>
      </section>
    
    
      {/* Trending Research Section */}
      <section className="py-8 bg-white">
        <div className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-7xl text-gray-900">
              {t('trending.title')}
            </h2>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  const container = document.querySelector('#trending-carousel');
                  if (container) container.scrollBy({ left: -400, behavior: 'smooth' });
                }}
                className="relative w-14 h-14 rounded-full bg-white border-2 border-gray-900 flex items-center justify-center overflow-hidden group transition-colors"
                aria-label="Previous"
              >
                {/* Liquid fill animation background */}
                <span className="absolute inset-0 bg-gray-900 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-full"></span>
                
                <svg className="relative z-10 w-6 h-6 text-gray-900 group-hover:text-white transition-colors duration-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => {
                  const container = document.querySelector('#trending-carousel');
                  if (container) container.scrollBy({ left: 400, behavior: 'smooth' });
                }}
                className="relative w-14 h-14 rounded-full bg-white border-2 border-gray-900 flex items-center justify-center overflow-hidden group transition-colors"
                aria-label="Next"
              >
                {/* Liquid fill animation background */}
                <span className="absolute inset-0 bg-gray-900 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-full"></span>
                
                <svg className="relative z-10 w-6 h-6 text-gray-900 group-hover:text-white transition-colors duration-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Product Carousel - Full Width */}
        <div id="trending-carousel" className="overflow-x-auto scrollbar-hide scroll-smooth">
          <div className="flex gap-6 px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 pb-6">
            {trendingProducts.length > 0 ? (
              trendingProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="flex-none w-64 md:w-72 lg:w-80 xl:w-[340px] 2xl:w-[360px]">
                  <div className="relative bg-gray-50 rounded-xl overflow-hidden shadow-sm group h-full">
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {product.onSale && product.regularPrice && product.salePrice && (
                        <span className="bg-red-500 text-white text-xs lg:text-xs xl:text-sm 2xl:text-sm font-bold px-4 py-1.5 rounded-full">
                          Save {Math.round(((parseFloat(product.regularPrice) - parseFloat(product.salePrice)) / parseFloat(product.regularPrice)) * 100)}%
                        </span>
                      )}
                      {product.stockStatus !== 'instock' && (
                        <span className="bg-gray-300 text-gray-700 text-xs lg:text-xs xl:text-sm 2xl:text-sm font-bold px-4 py-1.5 rounded-full">
                          Sold Out
                        </span>
                      )}
                    </div>

                    {/* Product Image with slide transition */}
                    <div className="relative bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <>
                          {/* First Image */}
                          <img 
                            src={product.images[0] || '/placeholder.jpg'} 
                            alt={product.name} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:-translate-x-full" 
                          />
                          {/* Second Image - slides in from right */}
                          <img 
                            src={product.images[1] || product.images[0] || '/placeholder.jpg'} 
                            alt={product.name} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out translate-x-full group-hover:translate-x-0" 
                          />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="bg-gray-50 p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-gray-500 text-xs lg:text-xs xl:text-sm 2xl:text-sm mb-1 uppercase tracking-wide">
                            Peptive
                          </p>
                          <h3 className="text-gray-900 text-base lg:text-base xl:text-lg 2xl:text-xl font-medium">{language === 'ar' && (product as any).arabic_name ? (product as any).arabic_name : product.name}</h3>
                        </div>
                        <div className="text-right ml-3">
                          <p className="text-red-500 font-semibold text-base lg:text-base xl:text-lg 2xl:text-xl whitespace-nowrap">
                            Dhs. {parseFloat(product.price).toFixed(2)}
                          </p>
                          {product.onSale && product.regularPrice && parseFloat(product.regularPrice) > parseFloat(product.price) && (
                            <p className="text-gray-400 text-sm lg:text-sm xl:text-base 2xl:text-lg line-through whitespace-nowrap">
                              Dhs. {parseFloat(product.regularPrice).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-none w-80">
                <div className="bg-gray-100 rounded-3xl p-8 text-center">
                  <p className="text-gray-500 lg:text-sm xl:text-base 2xl:text-lg">No trending products available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      

      {/* Build Your Stack Section */}
      <section className="py-16 bg-white">
        <div className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-7xl font-bold text-gray-900 mb-4">
              {t('stack.title')}
            </h2>
            <p className="text-gray-600 text-base lg:text-base xl:text-lg 2xl:text-xl max-w-2xl">
              {t('stack.description')}
            </p>
          </div>

          {/* Stack Builder Grid */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Stack Cards Container */}
            <div className="lg:col-span-3 grid md:grid-cols-3 gap-6">
              {stackProducts.length > 0 ? (
                stackProducts.map((product) => (
                  <div key={product.id} className="relative bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {product.onSale && product.regularPrice && product.salePrice && (
                        <span className="bg-red-500 text-white text-xs lg:text-xs xl:text-sm 2xl:text-sm font-bold px-4 py-1.5 rounded-full">
                          Save {Math.round(((parseFloat(product.regularPrice) - parseFloat(product.salePrice)) / parseFloat(product.regularPrice)) * 100)}%
                        </span>
                      )}
                      {product.stockStatus !== 'instock' && (
                        <span className="bg-gray-400 text-white text-xs lg:text-xs xl:text-sm 2xl:text-sm font-bold px-4 py-1.5 rounded-full">
                          Sold Out
                        </span>
                      )}
                    </div>

                    {/* Product Image */}
                    <div className="relative bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0] || '/placeholder.jpg'} 
                          alt={product.name} 
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
                ))
              ) : (
                // Show placeholder cards while loading
                [1, 2, 3].map((i) => (
                  <div key={i} className="relative bg-white rounded-3xl overflow-hidden shadow-sm">
                    <div className="relative bg-gray-100 aspect-square animate-pulse" />
                    <div className="bg-gray-50 p-5">
                      <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                      <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse" />
                      <div className="h-12 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Your Stack Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border-4 border-gray-900 rounded-3xl p-8 sticky top-24 min-h-[400px] flex flex-col">
                <h3 className="text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-gray-900 mb-4">{t('stack.your_stack')}</h3>
                
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
                  <span className="text-gray-900 font-semibold text-lg lg:text-lg xl:text-xl 2xl:text-2xl">{t('stack.total')}</span>
                  <span className="text-gray-900 font-bold text-lg lg:text-lg xl:text-xl 2xl:text-2xl">
                    Dhs. {getStackTotal().toFixed(2)}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={addStackToCart}
                  className={`w-full font-semibold py-4 text-base lg:text-base xl:text-base 2xl:text-lg rounded-full transition-colors ${
                    stackItems.length > 0
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-600 text-white cursor-not-allowed'
                  }`}
                  disabled={stackItems.length === 0}
                >
                  {t('stack.add_to_cart')} ({stackItems.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Peptive Peptides Section */}
      <section className="py-16 bg-white">
        <div className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48">
          {/* Section Title */}
          <h2 className="text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-7xl font-bold text-center text-gray-900 mb-12">
            {t('why_peptive.title')}
          </h2>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Precision-Focused Card */}
            <div className="bg-[#f6f6f6] rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center mb-4 shadow-sm">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base lg:text-lg xl:text-xl font-bold text-gray-900 mb-2">{t('why_peptive.precision.title')}</h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed font-normal">
                    {t('why_peptive.precision.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* No Middlemen Card */}
            <div className="bg-[#f6f6f6] rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center mb-4 shadow-sm">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base lg:text-lg xl:text-xl font-bold text-gray-900 mb-2">{t('why_peptive.middlemen.title')}</h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed font-normal">
                    {t('why_peptive.middlemen.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Boldly Disruptive Card */}
            <div className="bg-[#f6f6f6] rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center mb-4 shadow-sm">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base lg:text-lg xl:text-xl font-bold text-gray-900 mb-2">{t('why_peptive.disruptive.title')}</h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed font-normal">
                    {t('why_peptive.disruptive.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Marquee Section */}
          <div className="relative overflow-hidden bg-white py-8 -mx-6 sm:-mx-8 md:-mx-12 lg:-mx-12 xl:-mx-12 2xl:-mx-48">
            <div className="flex animate-marquee-fast whitespace-nowrap">
              <div className="flex items-center gap-12 px-6">
                <span className="relative inline-block text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-black text-gray-900 pb-3">
                  {t('moving_text.stimulating_peptides')}
                  <svg className="absolute -bottom-1 left-0 w-full h-2 animate-wave" viewBox="0 0 200 10" preserveAspectRatio="none">
                    <path d="M0,5 Q25,0 50,5 T100,5 T150,5 T200,5" stroke="url(#gradient)" strokeWidth="2" fill="none" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#ca8a04" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <span className="text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-black text-gray-900">{t('moving_text.research_grade_peptides')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <span className="relative inline-block text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-black text-gray-900 pb-3">
                  {t('moving_text.stimulating_peptides')}
                  <svg className="absolute -bottom-1 left-0 w-full h-2 animate-wave" viewBox="0 0 200 10" preserveAspectRatio="none">
                    <path d="M0,5 Q25,0 50,5 T100,5 T150,5 T200,5" stroke="url(#gradient)" strokeWidth="2" fill="none" />
                  </svg>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <span className="text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-black text-gray-900">{t('moving_text.research_grade_peptides')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              </div>
              <div className="flex items-center gap-12 px-6">
                <span className="relative inline-block text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-black text-gray-900 pb-3">
                  {t('moving_text.stimulating_peptides')}
                  <svg className="absolute -bottom-1 left-0 w-full h-2 animate-wave" viewBox="0 0 200 10" preserveAspectRatio="none">
                    <path d="M0,5 Q25,0 50,5 T100,5 T150,5 T200,5" stroke="url(#gradient)" strokeWidth="2" fill="none" />
                  </svg>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <span className="text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-black text-gray-900">{t('moving_text.research_grade_peptides')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <span className="relative inline-block text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-black text-gray-900 pb-3">
                  {t('moving_text.stimulating_peptides')}
                  <svg className="absolute -bottom-1 left-0 w-full h-2 animate-wave" viewBox="0 0 200 10" preserveAspectRatio="none">
                    <path d="M0,5 Q25,0 50,5 T100,5 T150,5 T200,5" stroke="url(#gradient)" strokeWidth="2" fill="none" />
                  </svg>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <span className="text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-8xl font-black text-gray-900">{t('moving_text.research_grade_peptides')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="pt-6 pb-8 bg-white">
        <div className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48">
          <div className="max-w-4xl mx-auto space-y-3">
            <h2 className="text-5xl lg:text-5xl xl:text-5xl 2xl:text-7xl font-bold text-gray-900 mb-8">
              {t('faqs.title')}
            </h2>
            
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-[#f6f6f6] rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-medium text-gray-900 text-base lg:text-base xl:text-lg 2xl:text-xl pr-6">
                    {faq.question}
                  </span>
                  <span className="flex-shrink-0 text-gray-900 text-2xl font-light">
                    {openFaqIndex === index ? '−' : '+'}
                  </span>
                </button>
                
                {openFaqIndex === index && (
                  <div className="px-5 pb-4">
                    <p className="text-gray-600 text-sm lg:text-sm xl:text-base 2xl:text-lg leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ...existing code... */}
      
      </div>
    
  );
}
