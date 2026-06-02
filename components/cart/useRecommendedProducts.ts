'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { woocommerce } from '@/lib/woocommerce';

// Shared recommendations source for the cart UIs.
// Prefers featured products, fills from the general catalog, and excludes
// anything already in the cart. Used by both the side cart and the cart page.
export function useRecommendedProducts(excludeIds: number[], limit: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Stable dependency so the effect doesn't refire on array identity changes
  const excludeKey = excludeIds.slice().sort((a, b) => a - b).join(',');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      const exclude = new Set(
        excludeKey ? excludeKey.split(',').map(Number) : []
      );
      try {
        let pool = await woocommerce.getFeaturedProducts(12);
        // Not enough featured products to fill the section — top up from catalog
        if (pool.length < limit + exclude.size) {
          const general = await woocommerce.getProducts({ perPage: 12 });
          pool = [...pool, ...general];
        }

        const seen = new Set<number>();
        const result: Product[] = [];
        for (const p of pool) {
          if (exclude.has(p.id) || seen.has(p.id)) continue;
          seen.add(p.id);
          result.push(p);
          if (result.length >= limit) break;
        }

        if (active) setProducts(result);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [excludeKey, limit]);

  return { products, loading };
}
