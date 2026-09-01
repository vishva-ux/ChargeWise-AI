import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, Lock, User } from 'lucide-react';

export const AuthPages: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  const fillUser = () => { setUsername('user'); setPassword('user'); setError(''); };
  const fillAdmin = () => { setUsername('admin'); setPassword('admin123'); setError(''); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-xl border border-slate-200">

        {/* Left Panel */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-sky-600 to-indigo-700 text-white p-12 flex-col justify-between relative overflow-hidden">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              ChargeWise<span className="font-light opacity-80">.ai</span>
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight leading-snug">
              Smart EV Charging,<br />Intelligently Planned.
            </h1>
            <p className="text-sm text-blue-100 leading-relaxed max-w-xs">
              Locate nearby charging stations, plan your route, and book slots — powered by real-time AI predictions.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 pt-4">
              {['Real-time Availability', 'Route Planning', 'Slot Booking', 'Wait-time AI'].map((f) => (
                <span key={f} className="px-3 py-1 bg-white/15 rounded-full text-[11px] font-semibold text-white/90 border border-white/20">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-[10px] text-blue-200/70 border-t border-white/10 pt-6">
            © 2026 ChargeWise AI Network Systems. All rights reserved.
          </div>

          {/* BG decoration */}
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-[420px] bg-white p-10 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Sign in</h2>
            <p className="text-[11px] text-slate-400 mt-1">Use the built-in credentials below to access the app.</p>
          </div>

          {/* Credential hint cards */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillUser}
              className="p-3 border border-slate-200 rounded-xl text-left hover:border-sky-300 hover:bg-sky-50 transition-all group"
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">User</div>
              <div className="text-xs font-semibold text-slate-700 group-hover:text-sky-700">user / user</div>
            </button>
            <button
              type="button"
              onClick={fillAdmin}
              className="p-3 border border-slate-200 rounded-xl text-left hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Admin</div>
              <div className="text-xs font-semibold text-slate-700 group-hover:text-indigo-700">admin / admin123</div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] text-slate-400 font-semibold">OR ENTER MANUALLY</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Username</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="user or admin"
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-[11px] text-rose-600 font-semibold bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-lg transition-all shadow-sm"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-[10px] text-slate-400">
            ChargeWise AI · Enterprise EV Network Platform
          </p>
        </div>
      </div>
    </div>
  );
};
