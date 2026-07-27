import type { User } from '../types';

interface NavbarProps {
  user: User | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  theme,
  onToggleTheme,
  onOpenAuth,
  onLogout,
  onOpenCreateModal,
}) => {
  return (
    <header className="bg-slate-900/90 dark:bg-slate-900/90 light:bg-white border-b border-slate-800 dark:border-slate-800 light:border-slate-200 sticky top-0 z-30 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand & Greeting */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-blue-400 flex items-center justify-center font-bold text-lg">
            ✓
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-slate-200 dark:text-slate-200 light:text-slate-800">
              Task Manager
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
              {user ? `Hello, ${user.name} 👋` : 'Simple & calm task manager'}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* New Task Button */}
          <button
            onClick={onOpenCreateModal}
            className="btn-primary px-3 py-1.5 text-xs flex items-center gap-1 cursor-pointer"
          >
            <span className="text-sm leading-none">+</span>
            <span>Add Task</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 transition-colors cursor-pointer text-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* User Sign In / Profile */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800 dark:border-slate-800 light:border-slate-200">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-blue-400 font-bold text-xs flex items-center justify-center border border-slate-700">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={onLogout}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer px-1 py-1"
                title="Sign Out"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-800 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-700 transition-colors cursor-pointer font-medium"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
