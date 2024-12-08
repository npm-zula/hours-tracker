import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const APP_PASSWORD = process.env.APP_PASSWORD || 'chronoly';
const AUTH_COOKIE = 'chronoly-auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password !== APP_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    cookieStore.set(AUTH_COOKIE, APP_PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );

  cookieStore.delete(AUTH_COOKIE);

  return response;
} 