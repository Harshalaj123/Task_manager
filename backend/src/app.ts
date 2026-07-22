import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // <-- 1. Import cors
import { connectDB } from './config/db';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // <-- 2. Enable CORS for all incoming frontend connections
app.use(express.json());

connectDB();

// API Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Task Manager API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});