"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/types';
import { wordpress } from '@/lib/wordpress';
import { useLanguage } from '@/contexts/LanguageContext';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';
import ProductCard from '@/components/products/ProductCard';

export default function HomePage() {
  const { t, language } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
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

  return (
    <div>
      {/* Static Hero Section */}
      <section className="relative w-full max-w-[1600px] mx-auto bg-[#fffdf8] overflow-hidden min-h-0 md:min-h-[600px] flex flex-col md:flex-row items-center md:py-32 pt-0 pb-10 md:pb-20">
        
        {/* Mobile Background Image & Gradient */}
        <div className="absolute top-0 left-0 right-0 h-[480px] md:hidden z-0">
           <Image src="/Hero-Products.png" alt="Maxa Human Peptides" fill className="object-cover object-top opacity-90 mix-blend-multiply" priority sizes="100vw" />
           {/* Gradient Overlay to fade into background */}
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fffdf8]/70 to-[#fffdf8]"></div>
        </div>

        {/* Split Screen Image (Desktop) */}
        <div className={`absolute top-0 bottom-0 w-[50%] hidden md:block ${language === 'ar' ? 'left-0' : 'right-0'}`}>
           <Image 
             src="/Hero-Products.png" 
             alt="Maxa Human Peptides" 
             fill 
             className={`object-cover ${language === 'ar' ? 'object-right' : 'object-left'}`}
             priority 
             sizes="50vw" 
           />
        </div>

        <div className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 max-w-[1400px] mx-auto w-full flex flex-col md:flex-row relative z-20 pt-[270px] md:pt-0">
          
          {/* Left Content */}
          <div className={`w-full md:w-[48%] flex flex-col items-center md:items-start text-center ${language === 'ar' ? 'md:text-right md:ml-auto' : 'md:text-left'}`}>
            <h1 className={`text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#09031c] mb-6 md:mb-4 tracking-tight order-1 ${language === 'ar' ? 'leading-[1.7]' : 'leading-[1.1]'}`}>
              {t('hero_static.title_1')}<br />{t('hero_static.title_2')}
            </h1>
            
            {/* Main CTA */}
            <Link href="/collections/all/products" className="w-full sm:w-auto order-2 md:order-8 mb-6 md:mb-0 md:mt-8">
              <button className="bg-[#0a0521] text-white px-8 py-4 rounded-full text-[15px] md:text-base font-medium md:font-bold tracking-wide transition-all hover:bg-black w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                {t('hero_static.discover')}
              </button>
            </Link>

            <p className="text-gray-600 text-[13px] sm:text-sm md:text-base lg:text-lg mb-4 md:mb-6 leading-relaxed max-w-lg font-medium order-3 md:order-2 inline-block">
              <span className="text-base md:text-xl mx-1.5 align-middle">🇺🇸</span>
              {t('hero_static.subtitle')}
            </p>
            
            {/* Avatars */}
            <div className="flex items-center gap-2.5 md:gap-3 mb-6 md:mb-8 order-4 md:order-3">
              <div className="flex -space-x-3">
                 <div className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-blue-500 overflow-hidden shadow-sm"><svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
                 <div className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-indigo-500 overflow-hidden shadow-sm"><svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
                 <div className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-purple-500 overflow-hidden shadow-sm"><svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
              </div>
              <span className="text-[13px] md:text-sm font-medium text-gray-700">{t('hero_static.co_developed')}</span>
            </div>

            {/* Features & Shipping */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-10 text-[13px] sm:text-sm text-gray-500 mb-6 md:mb-8 font-medium order-5 md:order-4 items-start w-full">
              {/* Column 1: Always visible on mobile (Checkout + Shipping) */}
              <div className="flex flex-col gap-2 md:gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  {t('hero_static.features.f5')}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">🇦🇪</span>
                  {t('hero_static.features.ship_uae')}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">🇸🇦</span>
                  {t('hero_static.features.ship_ksa')}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none tracking-tighter">🇶🇦 🇰🇼 🇧🇭</span>
                  {t('hero_static.features.ship_others')}
                </div>
              </div>

              {/* Column 2: Hidden on mobile (Other features) */}
              <div className="hidden md:flex flex-col gap-2 md:gap-3 w-full md:w-auto">
                {[1, 2, 3, 4, 7].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {t(`hero_static.features.f${i}`)}
                  </div>
                ))}
              </div>
            </div>

            {/* Pill */}
            <div className="bg-[#eef2fa] rounded-full px-5 py-2 md:py-2.5 flex items-center justify-center gap-2 mb-6 md:mb-8 border border-blue-100 shadow-sm order-6 md:order-5">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shrink-0"></span>
              <span className="font-bold text-[#11112b] text-[13px] md:text-sm">{t('hero_static.packages_delivered')}</span>
            </div>

            {/* WhatsApp Box */}
            <div className={`bg-white rounded-xl shadow-[0_2px_15px_rgb(0,0,0,0.04)] p-3 sm:py-2 sm:px-3 sm:pr-4 sm:pl-3 flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-4 mb-6 md:mb-8 border border-gray-100 w-full max-w-[550px] order-7 md:order-6 ${language === 'ar' ? 'border-r-[5px] border-r-[#25D366]' : 'border-l-[5px] border-l-[#25D366]'}`}>
              {/* Icon and Text row for mobile */}
              <div className="flex flex-row items-center justify-center sm:justify-start gap-3 sm:gap-4 w-full sm:w-auto flex-1">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#25D366] rounded-full flex items-center justify-center text-white shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                </div>
                <div className={`flex-1 text-left ${language === 'ar' ? 'text-right' : ''}`}>
                   <p className="font-bold text-[#09031c] text-[16px] sm:text-[16px] md:text-[16px] tracking-tight mb-0.5 leading-tight">{t('hero_static.need_guidance')}</p>
                   <p className="text-[11.5px] sm:text-[13px] text-gray-500 leading-tight">{t('hero_static.chat_directly')}</p>
                </div>
              </div>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('hero_static.whatsapp_message'))}`} target="_blank" rel="noopener noreferrer" className="bg-[#0a0521] text-white px-6 py-2.5 rounded-full text-[13px] sm:text-sm font-medium hover:bg-black transition-colors shrink-0 whitespace-nowrap w-full sm:w-auto text-center mt-1 sm:mt-0">
                {t('hero_static.ask_whatsapp')}
              </a>
            </div>

            {/* Footer text */}
            <div className={`mt-2 md:mt-8 flex flex-col items-center md:items-start order-8 md:order-9`}>
               <p className="text-[13px] md:text-sm text-gray-500 font-medium">{t('hero_static.footer_real')}</p>
               <p className="mt-2 text-[11px] md:text-xs text-gray-400 flex items-center justify-center md:justify-start gap-1.5">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
                  {t('hero_static.footer_research')}
               </p>
            </div>
          </div>

        </div>
      </section>

    {/* Brand Statement Section */}
      <section className="max-w-[1600px] mx-auto py-12 bg-white">
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
      <section className="max-w-[1600px] mx-auto py-8 bg-white">
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
        <div className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48">
          <div id="trending-carousel" className="overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-6">
            <div className="grid grid-flow-col auto-cols-[85%] sm:auto-cols-[calc((100%-1.5rem)/2)] lg:auto-cols-[calc((100%-3rem)/3)] xl:auto-cols-[calc((100%-4.5rem)/4)] gap-6">
            {trendingProducts.length > 0 ? (
              trendingProducts.map((product) => (
                <div key={product.id} className="w-full h-full snap-start">
                  <ProductCard product={product} />
                </div>
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
        </div>
      </section>

      

{/* Why Peptive Peptides Section */}
      <section className="max-w-[1600px] mx-auto py-16 bg-white">
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
      <section className="max-w-[1600px] mx-auto pt-6 pb-8 bg-white">
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
