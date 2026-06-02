/**
 * Centralized Tracking Library
 * Handles Google Analytics 4, Meta Pixel, and Klaviyo tracking
 */

// ==================== GOOGLE ANALYTICS 4 ====================

declare global {
  interface Window {
    gtag: any;
    fbq: any;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Track page views in Google Analytics
 */
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

/**
 * Track custom events in Google Analytics
 */
export const trackEvent = ({ 
  action, 
  category, 
  label, 
  value 
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// ==================== META PIXEL (FACEBOOK) ====================

/**
 * Track events in Meta Pixel
 */
export const trackMetaEvent = (eventName: string, data?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, data);
  }
};

// ==================== E-COMMERCE TRACKING ====================

interface Product {
  id: string | number;
  name: string;
  price: number;
  quantity?: number;
  category?: string;
}

interface OrderData {
  id: string;
  email: string;
  total: number;
  items: Product[];
  currency?: string;
}

/**
 * Track product view
 */
export const trackViewProduct = (product: Product) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'AED',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
      }],
    });
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: 'AED',
    });
  }
};

/**
 * Track add to cart
 */
export const trackAddToCart = (product: Product) => {
  const quantity = product.quantity || 1;
  
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'AED',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: quantity,
        item_category: product.category,
      }],
    });
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price * quantity,
      currency: 'AED',
    });
  }
};

/**
 * Track remove from cart
 */
export const trackRemoveFromCart = (product: Product) => {
  const quantity = product.quantity || 1;
  
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'remove_from_cart', {
      currency: 'AED',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: quantity,
      }],
    });
  }
};

/**
 * Track view cart
 */
export const trackViewCart = (items: Product[], total: number) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_cart', {
      currency: 'AED',
      value: total,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
    });
  }
};

/**
 * Track checkout initiation
 */
export const trackInitiateCheckout = (items: Product[], total: number) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'AED',
      value: total,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
    });
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: items.map(item => item.id),
      contents: items.map(item => ({
        id: item.id,
        quantity: item.quantity || 1,
      })),
      value: total,
      currency: 'AED',
      content_type: 'product',
    });
  }
};

/**
 * Track payment info added
 */
export const trackAddPaymentInfo = (total: number) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_payment_info', {
      currency: 'AED',
      value: total,
    });
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddPaymentInfo', {
      value: total,
      currency: 'AED',
    });
  }
};

/**
 * Track purchase completion
 */
export const trackPurchase = (orderData: OrderData) => {
  const currency = orderData.currency || 'AED';
  
  // Google Analytics - Enhanced E-commerce
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: orderData.id,
      value: orderData.total,
      currency: currency,
      items: orderData.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        item_category: item.category,
      })),
    });
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: orderData.total,
      currency: currency,
      content_ids: orderData.items.map(item => item.id),
      contents: orderData.items.map(item => ({
        id: item.id,
        quantity: item.quantity || 1,
      })),
      content_type: 'product',
    });
  }

  console.log('✅ Purchase tracked:', {
    orderId: orderData.id,
    total: orderData.total,
    items: orderData.items.length,
  });
};

/**
 * Track search
 */
export const trackSearch = (searchTerm: string) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
    });
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Search', {
      search_string: searchTerm,
    });
  }
};

/**
 * Track newsletter signup
 */
export const trackNewsletterSignup = (email: string) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method: 'newsletter',
    });
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: 'Newsletter Signup',
    });
  }
};

/**
 * Track user login
 */
export const trackLogin = (method: string = 'email') => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'login', {
      method: method,
    });
  }
};

/**
 * Track user signup
 */
export const trackSignup = (method: string = 'email') => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method: method,
    });
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration', {
      content_name: 'User Registration',
      status: 'completed',
    });
  }
};

// ==================== KLAVIYO TRACKING (OPTIONAL) ====================

/**
 * Track event in Klaviyo
 */
export const trackKlaviyoEvent = async (
  event: string, 
  email: string, 
  properties: any = {}
) => {
  const publicKey = process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY;
  
  if (!publicKey) return;

  try {
    await fetch('https://a.klaviyo.com/api/events/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'revision': '2024-10-15',
      },
      body: JSON.stringify({
        data: {
          type: 'event',
          attributes: {
            profile: { email },
            metric: { name: event },
            properties,
          },
        },
      }),
    });
  } catch (error) {
    console.error('Klaviyo tracking error:', error);
  }
};

/**
 * Identify user in Klaviyo
 */
export const identifyKlaviyoUser = async (
  email: string,
  properties: any = {}
) => {
  const publicKey = process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY;
  
  if (!publicKey) return;

  try {
    await fetch('https://a.klaviyo.com/api/profiles/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'revision': '2024-10-15',
      },
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {
            email,
            ...properties,
          },
        },
      }),
    });
  } catch (error) {
    console.error('Klaviyo identify error:', error);
  }
};
