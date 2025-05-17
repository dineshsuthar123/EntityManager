package com.example.project1.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.project1.model.Role;
import com.example.project1.model.User;
import com.example.project1.repository.RoleRepository;
import com.example.project1.repository.UserRepository;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        if (roleRepository.count() == 0) {
            System.out.println("Initializing roles in the database...");
            
            // Use the correct ERole enum from the Role class
            Role roleUser = new Role();
            roleUser.setName(Role.ERole.ROLE_USER);
            
            Role roleModerator = new Role();
            roleModerator.setName(Role.ERole.ROLE_MODERATOR);
            
            Role roleAdmin = new Role();
            roleAdmin.setName(Role.ERole.ROLE_ADMIN);
            
            roleRepository.save(roleUser);
            roleRepository.save(roleModerator);
            roleAdmin = roleRepository.save(roleAdmin);
            
            System.out.println("Roles initialized successfully!");
            
            // Create default admin user
            if (userRepository.count() == 0) {
                System.out.println("Creating default admin user...");
                
                User adminUser = new User(
                    "admin",
                    "Admin",
                    "User",
                    "admin@example.com",
                    passwordEncoder.encode("admin123")
                );
                
                Set<Role> roles = new HashSet<>();
                roles.add(roleAdmin);
                adminUser.setRoles(roles);
                
                userRepository.save(adminUser);
                System.out.println("Default admin user created successfully!");
            }
        }
    }
}
