package com.example.project1.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    @Value("${app.cors.ngrok-origin:}")
    private String ngrokOrigin;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(allowedOrigins())
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }

            private String[] allowedOrigins() {
                if (ngrokOrigin != null && !ngrokOrigin.isBlank()) {
                    return new String[] {
                        "http://localhost:5173",
                        "http://localhost:3000",
                        "https://entity-manager.vercel.app",
                        ngrokOrigin
                    };
                }
                return new String[] {
                    "http://localhost:5173",
                    "http://localhost:3000",
                    "https://entity-manager.vercel.app"
                };
            }
        };
    }
}
