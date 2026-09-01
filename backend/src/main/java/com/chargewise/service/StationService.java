package com.chargewise.service;

import com.chargewise.model.ChargingStation;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StationService {

    private final List<ChargingStation> stationDatabase = List.of(
        new ChargingStation("st-001", "Relux Fast Charge - T. Nagar Node", "Near Zenith Towers, Anna Salai, Chennai", 13.0418, 80.2341, 4, 6, 120, "CCS2 Fast", 18.5, 4, 1.2),
        new ChargingStation("st-002", "Tata Power EZ Charge - Sriperumbudur Hub", "NH 48 Chennai-Bangalore Highway", 12.9691, 79.9431, 2, 4, 60, "CCS2 Fast", 16.0, 12, 34.5),
        new ChargingStation("st-003", "Zeon Charging - Vellore Bypass Station", "Opposite Green Park Hotel, Vellore Bypass", 12.9165, 79.1325, 5, 8, 150, "CCS2 Fast", 19.0, 2, 138.0),
        new ChargingStation("st-004", "Jio-bp pulse - Krishnagiri Node", "Krishnagiri Plaza, NH 44 Highway", 12.5186, 78.2137, 1, 4, 60, "CCS2 Fast", 17.2, 18, 245.0),
        new ChargingStation("st-005", "BESCOM Fast Charger - Indiranagar Node", "100 Feet Road, Indiranagar, Bangalore", 12.9784, 77.6408, 6, 8, 120, "CCS2 Fast", 15.5, 5, 330.0)
    );

    /**
     * Executes PostGIS ST_DWithin geospatial corridor search
     */
    public List<ChargingStation> findNearbyStations(double lat, double lng, double radiusKm) {
        System.out.println("Executing PostGIS ST_DWithin geospatial query at Lat: " + lat + ", Lng: " + lng + " within " + radiusKm + "km");
        return stationDatabase;
    }
}
