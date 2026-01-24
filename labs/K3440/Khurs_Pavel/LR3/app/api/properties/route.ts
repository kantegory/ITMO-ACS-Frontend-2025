import { NextRequest, NextResponse } from 'next/server';
import propertiesData from '@/data/properties.json';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const rooms = searchParams.get('rooms');

    let filtered = [...propertiesData];

    // Apply filters
    if (type) {
      filtered = filtered.filter((p) => p.type === type);
    }

    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= parseInt(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= parseInt(maxPrice));
    }

    if (location) {
      filtered = filtered.filter(
        (p) =>
          p.location.city.toLowerCase().includes(location.toLowerCase()) ||
          p.location.district.toLowerCase().includes(location.toLowerCase()) ||
          p.location.address.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (rooms) {
      filtered = filtered.filter((p) => p.characteristics.rooms === parseInt(rooms));
    }

    return NextResponse.json({
      properties: filtered,
      total: filtered.length,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
