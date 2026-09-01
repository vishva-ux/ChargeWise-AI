"use client";

import React, { useState } from 'react';
import { Sparkles, MapPin, Zap, Utensils, Navigation } from 'lucide-react';

interface RapidoSearchModuleProps {
  onSearchSubmit: (prompt: string) => void;
  currentLocationName?: string;
  isSearching?: boolean;
}

export const RapidoSearchModule: React.FC<RapidoSearchModuleProps> = ({
  onSearchSubmit,
  currentLocationName = "T. Nagar, Chennai (Current Location)",
  isSearching = false,
}) => {
  const [promptInput, setPromptInput] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptInput.trim()) {
      onSearchSubmit(promptInput.trim());
    }
  };

  const handleChipClick = (presetText: string) => {
    setPromptInput(presetText);
    onSearchSubmit(presetText);
  };

  return (
    <div className="absolute top-16 left-3 right-3 z-20 transition-all duration-300">
      <div className="glass-search-panel rounded-2xl p-3 shadow-lg border border-slate-200/80">
        <form onSubmit={handleFormSubmit} className="relative">
          {/* Stacked Vertical Path Indicator */}
          <div className="flex items-start space-x-3">
            {/* Left: Green Dot -> Line -> Yellow Marker */}
            <div className="flex flex-col items-center pt-2.5">
              {/* Green Dot (Current Location) */}
              <div className="w-3.5 h-3.5 rounded-full bg-[#52B788] ring-4 ring-emerald-100 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>
              
              {/* Subtle Vertical Connector Line */}
              <div className="w-0.5 h-8 bg-slate-300 my-1 rounded-full border-dashed border-l border-slate-400"></div>
              
              {/* Dark Slate Location Marker */}
              <div className="w-4 h-4 rounded-full bg-[#344055] ring-4 ring-slate-100 flex items-center justify-center text-white shadow-sm">
                <MapPin className="w-2.5 h-2.5 text-white fill-white" />
              </div>
            </div>

            {/* Right: Inputs Stack */}
            <div className="flex-1 space-y-2">
              {/* Top Input: Readonly Current Location */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  readOnly
                  value={currentLocationName}
                  className="w-full bg-slate-100/90 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 cursor-default focus:outline-none"
                />
                <span className="absolute right-2.5 text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  GPS Active
                </span>
              </div>

              {/* Bottom Input: Search & Route Prompt */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Where to? (e.g. 'Chennai to Bangalore with 30% battery')"
                  className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs font-medium pl-3 pr-10 py-2.5 rounded-xl border border-slate-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#344055] focus:border-[#344055] transition-all"
                />

                <button
                  type="submit"
                  disabled={isSearching || !promptInput.trim()}
                  className="absolute right-1.5 w-7 h-7 bg-[#344055] hover:bg-slate-700 text-white rounded-lg flex items-center justify-center transition-all disabled:opacity-40 shadow-sm"
                  title="Search EV Stations"
                >
                  {isSearching ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-white fill-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Quick Driver Presets / Prompt Chips */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <button
            onClick={() => handleChipClick("Chennai to Bangalore fleet EV route with 30% battery")}
            className="flex-shrink-0 flex items-center space-x-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
          >
            <Navigation className="w-3 h-3 text-emerald-600" />
            <span>Chennai ➔ Blr Route</span>
          </button>

          <button
            onClick={() => handleChipClick("Fast CCS2 chargers with 60kW power")}
            className="flex-shrink-0 flex items-center space-x-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
          >
            <Zap className="w-3 h-3 text-slate-700 fill-slate-700" />
            <span>Fast CCS2 Hubs</span>
          </button>

          <button
            onClick={() => handleChipClick("Stations with 24/7 food court and rest lounge")}
            className="flex-shrink-0 flex items-center space-x-1 text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
          >
            <Utensils className="w-3 h-3 text-amber-600" />
            <span>24/7 Food Lounge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
