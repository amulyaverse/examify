import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/auth';
  // const isSignupPage = request.nextUrl.pathname === '/signup';
  const isDashboardPage = request.nextUrl.pathname === '/dashboard';
  
  // Redirect to login if accessing dashboard without token
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  // Redirect to dashboard if already logged in and trying to access login/signup
  if ((isAuthPage) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/auth']
};
 