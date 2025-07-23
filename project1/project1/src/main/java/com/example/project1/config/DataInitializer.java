package com.example.project1.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.project1.model.Role;
import com.example.project1.repository.RoleRepository;

/**
 * Data initializer to set up default roles in the database.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize default roles if they don't exist
        if (roleRepository.findByName(Role.ERole.ROLE_USER).isEmpty()) {
            roleRepository.save(new Role(Role.ERole.ROLE_USER));
        }
        
        if (roleRepository.findByName(Role.ERole.ROLE_MODERATOR).isEmpty()) {
            roleRepository.save(new Role(Role.ERole.ROLE_MODERATOR));
        }
        
        if (roleRepository.findByName(Role.ERole.ROLE_ADMIN).isEmpty()) {
            roleRepository.save(new Role(Role.ERole.ROLE_ADMIN));
        }
        
        System.out.println("Default roles initialized successfully!");
    }
}
