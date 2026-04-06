import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    
    await connectDB();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });
    
    // Generate token for auto-login
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: { id: user._id, name: user.name, email: user.email }
    });
    
    // Set cookie for auto-login
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}