import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const APP_PASSWORD = process.env.APP_PASSWORD || 'chronoly';
const AUTH_COOKIE = 'chronoly-auth';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get(AUTH_COOKIE)?.value === APP_PASSWORD;
  const isAuthPage = request.nextUrl.pathname === '/auth';

  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (auth API route)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
}; 