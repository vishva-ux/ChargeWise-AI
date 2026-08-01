import React from 'react';
import { Zap, ShieldCheck, Cpu, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-sky-600 flex items-center justify-center text-white">
            <Zap className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-bold text-slate-800">ChargeWise AI System</span>
          <span>© 2026 Enterprise Edition</span>
        </div>

        <div className="flex items-center gap-6 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5" /> Python FastAPI ML</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> ASP.NET Core 8 Web API</span>
          <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5" /> PostgreSQL + PostGIS</span>
        </div>

      </div>
    </footer>
  );
};
