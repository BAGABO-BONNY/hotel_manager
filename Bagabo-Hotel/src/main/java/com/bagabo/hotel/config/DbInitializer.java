package com.bagabo.hotel.config;

import com.bagabo.hotel.entity.Hotel;
import com.bagabo.hotel.entity.Room;
import com.bagabo.hotel.repository.HotelRepository;
import com.bagabo.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DbInitializer implements CommandLineRunner {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public void run(String... args) throws Exception {
        // Test database connection and add sample data
        System.out.println("Testing database connection and initializing sample data...");

        // Create a sample hotel
        Hotel hotel = new Hotel();
        hotel.setName("Bagabo Hotel");
        hotel.setLocation("Davao City");
        
        // Create rooms for the hotel
        Room room1 = new Room();
        room1.setHotel(hotel);
        room1.setRoomType("Standard Room");
        room1.setPrice(3000.0);
        room1.setIsAvailable(true);

        Room room2 = new Room();
        room2.setHotel(hotel);
        room2.setRoomType("Deluxe Room");
        room2.setPrice(5000.0);
        room2.setIsAvailable(true);

        // Save hotel first
        hotel = hotelRepository.save(hotel);
        
        // Set hotel ID in rooms and save
        room1.setHotel(hotel);
        room2.setHotel(hotel);
        
        roomRepository.save(room1);
        roomRepository.save(room2);

        System.out.println("Database initialization completed successfully!");
        System.out.println("Sample data has been added:");
        System.out.println("Hotel: " + hotel.getName());
        System.out.println("Rooms: " + roomRepository.count() + " rooms added");
    }
}
