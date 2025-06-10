package com.bagabo.hotel.controller;

import com.bagabo.hotel.entity.User;
import com.bagabo.hotel.security.JwtUtils;
import com.bagabo.hotel.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.bagabo.hotel.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt for email: {}", loginRequest.email());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            User userDetails = (User) authentication.getPrincipal();
            logger.info("User authenticated successfully: {}", userDetails.getEmail());
            logger.info("User role: {}", userDetails.getRole().name());

            String jwt = jwtUtils.generateJwtToken(userDetails.getEmail(), userDetails.getRole().name());
            return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getEmail(), userDetails.getRole().name()));
        } catch (Exception e) {
            logger.error("Login failed for email: {}", loginRequest.email(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (userService.findByEmail(registerRequest.email()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setName(registerRequest.name());
        user.setEmail(registerRequest.email());
        user.setPassword(registerRequest.password());
        user.setRole(User.Role.CUSTOMER);

        userService.register(user);
        return ResponseEntity.ok("User registered successfully");
    }
}

// Request DTO
record LoginRequest(String email, String password) {}

// Response DTO
record JwtResponse(String token, String email, String role) {}
