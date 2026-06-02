# Beginner's Guide — Getting Started with Peptive Peptides

This guide is for someone who has **basic computer knowledge** but is new to web development. It will walk you through everything step by step.

---

## Table of Contents

1. [Understanding the Basics](#1-understanding-the-basics)
2. [What You Need Before Starting](#2-what-you-need-before-starting)
3. [Setting Up Your WordPress Backend](#3-setting-up-your-wordpress-backend)
4. [Setting Up the Frontend (Next.js)](#4-setting-up-the-frontend-nextjs)
5. [Running the Project Locally](#5-running-the-project-locally)
6. [Managing Your Store (Day-to-Day)](#6-managing-your-store-day-to-day)
7. [Understanding the Pages](#7-understanding-the-pages)
8. [Common Questions](#8-common-questions)

---

## 1. Understanding the Basics

### What is WordPress?
WordPress is a popular platform for building websites. In this project, it acts as your **admin panel** — where you manage products, orders, and customers. You never see it as a customer; it runs in the background.

### What is WooCommerce?
WooCommerce is a free plugin for WordPress that turns it into an online store. It handles products, prices, inventory, shipping, and orders.

### What is Next.js?
Next.js is a modern web framework (built on React) that creates the **website your customers see**. It's fast, responsive, and looks great on all devices.

### What is Stripe?
Stripe is a payment processor. When a customer buys something, Stripe handles the credit card payment securely. You never touch card numbers directly.

### How Do They Work Together?

```
Customer visits your website (Next.js)
    → Sees products (fetched from WooCommerce)
    → Adds items to cart (stored in their browser)
    → Proceeds to checkout
    → Pays via Stripe
    → Stripe confirms payment
    → Order is created in WooCommerce automatically
    → You see the order in WordPress admin
```

---

## 2. What You Need Before Starting

### Software to Install on Your Computer

| Software | What It Does | Download |
|----------|-------------|----------|
| **Node.js** (v18 or higher) | Runs the Next.js frontend | https://nodejs.org (LTS version) |
| **pnpm** | Package manager (installs dependencies) | Run `npm install -g pnpm` after installing Node.js |
| **Git** | Tracks code changes | https://git-scm.com |
| **VS Code** | Code editor (recommended) | https://code.visualstudio.com |

### Online Accounts You Need

| Service | What It Does | Where to Sign Up |
|---------|-------------|-----------------|
| **WordPress Hosting** | Hosts your WordPress backend | Cloudways, WP Engine, SiteGround, etc. |
| **Stripe Account** | Processes payments | https://stripe.com |
| **Vercel Account** | Hosts your frontend (free tier available) | https://vercel.com |
| **Google Analytics** (optional) | Tracks visitors | https://analytics.google.com |
| **Meta Business Suite** (optional) | Facebook/Instagram ad tracking | https://business.facebook.com |

---

## 3. Setting Up Your WordPress Backend

### Step 1: Install WordPress

If you don't already have WordPress installed, your hosting provider will have a one-click installer. Once installed, you can access your admin panel at:

```
https://your-domain.com/wp-admin
```

### Step 2: Install Required Plugins

Go to **Plugins → Add New** and install:

1. **WooCommerce** — Search "WooCommerce" and install + activate it
2. **JWT Authentication for WP REST API** — Search for it and install + activate

### Step 3: Install the Custom Plugin

The custom plugin is in the repository under `wordpress-plugin/peptive-bundles/`.

1. Zip the `peptive-bundles` folder
2. Go to **Plugins → Add New → Upload Plugin**
3. Upload the zip file and click **Activate**

### Step 4: Configure WooCommerce

1. Go to **WooCommerce → Settings → General**
   - Set your store address
   - Set currency to **United Arab Emirates dirham (AED)**

2. Go to **WooCommerce → Settings → Advanced → REST API**
   - Click **Add Key**
   - Description: "Next.js Frontend"
   - User: Select your admin user
   - Permissions: **Read/Write**
   - Click **Generate API Key**
   - **Copy the Consumer Key and Consumer Secret** — you'll need these later

### Step 5: Configure JWT Authentication

Edit your WordPress `wp-config.php` file (via FTP or your hosting file manager) and add these lines **before** the line that says `/* That's all, stop editing! */`:

```php
define('JWT_AUTH_SECRET_KEY', 'your-unique-secret-key-here');
define('JWT_AUTH_CORS_ENABLE', true);
```

Replace `your-unique-secret-key-here` with a random string (you can use https://api.wordpress.org/secret-key/1.1/salt/ to generate one).

### Step 6: Add CORS Support

Copy the contents of `UPDATED-FUNCTIONS.php` from the repository into your WordPress theme's `functions.php` file:

1. Go to **Appearance → Theme File Editor**
2. Select `functions.php`
3. Paste the code from `UPDATED-FUNCTIONS.php` at the end
4. **Important:** Update the `$allowed_origins` array with your actual frontend URL
5. Click **Update File**

### Step 7: Add Products

1. Go to **Products → Add New**
2. Fill in:
   - Product name
   - Description
   - Price (regular and sale price)
   - Product images
   - Categories (e.g., "all", "trending", "stack", "oral")
3. Click the **Arabic Translation** tab to add Arabic content
4. Click the **Monthly Pricing** tab to set 3-month and 6-month bundle prices
5. Click **Publish**

---

## 4. Setting Up the Frontend (Next.js)

### Step 1: Get the Code

Open a terminal (Command Prompt on Windows, Terminal on Mac) and run:

```bash
cd /path/to/where/you/want/the/project
git clone <your-repository-url>
cd peptive
```

### Step 2: Install Dependencies

```bash
pnpm install
```

This downloads all the libraries the project needs. It might take a minute.

### Step 3: Create Environment File

Create a file called `.env.local` in the project root:

```bash
# On Mac/Linux
touch .env.local

# On Windows (in the project folder)
# Just create a new file named .env.local
```

Open it in your editor and add:

```env
# WordPress Connection
NEXT_PUBLIC_WOOCOMMERCE_URL=https://your-wordpress-site.com
WOOCOMMERCE_CONSUMER_KEY=ck_your_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_secret_here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Peptive Peptides
```

Replace the placeholder values with your actual keys.

### Step 4: Run the Development Server

```bash
pnpm dev
```

You should see:

```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
```

Open `http://localhost:3000` in your browser. You should see the Peptive website!

---

## 5. Running the Project Locally

### Starting the Server

Every time you want to work on or preview the site:

```bash
cd /path/to/peptive
pnpm dev
```

### Stopping the Server

Press `Ctrl + C` in the terminal.

### Building for Production

To create an optimized production build:

```bash
pnpm build
```

To run the production build locally:

```bash
pnpm start
```

---

## 6. Managing Your Store (Day-to-Day)

### Adding a New Product

1. Log in to WordPress admin (`your-domain.com/wp-admin`)
2. Go to **Products → Add New**
3. Add product name, description, images, and prices
4. Set a category (e.g., "all" for it to show on /products page)
5. Add Arabic translations in the "Arabic Translation" tab
6. Set bundle pricing in the "Monthly Pricing" tab
7. Click **Publish**

The product will automatically appear on the frontend.

### Viewing Orders

1. Go to **WooCommerce → Orders**
2. You'll see all orders with status, customer details, and totals
3. Click an order to see full details including shipping address

### Managing Coupons

1. Go to **WooCommerce → Coupons → Add Coupon**
2. Set a code, discount type (percentage or fixed), and amount
3. Set usage limits if needed
4. Click **Publish**

Customers can enter the coupon code on the checkout page.

### Checking Inventory

1. Go to **Products → All Products**
2. The "Stock" column shows current inventory
3. For bundle products, stock is automatically calculated from component products

### Updating Product Verification Codes

The verification system uses an Excel file (`peptiveverificationcode.xlsx`) in the project root:
- Column A: Verification code
- Column B: Status ("used" or blank)

To add new codes, add rows to this spreadsheet.

---

## 7. Understanding the Pages

| URL | What It Shows |
|-----|--------------|
| `/` | Homepage — hero banner, trending products, stack builder, FAQs |
| `/products` | All products grid |
| `/products/bpc-157` | Individual product page (slug-based) |
| `/oral-peptides` | Oral peptides category |
| `/cart` | Full-page cart view |
| `/checkout` | Checkout form with billing, shipping, coupon, and Stripe payment |
| `/checkout/success` | "Thank you" page after payment |
| `/checkout/cancel` | Page shown when payment is cancelled |
| `/login` | User login |
| `/signup` | User registration |
| `/account` | User dashboard (profile, orders, addresses) |
| `/pages/dosage-calculator` | Interactive peptide dosage calculator |
| `/pages/authentication` | Product verification code checker |
| `/pages/instant-authentication` | Authentication success display |
| `/privacy-policy` | Privacy policy page |

---

## 8. Common Questions

### "Products aren't showing on the site"

- Check that your `.env.local` has the correct `NEXT_PUBLIC_WOOCOMMERCE_URL`
- Verify the WooCommerce Consumer Key and Secret are correct
- Make sure products are published (not draft) in WooCommerce
- Check that products have a category assigned
- Visit `http://localhost:3000/api/test-woocommerce` to test the connection

### "Checkout isn't working"

- Make sure your Stripe keys are correct in `.env.local`
- For testing, use Stripe's test mode keys (starting with `sk_test_` and `pk_test_`)
- Use test card number `4242 4242 4242 4242` with any future expiry and any CVC

### "Arabic isn't showing on product pages"

- Make sure you filled in the Arabic Translation tab in the WooCommerce product editor
- Make sure the Peptive Bundles plugin is activated
- The frontend reads Arabic from the `extensions['peptive-bundles']` field in the Store API

### "User login isn't working"

- Make sure the JWT Authentication plugin is installed and activated
- Check that `wp-config.php` has the JWT secret key defined
- Make sure `UPDATED-FUNCTIONS.php` code is in your theme's `functions.php`

### "WhatsApp button isn't working"

The WhatsApp button in the bottom-left links to `wa.me/971558225919`. To change this number, edit `app/layout.tsx` and update the `href` on the WhatsApp link.

### "How do I change the announcement bar text?"

Edit `lib/translations.ts` — look for `announcement_bar` in both the `en` and `ar` sections.

### "How do I change prices from AED to another currency?"

1. Change WooCommerce currency in **WooCommerce → Settings → General**
2. Update `lib/utils.ts` — change the `formatPrice()` function
3. Update `app/api/create-checkout-session/route.ts` — change `currency: 'aed'` to your currency
4. Update tracking events in `lib/tracking.ts` — change `currency: 'AED'`

---

## Next Steps

Once you're comfortable with this guide, check out the **[Advanced Guide](04-ADVANCED-GUIDE.md)** for:
- Deploying to production
- Setting up Stripe webhooks
- Customizing the design
- Adding new pages
- Performance optimization
- Troubleshooting

---

*This guide assumes you're starting fresh. If you already have WordPress set up, skip to the relevant sections.*