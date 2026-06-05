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

  if (dismissed || !visible) return null;

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
    <div className="fixed bottom-4 right-4 z-40 w-[440px] max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Close"
        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-white shadow"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-center gap-3">
        <img
          src={product.image || '/placeholder.jpg'}
          alt={name}
          className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-100 object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-xs font-medium text-gray-900">{name}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm font-semibold text-red-500">
              {formatPrice(product.price)}
            </span>
            {onSale && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.regularPrice)}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex-shrink-0 rounded-full bg-gray-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-gray-800"
        >
          {t('product_detail.add_to_cart')}
        </button>
      </div>
    </div>
  );
}
