package com.bagabo.hotel.repository;

import com.bagabo.hotel.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStatus(String status);
    
    // Custom query to find bookings by user ID and status
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND b.status != :status")
    Optional<List<Booking>> findByUser_IdAndStatusNot(@Param("userId") Long userId, @Param("status") String status);
    
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId")
    Optional<List<Booking>> findByUser_Id(@Param("userId") Long userId);
}
