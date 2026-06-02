'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { woocommerce } from '@/lib/woocommerce';
import ProductGrid from './ProductGrid';

interface RelatedProductsProps {
  productIds: number[];
  currentProductId: number;
}

export default function RelatedProducts({ productIds, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (productIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Filter out current product and limit to 4 products
        const filteredIds = productIds
          .filter(id => id !== currentProductId)
          .slice(0, 4);

        if (filteredIds.length > 0) {
          const relatedProducts = await woocommerce.getProductsByIds(filteredIds);
          setProducts(relatedProducts);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productIds, currentProductId]);

  if (loading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-96 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <ProductGrid products={products} />
    </div>
  );
}
