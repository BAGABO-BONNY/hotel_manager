package com.bagabo.hotel.service;

import com.bagabo.hotel.entity.Billing;
import com.bagabo.hotel.entity.Booking;
import com.bagabo.hotel.repository.BillingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BillingService {

    @Autowired
    private BillingRepository billingRepository;

    public Optional<Billing> getBillingByBookingId(Long bookingId) {
        return billingRepository.findByBookingId(bookingId);
    }

    public List<Billing> getBillingsByUserId(Long userId) {
        return billingRepository.findByBooking_User_Id(userId);
    }

    public Billing getBillingById(Long id) {
        return billingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Billing not found with id: " + id));
    }

    public List<Billing> getAllBillings() {
        return billingRepository.findAll();
    }
}
