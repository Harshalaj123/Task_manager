import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';

// @desc    Register a new user
// @route   POST /api/users/register
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // 4. Respond with user info (excluding password)
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
};