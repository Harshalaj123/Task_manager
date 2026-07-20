import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes'; // <-- 1. Added Import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

connectDB();

// API Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes); // <-- 2. Added Route entry point

app.get('/', (req, res) => {
  res.send('Task Manager API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});