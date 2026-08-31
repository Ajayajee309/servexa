package com.servexa.controller;

import com.servexa.dto.MessageResponse;
import com.servexa.model.Booking;
import com.servexa.model.Provider;
import com.servexa.model.User;
import com.servexa.repository.BookingRepository;
import com.servexa.repository.ProviderRepository;
import com.servexa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final BookingRepository bookingRepository;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/providers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Provider>> getAllProviders() {
        return ResponseEntity.ok(providerRepository.findAll());
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    @PutMapping("/providers/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> verifyProvider(@PathVariable Long id, @RequestParam boolean verified) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        
        provider.setVerified(verified);
        providerRepository.save(provider);
        
        String status = verified ? "verified" : "unverified";
        return ResponseEntity.ok(new MessageResponse("Provider has been " + status));
    }
}
