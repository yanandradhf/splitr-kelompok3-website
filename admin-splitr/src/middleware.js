import { NextResponse } from 'next/server';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const sessionId = request.cookies.get('sessionId')?.value;
  const method = request.method;
  
  console.log('Middleware - Checking access to:', pathname, method);
  console.log('Middleware - SessionId:', sessionId ? 'exists' : 'missing');
  
  // Allow API requests (login, logout, etc.)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // If user has session but tries to access login page (GET only), return 403
  if (pathname === '/' && sessionId && method === 'GET') {
    console.log('Middleware - Authenticated user accessing login page, returning 403');
    return new Response(null, { status: 403 });
  }
  
  // Protected paths that require authentication
  const protectedPaths = ['/dashboard', '/profile', '/transactions'];
  
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!sessionId) {
      console.log('Middleware - No session, returning 403 Forbidden');
      return new Response(null, { status: 403 });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)'
};