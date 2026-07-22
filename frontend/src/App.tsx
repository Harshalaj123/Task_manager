import { useState, useEffect } from 'react';
import axios from 'axios';

interface Task {
  _id: string;
  title: string;
  description?: string;
  completed?: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      if (Array.isArray(res.data)) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new task
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim() || loading) return;

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', { 
        title: newTask,
        description: 'New Task' 
      });
      // Append the newly saved task directly from backend response
      setTasks((prevTasks) => [...prevTasks, res.data]);
      setNewTask('');
    } catch (err: any) {
      console.error('Error adding task:', err);
      alert(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '60px auto', padding: '25px', fontFamily: 'sans-serif', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>Task Manager</h1>

      <form onSubmit={addTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>No tasks found. Add one above!</p>
        ) : (
          tasks.map((task) => (
            <li
              key={task._id}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', marginBottom: '8px', borderBottom: '1px solid #eee' }}
            >
              <span>{task.title}</span>
              <button
                onClick={() => deleteTask(task._id)}
                style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;