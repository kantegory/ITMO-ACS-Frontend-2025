import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import usersData from '@/data/users.json';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json();

    // Check if user already exists
    const existingUser = usersData.find((u) => u.email === email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists', success: false },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      password,
      name,
      phone,
      avatar: '/images/placeholders/avatar-default.jpg',
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    };

    // Generate token
    const token = uuidv4();

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
