import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: Request) {
  try {
    // Get token from cookie
    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader?.split('token=')[1]?.split(';')[0];
    
    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    return NextResponse.json({ 
      success: true, 
      user: decoded 
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}