import { CartItem } from '@/types';

// Decode HTML entities (e.g. "&#038;" -> "&", "&#8211;" -> "–") that
// WordPress/WooCommerce returns in titles. Works on both server and client.
export function decodeHtmlEntities(text: string): string {
  if (!text) return text;
  const named: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&#39;': "'",
    '&nbsp;': ' ',
  };
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&[a-zA-Z]+;/g, (entity) => named[entity] ?? entity);
}

// Format price to currency string (UAE Dirham)
export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `Dhs. ${(numPrice || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Calculate cart total
export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + parseFloat(item.price) * item.quantity;
  }, 0);
}

// Calculate cart item count
export function calculateCartItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

// Generate star rating display
export function generateStarRating(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Strip HTML tags
export function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Generate slug from string
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Get stock status label
export function getStockStatusLabel(status: string): string {
  const labels: { [key: string]: string } = {
    instock: 'In Stock',
    outofstock: 'Out of Stock',
    onbackorder: 'On Backorder',
  };
  return labels[status] || 'Unknown';
}

// Get stock status color
export function getStockStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    instock: 'text-green-600',
    outofstock: 'text-red-600',
    onbackorder: 'text-yellow-600',
  };
  return colors[status] || 'text-gray-600';
}
