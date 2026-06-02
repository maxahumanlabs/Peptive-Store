import { NextRequest, NextResponse } from 'next/server';
import { woocommerce } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
    }

    const customer = await woocommerce.getCustomer(parseInt(customerId));

    return NextResponse.json({
      billing: customer.billing,
      shipping: customer.shipping,
    });
  } catch (error: any) {
    console.error('Error fetching customer addresses:', error);
    return NextResponse.json({ billing: null, shipping: null });
  }
}
