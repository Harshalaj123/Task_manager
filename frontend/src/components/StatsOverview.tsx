import type { TaskStats } from '../types';

interface StatsOverviewProps {
  stats: TaskStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="card-soft p-4 mb-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Progress Text */}
        <div className="text-left w-full sm:w-auto">
          <h2 className="text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-800">
            {stats.completed === stats.total && stats.total > 0
              ? '🎉 All tasks finished!'
              : stats.pending === 0 && stats.total === 0
              ? 'Ready to add your first task?'
              : `${stats.pending} task${stats.pending === 1 ? '' : 's'} remaining`}
          </h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500 mt-0.5">
            {stats.completed} of {stats.total} completed ({percentage}%)
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-56 flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-800 dark:bg-slate-800 light:bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500/80 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono min-w-[36px] text-right">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};
