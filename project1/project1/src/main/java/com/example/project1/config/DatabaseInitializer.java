package com.example.project1.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.project1.model.Role;
import com.example.project1.model.User;
import com.example.project1.repository.RoleRepository;
import com.example.project1.repository.UserRepository;

/**
 * Database initializer that runs on application startup.
 * Creates default roles and admin user if they don't exist.
 */
@Component
@Order(1) // Ensure this runs first
public class DatabaseInitializer implements CommandLineRunner {
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("========================================");
        System.out.println("DATABASE INITIALIZATION STARTING...");
        System.out.println("========================================");
        
        // Initialize roles if they don't exist
        initializeRoles();
        
        // Create default admin user (separate from role initialization)
        createDefaultAdminUser();
        
        System.out.println("========================================");
        System.out.println("DATABASE INITIALIZATION COMPLETE!");
        System.out.println("========================================");
    }
    
    private void initializeRoles() {
        // Create ROLE_USER if it doesn't exist
        if (roleRepository.findByName(Role.ERole.ROLE_USER).isEmpty()) {
            Role roleUser = new Role(Role.ERole.ROLE_USER);
            roleRepository.save(roleUser);
            System.out.println("✓ Created ROLE_USER");
        }
        
        // Create ROLE_MODERATOR if it doesn't exist
        if (roleRepository.findByName(Role.ERole.ROLE_MODERATOR).isEmpty()) {
            Role roleModerator = new Role(Role.ERole.ROLE_MODERATOR);
            roleRepository.save(roleModerator);
            System.out.println("✓ Created ROLE_MODERATOR");
        }
        
        // Create ROLE_ADMIN if it doesn't exist
        if (roleRepository.findByName(Role.ERole.ROLE_ADMIN).isEmpty()) {
            Role roleAdmin = new Role(Role.ERole.ROLE_ADMIN);
            roleRepository.save(roleAdmin);
            System.out.println("✓ Created ROLE_ADMIN");
        }
    }
    
    private void createDefaultAdminUser() {
        // Only create admin user if no users exist
        if (userRepository.count() == 0) {
            System.out.println("Creating default admin user...");
            
            try {
                Role adminRole = roleRepository.findByName(Role.ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin role not found!"));
                
                User adminUser = new User(
                    "admin",
                    "Admin",
                    "User",
                    "admin@example.com",
                    passwordEncoder.encode("admin123")
                );
                
                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);
                adminUser.setRoles(roles);
                
                userRepository.save(adminUser);
                
                System.out.println("✓ Default admin user created successfully!");
                System.out.println("  Username: admin");
                System.out.println("  Password: admin123");
                System.out.println("  Email: admin@example.com");
            } catch (Exception e) {
                System.err.println("✗ Failed to create admin user: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("• Users already exist, skipping admin user creation");
        }
    }
}
