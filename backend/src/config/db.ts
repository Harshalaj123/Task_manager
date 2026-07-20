import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Falls back to a local database named 'taskmanager' if no environment variable is set
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error}`);
    process.exit(1);
  }
};