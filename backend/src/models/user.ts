import { Schema, model, Document } from 'mongoose';

export type UserRole = 'Admin' | 'Manager' | 'Developer';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Developer'],
      default: 'Developer',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>('User', UserSchema);