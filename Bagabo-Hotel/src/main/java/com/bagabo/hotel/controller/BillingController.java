package com.bagabo.hotel.controller;

import com.bagabo.hotel.entity.Billing;
import com.bagabo.hotel.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billings")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @GetMapping("/{bookingId}")
    public ResponseEntity<Billing> getBillingByBookingId(@PathVariable Long bookingId) {
        return billingService.getBillingByBookingId(bookingId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Billing>> getMyBillings() {
        // TODO: Get current user ID from JWT
        Long userId = 1L; // Replace with actual user ID
        return ResponseEntity.ok(billingService.getBillingsByUserId(userId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Billing>> getAllBillings() {
        return ResponseEntity.ok(billingService.getAllBillings());
    }
}
