import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ChargingStation } from '../utils/aiEngine';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon paths in React bundle environments
delete (L.Icon.Default.prototype as any)._getIconUrl;

const createCustomIcon = (type: 'FAST' | 'AC' | 'USER', text?: string) => {
  if (type === 'USER') {
    return L.divIcon({
      className: 'custom-map-marker',
      html: `<div class="marker-pin-user"></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  }

  const isFast = type === 'FAST';
  const bgColor = isFast ? '#f59e0b' : '#06b6d4';
  const iconSymbol = isFast ? '⚡' : '🔌';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="background-color: ${bgColor}; width: 34px; height: 34px; border-radius: 50%; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">
        ${iconSymbol}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
};

// Helper component to smoothly animate map center shifts
const MapController: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 12 }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2, easeLinearity: 0.25 });
  }, [center, zoom, map]);
  return null;
};

interface StationMapProps {
  stations: any[];
  selectedStation: any | null;
  onSelectStation: (station: any) => void;
  userLat?: number;
  userLng?: number;
  center?: [number, number];
  routePolyline?: [number, number][];
}

export const StationMap: React.FC<StationMapProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  userLat = 13.0418,
  userLng = 80.2341,
}) => {
  const getLat = (s: any) => s.lat ?? s.latitude ?? userLat;
  const getLng = (s: any) => s.lng ?? s.longitude ?? userLng;
  const getAvail = (s: any) => s.availablePorts ?? s.availableChargers ?? 2;
  const getTotal = (s: any) => s.totalPorts ?? s.totalChargers ?? 4;
  const getPower = (s: any) => s.powerKw ?? (s.chargers?.[0]?.maxPowerKw) ?? 60;
  const getType = (s: any) => s.connectorType ?? (s.chargers?.[0]?.type) ?? 'CCS2 Fast';
  const getWait = (s: any) => s.predictedWaitTimeMins ?? s.predictedWaitMinutes ?? 5;

  const defaultCenter: [number, number] = selectedStation
    ? [getLat(selectedStation), getLng(selectedStation)]
    : [userLat, userLng];

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full"
      >
        {/* Dark Modern Vector Tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Map Controller for smooth flyTo transitions */}
        <MapController center={defaultCenter} zoom={selectedStation ? 13 : 12} />

        {/* User Location Pulse Marker */}
        <Marker position={[userLat, userLng]} icon={createCustomIcon('USER')}>
          <Popup>
            <div className="text-xs font-bold text-slate-900">
              📍 Current Location (GPS)
            </div>
          </Popup>
        </Marker>

        {/* Station Markers */}
        {stations.map((st) => {
          const lat = getLat(st);
          const lng = getLng(st);
          const powerKw = getPower(st);
          const connectorType = getType(st);
          const avail = getAvail(st);
          const total = getTotal(st);
          const waitMins = getWait(st);
          const price = st.pricePerKwh ?? 18;

          const isFast = String(connectorType).toLowerCase().includes('ccs2') || String(connectorType).toLowerCase().includes('fast') || powerKw >= 50;

          return (
            <Marker
              key={st.id}
              position={[lat, lng]}
              icon={createCustomIcon(isFast ? 'FAST' : 'AC')}
              eventHandlers={{
                click: () => onSelectStation(st),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1 max-w-[200px]">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-600 mb-0.5">
                    <span>{connectorType}</span>
                    <span>⚡ {powerKw} kW</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 leading-tight mb-1">{st.name}</h4>
                  <p className="text-[10px] text-slate-500 mb-2">{st.address}</p>
                  
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 bg-slate-100 p-1.5 rounded mb-2">
                    <span>Avail: {avail}/{total}</span>
                    <span className="text-emerald-600 font-bold">~{waitMins}m wait</span>
                  </div>

                  <button
                    onClick={() => onSelectStation(st)}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 text-[11px] font-extrabold py-1.5 rounded-lg shadow-sm transition-colors text-center"
                  >
                    Book Slot (₹{price}/kWh)
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
