import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    const { name, email, googleId, avatar } = await req.json();
    
    await connectDB();
    
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
      });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    const response = NextResponse.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }
    });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    return NextResponse.json({ error: 'Google auth failed' }, { status: 500 });
  }
}