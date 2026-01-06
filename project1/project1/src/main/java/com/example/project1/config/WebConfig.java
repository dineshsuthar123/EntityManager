package com.example.project1.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC configuration.
 * Note: CORS is configured in SecurityConfig to work properly with Spring Security.
 * Do NOT add CORS configuration here as it will conflict.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    // CORS is handled by SecurityConfig.corsConfigurationSource()
    // Other Web MVC configurations can be added here if needed
}
