"use client";

import React from 'react';
import { MOCK_ANALYTICS } from '../utils/mockData';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { ShieldCheck, TrendingUp, Zap, Clock, DollarSign, Activity, Cpu, Users, Building } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const analytics = MOCK_ANALYTICS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Admin Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            Enterprise Operations & ML Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time grid utilization, station revenue trends, and XGBoost machine learning model accuracy monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-600" /> System Operational
          </span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monthly Revenue</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">₹{analytics.totalRevenueMonth.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" /> +14.2% from last month
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bookings Today</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{analytics.totalBookingsToday}</div>
            <div className="text-[10px] text-sky-600 font-semibold flex items-center gap-0.5 mt-1">
              <Zap className="w-3 h-3" /> Peak demand active
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Grid Utilization</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{analytics.averageChargerUtilization}%</div>
            <div className="text-[10px] text-slate-500 font-medium mt-1">
              Avg Wait: <strong className="text-slate-800">{analytics.averageWaitTimeMinutes} min</strong>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-slate-900 text-white rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ML Forecast Accuracy</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">{analytics.mlModelAccuracyPercentage}%</div>
            <div className="text-[10px] text-slate-300 font-medium mt-1 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-sky-400" /> XGBoost Engine v1.0
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-emerald-400 border border-slate-700 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Trend Line Chart */}
        <div className="lg:col-span-7 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Weekly Revenue Performance (₹)</h3>
              <p className="text-xs text-slate-500">Daily charging income across network</p>
            </div>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Weekly Report
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.revenueTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#0284c7" strokeWidth={3} dot={{ fill: '#0284c7', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Station Utilization Heatmap Bar Chart */}
        <div className="lg:col-span-5 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Station Utilization Rate (%)</h3>
            <p className="text-xs text-slate-500">Occupancy load per top station</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.utilizationHeatmap} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="stationName" type="category" width={110} tick={{ fontSize: 10, fill: '#334155' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="utilizationPercentage" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
