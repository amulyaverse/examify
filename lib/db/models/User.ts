import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  googleId?: string;
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  avatar: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);