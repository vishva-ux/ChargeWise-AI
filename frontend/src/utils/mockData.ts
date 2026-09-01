import { Station, Booking, AnalyticsData } from '../types';

export const MOCK_STATIONS: Station[] = [
  // ── Bengaluru ──
  {
    id: 'st-01',
    name: 'Downtown Supercharge Hub',
    address: '742 MG Road, Central Business District, Bengaluru',
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
    address: '100 Outer Ring Road, Electronic City, Bengaluru',
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
    name: 'Kempegowda Airport Charge Plaza',
    address: 'Terminal 2, Kempegowda International Airport, Bengaluru',
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
    name: 'MG Road Metro EV Station',
    address: 'Platform 1 Entrance, MG Road Metro Hub, Bengaluru',
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
  },

  // ── Mumbai ──
  {
    id: 'st-05',
    name: 'BKC EV SuperHub',
    address: 'G Block, Bandra Kurla Complex, Mumbai',
    latitude: 19.0652,
    longitude: 72.8685,
    rating: 4.80,
    totalChargers: 12,
    availableChargers: 9,
    pricePerKwh: 20.00,
    operatorName: 'ChargeWise Ultra',
    distanceKm: 3.1,
    predictedWaitMinutes: 0.0,
    recommendationScore: 94.8,
    chargers: [
      { id: 'ch-12', serialNumber: 'CW-BKC-01', type: 'Supercharger', maxPowerKw: 250, status: 'Available', priceRate: 20.00 },
      { id: 'ch-13', serialNumber: 'CW-BKC-02', type: 'CCS2', maxPowerKw: 150, status: 'Available', priceRate: 20.00 },
      { id: 'ch-14', serialNumber: 'CW-BKC-03', type: 'Type2', maxPowerKw: 50, status: 'Occupied', priceRate: 15.00 }
    ]
  },
  {
    id: 'st-06',
    name: 'Andheri Metro Charge Point',
    address: 'Near Andheri Station, Metro Line 1, Mumbai',
    latitude: 19.1136,
    longitude: 72.8697,
    rating: 4.55,
    totalChargers: 6,
    availableChargers: 3,
    pricePerKwh: 17.50,
    operatorName: 'MetroCharge Mumbai',
    distanceKm: 7.4,
    predictedWaitMinutes: 6.0,
    recommendationScore: 83.0,
    chargers: [
      { id: 'ch-15', serialNumber: 'CW-AND-01', type: 'CCS2', maxPowerKw: 100, status: 'Available', priceRate: 17.50 },
      { id: 'ch-16', serialNumber: 'CW-AND-02', type: 'Type2', maxPowerKw: 22, status: 'Available', priceRate: 13.00 }
    ]
  },
  {
    id: 'st-07',
    name: 'Powai Tech Downtown Charger',
    address: 'Hiranandani Gardens, Powai, Mumbai',
    latitude: 19.1170,
    longitude: 72.9050,
    rating: 4.65,
    totalChargers: 8,
    availableChargers: 5,
    pricePerKwh: 18.00,
    operatorName: 'GreenGrid Power',
    distanceKm: 12.0,
    predictedWaitMinutes: 4.5,
    recommendationScore: 88.3,
    chargers: [
      { id: 'ch-17', serialNumber: 'CW-POW-01', type: 'CCS2', maxPowerKw: 150, status: 'Available', priceRate: 18.00 },
      { id: 'ch-18', serialNumber: 'CW-POW-02', type: 'Supercharger', maxPowerKw: 250, status: 'Occupied', priceRate: 20.00 }
    ]
  },

  // ── New Delhi ──
  {
    id: 'st-08',
    name: 'Connaught Place EV Hub',
    address: 'Block A, Connaught Place, New Delhi',
    latitude: 28.6329,
    longitude: 77.2195,
    rating: 4.75,
    totalChargers: 10,
    availableChargers: 7,
    pricePerKwh: 19.00,
    operatorName: 'ChargeWise Ultra',
    distanceKm: 2.0,
    predictedWaitMinutes: 2.0,
    recommendationScore: 91.5,
    chargers: [
      { id: 'ch-19', serialNumber: 'CW-CP-01', type: 'Supercharger', maxPowerKw: 250, status: 'Available', priceRate: 19.00 },
      { id: 'ch-20', serialNumber: 'CW-CP-02', type: 'CCS2', maxPowerKw: 150, status: 'Available', priceRate: 19.00 },
      { id: 'ch-21', serialNumber: 'CW-CP-03', type: 'Type2', maxPowerKw: 50, status: 'Available', priceRate: 14.50 }
    ]
  },
  {
    id: 'st-09',
    name: 'IGI Airport Terminal 3 Charger',
    address: 'Arrival Level, Terminal 3, IGI Airport, New Delhi',
    latitude: 28.5562,
    longitude: 77.1000,
    rating: 4.88,
    totalChargers: 14,
    availableChargers: 11,
    pricePerKwh: 23.00,
    operatorName: 'AeroCharge Network',
    distanceKm: 14.5,
    predictedWaitMinutes: 0.0,
    recommendationScore: 95.0,
    chargers: [
      { id: 'ch-22', serialNumber: 'CW-IGI-01', type: 'Supercharger', maxPowerKw: 350, status: 'Available', priceRate: 23.00 },
      { id: 'ch-23', serialNumber: 'CW-IGI-02', type: 'CCS2', maxPowerKw: 150, status: 'Available', priceRate: 23.00 }
    ]
  },
  {
    id: 'st-10',
    name: 'Cyber City Gurugram Hub',
    address: 'DLF Cyber City, Sector 25, Gurugram',
    latitude: 28.4947,
    longitude: 77.0888,
    rating: 4.60,
    totalChargers: 8,
    availableChargers: 4,
    pricePerKwh: 17.00,
    operatorName: 'CityCharge Express',
    distanceKm: 18.3,
    predictedWaitMinutes: 8.0,
    recommendationScore: 82.7,
    chargers: [
      { id: 'ch-24', serialNumber: 'CW-GGN-01', type: 'CCS2', maxPowerKw: 100, status: 'Available', priceRate: 17.00 },
      { id: 'ch-25', serialNumber: 'CW-GGN-02', type: 'Type2', maxPowerKw: 22, status: 'Occupied', priceRate: 13.00 }
    ]
  },

  // ── Chennai ──
  {
    id: 'st-11',
    name: 'Anna Salai EV SuperCharger',
    address: '34 Anna Salai, Mount Road, Chennai',
    latitude: 13.0604,
    longitude: 80.2496,
    rating: 4.70,
    totalChargers: 8,
    availableChargers: 6,
    pricePerKwh: 16.50,
    operatorName: 'ChargeWise Ultra',
    distanceKm: 3.5,
    predictedWaitMinutes: 1.0,
    recommendationScore: 90.2,
    chargers: [
      { id: 'ch-26', serialNumber: 'CW-AS-01', type: 'Supercharger', maxPowerKw: 250, status: 'Available', priceRate: 16.50 },
      { id: 'ch-27', serialNumber: 'CW-AS-02', type: 'CCS2', maxPowerKw: 150, status: 'Available', priceRate: 16.50 },
      { id: 'ch-28', serialNumber: 'CW-AS-03', type: 'Type2', maxPowerKw: 22, status: 'Available', priceRate: 12.00 }
    ]
  },
  {
    id: 'st-12',
    name: 'Chennai Airport Charge Hub',
    address: 'Domestic Arrivals, Chennai International Airport',
    latitude: 12.9941,
    longitude: 80.1709,
    rating: 4.82,
    totalChargers: 10,
    availableChargers: 8,
    pricePerKwh: 21.00,
    operatorName: 'AeroCharge Network',
    distanceKm: 10.2,
    predictedWaitMinutes: 0.0,
    recommendationScore: 93.4,
    chargers: [
      { id: 'ch-29', serialNumber: 'CW-CHN-01', type: 'Supercharger', maxPowerKw: 350, status: 'Available', priceRate: 21.00 },
      { id: 'ch-30', serialNumber: 'CW-CHN-02', type: 'CCS2', maxPowerKw: 150, status: 'Available', priceRate: 21.00 }
    ]
  },
  {
    id: 'st-13',
    name: 'OMR Tech Corridor Charger',
    address: 'Old Mahabalipuram Road, Sholinganallur, Chennai',
    latitude: 12.9007,
    longitude: 80.2275,
    rating: 4.50,
    totalChargers: 6,
    availableChargers: 2,
    pricePerKwh: 15.50,
    operatorName: 'GreenGrid Power',
    distanceKm: 22.0,
    predictedWaitMinutes: 15.0,
    recommendationScore: 76.8,
    chargers: [
      { id: 'ch-31', serialNumber: 'CW-OMR-01', type: 'CCS2', maxPowerKw: 100, status: 'Available', priceRate: 15.50 },
      { id: 'ch-32', serialNumber: 'CW-OMR-02', type: 'Type2', maxPowerKw: 22, status: 'Occupied', priceRate: 11.00 }
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
