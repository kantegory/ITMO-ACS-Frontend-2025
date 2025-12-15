import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

// GET /api/rentals?userId=xxx - получить аренды пользователя
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    const rentalsPath = path.join(process.cwd(), 'data', 'rentals.json');
    const rentalsData = await fs.readFile(rentalsPath, 'utf8');
    const rentals = JSON.parse(rentalsData);

    // Фильтруем по userId, если указан
    const filteredRentals = userId
      ? rentals.filter((rental: { tenantId: string }) => rental.tenantId === userId)
      : rentals;

    return NextResponse.json(filteredRentals);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/rentals - создать новую аренду
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, tenantId, startDate, endDate } = body;

    if (!propertyId || !tenantId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // В мок-реализации просто возвращаем успех
    // В реальном приложении здесь была бы запись в БД
    const newRental = {
      id: `rental-${Date.now()}`,
      propertyId,
      tenantId,
      ownerId: 'owner-1', // В реальном приложении получали бы из свойства
      startDate,
      endDate,
      status: 'pending',
      totalPrice: 0,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      rental: newRental
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
