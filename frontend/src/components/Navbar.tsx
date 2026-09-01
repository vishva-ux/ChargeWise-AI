import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, MapPin, Navigation, Calendar, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-300/80 flex items-center justify-center text-slate-700 shadow-sm group-hover:bg-slate-200 transition-colors">
            <Zap className="w-4 h-4 fill-slate-700 text-slate-700" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-800">
              ChargeWise<span className="text-sky-600 font-medium">.ai</span>
            </span>
            <span className="block text-[9px] font-semibold tracking-wider text-slate-400 uppercase -mt-0.5">
              EV Network Grid
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

          {/* User Profile Info */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center font-bold text-xs">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">{user?.role === 'Admin' ? 'Admin' : 'User'}</div>
              <div className="text-[10px] text-slate-500 leading-tight">{user?.vehicleModel || 'EV Vehicle'}</div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => { logout(); navigate('/auth'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-500 text-[11px] font-semibold transition-all"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>

      </div>
    </header>
  );
};
