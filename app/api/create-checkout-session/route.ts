import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-01-28.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, couponCode, customerEmail, billingDetails, shippingDetails, tax, shipping } = body;

    // Log incoming items for debugging
    console.log('Creating checkout session with items:', JSON.stringify(items, null, 2));
    console.log('Tax:', tax, 'Shipping:', shipping);

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Transform cart items to Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: any) => {
      // Create a clear product name with bundle info
      const productName = item.bundleLabel 
        ? `${item.name} - ${item.bundleLabel}`
        : item.name;
      
      // Log for debugging
      console.log('Creating Stripe line item:', {
        name: productName,
        price: item.price,
        quantity: item.quantity,
        bundleType: item.bundleType,
        total: parseFloat(item.price) * item.quantity
      });
      
      return {
        price_data: {
          currency: 'aed', // UAE Dirham
          product_data: {
            name: productName,
            // Don't include images to avoid showing WordPress domain in Stripe checkout
            ...(item.shortDescription && { description: item.shortDescription }),
            metadata: {
              product_id: item.id.toString(), // ✅ Store WooCommerce product ID in metadata
              woocommerce_product_id: item.id.toString(), // Fallback field name
              bundle_type: item.bundleType || 'one-month',
              bundle_label: item.bundleLabel || '',
              cart_item_id: item.cartItemId || '',
            },
          },
          unit_amount: Math.round(parseFloat(item.price) * 100), // Convert to fils (cents)
        },
        quantity: item.quantity,
      };
    });

    // Add tax as a line item if tax amount is provided
    if (tax && tax > 0) {
      lineItems.push({
        price_data: {
          currency: 'aed',
          product_data: {
            name: 'Tax (5%)',
            description: 'Value Added Tax',
          },
          unit_amount: Math.round(tax * 100), // Convert to fils
        },
        quantity: 1,
      });
    }

    // Add shipping as a line item if shipping cost is provided
    if (shipping && shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'aed',
          product_data: {
            name: 'Shipping',
            description: 'Delivery charges',
          },
          unit_amount: Math.round(shipping * 100), // Convert to fils
        },
        quantity: 1,
      });
    }

    // Prepare session parameters
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/checkout?cancelled=true`,
      customer_email: customerEmail,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM', 'US', 'GB', 'CA'], // Customize based on your shipping regions
      },
      // Add business branding
      payment_intent_data: {
        description: `Order from ${process.env.NEXT_PUBLIC_SITE_NAME || 'Peptive Peptides'}`,
      },
      metadata: {
        billingDetails: JSON.stringify(billingDetails),
        shippingDetails: JSON.stringify(shippingDetails),
        site_name: process.env.NEXT_PUBLIC_SITE_NAME || 'Peptive Peptides',
      },
    };

    // Apply coupon/discount code if provided
    if (couponCode) {
      try {
        // Check if it's a promo code
        const promoCodes = await stripe.promotionCodes.list({
          code: couponCode,
          active: true,
          limit: 1,
        });

        if (promoCodes.data.length > 0) {
          sessionParams.discounts = [{
            promotion_code: promoCodes.data[0].id,
          }];
        } else {
          // Try as a coupon ID
          const coupon = await stripe.coupons.retrieve(couponCode);
          if (coupon && coupon.valid) {
            sessionParams.discounts = [{
              coupon: couponCode,
            }];
          }
        }
      } catch (error) {
        console.error('Coupon validation error:', error);
        // Continue without coupon if invalid
      }
    }

    // Calculate and log total amount for debugging
    const totalAmount = lineItems.reduce((sum, item) => {
      return sum + (item.price_data!.unit_amount! * (item.quantity ?? 1));
    }, 0);
    console.log('Total amount to be charged (in fils):', totalAmount, '(AED', (totalAmount / 100).toFixed(2), ')');

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
