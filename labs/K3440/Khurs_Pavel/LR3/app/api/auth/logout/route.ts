import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // В мок-реализации просто возвращаем успех
    // В реальном приложении здесь была бы очистка сессии, токенов и т.д.
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
