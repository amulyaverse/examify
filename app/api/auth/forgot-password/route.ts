import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    await connectDB();
    
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();
    
    // Send email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset - Examify',
      html: `
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 1 hour.</p>
      `,
    });
    
    return NextResponse.json({ success: true, message: 'Reset email sent' });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 });
  }
}