import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import taskRoutes from './routes/taskRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/tasks', taskRoutes);

// Simple health check route
app.get('/', (req, res) => {
  res.send('Task Manager API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});