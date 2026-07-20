import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: [true, 'Please add a name'] },
  email: { type: String, required: [true, 'Please add an email'], unique: true },
  password: { type: String, required: [true, 'Please add a password'] }
}, { timestamps: true });

export default model<IUser>('User', UserSchema);