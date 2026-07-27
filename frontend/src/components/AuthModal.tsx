import React, { useState } from 'react';
import { authApi } from '../services/api';
import type { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (mode === 'register' && !name) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      let user: User;
      if (mode === 'login') {
        user = await authApi.login({ email, password });
      } else {
        user = await authApi.register({ name, email, password });
      }
      onSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/80 text-left relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 bg-slate-900/80 rounded-2xl border border-slate-800 mb-6">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${mode === 'login'
              ? 'gradient-bg text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${mode === 'register'
              ? 'gradient-bg text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            Register Account
          </button>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h3 className="text-xl font-extrabold text-slate-100 font-[Outfit]">
            {mode === 'login' ? 'Welcome Back!' : 'Create an Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Enter your credentials to access your task dashboard'
              : 'Join TaskFlow Pro to organize your work efficiently'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/80 text-slate-100 border border-slate-700/80 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/80 text-slate-100 border border-slate-700/80 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/80 text-slate-100 border border-slate-700/80 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 gradient-bg gradient-bg-hover text-white font-semibold text-sm py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {loading
              ? 'Processing...'
              : mode === 'login'
                ? 'Sign In to Dashboard'
                : 'Create My Account'}
          </button>
        </form>

        <p className="text-[11px] text-slate-500 text-center mt-4">
          Note: If MongoDB backend is offline, instant Demo Session will activate automatically.
        </p>
      </div>
    </div>
  );
};
