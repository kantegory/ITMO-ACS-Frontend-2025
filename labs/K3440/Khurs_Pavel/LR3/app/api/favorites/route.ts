import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

// GET /api/favorites?userId=xxx - получить избранное пользователя
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    return NextResponse.json([]);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/favorites - добавить в избранное
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, propertyId } = body;

    if (!userId || !propertyId) {
      return NextResponse.json(
        { error: "User ID and Property ID are required" },
        { status: 400 }
      );
    }

    // Проверяем, что объект существует
    const propertiesPath = path.join(process.cwd(), "data", "properties.json");
    const propertiesData = await fs.readFile(propertiesPath, "utf8");
    const properties = JSON.parse(propertiesData);

    const propertyExists = properties.some(
      (p: { id: string }) => p.id === propertyId
    );

    if (!propertyExists) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // В мок-реализации просто возвращаем успех
    // В реальном приложении здесь была бы запись в БД
    return NextResponse.json({
      success: true,
      message: "Added to favorites",
      favorite: { userId, propertyId },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/favorites - удалить из избранного
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, propertyId } = body;

    if (!userId || !propertyId) {
      return NextResponse.json(
        { error: "User ID and Property ID are required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Removed from favorites",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
