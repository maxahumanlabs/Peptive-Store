'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';

interface FloatingAddToCartProps {
  product: Product;
}

// A quick "add this product" card that floats at the bottom-right while the
// "MORE RESULTS" section is on screen, and hides once the footer is reached.
export default function FloatingAddToCart({ product }: FloatingAddToCartProps) {
  const { t, language } = useLanguage();
  const addItem = useCartStore((state) => state.addItem);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const recs = document.getElementById('more-results');
      const footer = document.querySelector('footer');
      if (!recs) {
        setVisible(false);
        return;
      }
      const vh = window.innerHeight;
      const recsTop = recs.getBoundingClientRect().top;
      const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
      // Visible once the recommendations section enters the viewport, hidden
      // once the footer is about to appear.
      setVisible(recsTop < vh && footerTop > vh * 0.9);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  if (dismissed) return null;

  const name =
    language === 'ar' && (product as any).arabic_name
      ? (product as any).arabic_name
      : product.name;

  const onSale =
    product.onSale &&
    product.regularPrice &&
    parseFloat(product.regularPrice) > parseFloat(product.price);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      bundleType: 'one-month',
      bundleLabel: t('bundle.one_month'),
      arabicName: (product as any).arabic_name || '',
    });
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 w-[520px] max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl transition-all duration-500 ease-out ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-8 opacity-0'
      }`}
    >
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Close"
        className="absolute -top-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-white shadow"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-center gap-4">
        <img
          src={product.image || '/placeholder.jpg'}
          alt={name}
          className="h-20 w-20 flex-shrink-0 rounded-xl bg-gray-100 object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm md:text-base font-medium text-gray-900">
            {name}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-base md:text-lg font-semibold text-red-500">
              {formatPrice(product.price)}
            </span>
            {onSale && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.regularPrice)}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex-shrink-0 rounded-full bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          {t('product_detail.add_to_cart')}
        </button>
      </div>
    </div>
  );
}
