import { NextResponse } from 'next/server';
import { wordpress } from '@/lib/wordpress';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const hero = await wordpress.getHeroSection('home');
    return NextResponse.json({ 
      success: true, 
      hero 
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
