import axios, { AxiosInstance } from 'axios';
import http from 'http';
import https from 'https';
import { WooCommerceProduct, Product, ProductReview } from '@/types';
import { decodeHtmlEntities } from './utils';

// Store API Product interface (different from REST API v3)
interface StoreAPIProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  sku: string;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
  };
  on_sale: boolean;
  average_rating: string;
  review_count: number;
  images: Array<{
    id: number;
    src: string;
    thumbnail: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  is_in_stock: boolean;
  stock_availability: {
    text: string;
    class: string;
  };
  arabic_name?: string;
  arabic_description?: string;
  arabic_short_description?: string;
  arabic_tags?: string;
  bundle_pricing?: {
    three_month: { regular_price: string; sale_price: string };
    six_month: { regular_price: string; sale_price: string };
  };
}

class WooCommerceAPI {
  private client: AxiosInstance;
  private storeClient: AxiosInstance;
  private consumerKey: string;
  private consumerSecret: string;

  constructor() {
    // Remove trailing slash from URL to prevent double slashes
    const baseURL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL?.replace(/\/$/, '');
    const hostHeader = process.env.NEXT_PUBLIC_WOOCOMMERCE_HOST || '';
    this.consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
    this.consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

    if (!baseURL) {
      throw new Error('NEXT_PUBLIC_WOOCOMMERCE_URL is not defined');
    }

    // Build headers object
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Only add Host header if configured (required for Local by Flywheel)
    if (hostHeader) {
      headers['Host'] = hostHeader;
    }

    // Force IPv4 to prevent IPv6 timeout issues with .local domains
    const httpAgent = new http.Agent({ family: 4 });
    const httpsAgent = new https.Agent({ family: 4 });

    // REST API client (for products, reviews, etc.)
    this.client = axios.create({
      baseURL: `${baseURL}/wp-json/wc/v3`,
      auth: {
        username: this.consumerKey,
        password: this.consumerSecret,
      },
      headers,
      timeout: 30000, // 30 second timeout
      httpAgent,
      httpsAgent,
    });

    // Store API client - use proxy to avoid CORS issues
    // In browser, use Next.js API proxy route
    // On server, use direct WooCommerce URL
    const isServer = typeof window === 'undefined';
    const storeBaseURL = isServer 
      ? `${baseURL}/wp-json/wc/store/v1`
      : '/api/proxy/wc-store';
    
    this.storeClient = axios.create({
      baseURL: storeBaseURL,
      headers,
      withCredentials: !isServer, // Only use credentials in browser
      timeout: 30000, // 30 second timeout
      httpAgent: isServer ? httpAgent : undefined,
      httpsAgent: isServer ? httpsAgent : undefined,
    });
  }

  // Transform WooCommerce REST API product to simplified Product type
  private transformProduct(wcProduct: WooCommerceProduct): Product {
    return {
      id: wcProduct.id,
      name: decodeHtmlEntities(wcProduct.name),
      slug: wcProduct.slug,
      description: wcProduct.description,
      shortDescription: wcProduct.short_description,
      price: wcProduct.price,
      regularPrice: wcProduct.regular_price,
      salePrice: wcProduct.sale_price,
      onSale: wcProduct.on_sale,
      image: wcProduct.images[0]?.src || '/placeholder-product.jpg',
      images: wcProduct.images.map(img => img.src),
      categories: wcProduct.categories.map(cat => cat.name),
      tags: wcProduct.tags?.map(tag => tag.name) || [],
      stockStatus: wcProduct.stock_status,
      stockQuantity: wcProduct.stock_quantity,
      rating: parseFloat(wcProduct.average_rating) || 0,
      ratingCount: wcProduct.rating_count,
      relatedIds: wcProduct.related_ids,
      attributes: wcProduct.attributes,
    };
  }

  // Transform Store API product to simplified Product type
  private transformStoreProduct(storeProduct: StoreAPIProduct): Product {
    // Convert prices from cents to decimal (Store API uses integer cents)
    const price = (parseInt(storeProduct.prices.price) / 100).toFixed(2);
    const regularPrice = (parseInt(storeProduct.prices.regular_price) / 100).toFixed(2);
    const salePrice = (parseInt(storeProduct.prices.sale_price) / 100).toFixed(2);

    // Extract custom fields from extensions namespace
    const extensions = (storeProduct as any).extensions?.['peptive-bundles'] || {};

    return {
      id: storeProduct.id,
      name: decodeHtmlEntities(storeProduct.name),
      slug: storeProduct.slug,
      description: storeProduct.description,
      shortDescription: storeProduct.short_description,
      price,
      regularPrice,
      salePrice,
      onSale: storeProduct.on_sale,
      image: storeProduct.images[0]?.src || '/placeholder-product.jpg',
      images: storeProduct.images.map(img => img.src), // Override with string array
      categories: storeProduct.categories.map(cat => cat.name),
      stockStatus: storeProduct.is_in_stock ? 'instock' : 'outofstock',
      stockQuantity: null, // Store API doesn't provide exact quantity
      rating: parseFloat(storeProduct.average_rating) || 0,
      ratingCount: storeProduct.review_count,
      relatedIds: [], // Store API doesn't provide related products
      attributes: [], // Store API doesn't provide attributes
      tags: storeProduct.tags?.map(tag => tag.name) || [],
      // Add custom fields from plugin extensions
      arabic_name: extensions.arabic_name || '',
      arabic_description: extensions.arabic_description || '',
      arabic_short_description: extensions.arabic_short_description || '',
      arabic_tags: extensions.arabic_tags || '',
      bundle_pricing: extensions.bundle_pricing || null,
      is_bundle: extensions.is_bundle || false,
      bundle_items: extensions.bundle_items || [],
    } as any;
  }

  // Get all products (using Store API - no auth required)
  async getProducts(params?: {
    page?: number;
    perPage?: number;
    category?: string;
    featured?: boolean;
    onSale?: boolean;
    search?: string;
  }): Promise<Product[]> {
    try {
      // Use Store API instead of REST API v3.
      // The category param is a WooCommerce category slug (e.g. 'all', 'oral').
      const response = await this.storeClient.get<StoreAPIProduct[]>('/products', {
        params: {
          page: params?.page || 1,
          per_page: params?.perPage || 12,
          category: params?.category,
          featured: params?.featured,
          on_sale: params?.onSale,
          search: params?.search,
        },
      });

      return response.data.map(this.transformStoreProduct);
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Get single product by slug (using Store API - no auth required)
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      // Use Store API to get product (no auth needed)
      const response = await this.storeClient.get<StoreAPIProduct[]>('/products', {
        params: {
          slug: slug,
          per_page: 1,
        },
      });

      if (response.data && response.data.length > 0) {
        return this.transformStoreProduct(response.data[0]);
      }

      // Fallback: non-latin (e.g. Arabic) slugs are stored percent-encoded in
      // WordPress, so the exact ?slug= filter can miss them. Fetch the catalog
      // and match by comparing decoded slugs.
      const decode = (s: string) => {
        try {
          return decodeURIComponent(s);
        } catch {
          return s;
        }
      };
      const target = decode(slug);

      const all = await this.storeClient.get<StoreAPIProduct[]>('/products', {
        params: { per_page: 100 },
      });
      const match = all.data?.find(
        (p) => p.slug === slug || decode(p.slug) === target
      );

      return match ? this.transformStoreProduct(match) : null;
    } catch (error) {
      console.error(`Error fetching product ${slug}:`, error);
      return null;
    }
  }

  // Get product by ID (using Store API)
  async getProductById(id: number): Promise<Product | null> {
    try {
      const response = await this.storeClient.get<StoreAPIProduct>(`/products/${id}`);
      return this.transformStoreProduct(response.data);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  }

  // Get multiple products by IDs (using Store API)
  async getProductsByIds(ids: number[]): Promise<Product[]> {
    try {
      const response = await this.storeClient.get<StoreAPIProduct[]>('/products', {
        params: {
          include: ids.join(','),
          per_page: ids.length,
        },
      });

      return response.data.map(this.transformStoreProduct);
    } catch (error) {
      console.error('Error fetching products by IDs:', error);
      return [];
    }
  }

  // Get featured products
  async getFeaturedProducts(limit = 4): Promise<Product[]> {
    return this.getProducts({ featured: true, perPage: limit });
  }

  // Get products on sale
  async getSaleProducts(limit = 8): Promise<Product[]> {
    return this.getProducts({ onSale: true, perPage: limit });
  }

  // Search products
  async searchProducts(query: string, limit = 12): Promise<Product[]> {
    return this.getProducts({ search: query, perPage: limit });
  }

  // ==================== PRODUCT REVIEWS ====================
  
  // Get reviews for a product
  async getProductReviews(productId: number): Promise<ProductReview[]> {
    try {
      const response = await this.client.get(`/products/reviews`, {
        params: {
          product: productId,
          per_page: 100,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      return [];
    }
  }

  // ==================== STORE API (Cart & Checkout) ====================
  
  // Get Store API client (for making cart/checkout calls from client side)
  getStoreClient() {
    return this.storeClient;
  }

  // ==================== ORDERS ====================
  
  // Get orders (with optional filters)
  async getOrders(params?: {
    customer?: string;
    perPage?: number;
    page?: number;
    orderby?: string;
    order?: string;
  }): Promise<any[]> {
    try {
      const response = await this.client.get('/orders', {
        params: {
          customer: params?.customer,
          per_page: params?.perPage || 10,
          page: params?.page || 1,
          orderby: params?.orderby || 'date',
          order: params?.order || 'desc',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  // ==================== CUSTOMERS ====================
  
  // Get customer by ID
  async getCustomer(customerId: number): Promise<any> {
    try {
      const response = await this.client.get(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${customerId}:`, error);
      return null;
    }
  }

  // ==================== COUPONS ====================
  
  // Get coupons (with optional filters)
  async getCoupons(params?: {
    code?: string;
    perPage?: number;
  }): Promise<any[]> {
    try {
      const response = await this.client.get('/coupons', {
        params: {
          code: params?.code,
          per_page: params?.perPage || 10,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }
  }
}

// Export singleton instance
export const woocommerce = new WooCommerceAPI();

// Export class for testing or custom instances
export default WooCommerceAPI;
