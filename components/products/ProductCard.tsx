'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language } = useLanguage();
  
  // Get localized product name
  const productName = language === 'ar' && (product as any).arabic_name 
    ? (product as any).arabic_name 
    : product.name;
  
  // Calculate discount percentage if on sale
  const discountPercent = product.onSale && product.regularPrice && product.salePrice
    ? Math.round(((parseFloat(product.regularPrice) - parseFloat(product.salePrice)) / parseFloat(product.regularPrice)) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="relative bg-gray-50 rounded-xl overflow-hidden shadow-sm group block">
      {/* Badges */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        {product.onSale && discountPercent > 0 && (
          <span className="bg-red-500 text-white text-xs lg:text-sm xl:text-sm font-bold px-4 py-1.5 rounded-full">
            Save {discountPercent}%
          </span>
        )}
        {product.stockStatus !== 'instock' && (
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
      </div>

      {/* Product Info */}
      <div className="bg-gray-50 p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <p className="text-gray-500 text-xs lg:text-sm xl:text-sm mb-1 uppercase tracking-wide">
              Peptive
            </p>
            <h3 className="text-gray-900 text-base lg:text-lg xl:text-xl font-medium">{productName}</h3>
          </div>
          <div className="text-right ml-3">
            <p className="text-red-500 font-semibold text-base lg:text-lg xl:text-xl whitespace-nowrap">
              Dhs. {parseFloat(product.price).toFixed(2)}
            </p>
            {product.onSale && product.regularPrice && parseFloat(product.regularPrice) > parseFloat(product.price) && (
              <p className="text-gray-400 text-sm lg:text-base xl:text-lg line-through whitespace-nowrap">
                Dhs. {parseFloat(product.regularPrice).toFixed(2)}
              </p>
            )}
          </div>
        </div>
        
        {/* View Details Button */}
        {/* <Link 
          href={`/products/${product.slug}`}
          className={`block w-full text-center py-3 rounded-full font-semibold transition-colors ${
            product.stockStatus === 'instock'
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-600 text-white cursor-not-allowed'
          }`}
        >
          {product.stockStatus === 'instock' ? 'View Details' : 'Sold Out'}
        </Link> */}
      </div>
    </Link>
  );
}
