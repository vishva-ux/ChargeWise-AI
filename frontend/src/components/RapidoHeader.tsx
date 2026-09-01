import React from 'react';
import { Bell, Zap, ShieldCheck, User } from 'lucide-react';

interface RapidoHeaderProps {
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  activeFleetWalletBalance?: number;
  userPhone?: string;
}

export const RapidoHeader: React.FC<RapidoHeaderProps> = ({
  onNotificationClick,
  onProfileClick,
  activeFleetWalletBalance = 2450.00,
  userPhone = "+91 98765 43210",
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-4 pt-3 pb-2 glass-header text-slate-800 flex items-center justify-between shadow-sm border-b border-slate-200/80">
      {/* Left: Branding & Clean Subtitle */}
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-xl bg-[#344055] flex items-center justify-center shadow-md shadow-slate-900/10 text-white font-black">
          <Zap className="w-5 h-5 fill-white stroke-white" />
        </div>
        <div>
          <h1 className="font-black text-base tracking-tight text-slate-900">
            ChargeWise
          </h1>
        </div>
      </div>

      {/* Right: Fleet Balance & Rapido Profile Avatar */}
      <div className="flex items-center space-x-2">
        {/* Wallet Balance Badge */}
        <div className="flex items-center space-x-1 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-xs text-emerald-800 font-extrabold shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>₹{activeFleetWalletBalance.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={onNotificationClick}
          className="relative w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-slate-700" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#52B788] ring-2 ring-white"></span>
        </button>

        {/* Rapido Account Profile Button */}
        <button
          onClick={onProfileClick}
          className="w-8 h-8 rounded-full bg-[#344055] hover:bg-slate-700 flex items-center justify-center text-white transition-transform active:scale-95 shadow-sm"
          title="Account Profile & Logout"
        >
          <User className="w-4 h-4 text-white" />
        </button>
      </div>
    </header>
  );
};
