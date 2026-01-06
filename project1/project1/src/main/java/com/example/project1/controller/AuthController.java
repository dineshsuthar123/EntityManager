package com.example.project1.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.project1.dto.JwtResponse;
import com.example.project1.dto.LoginRequest;
import com.example.project1.dto.MessageResponse;
import com.example.project1.dto.SignupRequest;
import com.example.project1.model.Role;
import com.example.project1.model.User;
import com.example.project1.repository.RoleRepository;
import com.example.project1.repository.UserRepository;
import com.example.project1.security.JwtUtils;
import com.example.project1.security.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt for user: {}", loginRequest.getUsername());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            logger.info("User {} logged in successfully with roles: {}", userDetails.getUsername(), roles);

            return ResponseEntity.ok(new JwtResponse(jwt, 
                                                     userDetails.getId(), 
                                                     userDetails.getUsername(),
                                                     userDetails.getFirstName(),
                                                     userDetails.getLastName(), 
                                                     userDetails.getEmail(), 
                                                     roles));
        } catch (BadCredentialsException e) {
            logger.warn("Invalid credentials for user: {}", loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Error: Invalid username or password!"));
        } catch (Exception e) {
            logger.error("Authentication error for user: {} - {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error: Authentication failed - " + e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        logger.info("Registration attempt for user: {}", signUpRequest.getUsername());
        
        try {
            // Validate input fields
            if (signUpRequest.getUsername() == null || signUpRequest.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is required!"));
            }
            
            if (signUpRequest.getEmail() == null || signUpRequest.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is required!"));
            }
            
            if (signUpRequest.getPassword() == null || signUpRequest.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Password is required!"));
            }
            
            // Check if username already exists
            if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                logger.warn("Username already taken: {}", signUpRequest.getUsername());
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
            }

            // Check if email already exists
            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                logger.warn("Email already in use: {}", signUpRequest.getEmail());
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
            }

            // Create new user
            User user = new User(
                signUpRequest.getUsername().trim(),
                signUpRequest.getFirstName() != null ? signUpRequest.getFirstName().trim() : "",
                signUpRequest.getLastName() != null ? signUpRequest.getLastName().trim() : "",
                signUpRequest.getEmail().trim(),
                encoder.encode(signUpRequest.getPassword())
            );

            // Assign default ROLE_USER
            Set<Role> roles = new HashSet<>();
            Role userRole = roleRepository.findByName(Role.ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Default role not found. Please contact administrator."));
            roles.add(userRole);

            user.setRoles(roles);
            userRepository.save(user);

            logger.info("User {} registered successfully!", signUpRequest.getUsername());
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
            
        } catch (RuntimeException e) {
            logger.error("Registration error for user: {} - {}", signUpRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error: Registration failed - " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error during registration for user: {} - {}", signUpRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error: An unexpected error occurred during registration."));
        }
    }
}
