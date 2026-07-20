import { Request, Response } from 'express';
import Task from '../models/Task';

// @desc    Get all tasks for a user
// @route   GET /api/tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    // In the future, req.user will be populated by your auth middleware
    const mockUserId = "60c72b2f9b1d8b2bad766442"; 
    
    const tasks = await Task.find({ user: mockUserId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    const mockUserId = "60c72b2f9b1d8b2bad766442";

    if (!title) {
      res.status(400).json({ message: 'Please add a title' });
      return;
    }

    const newTask = await Task.create({
      user: mockUserId,
      title,
      description
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
};