package com.servexa.controller;

import com.servexa.dto.JwtResponse;
import com.servexa.dto.LoginRequest;
import com.servexa.dto.MessageResponse;
import com.servexa.dto.SignupRequest;
import com.servexa.model.Provider;
import com.servexa.model.Role;
import com.servexa.model.User;
import com.servexa.repository.ProviderRepository;
import com.servexa.repository.UserRepository;
import com.servexa.security.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        User userDetails = (User) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getFullName(),
                userDetails.getEmail(),
                userDetails.getRole()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = User.builder()
                .fullName(signUpRequest.getFullName())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .phone(signUpRequest.getPhone())
                .address(signUpRequest.getAddress())
                .profileImageUrl(signUpRequest.getProfileImageUrl())
                .role(signUpRequest.getRole() != null ? signUpRequest.getRole() : Role.CUSTOMER)
                .isBlocked(false)
                .build();

        userRepository.save(user);

        if (user.getRole() == Role.PROVIDER) {
            Provider provider = Provider.builder()
                    .user(user)
                    .serviceCategory(signUpRequest.getServiceCategory())
                    .isVerified(false)
                    .isApprovedByAdmin(false)
                    .build();
            providerRepository.save(provider);
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
