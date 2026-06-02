# Peptive Product Bundles Plugin

All-in-one WordPress/WooCommerce plugin for product bundles, Arabic translations, and bundle pricing.

## Features

✅ **Custom Bundle Product Type** - Create bundles of multiple products  
✅ **Arabic Translation Fields** - Add Arabic name, description, short description, and tags  
✅ **Bundle Pricing** - Set custom pricing for 3-month and 6-month bundles  
✅ **Admin Interface** - Easy-to-use admin panel for all features  
✅ **Automatic Inventory Management** - Deducts stock from component products  
✅ **Order Details** - Shows bundle components in orders  
✅ **Store API Integration** - All data available via REST API  
✅ **Cart Display** - Shows bundle contents in cart  
✅ **Stock Tracking** - Bundle stock based on lowest stock of components  
✅ **Virtual Pricing** - Optional auto-calculate bundle price from components  

## Installation

### 1. Upload to WordPress

```bash
# Option A: Via WordPress Admin
1. Go to WordPress Admin → Plugins → Add New
2. Click "Upload Plugin"
3. Upload the peptive-bundles folder as a ZIP file
4. Click "Activate"

# Option B: Via FTP/File Manager
1. Upload the entire peptive-bundles folder to:
   /wp-content/plugins/
2. Go to WordPress Admin → Plugins
3. Find "Peptive Product Bundles" and click "Activate"
```

### 2. Activate Plugin

Once uploaded, activate the plugin from the WordPress admin panel:
- Navigate to **Plugins** → **Installed Plugins**
- Find **Peptive Product Bundles**
- Click **Activate**

## Usage

### 1. Adding Arabic Translations to Products

For **any product type** (Simple, Variable, Bundle):

1. **Go to Products → Edit Product** (or Add New)
2. **Click "Arabic Translation" tab**
3. **Fill in Arabic fields:**
   - Arabic Product Name (اسم المنتج بالعربية)
   - Arabic Short Description (وصف قصير بالعربية)
   - Arabic Description (وصف كامل بالعربية)
   - Arabic Tags (وسوم بالعربية - comma separated)
4. **Save/Update** the product

### 2. Setting Bundle Pricing (for Simple Products)

For **Simple products only**:

1. **Go to Products → Edit Product**
2. **Click "Bundle Pricing" tab**
3. **Set 3-Month Bundle Prices:**
   - Regular Price (3 months) - e.g., $147
   - Sale Price (3 months) - e.g., $127 (optional)
4. **Set 6-Month Bundle Prices:**
   - Regular Price (6 months) - e.g., $294
   - Sale Price (6 months) - e.g., $247 (optional)
5. **Leave empty for auto-calculation** (unit price × quantity)
6. **Save/Update** the product

**Example:**
- Single unit: $50 regular, $42 sale
- If 3-month bundle prices are empty → Auto-calculates to $126 ($42 × 3)
- If you set 3-month sale price to $119 → Uses custom $119 price

### 3. Creating a Bundle Product

1. **Go to Products → Add New** in WordPress admin
2. **Select Product Type**: Choose "Product Bundle" from the dropdown
3. **Click "Bundle Products" tab**
4. **Add Products**: Click "Add Product" to adall custom data:

### Get Products with All Custom Data

```javascript
// Regular WooCommerce API call
const response = await fetch('/wp-json/wc/v3/products');
const products = await response.json();

// All products will have:
products.forEach(product => {
  // Arabic translations (available for all product types)
  console.log('Arabic Name:', product.arabic_name);
  console.log('Arabic Description:', product.arabic_description);
  console.log('Arabic Short Description:', product.arabic_short_description);
  console.log('Arabic Tags:', product.arabic_tags);
  
  // Bundle pricing (available for simple products)
  if (product.bundle_pricing) {
    console.log('3-Month Price:', product.bundle_pricing.three_month);
    console.log('6-Month Price:', product.bundle_pricing.six_month);
    // Each has: { regular_price: "147.00", sale_price: "127.00" }
  }
  
  // Bundle items (for bundle products)
  if (product.is_bundle) {
    console.log('Bundle Items:', product.bundle_items);
  }
});
```

### Display Product with Arabic Support

```typescript
// In your Next.js product page
interface Product {
  name: string;
  arabic_name?: string;
  description: string;
  arabic_description?: string;
  short_description: string;
  arabic_short_description?: string;
  bundle_pricing?: {
    three_month: { regular_price: string; sale_price: string };
    six_month: { regular_price: string; sale_price: string };
  };
}

function ProductPage({ product, language }) {
  // Use Arabic if language is 'ar' and Arabic content exists
  const productName = language === 'ar' && product.arabic_name 
    ? product.arabic_name 
    : product.name;
  
  const productDesc = language === 'ar' && product.arabic_description 
    ? product.arabic_description 
    : product.description;
  
  return (
    <div>
      <h1>{productName}</h1>
      <div dangerouslySetInnerHTML={{ __html: productDesc }} />
      
      {/* Bundle pricing */}
      {product.bundle_pricing && (
        <div>
          <h3>3 Months</h3>
          <p>Price: ${product.bundle_pricing.three_month.sale_price || product.bundle_pricing.three_month.regular_price}</p>
          
          <h3>6 Months</h3>
          <p>Price: ${product.bundle_pricing.six_month.sale_price || product.bundle_pricing.six_month.regular_price}</p
    //   }
    // ]
  }
});
```

### Display Bundle in Frontend

```typescript
// In your Next.js product page
interface BundleItem {
  product_id: number;
  quantity: number;
  product: {
    name: string;
    price: string;
  };
}

function ProductPage({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      
      {product.is_bundle && (
        <div className="bundle-contents">
          <h3>This bundle includes:</h3>
          <ul>
            {product.bundle_items.map((item: BundleItem) => (
              <li key={item.product_id}>
                {item.product.name} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## File Structure

```
peptive-bundles/
├── peptive-bundles.php          # Main plugin file
├── README.md                     # This file
└── includes/
    ├── class-bundle-product-type.php  # Registers bundle product type
    ├── class-bundle-admin.php         # Admin interface
    ├── class-bundle-cart.php          # Cart handling
    ├── class-bundle-order.php         # Order display
    ├── class-bundle-inventory.php     # Stock management
    └── class-bundle-api.php           # REST API integration
```

## Stock Management

### How Bundle Stock Works

**⚠️ Important: Bundle availability depends on ALL component products**

1. **Out of Stock Detection:**
   - If ANY component product is out of stock → entire bundle becomes **out of stock**
   - If ANY component doesn't have enough quantity → bundle becomes **out of stock**
   - Bundle stock status is calculated automatically in real-time

2. **Stock Quantity Calculation:**
   - Bundle available quantity = lowest available quantity across all components
   - Example:
     - BPC-157: 10 in stock (need 2 per bundle) → can make 5 bundles
     - TB-500: 3 in stock (need 1 per bundle) → can make 3 bundles
     - **Bundle shows: 3 in stock** (limited by TB-500)

3. **Automatic Updates:**
   - When component stock changes → all bundles containing that product update automatically
   - When component goes out of stock → all bundles become out of stock immediately
   - REST API always returns accurate real-time stock status

4. **Purchase Flow:**
   - Customer adds bundle to cart
   - System checks all component availability
   - If any component out of stock → purchase prevented
   - On successful order → inventory deducted from each component
   - Bundle stock updates automatically

## Requirements

- WordPress 5.8+
- WooCommerce 6.0+
- PHP 7.4+

## Support

For issues or questions, contact the Peptive development team.

## Version

Current Version: 1.0.0
