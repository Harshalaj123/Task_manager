import { useState, useEffect, useMemo } from 'react';
import type { Task, User, TaskStats, TaskFilterState } from './types';
import { taskApi, authApi } from './services/api';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { TaskFilterBar } from './components/TaskFilterBar';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { AuthModal } from './components/AuthModal';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', { autoConnect: false });

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Quick Task Input
  const [quickTitle, setQuickTitle] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<TaskFilterState>({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem('tm_local_tasks');
      if (stored && stored.includes('mock-1')) {
        localStorage.removeItem('tm_local_tasks');
      }
      const currentUser = await authApi.getMe();
      setUser(currentUser);
      await loadTasks();
    };
    init();
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [theme]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await taskApi.getTasks(filters);
      setTasks(data);
      const currentStats = await taskApi.getStats();
      setStats(currentStats);
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filters]);

  useEffect(() => {
    if (user) {
      socket.connect();
      
      const handleTaskChange = (task: any) => {
        const taskUserId = task.user || task.userId; // handle different payload formats
        if (taskUserId === user._id || (task.id && task.user === user._id)) {
          loadTasks();
        }
      };

      socket.on('taskCreated', handleTaskChange);
      socket.on('taskUpdated', handleTaskChange);
      socket.on('taskDeleted', (data) => {
        if (data.user === user._id) {
          loadTasks();
        }
      });
    } else {
      socket.disconnect();
    }

    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, [user, filters]);

  const handleFilterChange = (newFilters: Partial<TaskFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Quick Add Task
  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || quickLoading) return;

    setQuickLoading(true);
    try {
      await taskApi.createTask({
        title: quickTitle.trim(),
        priority: 'medium',
        status: 'pending',
        category: 'General',
        isCompleted: false,
      });
      setQuickTitle('');
      await loadTasks();
    } catch (err) {
      console.error('Error quick adding task:', err);
    } finally {
      setQuickLoading(false);
    }
  };

  // Task Actions
  const handleToggleStatus = async (id: string) => {
    try {
      await taskApi.toggleTask(id);
      await loadTasks();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskApi.deleteTask(id);
      await loadTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleSaveTask = async (taskData: Omit<Task, '_id'> & { _id?: string }) => {
    if (taskData._id) {
      await taskApi.updateTask(taskData._id, taskData);
    } else {
      await taskApi.createTask(taskData);
    }
    await loadTasks();
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    loadTasks();
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [tasks]);

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 text-slate-100 dark:text-slate-100 light:text-slate-900 transition-colors">
      {/* Header */}
      <Navbar
        user={user}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Quick Add Bar */}
        <form onSubmit={handleQuickAdd} className="mb-5 flex gap-2">
          <input
            type="text"
            placeholder="Add a new task... (press Enter)"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-900 dark:bg-slate-900 light:bg-white text-slate-100 dark:text-slate-100 light:text-slate-900 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded-xl text-xs focus:outline-none focus:border-slate-600 shadow-sm"
          />
          <button
            type="submit"
            disabled={quickLoading || !quickTitle.trim()}
            className="btn-primary px-4 py-2.5 text-xs cursor-pointer disabled:opacity-50"
          >
            {quickLoading ? 'Adding...' : 'Add Task'}
          </button>
        </form>

        {/* Dashboard Stats */}
        <StatsOverview stats={stats} />

        {/* Filter Toolbar */}
        <TaskFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Task List */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="card-soft p-8 text-center space-y-1.5 my-4">
            <p className="text-xl">✨</p>
            <h3 className="text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
              No tasks found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-500">
              Type a task above or click "+ Add Task" to create your first task!
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
        existingCategories={categories}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => {
          setUser(u);
          loadTasks();
        }}
      />
    </div>
  );
}

export default App;