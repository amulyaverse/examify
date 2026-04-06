import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    
    await connectDB();
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }
    
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    return NextResponse.json({ success: true, message: 'Password reset successful' });
    
  } catch (error) {
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}