"use client";

import React from 'react';
import { User, LogOut, X, ShieldCheck, Car, Smartphone, Zap } from 'lucide-react';

interface RapidoProfileModalProps {
  userPhone: string;
  vehicleType: string;
  walletBalance: number;
  onClose: () => void;
  onLogout: () => void;
}

export const RapidoProfileModal: React.FC<RapidoProfileModalProps> = ({
  userPhone,
  vehicleType,
  walletBalance,
  onClose,
  onLogout,
}) => {
  return (
    <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#344055] text-white flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Rapido Driver Profile</h3>
              <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Active Verified Account
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Info Items */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-slate-700" />
              Phone Number
            </span>
            <span className="font-bold text-slate-900">{userPhone}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-slate-700" />
              Vehicle Type
            </span>
            <span className="font-bold text-slate-900">{vehicleType}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              EV Fleet Wallet
            </span>
            <span className="font-extrabold text-emerald-700 text-sm">
              ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Logout Action */}
        <button
          onClick={onLogout}
          className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs py-3.5 rounded-2xl border border-rose-200 flex items-center justify-center space-x-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>LOGOUT FROM CHARGEWISE</span>
        </button>
      </div>
    </div>
  );
};
