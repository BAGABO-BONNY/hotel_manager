package com.bagabo.hotel.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails; // Keep UserDetails for the interface contract
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
// SimpleGrantedAuthority and Collections are no longer needed here as User entity handles authorities
import org.springframework.stereotype.Service;
import com.bagabo.hotel.entity.User; // Your User entity that now implements UserDetails
import com.bagabo.hotel.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        // The User entity itself is now a UserDetails instance
    }
}
