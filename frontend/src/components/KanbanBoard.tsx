import type { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onToggleStatus,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const columns: { id: TaskStatus; title: string; color: string; count: number; items: Task[] }[] = [
    {
      id: 'pending',
      title: 'To Do / Pending',
      color: 'bg-amber-500',
      count: pendingTasks.length,
      items: pendingTasks,
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'bg-purple-500',
      count: inProgressTasks.length,
      items: inProgressTasks,
    },
    {
      id: 'completed',
      title: 'Completed',
      color: 'bg-emerald-500',
      count: completedTasks.length,
      items: completedTasks,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => (
        <div key={col.id} className="glass-panel p-4 rounded-2xl flex flex-col h-full min-h-[500px]">
          {/* Column Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${col.color}`} />
              <h3 className="text-sm font-bold text-slate-200 dark:text-slate-200 font-[Outfit]">{col.title}</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold border border-slate-700">
              {col.count}
            </span>
          </div>

          {/* Cards Container */}
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {col.items.length === 0 ? (
              <div className="h-36 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500">No tasks in {col.title.toLowerCase()}</p>
              </div>
            ) : (
              col.items.map((task) => (
                <div key={task._id} className="space-y-2">
                  <TaskCard
                    task={task}
                    onToggleStatus={onToggleStatus}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />

                  {/* Move Action Controls */}
                  <div className="flex items-center justify-end gap-1 px-1 text-[11px]">
                    <span className="text-slate-500 mr-1">Move to:</span>
                    {col.id !== 'pending' && (
                      <button
                        onClick={() => onUpdateStatus(task._id, 'pending')}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      >
                        Pending
                      </button>
                    )}
                    {col.id !== 'in-progress' && (
                      <button
                        onClick={() => onUpdateStatus(task._id, 'in-progress')}
                        className="px-2 py-0.5 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors cursor-pointer"
                      >
                        In Progress
                      </button>
                    )}
                    {col.id !== 'completed' && (
                      <button
                        onClick={() => onUpdateStatus(task._id, 'completed')}
                        className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors cursor-pointer"
                      >
                        Completed
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
