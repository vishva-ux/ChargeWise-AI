package com.chargewise.controller;

import com.chargewise.model.ChargingStation;
import com.chargewise.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stations")
@CrossOrigin(origins = "*")
public class StationController {

    @Autowired
    private StationService stationService;

    @GetMapping("/nearby")
    public ResponseEntity<List<ChargingStation>> getNearbyStations(
            @RequestParam(defaultValue = "13.0418") double lat,
            @RequestParam(defaultValue = "80.2341") double lng,
            @RequestParam(defaultValue = "50.0") double radiusKm) {
        
        List<ChargingStation> result = stationService.findNearbyStations(lat, lng, radiusKm);
        return ResponseEntity.ok(result);
    }
}
