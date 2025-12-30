import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

// GET /api/messages?userId=xxx - получить сообщения пользователя
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    const messagesPath = path.join(process.cwd(), 'data', 'messages.json');
    const messagesData = await fs.readFile(messagesPath, 'utf8');
    const messages = JSON.parse(messagesData);

    // Фильтруем сообщения, где пользователь - отправитель или получатель
    const filteredMessages = userId
      ? messages.filter(
          (msg: { senderId: string; recipientId: string }) =>
            msg.senderId === userId || msg.recipientId === userId
        )
      : messages;

    return NextResponse.json(filteredMessages);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/messages - отправить сообщение
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, senderId, recipientId, text } = body;

    if (!senderId || !recipientId || !text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // В мок-реализации просто возвращаем успех
    // В реальном приложении здесь была бы запись в БД
    const newMessage = {
      id: `msg-${Date.now()}`,
      propertyId: propertyId || null,
      senderId,
      recipientId,
      text,
      timestamp: new Date().toISOString(),
      read: false
    };

    return NextResponse.json({
      success: true,
      message: newMessage
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
