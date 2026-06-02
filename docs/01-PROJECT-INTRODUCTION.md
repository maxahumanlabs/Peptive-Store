# Peptive Peptides — Project Introduction

## Dear Client,

Thank you for trusting us with your project. This document explains **what we built, how we built it, and why we made these architectural decisions**.

---

## What Is This Project?

Peptive Peptides is a **headless e-commerce website** for selling research peptides, primarily targeting the UAE and GCC market. It is a fully custom storefront with bilingual support (English & Arabic), Stripe payment processing, product authentication, and a dosage calculator.

---

## What Does "Headless" Mean?

In a traditional WordPress/WooCommerce site, WordPress handles **both** the backend (products, orders, users) and the frontend (what the visitor sees). The design is controlled by a WordPress theme.

In a **headless** architecture, we split these two concerns:

```
┌──────────────────────────────────┐
│         FRONTEND (Next.js)       │  ← What visitors see and interact with
│  Custom React UI, Tailwind CSS,  │     Hosted on Vercel (or any Node host)
│  Client-side cart, Stripe, i18n  │
└────────────┬─────────────────────┘
             │  REST API calls (JSON)
             ▼
┌──────────────────────────────────┐
│      BACKEND (WordPress +        │  ← Products, orders, users, inventory
│        WooCommerce)              │     Hosted on any WordPress host
│   Custom Plugin, Store API       │
└──────────────────────────────────┘
```

### Why Headless?

| Benefit | Explanation |
|---------|-------------|
| **Speed** | Next.js generates lightning-fast pages. No WordPress frontend bloat. |
| **Custom Design** | We have **full control** over every pixel. No theme limitations. |
| **Scalability** | Frontend and backend can scale independently. |
| **Security** | WordPress admin is hidden from end users. Only the API is exposed. |
| **Modern UX** | Smooth page transitions, real-time cart sidebar, parallax effects — things that are very hard to achieve with WordPress themes. |
| **SEO** | Next.js supports server-side rendering for excellent search engine indexing. |

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | Next.js 14 (React 18) | Pages, routing, server-side rendering |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS for rapid, consistent UI |
| **State Management** | Zustand | Lightweight cart state, persisted to localStorage |
| **Payments** | Stripe Checkout | Secure payment processing (AED currency) |
| **Backend CMS** | WordPress + WooCommerce | Product management, orders, customers, inventory |
| **Custom Plugin** | Peptive Product Bundles | Arabic translations, bundle pricing, custom product types |
| **Language** | TypeScript | Type-safe JavaScript for fewer bugs |
| **Authentication** | JWT (JSON Web Tokens) | Secure user login via WordPress REST API |
| **Analytics** | Google Analytics 4 + Meta Pixel | Visitor tracking and e-commerce event logging |
| **Deployment** | Vercel (frontend) | Automatic deployments from Git |

---

## API Keys & Environment Variables You Need

The frontend needs the following environment variables to connect to your WordPress backend and services. These are stored in a `.env.local` file (never committed to Git).

### Required Keys

| Variable | Where to Get It | Purpose |
|----------|----------------|---------|
| `NEXT_PUBLIC_WOOCOMMERCE_URL` | Your WordPress site URL (e.g., `https://your-wordpress-site.com`) | Base URL for all API calls |
| `NEXT_PUBLIC_WOOCOMMERCE_HOST` | Same domain as above (optional, for Local by Flywheel setups) | Host header for virtual host routing |
| `WOOCOMMERCE_CONSUMER_KEY` | WooCommerce → Settings → Advanced → REST API → Add Key | Read/write access to WooCommerce REST API |
| `WOOCOMMERCE_CONSUMER_SECRET` | Same as above | Paired with the consumer key |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys | Server-side Stripe operations |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API Keys | Client-side Stripe initialization |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks → Signing secret | Verify webhook signatures |
| `NEXT_PUBLIC_SITE_URL` | Your frontend URL (e.g., `https://peptivepeptides.com`) | Redirect URLs for Stripe checkout |
| `NEXT_PUBLIC_SITE_NAME` | `Peptive Peptides` | Brand name used in payment descriptions |

### Optional Keys (Analytics)

| Variable | Where to Get It | Purpose |
|----------|----------------|---------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics → Admin → Data Streams | Google Analytics 4 tracking |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Business Suite → Events Manager → Pixels | Facebook/Instagram ad tracking |

### Example `.env.local` File

```env
# WordPress / WooCommerce
NEXT_PUBLIC_WOOCOMMERCE_URL=https://your-wordpress-site.com
WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret_here

# Stripe
STRIPE_SECRET_KEY=sk_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Site
NEXT_PUBLIC_SITE_URL=https://peptivepeptides.com
NEXT_PUBLIC_SITE_NAME=Peptive Peptides

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXXX
```

---

## WordPress Backend Setup Requirements

For the headless frontend to work, your WordPress installation needs:

### 1. Plugins Required on WordPress

| Plugin | Purpose |
|--------|---------|
| **WooCommerce** | E-commerce engine (products, orders, cart) |
| **JWT Authentication for WP REST API** | Enables user login from the frontend |
| **Peptive Product Bundles** (custom, included in repo) | Arabic translations, bundle pricing, custom product type |

### 2. WordPress Configuration

The file `UPDATED-FUNCTIONS.php` contains code that **must be added to your theme's `functions.php`** or a site-specific plugin. It provides:

- **CORS headers** — Allows the Next.js frontend (on a different domain) to communicate with WordPress APIs.
- **Store API nonce bypass** — Required for headless cart/checkout operations.
- **Custom user registration endpoint** — Allows the signup page to create WordPress users.

### 3. JWT Plugin Configuration

Add these lines to your WordPress `wp-config.php`:

```php
define('JWT_AUTH_SECRET_KEY', 'your-unique-secret-key-here');
define('JWT_AUTH_CORS_ENABLE', true);
```

### 4. WooCommerce REST API Keys

1. Go to **WooCommerce → Settings → Advanced → REST API**
2. Click **Add Key**
3. Set permissions to **Read/Write**
4. Copy the Consumer Key and Consumer Secret into your `.env.local`

---

## How the Two Systems Communicate

```
User visits peptivepeptides.com
         │
         ▼
   Next.js Frontend (Vercel)
         │
         ├──► WooCommerce Store API (/wp-json/wc/store/v1/)
         │    → Fetch products (no auth needed)
         │    → Cart operations
         │
         ├──► WooCommerce REST API (/wp-json/wc/v3/)
         │    → Product reviews (auth required)
         │    → Coupons, orders, customers
         │    → Protected by Consumer Key/Secret
         │
         ├──► WordPress REST API (/wp-json/wp/v2/)
         │    → Pages, media, CMS content
         │    → User login (JWT)
         │
         ├──► Stripe API
         │    → Create checkout sessions
         │    → Process payments
         │
         └──► Stripe Webhooks → Next.js API Route
              → On payment success, create WooCommerce order
```

---

## Deployment Overview

| Component | Where | How |
|-----------|-------|-----|
| **Frontend** | Vercel (recommended) | Connect Git repo → auto-deploys on push |
| **WordPress** | Any WordPress host (Cloudways, WP Engine, etc.) | Standard WordPress hosting |
| **Stripe Webhooks** | Stripe Dashboard | Point to `https://your-site.com/api/webhooks/stripe` |

---

## Summary

This project gives you:

- A **blazing-fast** custom storefront that looks nothing like a typical WordPress site
- **Full control** over your products, orders, and inventory through WordPress admin
- **Bilingual support** (English + Arabic with RTL) baked into every page
- **Secure payments** via Stripe with automatic order creation in WooCommerce
- A **custom WordPress plugin** that adds Arabic translation fields, bundle pricing, and product bundling
- **Analytics tracking** with Google Analytics 4 and Meta Pixel for marketing insights
- **Product authentication** system for customers to verify their purchases

Everything is built with modern, industry-standard technologies that are maintainable and scalable.

---

*Document prepared as part of the Peptive Peptides freelance project handoff.*
