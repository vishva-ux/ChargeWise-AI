export type ConnectorType = 'CCS2' | 'Type2' | 'CHAdeMO' | 'Supercharger';
export type StationStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Offline';

export interface Charger {
  id: string;
  serialNumber: string;
  type: ConnectorType;
  maxPowerKw: number;
  status: StationStatus;
  priceRate: number;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  totalChargers: number;
  availableChargers: number;
  pricePerKwh: number;
  operatorName: string;
  distanceKm: number;
  predictedWaitMinutes: number;
  recommendationScore: number;
  chargers: Charger[];
}

export interface Booking {
  id: string;
  stationId: string;
  stationName: string;
  chargerSerial: string;
  chargerType: string;
  startTime: string;
  endTime: string;
  estimatedCost: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  qrCodeToken: string;
  transactionRef: string;
}

export interface RoutePlan {
  totalDistanceKm: number;
  totalDurationMinutes: number;
  estimatedTotalCost: number;
  recommendedChargingStops: Station[];
  routePolylinePoints: [number, number][];
  batteryInfo: {
    currentSocPercentage: number;
    remainingRangeKm: number;
    needsChargingEnroute: boolean;
    recommendedChargeKwh: number;
    suggestedChargerType: string;
  };
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: 'User' | 'Admin';
  vehicleModel: string;
  batteryCapacityKwh: number;
  preferredConnector: ConnectorType;
}

export interface AnalyticsData {
  totalBookingsToday: number;
  totalActiveStations: number;
  totalRevenueMonth: number;
  averageChargerUtilization: number;
  averageWaitTimeMinutes: number;
  mlModelAccuracyPercentage: number;
  revenueTrends: { date: string; revenue: number }[];
  utilizationHeatmap: { stationName: string; utilizationPercentage: number }[];
}
