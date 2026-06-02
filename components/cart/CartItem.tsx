'use client';

import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { CartItem as CartItemType } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem } = useCartStore();
  const { language, t } = useLanguage();
  const cartItemId = item.cartItemId || `${item.id}`;
  
  // Use Arabic name if available and in Arabic mode
  const displayName = language === 'ar' && item.arabicName ? item.arabicName : item.name;
  
  // Get localized bundle label
  const getLocalizedBundleLabel = (bundleType?: string) => {
    if (!bundleType) return null;
    switch (bundleType) {
      case 'one-month':
        return t('bundle.one_month');
      case 'three-months':
        return t('bundle.three_months');
      case 'six-months':
        return t('bundle.six_months');
      default:
        return item.bundleLabel;
    }
  };
  
  const displayBundleLabel = getLocalizedBundleLabel(item.bundleType);

  return (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
      {/* Product Image */}
      <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-normal text-gray-900 mb-1">
          {displayName}
          {displayBundleLabel && (
            <span className="ml-1 text-[10px] text-pink-600 font-medium">({displayBundleLabel})</span>
          )}
        </h3>
        <p className="text-sm font-normal text-gray-900">{formatPrice(item.price)}</p>
      </div>

      {/* Remove & Price */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeItem(cartItemId)}
          className="text-xs font-normal text-red-600 hover:text-red-700 hover:underline transition-all"
          aria-label="Remove item"
        >
          {t('cart.remove')}
        </button>
        <p className="text-sm font-normal text-gray-900">
          {formatPrice(parseFloat(item.price))}
        </p>
      </div>
    </div>
  );
}
