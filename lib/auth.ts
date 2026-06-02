import axios, { AxiosInstance } from 'axios';
import { User, UserLoginCredentials, UserRegistrationData } from '@/types';

/**
 * JWT Authentication Client
 * Requires JWT Authentication for WP REST API plugin:
 * https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
 * 
 * Setup in WordPress:
 * 1. Install & activate the plugin
 * 2. Add to wp-config.php:
 *    define('JWT_AUTH_SECRET_KEY', 'your-secret-key');
 *    define('JWT_AUTH_CORS_ENABLE', true);
 */
class AuthAPI {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    // Remove trailing slash from URL to prevent double slashes
    const baseURL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL?.replace(/\/$/, '');

    if (!baseURL) {
      throw new Error('NEXT_PUBLIC_WOOCOMMERCE_URL is not defined');
    }

    this.client = axios.create({
      baseURL: `${baseURL}/wp-json`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage if exists
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      if (this.token) {
        this.setAuthHeader(this.token);
      }
    }
  }

  private setAuthHeader(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  private removeAuthHeader() {
    delete this.client.defaults.headers.common['Authorization'];
  }

  // ==================== AUTHENTICATION ====================

  /**
   * Login user and get JWT token
   */
  async login(credentials: UserLoginCredentials): Promise<{
    success: boolean;
    token?: string;
    user?: User;
    message?: string;
  }> {
    try {
      const response = await this.client.post('/jwt-auth/v1/token', {
        username: credentials.username,
        password: credentials.password,
      });

      const { token, user_email, user_nicename, user_display_name } = response.data;

      this.token = token;
      this.setAuthHeader(token);

      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }

      return {
        success: true,
        token,
        user: {
          email: user_email,
          username: user_nicename,
          displayName: user_display_name,
        },
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid username or password',
      };
    }
  }

  /**
   * Register new user
   */
  async register(data: UserRegistrationData): Promise<{
    success: boolean;
    user?: User;
    message?: string;
  }> {
    try {
      const response = await this.client.post('/wp/v2/users/register', {
        username: data.username,
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
      });

      return {
        success: true,
        user: {
          id: response.data.id,
          email: response.data.email,
          username: response.data.username,
          displayName: response.data.name,
        },
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  }

  /**
   * Logout user
   */
  logout() {
    this.token = null;
    this.removeAuthHeader();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Validate current token
   */
  async validateToken(): Promise<boolean> {
    if (!this.token) return false;

    try {
      await this.client.post('/jwt-auth/v1/token/validate');
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.token !== null;
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.token;
  }

  // ==================== USER DATA ====================

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User | null> {
    if (!this.token) return null;

    try {
      const response = await this.client.get('/wp/v2/users/me');
      return {
        id: response.data.id,
        email: response.data.email,
        username: response.data.slug,
        displayName: response.data.name,
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        avatar: response.data.avatar_urls?.['96'],
      };
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateUser(userId: number, data: Partial<User>): Promise<boolean> {
    if (!this.token) return false;

    try {
      await this.client.post(`/wp/v2/users/${userId}`, {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
      });
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  // ==================== WOOCOMMERCE CUSTOMER DATA ====================

  /**
   * Get customer orders from WooCommerce via API route
   */
  async getCustomerOrders(customerId?: number): Promise<any[]> {
    try {
      const userId = customerId || (await this.getCurrentUser())?.id;
      if (!userId) return [];

      const response = await axios.get(`/api/customer-orders?customerId=${userId}`);
      return response.data.orders || [];
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      return [];
    }
  }

  /**
   * Get customer billing and shipping addresses via API route
   */
  async getCustomerAddresses(): Promise<{billing: any; shipping: any} | null> {
    try {
      const user = await this.getCurrentUser();
      if (!user?.id) return null;

      const response = await axios.get(`/api/customer-addresses?customerId=${user.id}`);
      return {
        billing: response.data.billing,
        shipping: response.data.shipping,
      };
    } catch (error) {
      console.error('Error fetching customer addresses:', error);
      return null;
    }
  }
}

// Export singleton instance
export const authAPI = new AuthAPI();

// Export class for testing or custom instances
export default AuthAPI;
