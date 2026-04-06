import { NextResponse } from 'next/server';
import { generateCodeVerifier, generateCodeChallenge } from '@/lib/auth/pkce';

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/google/callback`;
  
  // Generate PKCE codes
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  // Store verifier in cookie for later verification
  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `response_type=code&` +
    `scope=email profile&` +
    `code_challenge=${codeChallenge}&` +
    `code_challenge_method=S256`
  );
  
  response.cookies.set('code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 10 * 60, // 10 minutes
  });
  
  return response;
}