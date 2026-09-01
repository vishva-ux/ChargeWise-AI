package com.chargewise.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChargingStation {
    private String id;
    private String name;
    private String address;
    private double latitude;
    private double longitude;
    private int availablePorts;
    private int totalPorts;
    private int powerKw;
    private String connectorType;
    private double pricePerKwh;
    private int predictedWaitTimeMins;
    private double distanceKm;
}
