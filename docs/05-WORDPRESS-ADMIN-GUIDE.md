# WordPress Admin Panel Guide — Managing Your Peptive Store

This guide is for **non-developers** who need to manage products, categories, orders, and settings through the WordPress admin panel. No coding knowledge required.

---

## Table of Contents

1. [How to Log In to Your WordPress Admin](#1-how-to-log-in-to-your-wordpress-admin)
2. [Navigating the Admin Dashboard](#2-navigating-the-admin-dashboard)
3. [Understanding Categories — How They Control Your Website Pages](#3-understanding-categories--how-they-control-your-website-pages)
4. [Adding a New Product](#4-adding-a-new-product)
5. [Editing an Existing Product](#5-editing-an-existing-product)
6. [Managing Categories](#6-managing-categories)
7. [Setting Up Bundle Pricing (3-Month & 6-Month)](#7-setting-up-bundle-pricing-3-month--6-month)
8. [Adding Arabic Translations to Products](#8-adding-arabic-translations-to-products)
9. [Managing Product Images](#9-managing-product-images)
10. [Managing Inventory / Stock](#10-managing-inventory--stock)
11. [Featured Products — Homepage Spotlight](#11-featured-products--homepage-spotlight)
12. [Managing Orders](#12-managing-orders)
13. [Managing Coupons / Discount Codes](#13-managing-coupons--discount-codes)
14. [Managing Customers](#14-managing-customers)
15. [WooCommerce Settings Overview](#15-woocommerce-settings-overview)
16. [Important Settings We Have Configured](#16-important-settings-we-have-configured)
17. [Quick Reference — Which Category Shows Where](#17-quick-reference--which-category-shows-where)
18. [Common Tasks Cheat Sheet](#18-common-tasks-cheat-sheet)
19. [Troubleshooting](#19-troubleshooting)

---

## 1. How to Log In to Your WordPress Admin

### Step 1: Open Hostinger (Your Hosting Provider)

1. Go to **https://hpanel.hostinger.com** in your web browser
2. Log in with your Hostinger email and password
3. You will see your **Hostinger Dashboard** with your websites listed

### Step 2: Access WordPress from Hostinger

**Option A — Direct WordPress Login (Recommended):**

1. In the Hostinger dashboard, find your website and click **Manage**
2. In the left sidebar, click **WordPress** → **Overview**
3. Click the **Edit Website** button or **WP Admin** button — this will log you in automatically

**Option B — Manual Login:**

1. Open your browser and go to:
   ```
   https://your-domain.com/wp-admin
   ```
   (Replace `your-domain.com` with your actual website address)
2. Enter your WordPress **username** and **password**
3. Click **Log In**

You should now see the **WordPress Dashboard**.

---

## 2. Navigating the Admin Dashboard

Once logged in, you will see a dark sidebar on the left. Here are the sections you'll use most:

| Sidebar Item | What It's For |
|-------------|--------------|
| **Dashboard** | Overview of your site — recent orders, activity, stats |
| **Posts** | Blog posts (not used much in this project) |
| **Media** | All uploaded images and files |
| **Pages** | WordPress pages (the website pages are handled by Next.js, not here) |
| **Products** | ⭐ **Your main workspace** — add, edit, and manage all products |
| **WooCommerce** | Orders, customers, coupons, reports, and settings |
| **Appearance** | Themes and site appearance (no need to change — our frontend is custom) |
| **Plugins** | Installed plugins — make sure **WooCommerce**, **JWT Authentication**, and **Peptive Product Bundles** are active |
| **Users** | User accounts for the admin panel |
| **Settings** | WordPress general settings |

### Key Areas You'll Visit Most:

- **Products → All Products** — See and edit all your products
- **Products → Add New** — Create a new product
- **Products → Categories** — Manage product categories
- **WooCommerce → Orders** — See customer orders
- **WooCommerce → Coupons** — Create discount codes
- **WooCommerce → Settings** — Store configuration

---

## 3. Understanding Categories — How They Control Your Website Pages

**This is the most important section.** Categories in WooCommerce directly control which products appear on which page of your website.

### How It Works

Your website has several product pages. Each page pulls products from a **specific WooCommerce category**. When you assign a category to a product, that product will automatically show up on the corresponding page.

### Category → Page Mapping

| WooCommerce Category (Slug) | Website Page | URL | What Shows There |
|------------------------------|-------------|-----|-----------------|
| **all** | All Peptides | `/products` | The main shop page showing all products |
| **oral** | Oral Peptides | `/oral-peptides` | Only oral peptide supplements |
| **stack** | Stack Builder | `/stack` | Products customers can combine into stacks |
| **trending** | Homepage — Trending Section | `/` (homepage) | Up to 10 trending products shown on the homepage |

### What Does This Mean in Practice?

- If you create a new product and assign it the category **"all"**, it will appear on the **All Peptides** page (`/products`).
- If you also assign it the category **"trending"**, it will **additionally** appear in the **Trending section on the homepage**.
- A product can belong to **multiple categories**. For example, a product can be in both **"all"** and **"oral"** and **"trending"** — it will then appear on all three pages.

### Example:

You create a product called "BPC-157 Oral":
- You assign categories: **all**, **oral**, **trending**
- Result:
  - ✅ Shows on `/products` (All Peptides page)
  - ✅ Shows on `/oral-peptides` (Oral Peptides page)
  - ✅ Shows on the homepage trending section
  - ❌ Does NOT show on `/stack` (because you didn't assign the "stack" category)

### Featured Products (Special)

The homepage also has a **Featured Products** section. This does NOT use a category. Instead:
- Go to the product in WordPress
- In the right sidebar, find the **"Catalog visibility"** section
- Check the ✅ **"This is a featured product"** checkbox (or use the star icon in the product list)
- The homepage will show up to **4 featured products**

---

## 4. Adding a New Product

### Step-by-Step:

1. In the WordPress sidebar, click **Products → Add New**

2. **Product Name** — Type the product name at the top (e.g., "BPC-157 Oral Capsules")

3. **Product Description** — In the large text editor below the title, write a detailed description. This shows on the product detail page. You can use formatting (bold, lists, etc.)

4. **Short Description** — Scroll down to find **"Product short description"**. Write a brief 1-2 sentence summary. This appears as the subtitle on the product page.

5. **Product Data Section** (the big box in the middle):

   a. Make sure the product type dropdown says **"Simple product"**
   
   b. **General Tab:**
      - **Regular price** — The original price (e.g., `49`)
      - **Sale price** — The discounted price, leave empty if no sale (e.g., `39`)
   
   c. **Inventory Tab:**
      - **SKU** — A unique product code (e.g., `BPC-157-ORAL`)
      - **Manage stock** — Check this box ✅
      - **Stock quantity** — How many units you have (e.g., `100`)
      - **Allow backorders** — Usually set to "Do not allow"
   
   d. **Arabic Translation Tab** *(from Peptive Bundles plugin):*
      - Arabic Product Name
      - Arabic Short Description
      - Arabic Full Description
      - Arabic Tags
      - *(See [Section 8](#8-adding-arabic-translations-to-products) for details)*
   
   e. **Bundle Pricing Tab** *(from Peptive Bundles plugin):*
      - 3-Month Regular Price & Sale Price
      - 6-Month Regular Price & Sale Price
      - *(See [Section 7](#7-setting-up-bundle-pricing-3-month--6-month) for details)*

6. **Product Categories** (right sidebar):
   - Check the boxes for the categories this product belongs to
   - At minimum, always check ✅ **"all"** so it shows on the main products page
   - Add more categories as needed (oral, stack, trending)

7. **Product Tags** (right sidebar):
   - Add relevant tags like "peptide", "oral", "research", etc.
   - Tags help with search and filtering

8. **Product Image** (right sidebar):
   - Click **"Set product image"**
   - Upload or select the main product image
   - This is the primary image shown in product cards and the detail page

9. **Product Gallery** (right sidebar):
   - Click **"Add product gallery images"**
   - Upload additional images that show in the product image carousel

10. Click **Publish** (blue button, top-right)

**That's it! The product will now automatically appear on the website on all the pages corresponding to its categories.**

---

## 5. Editing an Existing Product

1. Go to **Products → All Products**
2. You'll see a list of all your products with columns: Name, SKU, Stock, Price, Categories, Tags, Date
3. **Hover over** a product name — you'll see options appear:
   - **Edit** — Open full editing page
   - **Quick Edit** — Edit basic info (name, price, categories, stock) without opening the full page
   - **Trash** — Delete the product
   - **View** — Preview the product
4. Click **Edit** to make changes
5. Make your changes
6. Click **Update** (blue button, top-right)

### Quick Edit (for fast changes):

Quick Edit is great for quickly changing:
- Product name
- Price
- Stock quantity
- Categories
- Status (published/draft)

Just hover over the product → click **Quick Edit** → make changes → click **Update**.

---

## 6. Managing Categories

### Viewing & Creating Categories

1. Go to **Products → Categories**
2. On the left side, you can **add a new category**:
   - **Name** — The display name (e.g., "Oral Peptides")
   - **Slug** — The URL-friendly name — **THIS IS CRITICAL** (e.g., `oral`)
   - **Parent category** — Leave as "None" for top-level categories
   - **Description** — Optional description
   - **Thumbnail** — Optional category image
3. Click **Add new category**

### ⚠️ Important: Category Slugs Must Match Exactly

The website code looks for these **exact slugs**:

| Category Name (you choose) | Slug (MUST be exactly this) | Used For |
|---------------------------|----------------------------|---------|
| All Peptides | `all` | Main products page |
| Oral | `oral` | Oral peptides page |
| Stack | `stack` | Stack builder page |
| Trending | `trending` | Homepage trending section |

**If the slug is wrong (e.g., "All" instead of "all", or "oral-peptides" instead of "oral"), products will NOT show on the correct page.**

### Editing a Category

1. On the right side of the Categories page, you'll see the list of existing categories
2. **Hover over** a category name → click **Edit**
3. Change what you need
4. Click **Update**

### Deleting a Category

1. Hover over a category → click **Delete**
2. This removes the category but does NOT delete the products in it

### Can I Add New Categories?

Yes! You can create any additional categories you want for organizing products. However, **only the four categories listed above** (all, oral, stack, trending) are connected to specific website pages. New categories you create can be used for internal organization but won't automatically have a page on the website (that requires a developer to set up).

---

## 7. Setting Up Bundle Pricing (3-Month & 6-Month)

Our website shows customers three purchasing options on each product page:
- **1-Month Supply** — Uses the regular product price
- **3-Month Supply** — Uses custom bundle pricing (discounted)
- **6-Month Supply** — Uses custom bundle pricing (best value)

### How to Set Bundle Prices:

1. Edit a product (or create a new one)
2. In the **Product Data** box, click the **"Bundle Pricing"** tab (added by the Peptive Bundles plugin)
3. Fill in:
   - **3-Month Regular Price** — The "original" price for 3 months (e.g., `147`)
   - **3-Month Sale Price** — The discounted 3-month price (e.g., `127`)
   - **6-Month Regular Price** — The "original" price for 6 months (e.g., `294`)
   - **6-Month Sale Price** — The discounted 6-month price (e.g., `247`)
4. Click **Update** / **Publish**

### What Happens If I Leave Bundle Prices Empty?

If you don't set bundle prices, the website will **automatically calculate** them by multiplying the single product price:
- 3-Month = Product Price × 3
- 6-Month = Product Price × 6

So if a product costs AED 49, the website will show AED 147 for 3-month and AED 294 for 6-month (no discount). Setting custom bundle prices lets you offer multi-month discounts.

---

## 8. Adding Arabic Translations to Products

The website supports both **English** and **Arabic**. When a visitor switches to Arabic, the product information changes to Arabic text. You need to manually provide Arabic content for each product.

### How to Add Arabic Translations:

1. Edit a product
2. In the **Product Data** box, click the **"Arabic Translation"** tab
3. Fill in:
   - **Arabic Product Name** — The product name in Arabic (e.g., `بي بي سي-157`)
   - **Arabic Short Description** — Brief product summary in Arabic
   - **Arabic Description** — Full product description in Arabic
   - **Arabic Tags** — Comma-separated tags in Arabic
4. Click **Update** / **Publish**

### What Happens If I Don't Add Arabic Translations?

The website will fall back to showing the **English** name and description when a visitor switches to Arabic. The page layout and buttons will still be in Arabic, but the product-specific text will remain in English.

---

## 9. Managing Product Images

### Product Image (Main Image)

- This is the primary image shown in product cards on listing pages and as the main image on the product detail page
- **Recommended size:** At least 800×800 pixels, square format
- To set: Edit product → right sidebar → **Product Image → Set product image**

### Product Gallery (Additional Images)

- These are extra images shown in the image carousel on the product detail page
- Customers can scroll through them
- To add: Edit product → right sidebar → **Product Gallery → Add product gallery images**

### Tips:
- Use high-quality images with a clean/white background
- Keep file sizes reasonable (under 500KB per image) for fast loading
- Use `.jpg` or `.webp` format for photos, `.png` for images with transparency

---

## 10. Managing Inventory / Stock

### Setting Up Stock for a Product:

1. Edit the product
2. Go to **Product Data → Inventory** tab
3. Check ✅ **"Manage stock?"**
4. Enter the **Stock quantity** (e.g., `50`)
5. Set **"Allow backorders?"** to "Do not allow" (recommended)
6. Set **"Low stock threshold"** (optional) — you'll get an email when stock reaches this number
7. Click **Update**

### Viewing Stock Across All Products:

1. Go to **Products → All Products**
2. The **Stock** column shows the status for each product:
   - **In stock (50)** — Product is available, 50 units left
   - **Out of stock** — No units available, product shows "Out of Stock" on website
   - **On backorder** — Taking orders despite no stock

### What Happens When Stock Reaches 0?

- The product will automatically show as **"Out of Stock"** on the website
- The "Add to Cart" button will be replaced with a **"Notify Me"** option
- Customers cannot purchase out-of-stock products

---

## 11. Featured Products — Homepage Spotlight

The homepage has a **Featured Products** section that highlights up to 4 products.

### How to Feature a Product:

**Method 1 — From the Product List:**
1. Go to **Products → All Products**
2. Find the product you want to feature
3. Click the ⭐ **star icon** next to the product name
4. The star turns yellow = product is now featured

**Method 2 — From the Product Editor:**
1. Edit the product
2. In the right sidebar, find **"Catalog visibility"**
3. Click **Edit** next to it
4. Check ✅ **"This is a featured product"**
5. Click **OK**, then **Update**

### How Many Products to Feature?

The homepage displays up to **4 featured products**. If you feature more than 4, only the first 4 will be shown.

---

## 12. Managing Orders

### Viewing Orders:

1. Go to **WooCommerce → Orders**
2. You'll see a list of all orders with:
   - **Order number** (e.g., #1234)
   - **Date**
   - **Status** (Processing, Completed, Cancelled, etc.)
   - **Customer name**
   - **Total amount**

### Order Statuses:

| Status | Meaning |
|--------|---------|
| **Processing** | Payment received, order needs to be fulfilled (shipped) |
| **Completed** | Order has been fulfilled and delivered |
| **On Hold** | Waiting for payment confirmation |
| **Cancelled** | Order was cancelled |
| **Refunded** | Payment was refunded |

### Viewing Order Details:

1. Click on an order number
2. You'll see:
   - Items ordered (product names, quantities, prices)
   - Billing address
   - Shipping address
   - Payment method (Stripe)
   - Stripe transaction ID (in order notes)
   - Order total breakdown (subtotal, tax, shipping, discounts)

### Updating Order Status:

1. Open the order
2. In the **"Order status"** dropdown (top right), select the new status
3. Click **Update**
4. The customer may receive an email notification depending on your WooCommerce email settings

### How Orders Are Created:

Orders are created **automatically** when a customer completes a Stripe payment:
1. Customer fills checkout form on the website
2. Customer pays via Stripe
3. Stripe confirms payment
4. Our system automatically creates the order in WooCommerce with status "Processing"
5. You receive the order in your WooCommerce → Orders list

**You do NOT need to create orders manually.**

---

## 13. Managing Coupons / Discount Codes

### Creating a New Coupon:

1. Go to **WooCommerce → Coupons** (or **Marketing → Coupons** in newer WooCommerce versions)
2. Click **Add Coupon**
3. Fill in:

   **General Tab:**
   - **Coupon code** — What customers type (e.g., `SAVE10`, `WELCOME20`)
   - **Discount type:**
     - **Percentage discount** — e.g., 10% off
     - **Fixed cart discount** — e.g., AED 20 off the total
   - **Coupon amount** — The discount value (e.g., `10` for 10% or AED 10)
   - **Allow free shipping** — Check if this coupon includes free shipping
   - **Coupon expiry date** — When the coupon stops working

   **Usage Restrictions Tab:**
   - **Minimum spend** — Customer must spend at least this much (e.g., AED 100)
   - **Maximum spend** — Maximum cart total allowed
   - **Individual use only** — Can't be combined with other coupons

   **Usage Limits Tab:**
   - **Usage limit per coupon** — Total times this coupon can be used (e.g., 100)
   - **Usage limit per user** — Times one customer can use it (e.g., 1)

4. Click **Publish**

### How Customers Use Coupons:

On the checkout page, customers will see a **"Have a coupon?"** field. They type the code and click Apply. The discount is calculated and shown in the order summary before payment.

---

## 14. Managing Customers

### Viewing Customers:

1. Go to **WooCommerce → Customers**
2. You'll see a list of registered customers with:
   - Name
   - Email
   - Orders count
   - Total spent
   - Last active date

### Customer Details:

Click on a customer to see:
- Billing and shipping addresses
- Order history
- Account information

### Note on Customer Registration:

Customers can create accounts through the website's signup page (`/signup`). Their accounts are stored in WordPress and they can log in to view their orders and saved addresses.

---

## 15. WooCommerce Settings Overview

Go to **WooCommerce → Settings** to access store settings. Here are the tabs:

### General Tab
- **Store address** — Your business address
- **Currency** — Set to **United Arab Emirates dirham (AED)** ⚠️ Do not change
- **Currency options** — Decimal places, thousand separator, etc.
- **Selling locations** — Where you sell to (leave as configured)

### Products Tab
- **Measurements** — Weight/dimension units
- **Reviews** — Enable/disable product reviews
- **Inventory** — Low stock notifications, out of stock visibility

### Shipping Tab
- Shipping zones and rates are configured here
- **Our shipping logic:**
  - 🇦🇪 **UAE** — Free shipping
  - 🇸🇦🇰🇼🇶🇦🇧🇭🇴🇲 **GCC countries** (Saudi Arabia, Kuwait, Qatar, Bahrain, Oman) — AED 25
  - 🌍 **Other countries** — AED 50
- ⚠️ The actual shipping calculation is handled by our custom code, but WooCommerce settings should match for order records

### Payments Tab
- Payment processing is handled by **Stripe** through our custom checkout
- You do not need to configure WooCommerce payment gateways

### Accounts & Privacy Tab
- Customer account settings
- Privacy policy settings

### Emails Tab
- Email notifications for orders, shipping, etc.
- You can customize which emails are sent and their content
- **Useful emails to enable:**
  - New order (sends to you when an order is placed)
  - Processing order (sends to customer when order is processing)
  - Completed order (sends to customer when order is marked complete)

### Advanced Tab
- **REST API** — Where API keys are managed (needed for the website connection)
  - ⚠️ Do not delete or change existing API keys unless you know what you're doing
- **Webhooks** — Event notifications (configured for Stripe)

---

## 16. Important Settings We Have Configured

These settings have been set up during development. **Please do not change them** unless you've consulted with a developer:

| Setting | Value | Why |
|---------|-------|-----|
| **Currency** | AED (United Arab Emirates Dirham) | The entire checkout and pricing system uses AED |
| **REST API Keys** | Consumer Key + Secret | The website uses these to communicate with WooCommerce |
| **JWT Authentication** | Enabled via plugin | Required for user login functionality |
| **Peptive Bundles Plugin** | Activated | Provides Arabic translations, bundle pricing, and bundle product type |
| **CORS Headers** | Configured in functions.php | Allows the frontend website to communicate with WordPress |
| **Permalink Structure** | Post name (`/%postname%/`) | Required for the REST API to work properly |

### Plugins That Must Stay Active:

| Plugin | What Happens If Deactivated |
|--------|---------------------------|
| **WooCommerce** | Entire store stops working — no products, no orders |
| **JWT Authentication for WP REST API** | Customer login stops working |
| **Peptive Product Bundles** | Arabic translations disappear, bundle pricing disappears |

---

## 17. Quick Reference — Which Category Shows Where

Here's a visual map of how categories map to your website:

```
YOUR WEBSITE PAGES
==================

🏠 HOMEPAGE (/)
├── Featured Products Section ← Products marked as "Featured" ⭐ (up to 4)
├── Trending Section          ← Category: "trending" (up to 10)
└── Stack Preview             ← Category: "stack" (shows 3 products)

📦 ALL PEPTIDES (/products)
└── All products              ← Category: "all" (up to 24)

💊 ORAL PEPTIDES (/oral-peptides)
└── Oral products only        ← Category: "oral" (up to 24)

🧱 STACK BUILDER (/stack)
└── Stackable products        ← Category: "stack" (up to 100)

📄 PRODUCT PAGE (/products/product-name)
└── Individual product        ← Shows when you click any product
    ├── 1-Month pricing       ← From product's regular/sale price
    ├── 3-Month pricing       ← From Bundle Pricing tab
    └── 6-Month pricing       ← From Bundle Pricing tab
```

### Assigning Multiple Categories:

A single product can appear on multiple pages. Just check multiple category boxes:

| Product Example | Categories Assigned | Appears On |
|----------------|--------------------|-----------| 
| BPC-157 Oral | ✅ all, ✅ oral, ✅ trending | Products page, Oral Peptides page, Homepage trending |
| TB-500 Stack | ✅ all, ✅ stack | Products page, Stack Builder page |
| KPV Capsules | ✅ all, ✅ oral | Products page, Oral Peptides page |
| New Peptide X | ✅ all | Products page only |

---

## 18. Common Tasks Cheat Sheet

### "I want to add a new product to the store"
1. **Products → Add New** → Fill in name, description, price, images → Assign categories (at least "all") → **Publish**

### "I want a product to show on the Oral Peptides page"
1. Edit the product → In the right sidebar, check ✅ the **"oral"** category → **Update**

### "I want a product to be trending on the homepage"
1. Edit the product → Check ✅ the **"trending"** category → **Update**

### "I want to feature a product on the homepage"
1. Go to **Products → All Products** → Click the ⭐ star next to the product name

### "I want to put a product on sale"
1. Edit the product → **Product Data → General** → Enter a **Sale price** → **Update**

### "I want to change a product's price"
1. Edit the product → **Product Data → General** → Change **Regular price** and/or **Sale price** → **Update**

### "I want to update stock quantity"
1. Edit the product → **Product Data → Inventory** → Change **Stock quantity** → **Update**

### "I want to temporarily hide a product"
1. Edit the product → In the **Publish** box (top right), change **Status** from "Published" to **"Draft"** → **Update**
2. To show it again: Change status back to "Published"

### "I want to create a discount code"
1. **WooCommerce → Coupons → Add Coupon** → Fill in code, discount type, amount → **Publish**

### "I want to see today's orders"
1. **WooCommerce → Orders** → Use the date filter at the top

### "I want to mark an order as shipped/completed"
1. Open the order → Change **Status** to "Completed" → **Update**

### "I want to remove a product from the store"
1. **Products → All Products** → Hover over the product → Click **Trash**
2. Or: Edit the product → Change status to **Draft** (to hide but not delete)

### "I want to add a new product with Arabic support"
1. Create the product as normal
2. Click the **Arabic Translation** tab in Product Data
3. Add Arabic name, description, and tags
4. **Publish**

---

## 19. Troubleshooting

### "I added a product but it's not showing on the website"

- ✅ Is the product **Published** (not Draft)?
- ✅ Did you assign at least one of the four categories? (all, oral, stack, trending)
- ✅ Is the category slug correct? (lowercase, no spaces)
- ✅ Does the product have a price set?
- ✅ Wait 1-2 minutes — the website may cache products briefly

### "Products are showing on the wrong page"

- Check which categories are assigned to the product
- Remember: category slug must be exactly `all`, `oral`, `stack`, or `trending`
- A product with no matching category won't show on any page

### "Bundle pricing isn't showing on the product page"

- Make sure the **Peptive Product Bundles** plugin is activated (**Plugins** page)
- Check that you filled in the **Bundle Pricing** tab in the product editor
- Both regular and sale prices should be filled for best results

### "Arabic text isn't appearing when language is switched"

- Make sure the **Arabic Translation** tab is filled in for that product
- Make sure the **Peptive Product Bundles** plugin is activated
- If left empty, the website will show the English text as fallback

### "I can't see the Arabic Translation or Bundle Pricing tabs"

- The **Peptive Product Bundles** plugin might be deactivated
- Go to **Plugins** → Find "Peptive Product Bundles" → Click **Activate**

### "Orders aren't appearing in WooCommerce"

- Orders are created automatically when Stripe payment succeeds
- Check your internet connection — the webhook from Stripe needs to reach WordPress
- Check **WooCommerce → Status → Logs** for any error messages

### "I forgot my WordPress password"

- On the login page, click **"Lost your password?"**
- Enter your email address
- Check your email for a password reset link
- Or: Log in via Hostinger dashboard (it can auto-login you to WordPress)

### "The website looks broken or shows errors"

- **Do not panic** — this is usually a temporary issue
- Try clearing your browser cache (Ctrl+Shift+Delete)
- Check if all required plugins are activated
- Contact your developer if the issue persists

---

## Need Help?

If you encounter something not covered in this guide:

1. **Check the other documentation files** in the `docs/` folder
2. **Don't change settings you're unsure about** — it's always safer to ask first
3. **Take a screenshot** of any error messages before contacting support

---

*This guide covers the day-to-day management of your Peptive store through WordPress. For technical setup, deployment, and code changes, please refer to the other documentation files.*
