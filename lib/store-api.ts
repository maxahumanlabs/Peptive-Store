import axios, { AxiosInstance } from 'axios';
import { 
  StoreCart, 
  StoreCartItem, 
  StoreCheckoutData, 
  StoreOrder 
} from '@/types';

/**
 * WooCommerce Store API Client
 * Handles cart, checkout, and session management
 * This is the RECOMMENDED way to handle cart in headless WooCommerce
 */
class StoreAPI {
  private client: AxiosInstance;

  constructor() {
    // Remove trailing slash from URL to prevent double slashes
    const baseURL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL?.replace(/\/$/, '');

    if (!baseURL) {
      throw new Error('NEXT_PUBLIC_WOOCOMMERCE_URL is not defined');
    }

    this.client = axios.create({
      baseURL: `${baseURL}/wp-json/wc/store/v1`,
      headers: {
        'Content-Type': 'application/json',
        'Host': 'peptivepeptides.local', // Required for Local by Flywheel virtual host routing
      },
      withCredentials: true, // CRITICAL: Enables session cookies
      timeout: 5000, // 5 second timeout
    });
  }

  // ==================== CART ====================

  /**
   * Get current cart
   */
  async getCart(): Promise<StoreCart | null> {
    try {
      const response = await this.client.get<StoreCart>('/cart');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return null;
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(productId: number, quantity = 1): Promise<StoreCart | null> {
    try {
      const response = await this.client.post<StoreCart>('/cart/add-item', {
        id: productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return null;
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(
    itemKey: string, 
    quantity: number
  ): Promise<StoreCart | null> {
    try {
      const response = await this.client.post<StoreCart>(
        `/cart/update-item`,
        {
          key: itemKey,
          quantity,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      return null;
    }
  }

  /**
   * Remove item from cart
   */
  async removeCartItem(itemKey: string): Promise<StoreCart | null> {
    try {
      const response = await this.client.post<StoreCart>(
        `/cart/remove-item`,
        {
          key: itemKey,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error removing cart item:', error);
      return null;
    }
  }

  /**
   * Apply coupon to cart
   */
  async applyCoupon(code: string): Promise<StoreCart | null> {
    try {
      const response = await this.client.post<StoreCart>(
        '/cart/apply-coupon',
        { code }
      );
      return response.data;
    } catch (error) {
      console.error('Error applying coupon:', error);
      return null;
    }
  }

  /**
   * Remove coupon from cart
   */
  async removeCoupon(code: string): Promise<StoreCart | null> {
    try {
      const response = await this.client.post<StoreCart>(
        '/cart/remove-coupon',
        { code }
      );
      return response.data;
    } catch (error) {
      console.error('Error removing coupon:', error);
      return null;
    }
  }

  /**
   * Update customer shipping/billing
   */
  async updateCustomer(data: {
    billing_address?: any;
    shipping_address?: any;
  }): Promise<StoreCart | null> {
    try {
      const response = await this.client.post<StoreCart>(
        '/cart/update-customer',
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      return null;
    }
  }

  /**
   * Select shipping rate
   */
  async selectShippingRate(
    packageId: string | number,
    rateId: string
  ): Promise<StoreCart | null> {
    try {
      const response = await this.client.post<StoreCart>(
        '/cart/select-shipping-rate',
        {
          package_id: packageId,
          rate_id: rateId,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error selecting shipping rate:', error);
      return null;
    }
  }

  // ==================== CHECKOUT ====================

  /**
   * Create an order (checkout)
   */
  async checkout(data: StoreCheckoutData): Promise<StoreOrder | null> {
    try {
      const response = await this.client.post<StoreOrder>('/checkout', data);
      return response.data;
    } catch (error) {
      console.error('Error during checkout:', error);
      return null;
    }
  }

  // ==================== PRODUCTS (Store API) ====================

  /**
   * Get products via Store API (optimized for storefront)
   */
  async getProducts(params?: {
    page?: number;
    per_page?: number;
    category?: string;
    search?: string;
    on_sale?: boolean;
  }) {
    try {
      const response = await this.client.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching store products:', error);
      return [];
    }
  }
}

// Export singleton instance
export const storeAPI = new StoreAPI();

// Export class for testing or custom instances
export default StoreAPI;
