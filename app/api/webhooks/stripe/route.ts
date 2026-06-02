import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import axios from 'axios';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-01-28.clover',
});

// This is your Stripe webhook secret (get it from Stripe Dashboard → Webhooks)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('Payment successful!', {
          sessionId: session.id,
          customerEmail: session.customer_email,
          amountTotal: session.amount_total,
        });

        // Create order in WooCommerce
        try {
          await createWooCommerceOrder(session);
          console.log('WooCommerce order created successfully');
        } catch (error) {
          console.error('Failed to create WooCommerce order:', error);
          // Don't fail the webhook - order payment is already successful
        }
        
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session expired:', session.id);
        // Handle expired sessions (optional)
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        // Handle successful payment
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent failed:', paymentIntent.id);
        // Handle failed payment (send notification, etc.)
        break;
      }

      case 'payment_intent.created': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent created:', paymentIntent.id);
        // Payment intent created - no action needed
        break;
      }

      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('Charge succeeded:', charge.id);
        // Charge successful - already handled by checkout.session.completed
        break;
      }

      case 'charge.updated': {
        const charge = event.data.object as Stripe.Charge;
        console.log('Charge updated:', charge.id);
        // Charge updated - informational only
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Create WooCommerce order from Stripe session
async function createWooCommerceOrder(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const billingDetails = JSON.parse(metadata.billingDetails || '{}');
  const shippingDetails = JSON.parse(metadata.shippingDetails || '{}');

  // Get line items from Stripe session with product metadata
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ['data.price.product'],
  });

  // Separate products from tax and shipping
  let taxAmount = 0;
  let shippingAmount = 0;
  const productLineItems: any[] = [];

  lineItems.data.forEach((item: any) => {
    const product = item.price.product as Stripe.Product;
    const productName = product.name.toLowerCase();
    
    // Check if this is tax or shipping line item
    if (productName.includes('tax')) {
      taxAmount = (item.amount_total || 0) / 100; // Convert from fils to AED
    } else if (productName.includes('shipping')) {
      shippingAmount = (item.amount_total || 0) / 100; // Convert from fils to AED
    } else {
      // Regular product
      productLineItems.push(item);
    }
  });

  // Transform product line items for WooCommerce
  const wooLineItems = productLineItems.map((item: any) => {
    // Get product metadata (contains WooCommerce product ID)
    const product = item.price.product as Stripe.Product;
    const productId = product.metadata?.product_id || 
                     product.metadata?.woocommerce_product_id || '0';
    
    return {
      product_id: parseInt(productId), // ✅ Get product ID from metadata
      quantity: item.quantity || 1,
      meta_data: [
        {
          key: '_bundle_type',
          value: product.metadata?.bundle_type || '',
        },
        {
          key: '_bundle_label',
          value: product.metadata?.bundle_label || '',
        },
        {
          key: '_stripe_line_item_id',
          value: item.id || '',
        },
      ],
    };
  });

  // Create order in WooCommerce
  const orderData = {
    status: 'processing',
    set_paid: true,
    customer_id: 0, // Guest checkout
    billing: {
      first_name: billingDetails.firstName || '',
      last_name: billingDetails.lastName || '',
      address_1: billingDetails.address1 || '',
      address_2: billingDetails.address2 || '',
      city: billingDetails.city || '',
      state: billingDetails.state || '',
      postcode: billingDetails.postcode || '',
      country: billingDetails.country || '',
      email: session.customer_email || billingDetails.email || '',
      phone: billingDetails.phone || '',
    },
    shipping: {
      first_name: shippingDetails.firstName || billingDetails.firstName || '',
      last_name: shippingDetails.lastName || billingDetails.lastName || '',
      address_1: shippingDetails.address1 || billingDetails.address1 || '',
      address_2: shippingDetails.address2 || billingDetails.address2 || '',
      city: shippingDetails.city || billingDetails.city || '',
      state: shippingDetails.state || billingDetails.state || '',
      postcode: shippingDetails.postcode || billingDetails.postcode || '',
      country: shippingDetails.country || billingDetails.country || '',
    },
    line_items: wooLineItems,
    shipping_lines: shippingAmount > 0 ? [{
      method_id: 'flat_rate',
      method_title: 'Shipping',
      total: shippingAmount.toFixed(2),
    }] : [],
    payment_method: 'stripe',
    payment_method_title: 'Credit Card (Stripe)',
    transaction_id: session.payment_intent as string,
    meta_data: [
      {
        key: '_stripe_session_id',
        value: session.id,
      },
      {
        key: '_stripe_payment_intent',
        value: session.payment_intent as string,
      },
      {
        key: '_stripe_customer_email',
        value: session.customer_email || '',
      },
      {
        key: '_payment_method',
        value: 'stripe_checkout',
      },
      {
        key: '_tax_amount',
        value: taxAmount.toFixed(2),
      },
      {
        key: '_shipping_amount',
        value: shippingAmount.toFixed(2),
      },
    ],
  };

  // Create WooCommerce API client
  const woocommerceAPI = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3`,
    auth: {
      username: process.env.WOOCOMMERCE_CONSUMER_KEY!,
      password: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const response = await woocommerceAPI.post('/orders', orderData);
  return response.data;
}
//   // const order = await woocommerce.post('orders', {
//   //   billing: billingDetails,
//   //   shipping: shippingDetails,
//   //   line_items: [...], // Extract from session
//   //   payment_method: 'stripe',
//   //   payment_method_title: 'Credit Card (Stripe)',
//   //   set_paid: true,
//   // });
//
//   // return order;
// }
