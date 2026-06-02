/**
 * API Test Page
 * Visit /api-test to verify all API connections are working
 */

'use client';

import { useEffect, useState } from 'react';

export default function APITestPage() {
  const [productsTest, setProductsTest] = useState({ success: false, data: null as any, error: null as any, loading: true, hasKey: false, hasSecret: false });
  const [heroTest, setHeroTest] = useState({ success: false, data: null as any, error: null as any, loading: true });
  const [reviewsTest, setReviewsTest] = useState({ success: false, data: null as any, error: null as any, loading: true });

  useEffect(() => {
    async function runTests() {
      // Test 1: WooCommerce Products API
      try {
        const response = await fetch('/api/test-woocommerce');
        const data = await response.json();
        setProductsTest({ 
          success: data.success, 
          data: data.products, 
          error: data.error, 
          loading: false,
          hasKey: data.hasKey || false,
          hasSecret: data.hasSecret || false
        });
      } catch (error: any) {
        setProductsTest({ success: false, data: null, error: error.message, loading: false, hasKey: false, hasSecret: false });
      }

      // Test 2: WordPress Hero Section
      try {
        const response = await fetch('/api/test-wordpress');
        const data = await response.json();
        setHeroTest({ 
          success: data.success, 
          data: data.hero, 
          error: data.error, 
          loading: false 
        });
      } catch (error: any) {
        setHeroTest({ success: false, data: null, error: error.message, loading: false });
      }
      
      setReviewsTest({ success: false, data: null, error: null, loading: false });
    }

    runTests();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">🧪 API Connection Test</h1>

      <div className="space-y-6">
        {/* WooCommerce Products Test */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">
              {productsTest.success ? '✅' : '❌'}
            </span>
            <h2 className="text-xl font-semibold">
              WooCommerce Products API
            </h2>
          </div>

          {productsTest.success ? (
            <div>
              <p className="text-green-600 mb-4">
                ✓ Successfully fetched {productsTest.data.length} products
              </p>
              <details className="cursor-pointer">
                <summary className="font-semibold">View Data</summary>
                <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto text-xs">
                  {JSON.stringify(productsTest.data, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div>
              <p className="text-red-600 mb-2">❌ Failed to fetch products</p>
              <p className="text-sm text-gray-600">
                Error: {productsTest.error || 'Unknown error'}
              </p>
              <div className="mt-4 bg-yellow-50 p-4 rounded">
                <p className="font-semibold">Troubleshooting:</p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Check NEXT_PUBLIC_WOOCOMMERCE_URL in .env.local</li>
                  <li>Verify WOOCOMMERCE_CONSUMER_KEY and SECRET</li>
                  <li>Ensure products exist in WooCommerce admin</li>
                  <li>Test: http://localhost:3000/wp-json/wc/v3/products</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* WordPress Hero Section Test */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">
              {heroTest.success ? '✅' : '⚠️'}
            </span>
            <h2 className="text-xl font-semibold">
              WordPress Hero Section (Optional)
            </h2>
          </div>

          {heroTest.success && heroTest.data ? (
            <div>
              <p className="text-green-600 mb-4">
                ✓ Successfully fetched hero section data
              </p>
              <details className="cursor-pointer">
                <summary className="font-semibold">View Data</summary>
                <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto text-xs">
                  {JSON.stringify(heroTest.data, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div>
              <p className="text-yellow-600 mb-2">
                ⚠️ No hero section found (this is optional)
              </p>
              <div className="mt-4 bg-blue-50 p-4 rounded">
                <p className="font-semibold">To enable hero sections:</p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Install Advanced Custom Fields (ACF) plugin</li>
                  <li>Create hero section fields (see HEADLESS_SETUP.md)</li>
                  <li>Add hero content to your Home page</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Product Reviews Test */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">
              {reviewsTest.success ? '✅' : '⚠️'}
            </span>
            <h2 className="text-xl font-semibold">
              Product Reviews API
            </h2>
          </div>

          {reviewsTest.success ? (
            <div>
              <p className="text-green-600 mb-4">
                ✓ Successfully fetched reviews ({reviewsTest.data.length} reviews)
              </p>
              {reviewsTest.data.length > 0 && (
                <details className="cursor-pointer">
                  <summary className="font-semibold">View Data</summary>
                  <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto text-xs">
                    {JSON.stringify(reviewsTest.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ) : (
            <div>
              <p className="text-yellow-600 mb-2">
                ⚠️ No reviews found (this is normal if you have no reviews yet)
              </p>
            </div>
          )}
        </div>

        {/* Store API Test (Client-Side Only) */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">ℹ️</span>
            <h2 className="text-xl font-semibold">
              Store API (Cart & Checkout)
            </h2>
          </div>

          <div>
            <p className="text-blue-600 mb-4">
              ℹ️ Store API must be tested client-side (in browser)
            </p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold mb-2">To test Store API:</p>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Open browser console on any page</li>
                <li>Run: <code className="bg-gray-200 px-2 py-1 rounded">
                  import(&apos;@/lib/store-api&apos;).then(m =&gt; m.storeAPI.getCart())
                </code></li>
                <li>Check for cart data in response</li>
              </ol>
            </div>
          </div>
        </div>

        {/* JWT Authentication Test */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">ℹ️</span>
            <h2 className="text-xl font-semibold">
              JWT Authentication
            </h2>
          </div>

          <div>
            <p className="text-blue-600 mb-4">
              ℹ️ Authentication requires JWT plugin setup
            </p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold mb-2">Setup checklist:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Install &quot;JWT Authentication for WP REST API&quot; plugin</li>
                <li>Add JWT_AUTH_SECRET_KEY to wp-config.php</li>
                <li>Test endpoint: http://localhost:3000/wp-json/jwt-auth/v1/token</li>
                <li>See HEADLESS_SETUP.md for detailed instructions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Environment Info */}
      <div className="mt-8 border rounded-lg p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">📋 Environment Info</h2>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-semibold">WooCommerce Consumer Key:</span>
            <br />
            <code className="bg-gray-200 px-2 py-1 rounded">
              {productsTest.loading ? '...' : productsTest.hasKey ? '✓ Configured' : '❌ Missing'}
            </code>
          </div>
          <div>
            <span className="font-semibold">WooCommerce Consumer Secret:</span>
            <br />
            <code className="bg-gray-200 px-2 py-1 rounded">
              {productsTest.loading ? '...' : productsTest.hasSecret ? '✓ Configured' : '❌ Missing'}
            </code>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-8 border-2 border-blue-500 rounded-lg p-6 bg-blue-50">
        <h2 className="text-xl font-semibold mb-4">🚀 Next Steps</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>If all tests pass, you&apos;re ready to integrate!</li>
          <li>See IMPLEMENTATION_EXAMPLES.md for code examples</li>
          <li>Migrate your cart to Store API for better functionality</li>
          <li>Set up JWT authentication for user accounts</li>
          <li>Configure WordPress CMS content (hero, banners)</li>
        </ol>
      </div>
    </div>
  );
}
