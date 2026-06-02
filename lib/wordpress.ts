import axios, { AxiosInstance } from 'axios';
import http from 'http';
import https from 'https';
import { WordPressPage, HeroSection, BannerSlide, GlobalSettings } from '@/types';

/**
 * WordPress CMS API Client
 * Handles fetching CMS content like hero sections, banners, and global settings
 */
class WordPressAPI {
  private client: AxiosInstance;

  constructor() {
    // Remove trailing slash from URL to prevent double slashes
    const baseURL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL?.replace(/\/$/, '');
    const hostHeader = process.env.NEXT_PUBLIC_WOOCOMMERCE_HOST || '';

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

    this.client = axios.create({
      baseURL: `${baseURL}/wp-json/wp/v2`,
      headers,
      timeout: 30000, // 30 second timeout
      httpAgent,
      httpsAgent,
    });
  }

  // ==================== PAGES ====================

  /**
   * Get a page by slug (e.g., 'home', 'about')
   */
  async getPageBySlug(slug: string): Promise<WordPressPage | null> {
    try {
      const response = await this.client.get<WordPressPage[]>('/pages', {
        params: { slug },
      });

      if (response.data.length === 0) {
        return null;
      }

      return response.data[0];
    } catch (error) {
      console.error(`Error fetching page ${slug}:`, error);
      return null;
    }
  }

  // ==================== HERO SECTIONS ====================

  /**
   * Get hero section data for a specific page
   * Assumes you're using ACF (Advanced Custom Fields) with fields like:
   * - hero_title
   * - hero_subtitle
   * - hero_image
   * - hero_cta_text
   * - hero_cta_link
   */
  async getHeroSection(pageSlug: string): Promise<HeroSection | null> {
    try {
      const page = await this.getPageBySlug(pageSlug);
      
      if (!page || !page.acf) {
        return null;
      }

      return {
        title: page.acf.hero_title || '',
        subtitle: page.acf.hero_subtitle || '',
        image: page.acf.hero_image || '',
        ctaText: page.acf.hero_cta_text || '',
        ctaLink: page.acf.hero_cta_link || '',
      };
    } catch (error) {
      console.error(`Error fetching hero section for ${pageSlug}:`, error);
      return null;
    }
  }

  // ==================== BANNERS ====================

  /**
   * Get banner/slider images
   * Assumes you have a custom post type 'banners' with ACF fields
   */
  async getBanners(): Promise<BannerSlide[]> {
    try {
      // This endpoint requires registering a custom post type in WordPress
      const response = await this.client.get<any[]>('/banners', {
        params: {
          per_page: 10,
          orderby: 'menu_order',
          order: 'asc',
        },
      });

      return response.data.map((banner) => ({
        id: banner.id,
        title: banner.title.rendered,
        image: banner.acf?.image || banner.featured_media_url || '',
        link: banner.acf?.link || '',
        priority: banner.menu_order || 0,
        device: banner.acf?.device || 'both', // 'mobile', 'desktop', 'both'
      }));
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  }

  // ==================== GLOBAL SETTINGS ====================

  /**
   * Get global settings from ACF Options Page
   * Assumes you have an ACF Options Page with fields like:
   * - supported_countries
   * - default_country
   * - currency_symbol
   * - tax_enabled
   */
  async getGlobalSettings(): Promise<GlobalSettings | null> {
    try {
      // ACF Options endpoint (requires ACF to REST API plugin or custom endpoint)
      const response = await this.client.get('/acf/v3/options/options');
      
      return {
        supportedCountries: response.data.acf.supported_countries || [],
        defaultCountry: response.data.acf.default_country || 'US',
        currencySymbol: response.data.acf.currency_symbol || '$',
        taxEnabled: response.data.acf.tax_enabled || false,
      };
    } catch (error) {
      console.error('Error fetching global settings:', error);
      return null;
    }
  }

  // ==================== MEDIA ====================

  /**
   * Get media item by ID
   */
  async getMediaById(id: number): Promise<string | null> {
    try {
      const response = await this.client.get(`/media/${id}`);
      return response.data.source_url || null;
    } catch (error) {
      console.error(`Error fetching media ${id}:`, error);
      return null;
    }
  }
}

// Export singleton instance
export const wordpress = new WordPressAPI();

// Export class for testing or custom instances
export default WordPressAPI;
