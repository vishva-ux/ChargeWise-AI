"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { RapidoHeader } from '../components/RapidoHeader';
import { RapidoSearchModule } from '../components/RapidoSearchModule';
import { RapidoBottomSheet } from '../components/RapidoBottomSheet';
import { RapidoLoginModal } from '../components/RapidoLoginModal';
import { RapidoProfileModal } from '../components/RapidoProfileModal';
import { RapidoNotificationsModal } from '../components/RapidoNotificationsModal';
import { INITIAL_STATIONS, processLLMQuery, ChargingStation, ExtractedAIQuery } from '../utils/aiEngine';

// Dynamically import StationMap with SSR disabled to prevent Leaflet window object errors
const StationMap = dynamic(
  () => import('../components/StationMap').then((mod) => mod.StationMap),
  { ssr: false }
);

export default function Home() {
  // Auth & Modal States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [userData, setUserData] = useState({ phone: '+91 98765 43210', vehicleType: 'EV Fleet Cab' });
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // App Data State
  const [stations, setStations] = useState<ChargingStation[]>(INITIAL_STATIONS);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(INITIAL_STATIONS[0]);
  const [aiQueryResult, setAiQueryResult] = useState<ExtractedAIQuery | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Handle conversational search submit
  const handleSearchSubmit = (promptText: string) => {
    setIsSearching(true);
    
    // Simulate AI LLM latency & Zod tool-calling parsing
    setTimeout(() => {
      const { extracted, matchingStations } = processLLMQuery(promptText);
      setAiQueryResult(extracted);
      setStations(matchingStations);
      if (matchingStations.length > 0) {
        setSelectedStation(matchingStations[0]);
      }
      setIsSearching(false);
    }, 500);
  };

  // Reset search filters back to default nearby stations
  const handleResetSearch = () => {
    setAiQueryResult(null);
    setStations(INITIAL_STATIONS);
    setSelectedStation(INITIAL_STATIONS[0]);
  };

  return (
    <main className="min-h-screen bg-[#65C5B0] flex items-center justify-center font-sans antialiased p-0 sm:p-6">
      {/* 440px Centered Desktop Viewport Canvas (Headspace/Rapido Mint Style Frame) */}
      <div className="mobile-canvas-frame relative flex flex-col">
        
        {/* Render Rapido Login Modal if not authenticated */}
        {!isLoggedIn ? (
          <RapidoLoginModal
            onLoginSuccess={(data) => {
              setUserData(data);
              setIsLoggedIn(true);
            }}
          />
        ) : (
          <>
            {/* Floating Header */}
            <RapidoHeader
              userPhone={userData.phone}
              activeFleetWalletBalance={2450.00}
              onProfileClick={() => setIsProfileOpen(true)}
              onNotificationClick={() => setIsNotificationsOpen(true)}
            />

            {/* Floating Search Module */}
            <RapidoSearchModule
              onSearchSubmit={handleSearchSubmit}
              currentLocationName="T. Nagar, Chennai (Current Location)"
              isSearching={isSearching}
            />

            {/* Background Interactive Map */}
            <StationMap
              stations={stations}
              selectedStation={selectedStation}
              onSelectStation={(st) => setSelectedStation(st)}
            />

            {/* Dynamic Sliding Bottom Sheet */}
            <RapidoBottomSheet
              stations={stations}
              selectedStation={selectedStation}
              onSelectStation={(st) => setSelectedStation(st)}
              aiQueryResult={aiQueryResult}
              onResetSearch={handleResetSearch}
            />

            {/* Notifications Modal */}
            {isNotificationsOpen && (
              <RapidoNotificationsModal
                onClose={() => setIsNotificationsOpen(false)}
              />
            )}

            {/* Profile Drawer Modal */}
            {isProfileOpen && (
              <RapidoProfileModal
                userPhone={userData.phone}
                vehicleType={userData.vehicleType}
                walletBalance={2450.00}
                onClose={() => setIsProfileOpen(false)}
                onLogout={() => {
                  setIsProfileOpen(false);
                  setIsLoggedIn(false);
                }}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
