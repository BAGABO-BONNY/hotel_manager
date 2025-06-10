package com.bagabo.hotel.service;

import com.bagabo.hotel.entity.Booking;
import com.bagabo.hotel.entity.Booking.BookingStatus;
import com.bagabo.hotel.entity.Room;
import com.bagabo.hotel.entity.User;
import com.bagabo.hotel.repository.BookingRepository;
import com.bagabo.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    public long getTotalBookings() {
        return bookingRepository.count();
    }

    public Booking createBooking(Booking booking) {
        // Check room availability
        Room room = roomRepository.findById(booking.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // Check if room is available for the given dates
        if (!room.isAvailable()) {
            throw new RuntimeException("Room is not available");
        }

        // Check date validity
        if (booking.getCheckIn().isAfter(booking.getCheckOut()) ||
            booking.getCheckIn().isBefore(LocalDate.now()) ||
            booking.getCheckOut().isBefore(LocalDate.now())) {
            throw new RuntimeException("Invalid date range");
        }

        // Mark room as unavailable
        room.setIsAvailable(false);
        roomRepository.save(room);

        // Set booking status to CONFIRMED
        booking.setStatus(BookingStatus.CONFIRMED);
        
        // Set the User object
        User user = booking.getUser();
        if (user == null) {
            throw new RuntimeException("User must be set before creating a booking");
        }
        
        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("No bookings found for user: " + userId));
    }

    public List<Booking> getActiveBookingsByUser(Long userId) {
        return bookingRepository.findByUser_IdAndStatusNot(userId, BookingStatus.CANCELLED.name())
                .orElseThrow(() -> new RuntimeException("No active bookings found for user: " + userId));
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    public void cancelBooking(Long id) {
        Booking booking = getBookingById(id);
        
        // Check if booking can be cancelled
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }
        if (booking.getStatus() == BookingStatus.CHECKED_IN || booking.getStatus() == BookingStatus.CHECKED_OUT) {
            throw new RuntimeException("Cannot cancel booking that has already started");
        }
        
        // Mark room as available
        Room room = roomRepository.findById(booking.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        room.setIsAvailable(true);
        roomRepository.save(room);
        
        // Update booking status
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }



    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
