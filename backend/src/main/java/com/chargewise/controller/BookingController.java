package com.chargewise.controller;

import com.chargewise.model.BookingRequest;
import com.chargewise.model.BookingResponse;
import com.chargewise.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/reserve")
    public ResponseEntity<BookingResponse> reserveSlot(@RequestBody BookingRequest request) {
        BookingResponse response = bookingService.createAtomicReservation(request);
        return ResponseEntity.ok(response);
    }
}
