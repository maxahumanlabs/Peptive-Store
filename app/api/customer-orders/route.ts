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

    const orders = await woocommerce.getOrders({
      customer: customerId,
      perPage: 10,
      orderby: 'date',
      order: 'desc',
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Error fetching customer orders:', error);
    return NextResponse.json({ orders: [] });
  }
}
