'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Product, ProductReview } from '@/types';
import { woocommerce } from '@/lib/woocommerce';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { openWhatsAppOrder } from '@/lib/whatsapp';
import RelatedProducts from '@/components/products/RelatedProducts';
import { useLanguage } from '@/contexts/LanguageContext';

type BundleOption = {
  id: string;
  months: number;
  label: string;
  price: number;
  savings?: number;
  savingsPercent?: number;
  isPopular?: boolean;
};

export default function ProductDetailPage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedBundle, setSelectedBundle] = useState('one-month');
  const [email, setEmail] = useState('');
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        const productData = await woocommerce.getProductBySlug(slug);
        setProduct(productData);
        
        // Fetch reviews for this product
        if (productData) {
          try {
            const reviewsData = await woocommerce.getProductReviews(productData.id);
            setReviews(reviewsData);
          } catch (error) {
            console.log('Reviews not available:', error);
            setReviews([]); // Set empty array if reviews fail
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    const bundle = bundleOptions.find(b => b.id === selectedBundle);
    if (!bundle) return;

    // Add the item with bundle information and correct price
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: bundle.price.toString(),
      image: product.image,
      bundleType: selectedBundle as 'one-month' | 'three-months' | 'six-months',
      bundleLabel: bundle.label,
      arabicName: (product as any).arabic_name || '',
    });
  };

  const handleNotifyMe = () => {
    if (email) {
      alert(`We'll notify you at ${email} when ${product?.name} is back in stock!`);
      setEmail('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-16 md:py-20 lg:py-20 xl:py-20 2xl:py-24">
        <div className="animate-pulse">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-12 xl:gap-12 2xl:gap-16">
            <div className="bg-gray-200 h-96 lg:h-[600px] rounded-3xl" />
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-40 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-16 md:py-20 lg:py-20 xl:py-20 2xl:py-24">
        <div className="text-center py-16">
          <h1 className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-xl text-gray-600 mb-8">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Calculate bundle options using WooCommerce prices AND custom monthly pricing
  // Use sale_price as the current price, regular_price as the original price
  const currentPrice = parseFloat(product.salePrice || product.price); // Discounted price
  const originalPrice = parseFloat(product.regularPrice || product.price); // Original price before discount
  
  // Calculate savings per item
  const savingsPerItem = originalPrice - currentPrice;
  const savingsPercentPerItem = originalPrice > 0 ? ((savingsPerItem / originalPrice) * 100) : 0;
  
  // Get bundle pricing from product data (from WordPress plugin monthly pricing)
  const bundlePricing = (product as any).bundle_pricing || {};
  
  // Helper function to check if a value is set and not empty
  const hasValue = (val: any) => val !== null && val !== undefined && val !== '' && parseFloat(val) > 0;
  
  // 3-Month pricing: Use custom prices if set, otherwise calculate
  const threeMonthRegular = hasValue(bundlePricing.three_month?.regular_price) 
    ? parseFloat(bundlePricing.three_month.regular_price) 
    : originalPrice * 3;
  const threeMonthSale = hasValue(bundlePricing.three_month?.sale_price)
    ? parseFloat(bundlePricing.three_month.sale_price)
    : (hasValue(bundlePricing.three_month?.regular_price) ? threeMonthRegular : currentPrice * 3);
  const threeMonthSavings = threeMonthRegular - threeMonthSale;
  const threeMonthSavingsPercent = threeMonthRegular > 0 ? ((threeMonthSavings / threeMonthRegular) * 100) : 0;
  
  // 6-Month pricing: Use custom prices if set, otherwise calculate
  const sixMonthRegular = hasValue(bundlePricing.six_month?.regular_price)
    ? parseFloat(bundlePricing.six_month.regular_price)
    : originalPrice * 6;
  const sixMonthSale = hasValue(bundlePricing.six_month?.sale_price)
    ? parseFloat(bundlePricing.six_month.sale_price)
    : (hasValue(bundlePricing.six_month?.regular_price) ? sixMonthRegular : currentPrice * 6);
  const sixMonthSavings = sixMonthRegular - sixMonthSale;
  const sixMonthSavingsPercent = sixMonthRegular > 0 ? ((sixMonthSavings / sixMonthRegular) * 100) : 0;
  
  const bundleOptions: BundleOption[] = [
    {
      id: 'one-month',
      months: 1,
      label: t('bundle.one_month'),
      price: currentPrice,
      savings: savingsPerItem,
      savingsPercent: Math.round(savingsPercentPerItem),
    },
    {
      id: 'three-months',
      months: 3,
      label: t('bundle.three_months'),
      price: threeMonthSale,
      savings: threeMonthSavings,
      savingsPercent: Math.round(threeMonthSavingsPercent),
      isPopular: true,
    },
    {
      id: 'six-months',
      months: 6,
      label: t('bundle.six_months'),
      price: sixMonthSale,
      savings: sixMonthSavings,
      savingsPercent: Math.round(sixMonthSavingsPercent),
    },
  ];

  // Get localized product content
  const productName = language === 'ar' && (product as any).arabic_name 
    ? (product as any).arabic_name 
    : product.name;
  
  const productDescription = language === 'ar' && (product as any).arabic_description 
    ? (product as any).arabic_description 
    : product.description;
  
  const productShortDescription = language === 'ar' && (product as any).arabic_short_description 
    ? (product as any).arabic_short_description 
    : product.shortDescription;

  const isOutOfStock = product.stockStatus === 'outofstock';

  // Toggle to show/hide the rating row (hidden to match the reference design)
  const SHOW_RATING = false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 md:px-12 lg:px-12 xl:px-12 2xl:px-48 pt-4 md:pt-6 lg:pt-6 xl:pt-6 2xl:pt-8 pb-16 md:pb-20 lg:pb-20 xl:pb-20 2xl:pb-24">
      <div className="grid lg:grid-cols-[1.35fr_1fr] gap-12 lg:gap-12 xl:gap-12 2xl:gap-16">
        {/* Left Column - Images */}
        <div className="space-y-4 lg:space-y-4 xl:space-y-4 2xl:space-y-6">
          {/* Main Image */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
            <Image
              src={product.images[selectedImage] || product.image}
              alt={productName}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3 lg:gap-3 xl:gap-3 2xl:gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-white rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index 
                      ? 'border-gray-900 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${productName} - ${index + 1}`}
                    fill
                    className="object-contain p-1"
                    sizes="150px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Details */}
        <div className="space-y-5 lg:space-y-5 xl:space-y-5 2xl:space-y-6">
          {/* Product Name & Price */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs lg:text-sm mb-1 uppercase tracking-wide">
                Peptive
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900">
                {productName}
              </h1>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </div>
              {product.onSale && (
                <div className="text-sm md:text-base lg:text-base xl:text-base text-gray-400 line-through">
                  {formatPrice(product.regularPrice)}
                </div>
              )}
            </div>
          </div>

          {/* Rating - Hardcoded (hidden via SHOW_RATING flag) */}
          {SHOW_RATING && (
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-lg">⭐</span>
              <span className="text-sm md:text-base lg:text-base xl:text-base font-semibold text-gray-900">
                4.9/5 (2869 {t('product_detail.reviews')})
              </span>
            </div>
          )}

          {/* Badges */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {((language === 'ar' && (product as any).arabic_tags) ? (product as any).arabic_tags.split(',').map((t: string) => t.trim()) : product.tags).map((tag: string, index: number) => (
                <div 
                  key={index}
                  className="inline-flex items-center justify-center rounded-[25px] px-6 py-3 border border-[rgba(120,90,20,0.4)] shadow-[inset_0_0_6px_rgba(255,255,255,0.3),0_3px_10px_rgba(0,0,0,0.25)] transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[inset_0_0_8px_rgba(255,255,255,0.4),0_6px_14px_rgba(0,0,0,0.3)] max-sm:rounded-[18px] max-sm:px-[14px] max-sm:py-2 max-md:rounded-[20px] max-md:px-4 max-md:py-[10px]"
                  style={{
                    background: 'linear-gradient(135deg, #b88900 0%, #f0c76e 20%, #fff3b0 40%, #d1a140 55%, #8c6c1a 70%, #f9d976 85%, #b88900 100%)',
                    backgroundSize: '200% 200%'
                  }}
                >
                  <span className="text-[15px] font-semibold text-black leading-[1.4] max-sm:text-[13px] max-sm:font-medium max-md:text-[14px]">
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Product Description */}

          {/* Short Description First */}
          {productShortDescription && (
            <div
              className="text-sm md:text-sm  text-gray-900 mb-2"
              dangerouslySetInnerHTML={{ __html: productShortDescription }}
            />
          )}

          {/* Full Description or Parse Contains & Instructions */}
          {productDescription && (
            (() => {
              // Check if description has Contains/Instructions structure
              const hasStructuredContent = productDescription.includes('Contains:') || productDescription.includes('Instructions:');
              
              if (hasStructuredContent) {
                // Convert block/break tags to newlines so list items stay on
                // separate lines instead of collapsing into one.
                const htmlToText = (html: string) => html
                  .replace(/<\s*br\s*\/?>/gi, '\n')
                  .replace(/<\/(p|li|div|h[1-6]|ul|ol)>/gi, '\n')
                  .replace(/<[^>]+>/g, '')
                  .replace(/&nbsp;/gi, ' ')
                  .replace(/\n{3,}/g, '\n\n')
                  .trim();

                // Intro = everything before the "Contains:" heading (rendered as
                // HTML so the bold sub-heading is preserved). Trailing unclosed
                // opening tags are stripped so nothing leaks.
                const containsIdx = productDescription.search(/Contains:/i);
                const introHtml = containsIdx > 0
                  ? productDescription.slice(0, containsIdx).replace(/(?:\s*<(?:p|strong|b|h[1-6]|span)>\s*)+$/i, '').trim()
                  : '';

                // Extract sections using regex (without 's' flag for ES compatibility)
                const containsMatch = productDescription.match(/Contains:([\s\S]*?)(Instructions:|$)/i);
                const instructionsMatch = productDescription.match(/Instructions:([\s\S]*?)(<\/p>|$)/i);
                const contains = containsMatch ? htmlToText(containsMatch[1]) : '';
                const instructions = instructionsMatch ? htmlToText(instructionsMatch[1]) : '';
                return (
                  <div className="mt-4 space-y-4">
                    {introHtml && (
                      <div
                        className="text-sm md:text-sm text-gray-800 [&_p]:mb-2 [&_strong]:font-bold [&_strong]:text-gray-900"
                        dangerouslySetInnerHTML={{ __html: introHtml }}
                      />
                    )}
                    {contains && (
                      <div>
                        <div className="font-bold text-sm md:text-sm text-gray-900 mb-1">{t('product_detail.contains')}</div>
                        <div className="text-sm md:text-sm text-gray-800 whitespace-pre-line">{contains}</div>
                      </div>
                    )}
                    {instructions && (
                      <div>
                        <div className="font-bold text-sm md:text-sm text-gray-900 mb-1">{t('product_detail.instructions')}</div>
                        <div className="text-sm md:text-sm text-gray-800 whitespace-pre-line mb-6">{instructions}</div>
                        <div className="text-sm md:text-sm italic text-gray-800 whitespace-pre-line">{t('product_detail.research_use')}</div>
                      </div>
                    )}
                  </div>
                );
              } else {
                // Just show the full description if no structured content
                return (
                  <div
                    className="text-sm md:text-sm text-gray-800 mt-4"
                    dangerouslySetInnerHTML={{ __html: productDescription }}
                  />
                );
              }
            })()
          )}

          {/* Stock Status */}
          {isOutOfStock ? (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-xs md:text-sm lg:text-sm xl:text-sm font-semibold text-red-600">
                {t('product_detail.out_of_stock')}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#f7fee7]">
              <span className="w-3 h-3 mr-2 rounded-full bg-[#4d7c0f] border-2 border-[#487012] shadow-inner"></span>
              <span className="text-[#4d7c0f] font-medium text-sm md:text-base">{t('product_detail.in_stock')}</span>
            </div>
          )}

          {/* Order on WhatsApp - primary CTA */}
          <button
            onClick={() => {
              const bundle = bundleOptions.find(b => b.id === selectedBundle);
              if (!product || !bundle) return;
              openWhatsAppOrder(
                [
                  {
                    name: product.name,
                    arabicName: (product as any).arabic_name || '',
                    price: bundle.price,
                    quantity: 1,
                    bundleLabel: bundle.label,
                  },
                ],
                language
              );
            }}
            disabled={isOutOfStock}
            className="w-full flex items-center justify-center gap-2 bg-black text-white text-sm md:text-base font-semibold py-4 lg:py-4 xl:py-4 2xl:py-5 px-6 rounded-full hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('product_detail.order_whatsapp')}
          </button>

          {/* Bundle Options */}
          <div className="pt-4">
            <div className="relative text-center mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative inline-block bg-gray-50 px-4">
                <h3 className="text-sm md:text-base lg:text-base xl:text-base font-bold text-gray-900 tracking-wider">
                  {t('product_detail.bundle_save')}
                </h3>
              </div>
            </div>
            <div className="space-y-2 lg:space-y-2 xl:space-y-2 2xl:space-y-3">
              {bundleOptions.map((bundle) => (
                <label
                  key={bundle.id}
                  className={`relative flex items-center p-3 lg:p-3 xl:p-3 2xl:p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedBundle === bundle.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="bundle"
                    value={bundle.id}
                    checked={selectedBundle === bundle.id}
                    onChange={(e) => setSelectedBundle(e.target.value)}
                    className="w-4 h-4 text-gray-900 focus:ring-gray-900 flex-shrink-0"
                  />
                  <div className="flex-1 ml-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-sm md:text-base lg:text-base xl:text-base font-bold text-gray-900">
                          {bundle.label}
                        </div>
                        {bundle.savings && bundle.savings > 0 ? (
                          <div className="text-xs md:text-xs lg:text-xs xl:text-xs text-[#4d7c0f] font-medium">
                            {t('product_detail.you_save')} {formatPrice(bundle.savings)} ({bundle.savingsPercent}%)
                          </div>
                        ) : (
                          <div className="text-xs md:text-xs lg:text-xs xl:text-xs text-gray-500">
                            {t('product_detail.standard_price')}
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-base md:text-lg lg:text-lg xl:text-lg font-bold text-gray-900">
                          {formatPrice(bundle.price)}
                        </div>
                        {bundle.savings && bundle.savings > 0 && (
                          <div className="text-xs md:text-xs lg:text-xs xl:text-xs text-gray-500 line-through">
                            {formatPrice(originalPrice * bundle.months)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {bundle.isPopular && (
                    <div className="absolute -top-2 -right-2 bg-black text-white px-2 py-1 rounded-full text-[10px] md:text-xs font-bold">
                      {t('product_detail.most_popular')}
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 lg:space-y-2 xl:space-y-2 2xl:space-y-3">
            {isOutOfStock ? (
              <button
                onClick={handleNotifyMe}
                className="w-full bg-black text-white text-sm md:text-base lg:text-base xl:text-base py-4 lg:py-4 xl:py-4 2xl:py-5 px-6 rounded-full hover:bg-gray-800 transition-all duration-200"
              >
                {t('product_detail.sold_out_notify')}
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full relative overflow-hidden bg-black text-white text-sm md:text-base lg:text-base xl:text-base py-4 lg:py-4 xl:py-4 2xl:py-5 px-6 rounded-full group border-2 border-black"
              >
                <span className="absolute inset-0 bg-white origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-full z-0"></span>
                <span className="relative z-10 group-hover:text-black transition-colors duration-400">{t('product_detail.add_to_cart')}</span>
              </button>
            )}
            
            <button
              onClick={() => {
                const bundle = bundleOptions.find(b => b.id === selectedBundle);
                if (!product || !bundle) return;
                openWhatsAppOrder(
                  [
                    {
                      name: product.name,
                      arabicName: (product as any).arabic_name || '',
                      price: bundle.price,
                      quantity: 1,
                      bundleLabel: bundle.label,
                    },
                  ],
                  language
                );
              }}
              disabled={isOutOfStock}
              className="w-full flex items-center justify-center bg-black text-white text-sm md:text-base py-4 lg:py-4 xl:py-4 2xl:py-5 px-6 rounded-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center">
                <span>{t('bundle.buy_now')}</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      
    </div>
  );
}
