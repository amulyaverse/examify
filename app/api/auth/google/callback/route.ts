import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const cookieHeader = req.headers.get('cookie');
  
  // Get code verifier from cookie
  const codeVerifier = cookieHeader?.split('code_verifier=')[1]?.split(';')[0];
  
  if (!code || !codeVerifier) {
    return NextResponse.redirect(new URL('/auth?error=auth_failed', process.env.NEXTAUTH_URL));
  }
  
  // Exchange code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
    }),
  });
  
  const tokens = await tokenResponse.json();
  
  if (!tokens.access_token) {
    return NextResponse.redirect(new URL('/auth?error=auth_failed', process.env.NEXTAUTH_URL));
  }
  
  // Get user info from Google
  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  
  const googleUser = await userInfoResponse.json();
  
  await connectDB();
  
  // Find or create user
  let user = await User.findOne({ email: googleUser.email });
  
  if (!user) {
    user = await User.create({
      name: googleUser.name,
      email: googleUser.email,
      googleId: googleUser.id,
      avatar: googleUser.picture,
    });
  }
  
  // Create JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // Redirect to profile with token cookie
  const response = NextResponse.redirect(new URL('/profile', process.env.NEXTAUTH_URL));
  
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
  
  response.cookies.set('code_verifier', '', { expires: new Date(0) });
  
  return response;
}