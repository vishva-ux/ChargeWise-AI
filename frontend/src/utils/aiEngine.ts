export interface ChargingStation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  availablePorts: number;
  totalPorts: number;
  powerKw: number;
  connectorType: 'CCS2 Fast' | 'Type 2 AC' | 'GB/T Fast';
  pricePerKwh: number;
  predictedWaitTimeMins: number;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  tags: string[];
  safetyRating: string;
  nearbyAmenities: string[];
  hasBrokenReport: boolean;
}

export interface ExtractedAIQuery {
  rawPrompt: string;
  startLocation: string;
  destination: string;
  currentBatteryPercentage: number;
  preferredChargerType: 'CCS2 Fast' | 'Type 2 AC' | 'ANY';
  maxWaitTimeMins?: number;
  tariffLimit?: string;
  isSemanticRAG: boolean;
  ragAnswer?: string;
}

// Initial Station Node Database (Simulating PostGIS Geospatial Records & Operational Nodes)
export const INITIAL_STATIONS: ChargingStation[] = [
  {
    id: 'st-001',
    name: 'Relux Fast Charge - T. Nagar Node',
    address: 'Near Zenith Towers, Anna Salai, Chennai',
    lat: 13.0418,
    lng: 80.2341,
    availablePorts: 4,
    totalPorts: 6,
    powerKw: 120,
    connectorType: 'CCS2 Fast',
    pricePerKwh: 18.5,
    predictedWaitTimeMins: 4,
    rating: 4.8,
    reviewsCount: 142,
    distanceKm: 1.2,
    tags: ['Superfast', '24/7 Food Court', 'Fleet Preferred'],
    safetyRating: '98% Safe (Lit & Guarded)',
    nearbyAmenities: ['Subway', 'Coffee Day', 'Clean Washrooms'],
    hasBrokenReport: false,
  },
  {
    id: 'st-002',
    name: 'Tata Power EZ Charge - Sriperumbudur Hub',
    address: 'NH 48 Chennai-Bangalore Highway Corridor',
    lat: 12.9691,
    lng: 79.9431,
    availablePorts: 2,
    totalPorts: 4,
    powerKw: 60,
    connectorType: 'CCS2 Fast',
    pricePerKwh: 16.0,
    predictedWaitTimeMins: 12,
    rating: 4.6,
    reviewsCount: 89,
    distanceKm: 34.5,
    tags: ['Highway Corridor', 'High Power'],
    safetyRating: '95% Safe',
    nearbyAmenities: ['Highway Resto', 'EV Lounge'],
    hasBrokenReport: false,
  },
  {
    id: 'st-003',
    name: 'Zeon Charging - Vellore Bypass Station',
    address: 'Opposite Green Park Hotel, Vellore Bypass',
    lat: 12.9165,
    lng: 79.1325,
    availablePorts: 5,
    totalPorts: 8,
    powerKw: 150,
    connectorType: 'CCS2 Fast',
    pricePerKwh: 19.0,
    predictedWaitTimeMins: 2,
    rating: 4.9,
    reviewsCount: 210,
    distanceKm: 138.0,
    tags: ['150kW UltraFast', 'Off-peak Discounts', 'Food Court'],
    safetyRating: '99% Safe (CCTV Monitored)',
    nearbyAmenities: ['McDonalds', 'Rest Area', 'Wifi Zone'],
    hasBrokenReport: false,
  },
  {
    id: 'st-004',
    name: 'Jio-bp pulse - Krishnagiri Node',
    address: 'Krishnagiri Plaza, NH 44 Highway',
    lat: 12.5186,
    lng: 78.2137,
    availablePorts: 1,
    totalPorts: 4,
    powerKw: 60,
    connectorType: 'CCS2 Fast',
    pricePerKwh: 17.2,
    predictedWaitTimeMins: 18,
    rating: 4.2,
    reviewsCount: 64,
    distanceKm: 245.0,
    tags: ['Highway Hub', 'Canopy'],
    safetyRating: '90% Safe',
    nearbyAmenities: ['Wildcraft Store', 'Fuel Station'],
    hasBrokenReport: true, // Reported minor plug issue on Port 2
  },
  {
    id: 'st-005',
    name: 'Kazam AC Charging - Guindy Tech Park',
    address: 'Mount Poonamallee Road, Guindy, Chennai',
    lat: 13.0067,
    lng: 80.202,
    availablePorts: 3,
    totalPorts: 4,
    powerKw: 22,
    connectorType: 'Type 2 AC',
    pricePerKwh: 12.0,
    predictedWaitTimeMins: 0,
    rating: 4.4,
    reviewsCount: 45,
    distanceKm: 4.8,
    tags: ['Economical', 'Workplace Charging'],
    safetyRating: '94% Safe',
    nearbyAmenities: ['Cafeteria', 'ATM'],
    hasBrokenReport: false,
  },
  {
    id: 'st-006',
    name: 'BESCOM Fast Charger - Indiranagar Node',
    address: '100 Feet Road, Indiranagar, Bangalore',
    lat: 12.9784,
    lng: 77.6408,
    availablePorts: 6,
    totalPorts: 8,
    powerKw: 120,
    connectorType: 'CCS2 Fast',
    pricePerKwh: 15.5,
    predictedWaitTimeMins: 5,
    rating: 4.7,
    reviewsCount: 178,
    distanceKm: 330.0,
    tags: ['Bangalore Hub', 'Fleet Wallet Supported'],
    safetyRating: '97% Safe',
    nearbyAmenities: ['Starbucks', 'Third Wave Coffee'],
    hasBrokenReport: false,
  }
];

/**
 * Natural Language LLM Tool Calling & Zod Extraction Simulation
 * Parses raw prompt text into strict JSON parameters (Zod schema) and queries the PostGIS spatial engine.
 */
export function processLLMQuery(promptText: string): {
  extracted: ExtractedAIQuery;
  matchingStations: ChargingStation[];
} {
  const text = promptText.toLowerCase();

  // Extract Battery % if present
  let battery = 35;
  const batteryMatch = text.match(/(\d{1,3})\s*%/);
  if (batteryMatch) {
    battery = parseInt(batteryMatch[1], 10);
  }

  // Determine Charger Type Preference
  let preferredType: 'CCS2 Fast' | 'Type 2 AC' | 'ANY' = 'ANY';
  if (text.includes('fast') || text.includes('fleet') || text.includes('ccs2') || text.includes('highway')) {
    preferredType = 'CCS2 Fast';
  } else if (text.includes('ac') || text.includes('slow') || text.includes('cheap')) {
    preferredType = 'Type 2 AC';
  }

  // Check for intent specific queries (broken plugs, food joints, safety)
  const isBrokenQuery = text.includes('broken') || text.includes('faulty') || text.includes('connector');
  const isFoodQuery = text.includes('food') || text.includes('eat') || text.includes('snack') || text.includes('coffee');
  const isSemanticRAG = isBrokenQuery || isFoodQuery || text.includes('safe') || text.includes('log');

  let ragAnswer = '';
  if (isBrokenQuery) {
    ragAnswer = 'Operational station registry check retrieved 1 station with reported connector issues (Krishnagiri Node - Port 2 latch issue). Showing verified operational stations nearby.';
  } else if (isFoodQuery) {
    ragAnswer = 'Route corridor search identified top stations with 24/7 dining lounges & coffee shops along your path.';
  } else if (battery < 25) {
    ragAnswer = `Critical Battery Alert (${battery}%). AI Route Planner prioritized ultra-fast 120kW+ CCS2 stations within immediate reach.`;
  } else {
    ragAnswer = `Extracted 4 structured route parameters via Zod tool calling. Queried PostGIS spatial database for optimal corridor nodes.`;
  }

  // Filter stations based on extracted requirements
  let filtered = [...INITIAL_STATIONS];

  if (isBrokenQuery) {
    filtered = filtered.filter(s => !s.hasBrokenReport);
  }

  if (preferredType !== 'ANY') {
    filtered = filtered.filter(s => s.connectorType === preferredType || s.powerKw >= 60);
  }

  // Sort by shortest predicted wait time & distance
  filtered.sort((a, b) => a.predictedWaitTimeMins - b.predictedWaitTimeMins || a.distanceKm - b.distanceKm);

  return {
    extracted: {
      rawPrompt: promptText,
      startLocation: text.includes('bangalore') ? 'Indiranagar, Bangalore' : 'T. Nagar, Chennai',
      destination: text.includes('bangalore') ? 'Indiranagar, Bangalore' : 'Vellore Bypass / Bangalore Corridor',
      currentBatteryPercentage: battery,
      preferredChargerType: preferredType,
      maxWaitTimeMins: 15,
      isSemanticRAG,
      ragAnswer,
    },
    matchingStations: filtered,
  };
}

/**
 * Calculates line-item transaction pricing breakdown
 */
export function calculatePricing(station: ChargingStation) {
  const baseReservationFee = 49;
  const estimatedKwhNeeded = 25; // standard charging session estimate
  const estimatedTariff = Math.round(station.pricePerKwh * estimatedKwhNeeded);
  const totalAmount = baseReservationFee + estimatedTariff;

  return {
    baseReservationFee,
    estimatedKwhNeeded,
    pricePerKwh: station.pricePerKwh,
    estimatedTariff,
    totalAmount,
  };
}
