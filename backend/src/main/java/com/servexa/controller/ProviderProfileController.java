package com.servexa.controller;

import com.servexa.dto.MessageResponse;
import com.servexa.dto.ProviderProfileUpdateDto;
import com.servexa.model.Provider;
import com.servexa.model.User;
import com.servexa.repository.ProviderRepository;
import com.servexa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/provider/profile")
@RequiredArgsConstructor
public class ProviderProfileController {

    private final ProviderRepository providerRepository;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        Provider provider = providerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));
                
        return ResponseEntity.ok(provider);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody ProviderProfileUpdateDto request, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        Provider provider = providerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));

        // Update User Details
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getProfileImageUrl() != null) user.setProfileImageUrl(request.getProfileImageUrl());
        userRepository.save(user);

        // Update Provider Details
        if (request.getServiceCategory() != null) provider.setServiceCategory(request.getServiceCategory());
        if (request.getExperienceYears() != null) provider.setExperienceYears(request.getExperienceYears());
        if (request.getServiceArea() != null) provider.setServiceArea(request.getServiceArea());
        if (request.getStartingPrice() != null) provider.setStartingPrice(request.getStartingPrice());
        if (request.getDescription() != null) provider.setDescription(request.getDescription());
        if (request.getWorkingHours() != null) provider.setWorkingHours(request.getWorkingHours());
        
        providerRepository.save(provider);

        return ResponseEntity.ok(new MessageResponse("Profile updated successfully"));
    }

    @PutMapping("/availability")
    public ResponseEntity<?> toggleAvailability(@RequestParam boolean isAvailable, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        Provider provider = providerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));

        provider.setAvailable(isAvailable);
        providerRepository.save(provider);

        return ResponseEntity.ok(new MessageResponse("Availability updated successfully"));
    }
}
