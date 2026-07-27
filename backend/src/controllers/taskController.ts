import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get user tasks with optional search/filter
// @route   GET /api/tasks
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    const { status, priority, category, search } = req.query;

    const filter: any = { user: userId };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: 'Server Error fetching tasks',
      error: (error as Error).message,
    });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    const { title, description, priority, status, category, dueDate } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ message: 'Please add a task title' });
      return;
    }

    const isCompleted = status === 'completed';

    const newTask = await Task.create({
      user: userId,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      status: status || 'pending',
      category: category || 'General',
      dueDate: dueDate ? new Date(dueDate) : null,
      isCompleted,
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({
      message: 'Server Error creating task',
      error: (error as Error).message,
    });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      res.status(404).json({ message: 'Task not found or unauthorized' });
      return;
    }

    const { title, description, priority, status, category, dueDate, isCompleted } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (category !== undefined) task.category = category.trim();
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (isCompleted !== undefined) task.isCompleted = Boolean(isCompleted);

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: 'Server Error updating task',
      error: (error as Error).message,
    });
  }
};

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/toggle
export const toggleTaskStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      res.status(404).json({ message: 'Task not found or unauthorized' });
      return;
    }

    const newCompletedState = !task.isCompleted;
    task.isCompleted = newCompletedState;
    task.status = newCompletedState ? 'completed' : 'pending';

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: 'Server Error toggling task',
      error: (error as Error).message,
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, user: userId });

    if (!task) {
      res.status(404).json({ message: 'Task not found or unauthorized' });
      return;
    }

    res.status(200).json({ message: 'Task removed successfully', id });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error deleting task',
      error: (error as Error).message,
    });
  }
};

// @desc    Get summary stats
// @route   GET /api/tasks/stats
export const getTaskStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const total = await Task.countDocuments({ user: userId });
    const pending = await Task.countDocuments({ user: userId, status: 'pending' });
    const inProgress = await Task.countDocuments({ user: userId, status: 'in-progress' });
    const completed = await Task.countDocuments({ user: userId, status: 'completed' });

    res.status(200).json({
      total,
      pending,
      inProgress,
      completed,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error fetching stats',
      error: (error as Error).message,
    });
  }
};