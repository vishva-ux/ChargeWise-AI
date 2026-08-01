import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Station } from '../types';
import { Zap, MapPin, Navigation, Clock } from 'lucide-react';

interface StationMapProps {
  stations: Station[];
  selectedStation: Station | null;
  onSelectStation: (station: Station) => void;
  routePolyline?: [number, number][];
  center?: [number, number];
  zoom?: number;
}

// Custom Leaflet Icons
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: justify-center;
        color: white;
        font-weight: bold;
        font-size: 11px;
        position: relative;
      ">
        <div style="margin: auto;">⚡</div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34]
  });
};

const greenIcon = createCustomIcon('#10b981', 'Available');
const amberIcon = createCustomIcon('#f59e0b', 'Busy');
const blueIcon = createCustomIcon('#0284c7', 'Selected');

export const StationMap: React.FC<StationMapProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  routePolyline,
  center = [12.9716, 77.5946],
  zoom = 12
}) => {
  return (
    <div className="w-full h-full min-h-[420px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {stations.map((st) => {
          const isSelected = selectedStation?.id === st.id;
          const icon = isSelected
            ? blueIcon
            : st.availableChargers > 0
            ? greenIcon
            : amberIcon;

          return (
            <Marker
              key={st.id}
              position={[st.latitude, st.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectStation(st)
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px]">
                  <div className="font-bold text-slate-900 text-sm mb-1">{st.name}</div>
                  <div className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {st.address}
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-slate-50 rounded-lg mb-2">
                    <span className="font-semibold text-emerald-600">
                      {st.availableChargers} / {st.totalChargers} Available
                    </span>
                    <span className="font-bold text-slate-700">₹{st.pricePerKwh}/kWh</span>
                  </div>
                  <button
                    onClick={() => onSelectStation(st)}
                    className="w-full py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-lg transition-colors"
                  >
                    View Station & Book
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Route Polyline overlay if planning */}
        {routePolyline && routePolyline.length > 0 && (
          <Polyline
            positions={routePolyline}
            color="#0284c7"
            weight={5}
            opacity={0.8}
            dashArray="10, 8"
          />
        )}
      </MapContainer>
    </div>
  );
};
