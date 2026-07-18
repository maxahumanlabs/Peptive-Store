import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || 'https://yellow-deer-458884.hostingersite.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { product_id, reviewer, reviewer_email, review, rating, images } = body;

    if (!product_id || !reviewer || !reviewer_email || !review || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Forward the request to the custom WordPress REST API endpoint
    const response = await fetch(`${WP_URL}/wp-json/maxa/v1/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id,
        reviewer,
        reviewer_email,
        review,
        rating,
        images: images || [], // Array of base64 strings
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('WP API Error:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to submit review' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
