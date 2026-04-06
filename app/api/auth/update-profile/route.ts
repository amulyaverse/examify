import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PUT(req: Request) {
  try {
    const { name, phone } = await req.json();
    
    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader?.split('token=')[1]?.split(';')[0];
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    await connectDB();
    
    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { name, phone, updatedAt: new Date() },
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}