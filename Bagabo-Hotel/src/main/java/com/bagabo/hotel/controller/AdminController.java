package com.bagabo.hotel.controller;

import com.bagabo.hotel.service.BookingService;
import com.bagabo.hotel.service.HotelService;
import com.bagabo.hotel.service.RoomService;
import com.bagabo.hotel.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private HotelService hotelService;
    
    @Autowired
    private RoomService roomService;
    
    @GetMapping("/dashboard/stats")
    public AdminDashboardStats getDashboardStats() {
        try {
            return new AdminDashboardStats(
                userService.getTotalUsers(),
                bookingService.getTotalBookings(),
                hotelService.getTotalHotels(),
                roomService.getTotalRooms()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch dashboard statistics", e);
        }
    }
}

record AdminDashboardStats(
    long totalUsers,
    long totalBookings,
    long totalHotels,
    long totalRooms
) {}
