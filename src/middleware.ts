import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/reports', '/settings'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path requires auth
  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Check for Supabase auth cookie
  const hasSession = request.cookies.getAll().some(c => c.name.includes('auth-token'));

  if (!hasSession) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('login', 'required');
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/reports/:path*', '/settings/:path*'],
};
