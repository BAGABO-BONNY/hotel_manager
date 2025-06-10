package com.bagabo.hotel.config;

import com.bagabo.hotel.entity.Hotel;
import com.bagabo.hotel.entity.Room;
import com.bagabo.hotel.entity.User;
import com.bagabo.hotel.repository.HotelRepository;
import com.bagabo.hotel.repository.RoomRepository;
import com.bagabo.hotel.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DataInitializer implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, HotelRepository hotelRepository,
                         RoomRepository roomRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Create admin user if not exists
        if (userRepository.findByEmail("admin@bagabo.com").isEmpty()) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@bagabo.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            logger.info("Admin password encoded successfully");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            logger.info("Admin user created successfully!");
        }

        // Create sample hotel if not exists
        if (hotelRepository.count() == 0) {
            Hotel hotel = new Hotel();
            hotel.setName("Bagabo Hotel");
            hotel.setLocation("Downtown");
            hotelRepository.save(hotel);

            // Create sample rooms
            for (int i = 1; i <= 6; i++) {
                Room room = new Room();
                room.setHotel(hotel);
                room.setRoomType("Standard");
                room.setPrice(100.0);
                room.setIsAvailable(true);
                roomRepository.save(room);
            }
            System.out.println("Sample hotel and rooms created successfully!");
        }
    }
}
