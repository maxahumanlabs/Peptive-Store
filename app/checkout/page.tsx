'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

// Countries we operate in (from CountrySelector)
const AVAILABLE_COUNTRIES = [
  { code: 'BH', name: 'Bahrain' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'OM', name: 'Oman' },
  { code: 'QA', name: 'Qatar' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'US', name: 'United States' },
];

// States for countries that have them
const COUNTRY_STATES: Record<string, string[]> = {
  US: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 
       'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
       'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 
       'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
       'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
       'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
       'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
  AE: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'],
  SA: ['Riyadh', 'Makkah', 'Madinah', 'Eastern Province', 'Asir', 'Tabuk', 'Qassim', 'Hail', 'Northern Borders', 'Jizan', 'Najran', 'Al Bahah', 'Al Jawf'],
};

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  // Check for payment cancellation
  useEffect(() => {
    const cancelled = searchParams?.get('cancelled');
    if (cancelled === 'true') {
      setError(t('checkout.payment_cancelled'));
    }
  }, [searchParams, t]);
  
  const subtotal = getSubtotal();
  const TAX_RATE = 0.05; // 5% tax rate
  const tax = subtotal * TAX_RATE; // Calculate 5% tax on subtotal
  const [shipping, setShipping] = useState(0);
  const discount = appliedCoupon?.discount || 0;
  const total = subtotal + tax + shipping - discount;

  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'AE', // Default to UAE
  });

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'AE', // Default to UAE
  });

  // Calculate shipping when location changes (tax is calculated directly from subtotal)
  useEffect(() => {
    const calculateShippingAndTax = async () => {
      if (!billingInfo.country || items.length === 0) return;

      setCalculatingShipping(true);
      try {
        const response = await fetch('/api/calculate-shipping-tax', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: items.map(item => ({ id: item.id, quantity: item.quantity })),
            country: billingInfo.country,
            state: billingInfo.state,
            postcode: billingInfo.postcode,
            city: billingInfo.city,
          }),
        });

        const data = await response.json();
        
        if (data.shipping !== undefined) {
          setShipping(data.shipping);
        }
        // Tax is now calculated directly from subtotal (5%)
      } catch (err) {
        console.error('Error calculating shipping:', err);
        // Keep default values
      } finally {
        setCalculatingShipping(false);
      }
    };

    // Debounce the calculation
    const timer = setTimeout(() => {
      calculateShippingAndTax();
    }, 500);

    return () => clearTimeout(timer);
  }, [billingInfo.country, billingInfo.state, billingInfo.postcode, billingInfo.city, items]);

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setValidatingCoupon(true);
    setCouponError(null);

    try {
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          cartTotal: subtotal,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setAppliedCoupon(data.coupon);
        setCouponError(null);
      } else {
        setCouponError(data.message || 'Invalid coupon code');
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError('Failed to validate coupon');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          couponCode: couponCode.trim() || undefined,
          customerEmail: billingInfo.email,
          billingDetails: billingInfo,
          shippingDetails: sameAsShipping ? billingInfo : shippingInfo,
          tax: tax, // Include 5% tax
          shipping: shipping, // Include shipping cost
          subtotal: subtotal, // Include subtotal for reference
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout URL directly
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 md:px-8 lg:px-12 py-8 md:py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-normal text-gray-900 mb-2">
          {t('checkout.title')}
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          {t('checkout.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Billing Information */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 md:p-6">
              <h2 className="text-base md:text-lg font-normal text-gray-900 mb-4">
                {t('checkout.billing_information')}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                <Input
                  label={`${t('checkout.first_name')} ${t('checkout.required_field')}`}
                  name="firstName"
                  value={billingInfo.firstName}
                  onChange={handleBillingChange}
                  required
                />
                <Input
                  label={`${t('checkout.last_name')} ${t('checkout.required_field')}`}
                  name="lastName"
                  value={billingInfo.lastName}
                  onChange={handleBillingChange}
                  required
                />
                <Input
                  label={`${t('checkout.email')} ${t('checkout.required_field')}`}
                  name="email"
                  type="email"
                  value={billingInfo.email}
                  onChange={handleBillingChange}
                  required
                  className="md:col-span-2"
                />
                <Input
                  label={`${t('checkout.phone')} ${t('checkout.required_field')}`}
                  name="phone"
                  type="tel"
                  value={billingInfo.phone}
                  onChange={handleBillingChange}
                  required
                  className="md:col-span-2"
                />
                <Input
                  label={`${t('checkout.address_line_1')} ${t('checkout.required_field')}`}
                  name="address1"
                  value={billingInfo.address1}
                  onChange={handleBillingChange}
                  required
                  className="md:col-span-2"
                />
                <Input
                  label={t('checkout.address_line_2')}
                  name="address2"
                  value={billingInfo.address2}
                  onChange={handleBillingChange}
                  className="md:col-span-2"
                />
                <Input
                  label={`${t('checkout.city')} ${t('checkout.required_field')}`}
                  name="city"
                  value={billingInfo.city}
                  onChange={handleBillingChange}
                  required
                />
                
                {/* State/Province Select - only show if country has states */}
                {COUNTRY_STATES[billingInfo.country] ? (
                  <div>
                    <label className="block text-xs md:text-sm font-normal text-gray-700 mb-2">
                      {t('checkout.state')} {t('checkout.required_field')}
                    </label>
                    <select
                      name="state"
                      value={billingInfo.state}
                      onChange={handleBillingChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-normal focus:border-gray-900 focus:outline-none bg-white"
                    >
                      <option value="">Select State/Province</option>
                      {COUNTRY_STATES[billingInfo.country].map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <Input
                    label={t('checkout.state')}
                    name="state"
                    value={billingInfo.state}
                    onChange={handleBillingChange}
                  />
                )}
                
                <Input
                  label="ZIP Code *"
                  name="postcode"
                  value={billingInfo.postcode}
                  onChange={handleBillingChange}
                  required
                />
                
                {/* Country Select */}
                <div>
                  <label className="block text-xs md:text-sm font-normal text-gray-700 mb-2">
                    {t('checkout.country')} {t('checkout.required_field')}
                  </label>
                  <select
                    name="country"
                    value={billingInfo.country}
                    onChange={handleBillingChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-normal focus:border-gray-900 focus:outline-none bg-white"
                  >
                    <option value="">Select Country</option>
                    {AVAILABLE_COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-normal text-gray-900">
                  {t('checkout.shipping_information')}
                </h2>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="mr-2 w-4 h-4 text-gray-900 focus:ring-gray-900 rounded"
                  />
                  <span className="text-xs md:text-sm font-normal text-gray-700">{t('checkout.same_as_billing')}</span>
                </label>
              </div>

              {!sameAsShipping && (
                <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                  <Input
                    label={`${t('checkout.first_name')} ${t('checkout.required_field')}`}
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleShippingChange}
                    required={!sameAsShipping}
                  />
                  <Input
                    label={`${t('checkout.last_name')} ${t('checkout.required_field')}`}
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleShippingChange}
                    required={!sameAsShipping}
                  />
                  <Input
                    label={`${t('checkout.address_line_1')} ${t('checkout.required_field')}`}
                    name="address1"
                    value={shippingInfo.address1}
                    onChange={handleShippingChange}
                    required={!sameAsShipping}
                    className="md:col-span-2"
                  />
                  <Input
                    label={t('checkout.address_line_2')}
                    name="address2"
                    value={shippingInfo.address2}
                    onChange={handleShippingChange}
                    className="md:col-span-2"
                  />
                  <Input
                    label={`${t('checkout.city')} ${t('checkout.required_field')}`}
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    required={!sameAsShipping}
                  />
                  
                  {/* State/Province Select - only show if country has states */}
                  {COUNTRY_STATES[shippingInfo.country] ? (
                    <div>
                      <label className="block text-xs md:text-sm font-normal text-gray-700 mb-2">
                        {t('checkout.state')} {t('checkout.required_field')}
                      </label>
                      <select
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        required={!sameAsShipping}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-normal focus:border-gray-900 focus:outline-none bg-white"
                      >
                        <option value="">Select State/Province</option>
                        {COUNTRY_STATES[shippingInfo.country].map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <Input
                      label={t('checkout.state')}
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                    />
                  )}
                  
                  <Input
                    label="ZIP Code *"
                    name="postcode"
                    value={shippingInfo.postcode}
                    onChange={handleShippingChange}
                    required={!sameAsShipping}
                  />
                  
                  {/* Country Select */}
                  <div>
                    <label className="block text-xs md:text-sm font-normal text-gray-700 mb-2">
                      {t('checkout.country')} {t('checkout.required_field')}
                    </label>
                    <select
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      required={!sameAsShipping}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-normal focus:border-gray-900 focus:outline-none bg-white"
                    >
                      <option value="">Select Country</option>
                      {AVAILABLE_COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 md:p-6">
              <h2 className="text-base md:text-lg font-normal text-gray-900 mb-4">
                {t('checkout.payment_information')}
              </h2>

              {/* Coupon Code Input */}
              <div className="mb-4">
                <label className="block text-xs md:text-sm font-normal text-gray-700 mb-2">
                  {t('checkout.discount_code_optional')}
                </label>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder={t('checkout.enter_coupon_code')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-normal focus:border-gray-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || validatingCoupon}
                      className="px-4 py-2 bg-gray-900 text-white text-xs md:text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {validatingCoupon ? t('checkout.applying') : t('checkout.apply')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 border border-green-300 rounded-lg p-3">
                    <div>
                      <p className="text-sm text-green-800">
                        <span className="font-medium">{appliedCoupon.code}</span> {t('checkout.applied')}
                      </p>
                      {appliedCoupon.description && (
                        <p className="text-xs text-green-600 mt-1">{appliedCoupon.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      {t('checkout.remove')}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-xs text-red-600 mt-1">{couponError}</p>
                )}
                {!appliedCoupon && !couponError && (
                  <p className="text-xs text-gray-500 mt-1">
                    {t('checkout.discount_code_help')}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-300 rounded-lg p-3">
                  <p className="text-red-800 text-xs md:text-sm font-normal">{error}</p>
                </div>
              )}

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm md:text-base font-normal text-blue-900 mb-1">
                      {t('checkout.secure_payment_title')}
                    </p>
                    <p className="text-xs md:text-sm text-blue-800">
                      {t('checkout.secure_payment_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 md:p-6 sticky top-24">
              <h2 className="text-base md:text-lg font-normal text-gray-900 mb-4">
                {t('checkout.order_summary')}
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.cartItemId || `${item.id}-${Math.random()}`} className="flex gap-3 bg-gray-50 p-3 rounded-xl">
                    <div className="relative w-14 h-14 bg-white rounded-lg flex-shrink-0 overflow-hidden shadow-sm">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-normal text-gray-900 mb-1 truncate">
                        {language === 'ar' && item.arabicName ? item.arabicName : item.name}
                        {item.bundleLabel && (
                          <span className="ml-1 text-[10px] text-pink-600 font-medium">({item.bundleLabel})</span>
                        )}
                      </p>
                      <p className="text-xs md:text-sm font-normal text-gray-900">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Summary */}
              <div className="border-t border-gray-100 pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-xs md:text-sm text-gray-700">
                  <span className="font-normal">{t('checkout.subtotal')}</span>
                  <span className="font-normal">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm text-gray-700">
                  <span className="font-normal">{t('checkout.shipping')}</span>
                  <span className="font-normal">
                    {calculatingShipping ? t('checkout.calculating_shipping') : shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-xs md:text-sm text-gray-700">
                  <span className="font-normal">VAT {t('checkout.tax')} 5%</span>
                  <span className="font-normal">
                    {calculatingShipping ? t('checkout.calculating_shipping') : formatPrice(tax)}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-xs md:text-sm text-green-600">
                    <span className="font-normal">
                      {t('checkout.discount')} ({appliedCoupon.code})
                    </span>
                    <span className="font-normal">-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm md:text-base font-normal text-gray-900">{t('checkout.total')}</span>
                  <span className="text-sm md:text-base font-normal text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white text-sm md:text-base font-normal py-3 px-4 rounded-full hover:bg-gray-800 transition-all duration-200 shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('checkout.processing') : t('checkout.place_order')}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p>Loading...</p></div>}>
      <CheckoutForm />
    </Suspense>
  );
}
