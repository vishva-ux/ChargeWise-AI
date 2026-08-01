import { Station, Booking, AnalyticsData } from '../types';

export const MOCK_STATIONS: Station[] = [
  {
    id: 'st-01',
    name: 'Downtown Supercharge Hub',
    address: '742 Evergreen Terrace, Central Business District',
    latitude: 12.9716,
    longitude: 77.5946,
    rating: 4.85,
    totalChargers: 6,
    availableChargers: 4,
    pricePerKwh: 18.50,
    operatorName: 'ChargeWise Ultra',
    distanceKm: 2.3,
    predictedWaitMinutes: 0.0,
    recommendationScore: 96.5,
    chargers: [
      { id: 'ch-01', serialNumber: 'CW-DT-01', type: 'Supercharger', maxPowerKw: 250, status: 'Available', priceRate: 18.50 },
      { id: 'ch-02', serialNumber: 'CW-DT-02', type: 'CCS2', maxPowerKw: 150, status: 'Occupied', priceRate: 18.50 },
      { id: 'ch-03', serialNumber: 'CW-DT-03', type: 'CCS2', maxPowerKw: 150, status: 'Available', priceRate: 18.50 },
      { id: 'ch-04', serialNumber: 'CW-DT-04', type: 'Type2', maxPowerKw: 50, status: 'Available', priceRate: 14.00 },
    ]
  },
  {
    id: 'st-02',
    name: 'Tech Park Fast Charging Grid',
    address: '100 Innovation Blvd, Silicon Square',
    latitude: 12.9352,
    longitude: 77.6387,
    rating: 4.70,
    totalChargers: 8,
    availableChargers: 5,
    pricePerKwh: 16.00,
    operatorName: 'GreenGrid Power',
    distanceKm: 5.8,
    predictedWaitMinutes: 3.5,
    recommendationScore: 89.2,
    chargers: [
      { id: 'ch-05', serialNumber: 'CW-TP-01', type: 'CCS2', maxPowerKw: 150, status: 'Available', priceRate: 16.00 },
      { id: 'ch-06', serialNumber: 'CW-TP-02', type: 'CHAdeMO', maxPowerKw: 60, status: 'Occupied', priceRate: 16.00 },
      { id: 'ch-07', serialNumber: 'CW-TP-03', type: 'Type2', maxPowerKw: 22, status: 'Available', priceRate: 12.00 }
    ]
  },
  {
    id: 'st-03',
    name: 'Airport Express Charge Plaza',
    address: 'Terminal 2 Outer Circle, International Airport',
    latitude: 13.1986,
    longitude: 77.7068,
    rating: 4.90,
    totalChargers: 10,
    availableChargers: 8,
    pricePerKwh: 22.00,
    operatorName: 'AeroCharge Network',
    distanceKm: 28.4,
    predictedWaitMinutes: 0.0,
    recommendationScore: 92.1,
    chargers: [
      { id: 'ch-08', serialNumber: 'CW-AP-01', type: 'Supercharger', maxPowerKw: 350, status: 'Available', priceRate: 22.00 },
      { id: 'ch-09', serialNumber: 'CW-AP-02', type: 'CCS2', maxPowerKw: 150, status: 'Available', priceRate: 22.00 }
    ]
  },
  {
    id: 'st-04',
    name: 'Metro Station EV Station',
    address: 'Platform 1 Entrance, MG Road Metro Hub',
    latitude: 12.9756,
    longitude: 77.6094,
    rating: 4.40,
    totalChargers: 4,
    availableChargers: 1,
    pricePerKwh: 14.00,
    operatorName: 'CityCharge Express',
    distanceKm: 1.8,
    predictedWaitMinutes: 12.0,
    recommendationScore: 78.4,
    chargers: [
      { id: 'ch-10', serialNumber: 'CW-MT-01', type: 'Type2', maxPowerKw: 22, status: 'Available', priceRate: 14.00 },
      { id: 'ch-11', serialNumber: 'CW-MT-02', type: 'CCS2', maxPowerKw: 50, status: 'Occupied', priceRate: 14.00 }
    ]
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bkg-101',
    stationId: 'st-01',
    stationName: 'Downtown Supercharge Hub',
    chargerSerial: 'CW-DT-01',
    chargerType: 'Supercharger',
    startTime: '2026-08-01T14:00:00Z',
    endTime: '2026-08-01T14:45:00Z',
    estimatedCost: 647.50,
    status: 'Confirmed',
    qrCodeToken: 'CW-QR-88A9F21B0C',
    transactionRef: 'TXN-9081248912'
  },
  {
    id: 'bkg-102',
    stationId: 'st-02',
    stationName: 'Tech Park Fast Charging Grid',
    chargerSerial: 'CW-TP-01',
    chargerType: 'CCS2',
    startTime: '2026-07-28T10:30:00Z',
    endTime: '2026-07-28T11:15:00Z',
    estimatedCost: 480.00,
    status: 'Completed',
    qrCodeToken: 'CW-QR-77B1A45C99',
    transactionRef: 'TXN-4512903841'
  }
];

export const MOCK_ANALYTICS: AnalyticsData = {
  totalBookingsToday: 142,
  totalActiveStations: 18,
  totalRevenueMonth: 48520.00,
  averageChargerUtilization: 74.8,
  averageWaitTimeMinutes: 4.2,
  mlModelAccuracyPercentage: 94.6,
  revenueTrends: [
    { date: 'Mon', revenue: 6200 },
    { date: 'Tue', revenue: 7100 },
    { date: 'Wed', revenue: 6800 },
    { date: 'Thu', revenue: 8400 },
    { date: 'Fri', revenue: 9200 },
    { date: 'Sat', revenue: 11500 },
    { date: 'Sun', revenue: 10800 }
  ],
  utilizationHeatmap: [
    { stationName: 'Downtown Supercharge Hub', utilizationPercentage: 88.5 },
    { stationName: 'Tech Park Fast Charging', utilizationPercentage: 79.2 },
    { stationName: 'Airport Express Plaza', utilizationPercentage: 91.0 },
    { stationName: 'Metro Station EV Hub', utilizationPercentage: 64.0 },
    { stationName: 'Suburban EcoCharge', utilizationPercentage: 51.5 }
  ]
};
