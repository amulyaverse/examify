import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/examify';

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Database connected');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Database error:', error);
    throw error;
  }
}
