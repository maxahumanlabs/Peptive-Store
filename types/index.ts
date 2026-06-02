// WooCommerce Product Types
export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_modified: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  stock_quantity: number | null;
  stock_status: string;
  backorders: string;
  manage_stock: boolean;
  categories: WooCommerceCategory[];
  tags: WooCommerceTag[];
  images: WooCommerceImage[];
  attributes: WooCommerceAttribute[];
  average_rating: string;
  rating_count: number;
  related_ids: number[];
}

export interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WooCommerceTag {
  id: number;
  name: string;
  slug: string;
}

export interface WooCommerceImage {
  id: number;
  date_created: string;
  date_modified: string;
  src: string;
  name: string;
  alt: string;
}

export interface WooCommerceAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

// Simplified Product Type for Frontend
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  regularPrice: string;
  salePrice: string;
  onSale: boolean;
  image: string;
  images: string[];
  categories: string[];
  stockStatus: string;
  stockQuantity: number | null;
  rating: number;
  ratingCount: number;
  relatedIds: number[];
  attributes: WooCommerceAttribute[];
  tags: string[];
}

// Cart Types
export interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string;
  quantity: number;
  bundleType?: 'one-month' | 'three-months' | 'six-months';
  bundleLabel?: string;
  cartItemId?: string; // Unique identifier for each cart entry
  arabicName?: string; // Arabic product name
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

// ==================== PRODUCT REVIEWS ====================

export interface ProductReview {
  id: number;
  product_id: number;
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
  date_created: string;
  verified: boolean;
  reviewer_avatar_urls: {
    [key: string]: string;
  };
}

// ==================== STORE API TYPES ====================

export interface StoreCartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  short_description: string;
  description: string;
  sku: string;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
    currency_symbol: string;
  };
  images: Array<{
    src: string;
    thumbnail: string;
    name: string;
  }>;
  totals: {
    line_subtotal: string;
    line_total: string;
  };
}

export interface StoreCart {
  items: StoreCartItem[];
  items_count: number;
  items_weight: number;
  cross_sells: any[];
  needs_payment: boolean;
  needs_shipping: boolean;
  has_calculated_shipping: boolean;
  shipping_address: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  billing_address: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  totals: {
    total_items: string;
    total_items_tax: string;
    total_fees: string;
    total_fees_tax: string;
    total_discount: string;
    total_discount_tax: string;
    total_shipping: string;
    total_shipping_tax: string;
    total_tax: string;
    total_price: string;
    currency_code: string;
    currency_symbol: string;
  };
  shipping_rates: Array<{
    package_id: number;
    name: string;
    destination: any;
    items: any[];
    shipping_rates: Array<{
      rate_id: string;
      name: string;
      description: string;
      delivery_time: string;
      price: string;
      selected: boolean;
    }>;
  }>;
  coupons: Array<{
    code: string;
    discount_type: string;
    totals: {
      total_discount: string;
      total_discount_tax: string;
    };
  }>;
  errors: any[];
}

export interface StoreCheckoutData {
  billing_address: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping_address?: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  payment_method: string;
  customer_note?: string;
  create_account?: boolean;
}

export interface StoreOrder {
  order_id: number;
  status: string;
  order_key: string;
  customer_note: string;
  customer_id: number;
  billing_address: any;
  shipping_address: any;
  payment_method: string;
  payment_result: {
    payment_status: string;
    payment_details: any[];
    redirect_url: string;
  };
}

// ==================== WORDPRESS CMS TYPES ====================

export interface WordPressPage {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  acf?: {
    [key: string]: any;
  };
}

export interface HeroSection {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export interface BannerSlide {
  id: number;
  title: string;
  image: string;
  link: string;
  priority: number;
  device: 'mobile' | 'desktop' | 'both';
}

export interface GlobalSettings {
  supportedCountries: string[];
  defaultCountry: string;
  currencySymbol: string;
  taxEnabled: boolean;
}

// ==================== AUTHENTICATION TYPES ====================

export interface User {
  id?: number;
  email: string;
  username: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface UserLoginCredentials {
  username: string;
  password: string;
}

export interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}


// Checkout Types
export interface BillingDetails {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface Order {
  billing: BillingDetails;
  shipping: ShippingDetails;
  lineItems: {
    productId: number;
    quantity: number;
  }[];
  paymentMethod: string;
  paymentMethodTitle: string;
  setPaid: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}
