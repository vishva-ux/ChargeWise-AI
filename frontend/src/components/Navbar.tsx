import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, MapPin, Navigation, Calendar, ShieldCheck, User, LogOut, Cpu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout, login } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-slate-900 via-sky-900 to-slate-800 bg-clip-text text-transparent">
              ChargeWise<span className="text-sky-600">.AI</span>
            </span>
            <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase -mt-1">
              Enterprise EV Grid
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              isActive('/') ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Station Map
          </Link>

          <Link
            to="/route-planner"
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              isActive('/route-planner') ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Navigation className="w-4 h-4" />
            AI Route Planner
          </Link>

          <Link
            to="/my-bookings"
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              isActive('/my-bookings') ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            My Bookings
          </Link>

          {user?.role === 'Admin' && (
            <Link
              to="/admin"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                isActive('/admin') ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* User Profile & Demo Controls */}
        <div className="flex items-center gap-3">
          {/* ML Engine Active Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-medium">
            <Cpu className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
            <span>XGBoost ML Engine Online</span>
          </div>

          {/* User Quick Switch */}
          <button
            onClick={() => login(user?.role === 'Admin' ? 'alex.mercer@gmail.com' : 'admin@chargewise.ai', user?.role === 'Admin' ? 'User' : 'Admin')}
            className="text-[11px] font-semibold text-slate-500 hover:text-sky-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            title="Switch demo user role"
          >
            Role: <span className="text-slate-800 font-bold">{user?.role}</span> ↻
          </button>

          {/* User Profile Info */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center font-bold text-xs">
              {user?.fullName.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">{user?.fullName}</div>
              <div className="text-[10px] text-slate-500 leading-tight">{user?.vehicleModel}</div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
