"use client";

import React, { useState } from 'react';
import { StationMap } from '../components/StationMap';
import { MOCK_STATIONS } from '../utils/mockData';
import { RoutePlan, Station } from '../types';
import { Navigation, BatteryCharging, Zap, MapPin, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const RoutePlanner: React.FC = () => {
  const [origin, setOrigin] = useState('Central Business District, Bengaluru');
  const [destination, setDestination] = useState('Kempegowda International Airport');
  const [currentSoc, setCurrentSoc] = useState(25);
  const [batteryCapacity, setBatteryCapacity] = useState(75);
  const [preferredConnector, setPreferredConnector] = useState('CCS2');
  const [loading, setLoading] = useState(false);

  const [routeResult, setRouteResult] = useState<RoutePlan | null>({
    totalDistanceKm: 38.5,
    totalDurationMinutes: 52,
    estimatedTotalCost: 540.00,
    recommendedChargingStops: [MOCK_STATIONS[1]], // Tech Park Fast Charging
    routePolylinePoints: [
      [12.9716, 77.5946],
      [12.9352, 77.6387],
      [13.1986, 77.7068]
    ],
    batteryInfo: {
      currentSocPercentage: 25,
      remainingRangeKm: 112.5,
      needsChargingEnroute: true,
      recommendedChargeKwh: 35.0,
      suggestedChargerType: 'CCS2 (150kW)'
    }
  });

  const handleCalculateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setRouteResult({
        totalDistanceKm: 42.0,
        totalDurationMinutes: 58,
        estimatedTotalCost: 580.00,
        recommendedChargingStops: [MOCK_STATIONS[0], MOCK_STATIONS[2]],
        routePolylinePoints: [
          [12.9716, 77.5946],
          [12.9756, 77.6094],
          [13.1986, 77.7068]
        ],
        batteryInfo: {
          currentSocPercentage: currentSoc,
          remainingRangeKm: Math.round(currentSoc * 4.5),
          needsChargingEnroute: currentSoc < 40,
          recommendedChargeKwh: 40.0,
          suggestedChargerType: 'Supercharger'
        }
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Title Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Navigation className="w-6 h-6 text-sky-600" />
          Battery-Aware AI Route Planner
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Input your starting battery State of Charge (SoC %) and destination. Our machine learning engine automatically inserts optimal charging stops to eliminate range anxiety.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Route Planner Form (Left Pane) */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleCalculateRoute} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            
            {/* Origin & Destination */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Starting Point (Origin)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-sky-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Battery Slider */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 flex items-center gap-1">
                  <BatteryCharging className="w-4 h-4 text-amber-500" />
                  Current Battery (SoC)
                </span>
                <span className="text-sky-600 font-extrabold text-sm">{currentSoc}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={95}
                value={currentSoc}
                onChange={(e) => setCurrentSoc(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>5% (Critical)</span>
                <span>50%</span>
                <span>95% (Full)</span>
              </div>
            </div>

            {/* Vehicle Params */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Battery Capacity (kWh)
                </label>
                <input
                  type="number"
                  value={batteryCapacity}
                  onChange={(e) => setBatteryCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Connector
                </label>
                <select
                  value={preferredConnector}
                  onChange={(e) => setPreferredConnector(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="CCS2">CCS2</option>
                  <option value="Supercharger">Supercharger</option>
                  <option value="Type2">Type2</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Optimizing Route with ML...' : 'Calculate AI Route & Stops'}
            </button>
          </form>

          {/* Route Summary Card */}
          {routeResult && (
            <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Trip Summary</span>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-medium">
                  Optimized
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 bg-slate-800/80 rounded-2xl px-3 border border-slate-700/50 text-center">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Distance</div>
                  <div className="text-base font-extrabold">{routeResult.totalDistanceKm} km</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Travel Time</div>
                  <div className="text-base font-extrabold">{routeResult.totalDurationMinutes} min</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Charging Cost</div>
                  <div className="text-base font-extrabold text-emerald-400">₹{routeResult.estimatedTotalCost}</div>
                </div>
              </div>

              {/* Charging Stops Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Recommended Charging Stops ({routeResult.recommendedChargingStops.length})
                </h4>

                <div className="space-y-2">
                  {routeResult.recommendedChargingStops.map((stop, idx) => (
                    <div key={stop.id} className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          Stop #{idx + 1}: {stop.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{stop.address}</div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2 py-1 rounded-md border border-emerald-800">
                        +25 min charge
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Map Visualization (Right Pane) */}
        <div className="lg:col-span-7 h-[650px] sticky top-20">
          <StationMap
            stations={MOCK_STATIONS}
            selectedStation={routeResult?.recommendedChargingStops[0] || null}
            onSelectStation={() => {}}
            routePolyline={routeResult?.routePolylinePoints}
          />
        </div>

      </div>

    </div>
  );
};
