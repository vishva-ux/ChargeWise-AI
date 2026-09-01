"use client";

import React from 'react';
import { Bell, X, Zap, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'DISCOUNT' | 'RESERVATION' | 'ALERT';
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Off-Peak Rate Discount',
    message: 'Vellore Bypass Hub tariff reduced to ₹16/kWh for the next 2 hours.',
    time: '5 mins ago',
    type: 'DISCOUNT',
  },
  {
    id: 'notif-2',
    title: 'Highway Corridor Status',
    message: 'Chennai ➔ Bangalore corridor: 14 CCS2 fast chargers currently active.',
    time: '15 mins ago',
    type: 'RESERVATION',
  },
  {
    id: 'notif-3',
    title: 'Battery Alert',
    message: 'Current SoC at 35%. Route Planner prioritized 120kW+ fast chargers.',
    time: '1 hour ago',
    type: 'ALERT',
  },
];

interface RapidoNotificationsModalProps {
  onClose: () => void;
}

export const RapidoNotificationsModal: React.FC<RapidoNotificationsModalProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#344055] text-white flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Notifications & Alerts</h3>
              <p className="text-[11px] text-slate-500 font-medium">3 New Fleet Updates</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5">
          {SAMPLE_NOTIFICATIONS.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex items-start space-x-3 transition-colors hover:bg-slate-100/60"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-[#344055] shadow-xs mt-0.5">
                {item.type === 'DISCOUNT' && <Zap className="w-4 h-4 text-emerald-600" />}
                {item.type === 'RESERVATION' && <CheckCircle2 className="w-4 h-4 text-[#344055]" />}
                {item.type === 'ALERT' && <ShieldAlert className="w-4 h-4 text-amber-600" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-slate-900">{item.title}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">{item.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Close Action Button */}
        <button
          onClick={onClose}
          className="w-full bg-[#344055] hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-2xl shadow-sm transition-colors uppercase tracking-wider"
        >
          CLOSE NOTIFICATIONS
        </button>
      </div>
    </div>
  );
};
