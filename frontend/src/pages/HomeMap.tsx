import React, { useState } from 'react';
import { StationCard } from '../components/StationCard';
import { StationMap } from '../components/StationMap';
import { BookingModal } from '../components/BookingModal';
import { MOCK_STATIONS } from '../utils/mockData';
import { Station, Booking } from '../types';
import { Search, Filter, Zap, SlidersHorizontal, MapPin, Sparkles } from 'lucide-react';

export const HomeMap: React.FC = () => {
  const [stations, setStations] = useState<Station[]>(MOCK_STATIONS);
  const [selectedStation, setSelectedStation] = useState<Station | null>(MOCK_STATIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterSpeed, setFilterSpeed] = useState<string>('All');
  const [bookingModalStation, setBookingModalStation] = useState<Station | null>(null);

  const filteredStations = stations.filter((st) => {
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          st.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'All' || st.chargers.some(c => c.type === filterType);
    const matchesSpeed = filterSpeed === 'All' || (filterSpeed === 'Ultra' ? st.chargers.some(c => c.maxPowerKw >= 150) : true);

    return matchesSearch && matchesType && matchesSpeed;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Banner */}
      <div className="mb-6 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> XGBoost Predictive Station Allocation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Smart EV Station Locator & Slot Booking
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Real-time charger availability, machine-learning wait time predictions, and instant slot reservations with PostGIS spatial search.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="relative z-10 flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
          <div>
            <div className="text-xl font-extrabold text-white">18</div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-medium">Active Stations</div>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div>
            <div className="text-xl font-extrabold text-emerald-400">94.6%</div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-medium">ML Accuracy</div>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar: Controls & Station List */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search station by name, city or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                <option value="All">All Plug Types</option>
                <option value="CCS2">CCS2</option>
                <option value="Supercharger">Supercharger</option>
                <option value="Type2">Type2</option>
              </select>

              <select
                value={filterSpeed}
                onChange={(e) => setFilterSpeed(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                <option value="All">All Speed Rates</option>
                <option value="Ultra">Ultra Fast (&ge;150 kW)</option>
              </select>
            </div>
          </div>

          {/* Station Cards Scrollable Feed */}
          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {filteredStations.map((st) => (
              <StationCard
                key={st.id}
                station={st}
                isSelected={selectedStation?.id === st.id}
                onSelect={(station) => setSelectedStation(station)}
                onBook={(station) => setBookingModalStation(station)}
              />
            ))}
          </div>
        </div>

        {/* Right Pane: Interactive Map */}
        <div className="lg:col-span-7 h-[700px] sticky top-20">
          <StationMap
            stations={filteredStations}
            selectedStation={selectedStation}
            onSelectStation={(station) => setSelectedStation(station)}
          />
        </div>

      </div>

      {/* Booking Modal */}
      {bookingModalStation && (
        <BookingModal
          station={bookingModalStation}
          isOpen={!!bookingModalStation}
          onClose={() => setBookingModalStation(null)}
          onBookingComplete={(booking) => {
            console.log('Booking completed:', booking);
          }}
        />
      )}
    </div>
  );
};
