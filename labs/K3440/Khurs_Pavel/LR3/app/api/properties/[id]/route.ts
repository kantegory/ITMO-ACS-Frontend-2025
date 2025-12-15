import { NextRequest, NextResponse } from 'next/server';
import propertiesData from '@/data/properties.json';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = propertiesData.find((p) => p.id === id);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      property,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
