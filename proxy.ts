import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isSignupPage = request.nextUrl.pathname === '/signup';
  const isDashboardPage = request.nextUrl.pathname === '/dashboard';
  
  // Redirect to login if accessing dashboard without token
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect to dashboard if already logged in and trying to access login/signup
  if ((isLoginPage || isSignupPage) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/login', '/signup']
};
