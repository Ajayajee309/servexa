package com.servexa.controller;

import com.servexa.dto.CustomRequestDto;
import com.servexa.dto.MessageResponse;
import com.servexa.model.CustomRequest;
import com.servexa.model.CustomRequestStatus;
import com.servexa.model.User;
import com.servexa.repository.CustomRequestRepository;
import com.servexa.repository.UserRepository;
import com.servexa.repository.ProviderRepository;
import com.servexa.repository.BookingRepository;
import com.servexa.repository.NotificationRepository;
import com.servexa.dto.AssignRequestDto;
import com.servexa.model.Booking;
import com.servexa.model.BookingStatus;
import com.servexa.model.Notification;
import com.servexa.model.Provider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CustomRequestController {

    private final CustomRequestRepository customRequestRepository;
    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final BookingRepository bookingRepository;
    private final NotificationRepository notificationRepository;

    @PostMapping("/custom-requests")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createCustomRequest(@RequestBody CustomRequestDto request, Authentication authentication) {
        String email = authentication.getName();
        User customer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CustomRequest customRequest = CustomRequest.builder()
                .customer(customer)
                .requestedService(request.getRequestedService())
                .location(request.getLocation())
                .preferredDate(request.getPreferredDate())
                .preferredTime(request.getPreferredTime())
                .status(CustomRequestStatus.PENDING)
                .build();

        customRequestRepository.save(customRequest);

        return ResponseEntity.ok(new MessageResponse("Custom request submitted successfully"));
    }

    @GetMapping("/admin/custom-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CustomRequest>> getAllCustomRequests() {
        return ResponseEntity.ok(customRequestRepository.findAll());
    }

    @PutMapping("/admin/custom-requests/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> resolveCustomRequest(@PathVariable Long id) {
        CustomRequest customRequest = customRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        customRequest.setStatus(CustomRequestStatus.RESOLVED);
        customRequestRepository.save(customRequest);
        
        return ResponseEntity.ok(new MessageResponse("Request marked as resolved"));
    }

    @PostMapping("/admin/custom-requests/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignCustomRequest(@PathVariable Long id, @RequestBody AssignRequestDto assignRequest) {
        CustomRequest customRequest = customRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        Provider provider = providerRepository.findById(assignRequest.getProviderId())
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        java.time.LocalDateTime bookingDateTime = java.time.LocalDateTime.now();
        if (customRequest.getPreferredDate() != null && customRequest.getPreferredTime() != null) {
            bookingDateTime = java.time.LocalDateTime.of(customRequest.getPreferredDate(), customRequest.getPreferredTime());
        }

        Booking booking = Booking.builder()
                .customer(customRequest.getCustomer())
                .provider(provider)
                .bookingDate(bookingDateTime)
                .serviceAddress(customRequest.getLocation())
                .problemDescription("Custom Request: " + customRequest.getRequestedService())
                .estimatedPrice(assignRequest.getEstimatedPrice())
                .status(BookingStatus.PENDING)
                .paymentStatus("PENDING")
                .customRequestId(customRequest.getId())
                .build();

        bookingRepository.save(booking);

        customRequest.setStatus(CustomRequestStatus.RESOLVED);
        customRequestRepository.save(customRequest);

        // Notify customer
        Notification customerNotif = new Notification();
        customerNotif.setUser(customRequest.getCustomer());
        customerNotif.setMessage("A provider has been assigned to your Custom Request. Estimated Price: ₹" + assignRequest.getEstimatedPrice());
        notificationRepository.save(customerNotif);

        // Notify provider
        Notification providerNotif = new Notification();
        providerNotif.setUser(provider.getUser());
        providerNotif.setMessage("You have been assigned a new Custom Request Booking!");
        notificationRepository.save(providerNotif);

        return ResponseEntity.ok(new MessageResponse("Provider assigned and Booking created successfully"));
    }
}
