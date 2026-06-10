'use client';

import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  // Get localized product name
  const productName = language === 'ar' && (product as any).arabic_name
    ? (product as any).arabic_name
    : product.name;

  // Calculate discount percentage if on sale
  const discountPercent = product.onSale && product.regularPrice && product.salePrice
    ? Math.round(((parseFloat(product.regularPrice) - parseFloat(product.salePrice)) / parseFloat(product.regularPrice)) * 100)
    : 0;

  const inStock = product.stockStatus === 'instock';

  // Quick add: stop the click from bubbling up to the card navigation,
  // add the product at its base bundle, and pop the cart sidebar open.
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.salePrice || product.price,
      image: (product as any).imageThumbnails?.[0] || product.images?.[0] || product.image,
      bundleType: 'one-month',
      bundleLabel: t('bundle.one_month'),
      arabicName: (product as any).arabic_name || '',
    });
    openCart();
  };

  // Card-level click → product page, unless the click landed on a button
  // (so the quick-add buttons keep their own behaviour).
  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button')) {
      router.push(`/products/${product.slug}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-gray-50 rounded-xl overflow-hidden shadow-sm group block cursor-pointer"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        {product.onSale && discountPercent > 0 && (
          <span className="bg-red-500 text-white text-xs lg:text-sm xl:text-sm font-bold px-4 py-1.5 rounded-full">
            Save {discountPercent}%
          </span>
        )}
        {!inStock && (
          <span className="bg-gray-300 text-gray-700 text-xs lg:text-sm xl:text-sm font-bold px-4 py-1.5 rounded-full">
            Sold Out
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <>
            {/* First Image */}
            <img
              src={product.images[0] || '/placeholder.jpg'}
              alt={productName}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:translate-x-full"
            />
            {/* Second Image - slides in from left */}
            <img
              src={product.images[1] || product.images[0] || '/placeholder.jpg'}
              alt={productName}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out -translate-x-full group-hover:translate-x-0"
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}

        {/* Desktop: Add to Cart pill that slides up on hover */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 p-3 z-20 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`w-full py-3 rounded-full font-semibold text-white transition-colors ${
              inStock ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            {inStock ? t('product_detail.add_to_cart') : t('stack.sold_out')}
          </button>
        </div>

        {/* Mobile: persistent circular "+" button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          aria-label={t('product_detail.add_to_cart')}
          className={`md:hidden absolute bottom-3 right-3 w-11 h-11 rounded-full flex items-center justify-center shadow-lg z-20 text-white ${
            inStock ? 'bg-gray-900' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      {/* Product Info — name above, price below, on every viewport */}
      <div className="bg-gray-50 p-5">
        <div className="flex flex-col gap-2">
          <div className="min-w-0">
            <p className="text-gray-500 text-[10px] lg:text-xs xl:text-xs mb-1 uppercase tracking-wide">
              Peptive
            </p>
            <h3 className="text-gray-900 text-base lg:text-lg xl:text-xl font-medium break-words">
              {productName}
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-red-500 font-semibold text-sm lg:text-base xl:text-base whitespace-nowrap">
              Dhs. {parseFloat(product.price).toFixed(2)}
            </p>
            {product.onSale && product.regularPrice && parseFloat(product.regularPrice) > parseFloat(product.price) && (
              <p className="relative inline-block text-gray-400 text-xs lg:text-sm xl:text-sm whitespace-nowrap">
                Dhs. {parseFloat(product.regularPrice).toFixed(2)}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-red-500 -rotate-6"
                />
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
