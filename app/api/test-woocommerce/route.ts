import { NextResponse } from 'next/server';
import { woocommerce } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await woocommerce.getProducts({ perPage: 3 });
    return NextResponse.json({ 
      success: true, 
      products,
      hasKey: !!process.env.WOOCOMMERCE_CONSUMER_KEY,
      hasSecret: !!process.env.WOOCOMMERCE_CONSUMER_SECRET,
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        hasKey: !!process.env.WOOCOMMERCE_CONSUMER_KEY,
        hasSecret: !!process.env.WOOCOMMERCE_CONSUMER_SECRET,
      },
      { status: 500 }
    );
  }
}
