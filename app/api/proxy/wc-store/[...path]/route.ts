import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { path } = params;
  const searchParams = request.nextUrl.searchParams;
  
  const woocommerceUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
  const fullPath = path.join('/');
  const queryString = searchParams.toString();
  
  const url = `${woocommerceUrl}/wp-json/wc/store/v1/${fullPath}${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from WooCommerce' },
      { status: 500 }
    );
  }
}
