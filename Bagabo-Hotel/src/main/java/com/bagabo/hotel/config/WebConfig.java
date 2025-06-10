package com.bagabo.hotel.config;

import org.springframework.context.annotation.Configuration;
// No longer importing WebMvcConfigurer or CorsRegistry as the bean is removed

@Configuration
public class WebConfig {

    // corsConfigurer bean has been removed to rely on SecurityConfig's CORS setup.

}
