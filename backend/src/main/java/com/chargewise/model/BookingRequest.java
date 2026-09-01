package com.chargewise.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private String stationId;
    private String userPhone;
    private String vehicleType;
    private String paymentMethod;
}
