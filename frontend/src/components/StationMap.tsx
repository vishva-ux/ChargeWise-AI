"use client";

import React, { useEffect, useState } from 'react';
import { ChargingStation } from '../utils/aiEngine';

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
  const [isClient, setIsClient] = useState(false);
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import Leaflet and React-Leaflet on client side only
    Promise.all([
      import('react-leaflet'),
      import('leaflet'),
      import('leaflet/dist/leaflet.css' as any)
    ]).then(([reactLeaflet, leafletModule]) => {
      const L = leafletModule.default || leafletModule;
      if (L.Icon && L.Icon.Default && L.Icon.Default.prototype) {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
      }
      setMapComponents({
        MapContainer: reactLeaflet.MapContainer,
        TileLayer: reactLeaflet.TileLayer,
        Marker: reactLeaflet.Marker,
        Popup: reactLeaflet.Popup,
        useMap: reactLeaflet.useMap,
        L,
      });
    });
  }, []);

  if (!isClient || !MapComponents) {
    return (
      <div className="absolute inset-0 w-full h-full bg-slate-900 flex items-center justify-center text-slate-400 text-xs font-semibold">
        Loading Interactive Leaflet Map...
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, useMap, L } = MapComponents;

  const createCustomIcon = (type: 'FAST' | 'AC' | 'USER') => {
    if (type === 'USER') {
      return L.divIcon({
        className: 'custom-map-marker',
        html: `<div class="marker-pin-user"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
    }

    const isFast = type === 'FAST';
    const bgColor = isFast ? '#344055' : '#52B788';
    const iconSymbol = isFast ? '⚡' : '🔌';

    return L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="background-color: ${bgColor}; width: 34px; height: 34px; border-radius: 50%; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; items-center; justify-content: center; font-weight: bold; font-size: 14px; color: #ffffff;">
          ${iconSymbol}
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -18],
    });
  };

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
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

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
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-0.5">
                    <span>{connectorType}</span>
                    <span>⚡ {powerKw} kW</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 leading-tight mb-1">{st.name}</h4>
                  <p className="text-[10px] text-slate-500 mb-2">{st.address}</p>
                  
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 bg-slate-100 p-1.5 rounded mb-2">
                    <span>Avail: {avail}/{total}</span>
                    <span className="text-emerald-700 font-bold">~{waitMins}m wait</span>
                  </div>

                  <button
                    onClick={() => onSelectStation(st)}
                    className="w-full bg-[#344055] hover:bg-slate-800 text-white text-[11px] font-extrabold py-1.5 rounded-lg shadow-sm transition-colors text-center uppercase tracking-wider"
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
