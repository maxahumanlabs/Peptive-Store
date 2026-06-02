import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { items, country, state, postcode, city } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    if (!country) {
      return NextResponse.json(
        { error: 'Country is required' },
        { status: 400 }
      );
    }

    // Simple shipping calculation logic
    // You can customize this based on your shipping rules
    let shippingCost = 0;

    // Example: Free shipping for UAE, flat rate for other countries
    if (country === 'AE') {
      shippingCost = 0; // Free shipping in UAE
    } else if (['SA', 'KW', 'QA', 'BH', 'OM'].includes(country)) {
      shippingCost = 25; // AED 25 for GCC countries
    } else {
      shippingCost = 50; // AED 50 for other countries
    }

    return NextResponse.json({
      shipping: shippingCost,
      // Tax is now calculated on frontend (5% of subtotal)
    });
  } catch (error: any) {
    console.error('Error calculating shipping:', error.message);
    
    // Return default values if calculation fails
    return NextResponse.json({
      shipping: 0,
    }, { status: 200 });
  }
}
