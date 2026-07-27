import type { TaskFilterState } from '../types';

interface TaskFilterBarProps {
  filters: TaskFilterState;
  onFilterChange: (newFilters: Partial<TaskFilterState>) => void;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
      {/* Search Input */}
      <div className="relative w-full sm:w-60">
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full px-3 py-1.5 bg-slate-900 dark:bg-slate-900 light:bg-white text-slate-200 dark:text-slate-200 light:text-slate-800 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded-lg text-xs focus:outline-none focus:border-slate-600"
        />
        {filters.search && (
          <button
            onClick={() => onFilterChange({ search: '' })}
            className="absolute right-2.5 top-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center p-1 bg-slate-900 dark:bg-slate-900 light:bg-slate-200 rounded-lg border border-slate-800 dark:border-slate-800 light:border-slate-300">
        {(['all', 'pending', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => onFilterChange({ status })}
            className={`px-3 py-1 rounded text-xs font-medium capitalize transition-all cursor-pointer ${
              filters.status === status
                ? 'bg-slate-800 text-blue-400 border border-slate-700'
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};
