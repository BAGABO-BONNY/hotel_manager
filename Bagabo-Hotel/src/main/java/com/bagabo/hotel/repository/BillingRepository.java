package com.bagabo.hotel.repository;

import com.bagabo.hotel.entity.Billing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillingRepository extends JpaRepository<Billing, Long> {
    Optional<Billing> findByBookingId(Long bookingId);
    List<Billing> findByBooking_User_Id(Long userId);
}
