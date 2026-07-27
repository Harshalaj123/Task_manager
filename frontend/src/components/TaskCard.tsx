import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const isCompleted = task.isCompleted || task.status === 'completed';

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className={`card-soft p-4 flex items-start justify-between gap-3 text-left transition-all ${
        isCompleted ? 'opacity-65' : ''
      }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Clean Circle Checkbox */}
        <button
          onClick={() => onToggleStatus(task._id)}
          className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
              : 'border-slate-500 dark:border-slate-500 light:border-slate-400 hover:border-indigo-500 bg-transparent'
          }`}
          title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
        >
          {isCompleted && <span className="text-xs font-bold">✓</span>}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-semibold transition-all ${
              isCompleted
                ? 'line-through text-slate-400 dark:text-slate-400 light:text-slate-400'
                : 'text-slate-100 dark:text-slate-100 light:text-slate-900'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Clean Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px]">
            {/* Priority Badge */}
            <span
              className={`px-2 py-0.5 rounded-md font-medium capitalize ${
                task.priority === 'high'
                  ? 'badge-high'
                  : task.priority === 'medium'
                  ? 'badge-medium'
                  : 'badge-low'
              }`}
            >
              {task.priority} priority
            </span>

            {/* Category */}
            {task.category && (
              <span className="px-2 py-0.5 rounded-md bg-slate-800 dark:bg-slate-800 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-700 font-medium">
                {task.category}
              </span>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <span className="text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium">
                📅 {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors cursor-pointer text-xs"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer text-xs"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
