import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
}, {
  timestamps: true // This automatically adds createdAt and updatedAt fields
});

export const User = model('User', userSchema);