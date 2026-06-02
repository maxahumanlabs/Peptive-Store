import { NextRequest, NextResponse } from 'next/server';
import { woocommerce } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { code, cartTotal } = await request.json();

    if (!code) {
      return NextResponse.json({ valid: false, message: 'Coupon code required' }, { status: 400 });
    }

    // Get coupon by code
    const coupons = await woocommerce.getCoupons({ code });

    if (!coupons || coupons.length === 0) {
      return NextResponse.json({ 
        valid: false, 
        message: 'Invalid coupon code' 
      });
    }

    const coupon = coupons[0];

    // Check if coupon is valid
    if (!coupon.id) {
      return NextResponse.json({ 
        valid: false, 
        message: 'Invalid coupon code' 
      });
    }

    // Check minimum amount
    const minimumAmount = parseFloat(coupon.minimum_amount || '0');
    if (minimumAmount > 0 && cartTotal < minimumAmount) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order amount of Dhs. ${minimumAmount.toFixed(2)} required`,
      });
    }

    // Check maximum amount
    const maximumAmount = parseFloat(coupon.maximum_amount || '0');
    if (maximumAmount > 0 && cartTotal > maximumAmount) {
      return NextResponse.json({
        valid: false,
        message: `Maximum order amount of Dhs. ${maximumAmount.toFixed(2)} exceeded`,
      });
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return NextResponse.json({
        valid: false,
        message: 'This coupon has reached its usage limit',
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percent') {
      discount = (cartTotal * parseFloat(coupon.amount)) / 100;
    } else if (coupon.discount_type === 'fixed_cart') {
      discount = parseFloat(coupon.amount);
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        amount: coupon.amount,
        discountType: coupon.discount_type,
        description: coupon.description,
        discount: discount,
      },
      message: 'Coupon applied successfully',
    });
  } catch (error: any) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ 
      valid: false, 
      message: 'Invalid coupon code' 
    });
  }
}
