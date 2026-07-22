import { Request, Response } from 'express';
import Task from '../models/Task';

// @desc    Get all tasks
// @route   GET /api/tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server Error fetching tasks', 
      error: (error as Error).message 
    });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ message: 'Please add a title' });
      return;
    }

    const mockUserId = "60c72b2f9b1d8b2bad766442"; // Placeholder user ID for testing

    const newTask = await Task.create({
      user: mockUserId,
      title: title.trim(),
      description: description ? description.trim() : ''
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server Error creating task', 
      error: (error as Error).message 
    });
  }
};

// @desc    Update a task (e.g., mark completed or edit text)
// @route   PUT /api/tasks/:id
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server Error updating task', 
      error: (error as Error).message 
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.status(200).json({ message: 'Task removed successfully', id });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server Error deleting task', 
      error: (error as Error).message 
    });
  }
};