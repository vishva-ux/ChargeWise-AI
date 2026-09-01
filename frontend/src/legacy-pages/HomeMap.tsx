"use client";

import React, { useState } from 'react';
import { StationCard } from '../components/StationCard';
import { StationMap } from '../components/StationMap';
import { BookingModal } from '../components/BookingModal';
import { MOCK_STATIONS } from '../utils/mockData';
import { Station, Booking } from '../types';
import { Search, MapPin, Navigation } from 'lucide-react';

export const HomeMap: React.FC = () => {
  const [stations, setStations] = useState<Station[]>(MOCK_STATIONS);
  const [selectedStation, setSelectedStation] = useState<Station | null>(MOCK_STATIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterSpeed, setFilterSpeed] = useState<string>('All');
  const [bookingModalStation, setBookingModalStation] = useState<Station | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru');

  // Geolocation States
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [locStatus, setLocStatus] = useState<'prompt' | 'locating' | 'done' | 'error'>('prompt');

  // Directions Route State
  const [routePoints, setRoutePoints] = useState<[number, number][] | undefined>(undefined);

  const handleShowDirections = (station: Station) => {
    setSelectedStation(station);
    const origin: [number, number] = userCoords || [12.9716, 77.5946];
    // Draw a simple straight-line route on map (production would use OSRM/Valhalla routing API)
    setRoutePoints([
      origin,
      [station.latitude, station.longitude]
    ]);
    // Also open Google Maps in a new tab for real turn-by-turn navigation
    const gmUrl = `https://www.google.com/maps/dir/${origin[0]},${origin[1]}/${station.latitude},${station.longitude}`;
    window.open(gmUrl, '_blank');
  };

  const requestUserLocation = () => {
    setLocStatus('locating');
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      setLocStatus('error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords([latitude, longitude]);
        setLocStatus('done');
        // Calculate dynamic haversine distances
        setStations(prev => prev.map(s => {
          const dist = Math.round(
            Math.sqrt(Math.pow(s.latitude - latitude, 2) + Math.pow(s.longitude - longitude, 2)) * 111.0 * 10
          ) / 10;
          return { ...s, distanceKm: dist };
        }).sort((a, b) => a.distanceKm - b.distanceKm));
      },
      (error) => {
        console.error(error);
        setLocStatus('error');
      }
    );
  };

  // City bounding boxes [minLat, maxLat, minLng, maxLng]
  const CITY_BOUNDS: Record<string, [number, number, number, number]> = {
    'Bengaluru': [12.80, 13.25, 77.45, 77.80],
    'Mumbai':    [18.85, 19.30, 72.75, 73.05],
    'Delhi':     [28.40, 28.90, 76.90, 77.40],
    'Chennai':   [12.85, 13.20, 80.10, 80.35],
  };

  const filteredStations = stations.filter((st) => {
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          st.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || st.chargers.some(c => c.type === filterType);
    const matchesSpeed = filterSpeed === 'All' || (filterSpeed === 'Ultra' ? st.chargers.some(c => c.maxPowerKw >= 150) : true);
    const bounds = CITY_BOUNDS[selectedCity];
    const matchesCity = !bounds || (
      st.latitude >= bounds[0] && st.latitude <= bounds[1] &&
      st.longitude >= bounds[2] && st.longitude <= bounds[3]
    );
    return matchesSearch && matchesType && matchesSpeed && matchesCity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Location Request Banner */}
      {locStatus === 'prompt' && (
        <div className="mb-4 p-4 bg-sky-50 border border-sky-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-sky-600 shrink-0" />
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-800">Find Chargers Near You</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Enable location access to calculate accurate distances to the nearest dispensers.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={requestUserLocation}
              className="flex-1 sm:flex-none px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] rounded-lg transition-colors shadow-xs"
            >
              Allow Location Access
            </button>
            <button
              onClick={() => setLocStatus('error')}
              className="px-3 py-1.5 text-slate-500 hover:text-slate-700 font-semibold text-[11px]"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Minimal Google-like Status Header */}
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">EV Charging Network Grid</h1>
          <p className="text-[11px] text-slate-500">Real-time status updates powered by XGBoost waiting-time forecasting model</p>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Grid Status: <span className="text-emerald-600 font-bold">18 Stations Online</span>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar: Controls & Station List */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search station by name, city or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* GPS Locate Target Button */}
              <button
                type="button"
                onClick={requestUserLocation}
                className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                  locStatus === 'locating'
                    ? 'bg-slate-100 border-slate-300 text-sky-600 animate-pulse'
                    : locStatus === 'done'
                    ? 'bg-sky-50 border-sky-200 text-sky-600'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
                }`}
                title="Locate my position"
              >
                <Navigation className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
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

              {/* City Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedCity(val);
                    setSearchQuery('');
                    setRoutePoints(undefined);
                    if (val === 'Bengaluru') { setUserCoords([12.9716, 77.5946]); }
                    else if (val === 'Mumbai') { setUserCoords([19.0760, 72.8777]); }
                    else if (val === 'Delhi')  { setUserCoords([28.6139, 77.2090]); }
                    else if (val === 'Chennai') { setUserCoords([13.0827, 80.2707]); }
                  }}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">New Delhi</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>

              {/* Quick Location Pills */}
              <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-100">
                {['Downtown', 'Tech Park', 'Airport', 'Metro'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setSearchQuery(loc)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-[10px] font-semibold transition-colors border border-slate-200/65"
                  >
                    {loc}
                  </button>
                ))}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-2 py-1 text-rose-600 font-bold text-[10px] hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Directions route timeline preview */}
          {routePoints && selectedStation && (
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs flex justify-between items-center animate-in fade-in duration-150">
              <div>
                <span className="font-bold text-sky-800">Directions active</span>
                <div className="text-[10px] text-slate-500">Route to {selectedStation.name} • {selectedStation.distanceKm} km</div>
              </div>
              <button
                onClick={() => setRoutePoints(undefined)}
                className="text-[10px] font-bold text-rose-600 hover:underline"
              >
                Clear Route
              </button>
            </div>
          )}

          {/* Station Cards Scrollable Feed */}
          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {filteredStations.map((st) => (
              <StationCard
                key={st.id}
                station={st}
                isSelected={selectedStation?.id === st.id}
                onSelect={(station) => setSelectedStation(station)}
                onBook={(station) => setBookingModalStation(station)}
                onShowDirections={handleShowDirections}
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
            center={userCoords || undefined}
            routePolyline={routePoints}
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
