import React from 'react';
import { Station, Charger } from '../types';
import { Star, Zap, Clock, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

interface StationCardProps {
  station: Station;
  isSelected?: boolean;
  onSelect: (station: Station) => void;
  onBook: (station: Station, charger?: Charger) => void;
}

export const StationCard: React.FC<StationCardProps> = ({ station, isSelected, onSelect, onBook }) => {
  return (
    <div
      onClick={() => onSelect(station)}
      className={`p-5 rounded-2xl bg-white border transition-all duration-200 cursor-pointer relative overflow-hidden ${
        isSelected
          ? 'border-sky-500 shadow-md ring-2 ring-sky-500/20'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* ML Recommendation Badge */}
      {station.recommendationScore > 90 && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-sky-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
          <Zap className="w-3 h-3 fill-current" /> AI Top Pick ({station.recommendationScore}%)
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2 pr-12">
        <div>
          <h3 className="font-bold text-slate-900 text-base leading-tight hover:text-sky-600 transition-colors">
            {station.name}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{station.address}</span>
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 py-3 my-3 bg-slate-50 rounded-xl px-3 border border-slate-100 text-center">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Available</div>
          <div className="text-sm font-extrabold text-emerald-600">
            {station.availableChargers} / {station.totalChargers}
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">ML Wait Est.</div>
          <div className="text-sm font-bold text-slate-700 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            {station.predictedWaitMinutes === 0 ? '0 min' : `${station.predictedWaitMinutes}m`}
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Tariff</div>
          <div className="text-sm font-bold text-slate-800">
            ₹{station.pricePerKwh}/kWh
          </div>
        </div>
      </div>

      {/* Charger Types Pills */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        {station.chargers.map((charger) => (
          <span
            key={charger.id}
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border flex items-center gap-1 ${
              charger.status === 'Available'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-500 border-slate-200 opacity-60'
            }`}
          >
            <Zap className="w-3 h-3 text-current" />
            {charger.type} ({charger.maxPowerKw}kW)
          </span>
        ))}
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{station.rating}</span>
          <span className="text-slate-400 font-normal">({station.distanceKm} km away)</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onBook(station);
          }}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all"
        >
          Book Slot <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
