'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { authAPI } from '@/lib/auth';
import { wordpress } from '@/lib/wordpress';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import CountrySelector from '@/components/CountrySelector';
import MobileLanguageToggle from '@/components/MobileLanguageToggle';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user is logged in
    setIsLoggedIn(authAPI.isLoggedIn());
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navigation = [
    { name: t('header.home'), href: '/' },
    { name: t('header.all_peptides'), href: '/products' },
    { name: t('header.oral_peptides'), href: '/oral-peptides' },
    // { name: t('stack.title'), href: '/stack' },
    { name: t('header.dosage_calculator'), href: '/pages/dosage-calculator' },
    { name: t('header.peptive_ai'), href: 'https://ai.peptivepeptides.com/' },
  ];

  return (
    <header className="bg-white sticky top-0 z-40">
      <nav className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48">
        <div className="flex justify-between items-center h-32">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.avif"
              alt="Peptive Logo"
              width={64}
              height={64}
              className="w-16 h-16 rounded-xl"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-3 text-gray-900 text-sm lg:text-sm xl:text-base 2xl:text-lg font-medium rounded-full overflow-hidden group transition-colors">
                <span className="absolute inset-0 bg-black origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-full"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-400">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Cart & Mobile Menu Button */}
          <div className="flex items-center space-x-1">
            {/* Mobile Language Toggle - Mobile Only */}
            <div className="md:hidden mr-2">
              <MobileLanguageToggle />
            </div>
            
            {/* User Icon - Desktop Only */}
            <Link 
              href={isLoggedIn ? '/account' : '/login'}
              className="hidden md:block p-1 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:animate-wiggle" 
              aria-label="User account"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-1 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:animate-wiggle"
              aria-label="Shopping cart"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1 text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <>
          {/* Drawer */}
          <div 
            className={`fixed right-0 top-0 h-full w-full sm:w-[90%] bg-white shadow-2xl z-60 flex flex-col transition-all duration-500 ease-in-out rounded-l-[2rem] md:hidden ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900">{t('header.menu') || 'Menu'}</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-900 hover:text-gray-600 transition-colors p-1"
                aria-label="Close menu"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-900 hover:text-gray-600 transition-colors font-medium text-lg py-3 border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* User Account Link */}
                <Link
                  href={isLoggedIn ? '/account' : '/login'}
                  className="text-gray-900 hover:text-gray-600 transition-colors font-medium text-lg py-3 border-b border-gray-100 flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {isLoggedIn ? (t('header.account') || 'Account') : t('header.login')}
                </Link>
              </div>

              {/* Country Selector in Mobile Menu */}
              <div className="mt-8 pt-8 border-t border-gray-200 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">{t('header.country') || 'Country'}</h3>
                  <CountrySelector />
                </div>
              </div>
            </div>
          </div>
        </>
      </nav>
    </header>
  );
}
