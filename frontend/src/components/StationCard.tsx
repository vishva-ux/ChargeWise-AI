import React from 'react';
import { Station, Charger } from '../types';
import { Star, Zap, Clock, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

interface StationCardProps {
  station: Station;
  isSelected?: boolean;
  onSelect: (station: Station) => void;
  onBook: (station: Station, charger?: Charger) => void;
  onShowDirections?: (station: Station) => void;
}

export const StationCard: React.FC<StationCardProps> = ({ station, isSelected, onSelect, onBook, onShowDirections }) => {
  return (
    <div
      onClick={() => onSelect(station)}
      className={`p-4 rounded-xl bg-white border transition-all duration-150 cursor-pointer relative overflow-hidden ${
        isSelected
          ? 'border-sky-600 shadow-sm ring-1 ring-sky-600/30'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* ML Recommendation Quiet Tag */}
      {station.recommendationScore > 90 && (
        <div className="absolute top-0 right-0 bg-sky-50 text-sky-700 border-l border-b border-sky-200 text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg shadow-2xs flex items-center gap-1">
          <Zap className="w-2.5 h-2.5 text-sky-600 fill-current" /> AI Pick
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2 pr-16">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm leading-snug hover:text-sky-600 transition-colors">
            {station.name}
          </h3>
          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{station.address}</span>
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-1 py-2 my-2.5 bg-slate-50/70 rounded-lg px-2 border border-slate-100 text-center">
        <div>
          <div className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">Available</div>
          <div className="text-xs font-bold text-emerald-600">
            {station.availableChargers} / {station.totalChargers}
          </div>
        </div>

        <div>
          <div className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">ML Wait</div>
          <div className="text-xs font-semibold text-slate-700 flex items-center justify-center gap-0.5">
            <Clock className="w-3 h-3 text-amber-500" />
            {station.predictedWaitMinutes === 0 ? '0 min' : `${station.predictedWaitMinutes}m`}
          </div>
        </div>

        <div>
          <div className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">Tariff</div>
          <div className="text-xs font-semibold text-slate-800">
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
          <span className="text-slate-400 font-normal">({station.distanceKm} km)</span>
        </div>

        <div className="flex items-center gap-1.5">
          {onShowDirections && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowDirections(station);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-bold text-[11px] text-slate-700 transition-colors"
            >
              Directions
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook(station);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 transition-all"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};
