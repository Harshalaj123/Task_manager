import axios from 'axios';
import type { Task, User, TaskStats, TaskFilterState } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Interceptor to attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Default empty tasks array
const initialMockTasks: Task[] = [];

const getLocalTasks = (): Task[] => {
  const stored = localStorage.getItem('tm_local_tasks');
  if (!stored) {
    localStorage.setItem('tm_local_tasks', JSON.stringify([]));
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const saveLocalTasks = (tasks: Task[]) => {
  localStorage.setItem('tm_local_tasks', JSON.stringify(tasks));
};

export const taskApi = {
  // Fetch tasks
  getTasks: async (filters?: TaskFilterState): Promise<Task[]> => {
    try {
      const response = await api.get('/tasks', { params: filters });
      return response.data;
    } catch (err) {
      console.warn('Backend API unavailable. Falling back to local storage.', err);
      let tasks = getLocalTasks();

      if (filters) {
        if (filters.status && filters.status !== 'all') {
          tasks = tasks.filter((t) => t.status === filters.status);
        }
        if (filters.priority && filters.priority !== 'all') {
          tasks = tasks.filter((t) => t.priority === filters.priority);
        }
        if (filters.category && filters.category !== 'all') {
          tasks = tasks.filter((t) => t.category === filters.category);
        }
        if (filters.search) {
          const q = filters.search.toLowerCase();
          tasks = tasks.filter(
            (t) =>
              t.title.toLowerCase().includes(q) ||
              (t.description && t.description.toLowerCase().includes(q))
          );
        }
      }
      return tasks;
    }
  },

  // Create Task
  createTask: async (taskData: Omit<Task, '_id'>): Promise<Task> => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (err) {
      console.warn('Backend API unavailable. Creating locally.', err);
      const newTask: Task = {
        ...taskData,
        _id: 'local-' + Date.now(),
        isCompleted: taskData.status === 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const tasks = getLocalTasks();
      const updated = [newTask, ...tasks];
      saveLocalTasks(updated);
      return newTask;
    }
  },

  // Update Task
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    try {
      const response = await api.put(`/tasks/${id}`, updates);
      return response.data;
    } catch (err) {
      console.warn('Backend API unavailable. Updating locally.', err);
      const tasks = getLocalTasks();
      const index = tasks.findIndex((t) => t._id === id);
      if (index === -1) throw new Error('Task not found');
      
      const updatedTask = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
      if (updates.status) {
        updatedTask.isCompleted = updates.status === 'completed';
      }
      tasks[index] = updatedTask;
      saveLocalTasks(tasks);
      return updatedTask;
    }
  },

  // Toggle Task Status
  toggleTask: async (id: string): Promise<Task> => {
    try {
      const response = await api.patch(`/tasks/${id}/toggle`);
      return response.data;
    } catch (err) {
      console.warn('Backend API unavailable. Toggling locally.', err);
      const tasks = getLocalTasks();
      const index = tasks.findIndex((t) => t._id === id);
      if (index === -1) throw new Error('Task not found');

      const isCompleted = !tasks[index].isCompleted;
      const status: Task['status'] = isCompleted ? 'completed' : 'pending';
      const updatedTask = { ...tasks[index], isCompleted, status, updatedAt: new Date().toISOString() };
      tasks[index] = updatedTask;
      saveLocalTasks(tasks);
      return updatedTask;
    }
  },

  // Delete Task
  deleteTask: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      console.warn('Backend API unavailable. Deleting locally.', err);
      const tasks = getLocalTasks();
      const updated = tasks.filter((t) => t._id !== id);
      saveLocalTasks(updated);
    }
  },

  // Get Stats
  getStats: async (): Promise<TaskStats> => {
    try {
      const response = await api.get('/tasks/stats');
      return response.data;
    } catch (err) {
      const tasks = getLocalTasks();
      return {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === 'pending').length,
        inProgress: tasks.filter((t) => t.status === 'in-progress').length,
        completed: tasks.filter((t) => t.status === 'completed').length,
      };
    }
  },
};

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<User> => {
    try {
      const response = await api.post('/users/login', credentials);
      if (response.data.token) {
        localStorage.setItem('tm_token', response.data.token);
        localStorage.setItem('tm_user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (err: any) {
      if (!err.response) {
        // Fallback demo user
        const demoUser: User = {
          _id: 'demo-user-id',
          name: 'Demo User',
          email: credentials.email,
          token: 'demo-token-12345',
        };
        localStorage.setItem('tm_token', demoUser.token!);
        localStorage.setItem('tm_user', JSON.stringify(demoUser));
        return demoUser;
      }
      throw err;
    }
  },

  register: async (userData: { name: string; email: string; password: string }): Promise<User> => {
    try {
      const response = await api.post('/users/register', userData);
      if (response.data.token) {
        localStorage.setItem('tm_token', response.data.token);
        localStorage.setItem('tm_user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (err: any) {
      if (!err.response) {
        const demoUser: User = {
          _id: 'demo-user-id-' + Date.now(),
          name: userData.name,
          email: userData.email,
          token: 'demo-token-12345',
        };
        localStorage.setItem('tm_token', demoUser.token!);
        localStorage.setItem('tm_user', JSON.stringify(demoUser));
        return demoUser;
      }
      throw err;
    }
  },

  getMe: async (): Promise<User | null> => {
    const token = localStorage.getItem('tm_token');
    if (!token) return null;

    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch {
      const stored = localStorage.getItem('tm_user');
      if (stored) {
        try { return JSON.parse(stored); } catch { return null; }
      }
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('tm_token');
    localStorage.removeItem('tm_user');
  },
};
