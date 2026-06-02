import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
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

    // Fetch shipping zones from WooCommerce
    const zonesResponse = await woocommerceAPI.get('/shipping/zones');
    const zones = zonesResponse.data;

    const allCountries: string[] = [];
    const countriesWithStates: { [key: string]: string[] } = {};

    // Get locations for each zone
    for (const zone of zones) {
      try {
        const locationsResponse = await woocommerceAPI.get(`/shipping/zones/${zone.id}/locations`);
        const locations = locationsResponse.data;

        for (const location of locations) {
          if (location.type === 'country') {
            // Just country (e.g., "AE")
            if (!allCountries.includes(location.code)) {
              allCountries.push(location.code);
            }
          } else if (location.type === 'state') {
            // Country with specific state (e.g., "US:CA")
            const [country, state] = location.code.split(':');
            if (!allCountries.includes(country)) {
              allCountries.push(country);
            }
            if (!countriesWithStates[country]) {
              countriesWithStates[country] = [];
            }
            if (!countriesWithStates[country].includes(state)) {
              countriesWithStates[country].push(state);
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching locations for zone ${zone.id}:`, error);
      }
    }

    return NextResponse.json({
      countries: allCountries.sort(),
      countriesWithStates,
      zones: zones.map((z: any) => ({ id: z.id, name: z.name })),
    });

  } catch (error: any) {
    console.error('Error fetching shipping zones:', error.message);
    
    // Fallback to default countries if WooCommerce fails
    return NextResponse.json({
      countries: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM', 'US', 'GB', 'CA'],
      countriesWithStates: {},
      zones: [],
      fallback: true,
    });
  }
}
