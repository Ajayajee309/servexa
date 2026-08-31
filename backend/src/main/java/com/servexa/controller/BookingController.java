package com.servexa.controller;

import com.servexa.dto.BookingRequest;
import com.servexa.dto.MessageResponse;
import com.servexa.model.Booking;
import com.servexa.model.BookingStatus;
import com.servexa.model.User;
import com.servexa.repository.BookingRepository;
import com.servexa.repository.ProviderRepository;
import com.servexa.repository.ServiceRepository;
import com.servexa.repository.UserRepository;
import com.servexa.repository.NotificationRepository;
import com.servexa.repository.PromoOfferRepository;
import com.servexa.model.PromoOffer;
import com.servexa.model.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.servexa.repository.CustomRequestRepository;
import com.servexa.model.CustomRequest;
import com.servexa.model.CustomRequestStatus;
import com.servexa.model.Role;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingRepository bookingRepository;
    private final ProviderRepository providerRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final PromoOfferRepository promoOfferRepository;
    private final CustomRequestRepository customRequestRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request, Authentication authentication) {
        String email = authentication.getName();
        Optional<User> customerOpt = userRepository.findByEmail(email);
        
        if (customerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Customer not found."));
        }

        String appliedPromoCode = null;
        Double discountPercentage = null;
        
        if (request.getPromoCode() != null && !request.getPromoCode().isEmpty()) {
            Optional<PromoOffer> offerOpt = promoOfferRepository.findByPromoCodeAndIsActiveTrue(request.getPromoCode().toUpperCase());
            if (offerOpt.isPresent()) {
                appliedPromoCode = offerOpt.get().getPromoCode();
                discountPercentage = offerOpt.get().getDiscountPercentage();
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Promo code is invalid or expired."));
            }
        }

        Booking booking = Booking.builder()
                .customer(customerOpt.get())
                .provider(providerRepository.findById(request.getProviderId()).orElseThrow(() -> new RuntimeException("Provider not found")))
                .service(request.getServiceId() != null ? serviceRepository.findById(request.getServiceId()).orElse(null) : null)
                .bookingDate(request.getBookingDate() != null ? request.getBookingDate() : LocalDateTime.now().plusDays(1))
                .serviceAddress(request.getServiceAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .problemDescription(request.getProblemDescription())
                .customerPhotos(request.getCustomerPhotos())
                .appliedPromoCode(appliedPromoCode)
                .discountPercentage(discountPercentage)
                .status(BookingStatus.PENDING)
                .paymentStatus("PENDING")
                .build();

        bookingRepository.save(booking);

        // Notify provider about the new booking request
        Notification notification = new Notification();
        notification.setUser(booking.getProvider().getUser());
        notification.setMessage("You have a new service request from " + booking.getCustomer().getFullName());
        notificationRepository.save(notification);

        return ResponseEntity.ok(new MessageResponse("Booking created successfully"));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole().name().equals("CUSTOMER")) {
            return ResponseEntity.ok(bookingRepository.findByCustomerId(user.getId()));
        } else if (user.getRole().name().equals("PROVIDER")) {
            return ResponseEntity.ok(bookingRepository.findByProviderId(providerRepository.findByUserId(user.getId()).get().getId()));
        }
        
        return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid Role"));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status, @RequestParam(required = false) Double finalPrice) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        
        try {
            BookingStatus newStatus = BookingStatus.valueOf(status.toUpperCase());
            booking.setStatus(newStatus);
            
            if (newStatus == BookingStatus.COMPLETED && finalPrice != null) {
                if (booking.getDiscountPercentage() != null && booking.getDiscountPercentage() > 0) {
                    double discount = (finalPrice * booking.getDiscountPercentage()) / 100.0;
                    booking.setFinalPrice(Math.max(0, finalPrice - discount));
                } else {
                    booking.setFinalPrice(finalPrice);
                }
            }
            
            bookingRepository.save(booking);

            if (newStatus == BookingStatus.CANCELLED) {
                if (booking.getCustomRequestId() != null) {
                    // Handle Custom Request rejection
                    CustomRequest customRequest = customRequestRepository.findById(booking.getCustomRequestId())
                            .orElseThrow(() -> new RuntimeException("Custom Request not found"));
                    
                    // Reset to PENDING
                    customRequest.setStatus(CustomRequestStatus.PENDING);
                    customRequestRepository.save(customRequest);
                    
                    // Notify Admins
                    List<User> admins = userRepository.findByRole(Role.ADMIN);
                    for (User admin : admins) {
                        Notification adminNotification = new Notification();
                        adminNotification.setUser(admin);
                        adminNotification.setMessage("Provider " + booking.getProvider().getUser().getFullName() + " declined Custom Request ID " + customRequest.getId() + ". Please reassign.");
                        notificationRepository.save(adminNotification);
                    }
                    
                    // SUPPRESS customer notification for Custom Request cancellation
                } else {
                    // Normal booking cancellation
                    Notification notification = new Notification();
                    notification.setUser(booking.getCustomer());
                    notification.setMessage("Your booking with " + booking.getProvider().getUser().getFullName() + " has been cancelled.");
                    notificationRepository.save(notification);
                }
            } else {
                Notification notification = new Notification();
                notification.setUser(booking.getCustomer());
                if (newStatus == BookingStatus.ACCEPTED) {
                    notification.setMessage("Your booking for " + booking.getProvider().getUser().getFullName() + " has been accepted!");
                } else if (newStatus == BookingStatus.COMPLETED) {
                    notification.setMessage("Your booking with " + booking.getProvider().getUser().getFullName() + " is completed. Please complete your payment.");
                } else {
                    notification.setMessage("Your booking status has been updated to: " + status);
                }
                notificationRepository.save(notification);
            }

            return ResponseEntity.ok(new MessageResponse("Booking status updated to " + status));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid status"));
        }
    }

    @PostMapping("/{id}/complete-with-photos")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> completeWithPhotos(@PathVariable Long id, @RequestBody List<String> providerPhotos, @RequestParam(required = false) Double finalPrice, Authentication authentication) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Verify provider owns this booking
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (!booking.getProvider().getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized to complete this booking"));
        }

        booking.setStatus(BookingStatus.COMPLETED);
        booking.setProviderPhotos(providerPhotos);
        
        if (finalPrice != null) {
                if (booking.getDiscountPercentage() != null && booking.getDiscountPercentage() > 0) {
                    double discount = (finalPrice * booking.getDiscountPercentage()) / 100.0;
                    booking.setFinalPrice(Math.max(0, finalPrice - discount));
                } else {
                    booking.setFinalPrice(finalPrice);
                }
        }
        
        bookingRepository.save(booking);

        // Notify customer
        Notification notification = new Notification();
        notification.setUser(booking.getCustomer());
        notification.setMessage("Your booking with " + booking.getProvider().getUser().getFullName() + " is completed. Please complete your payment.");
        notificationRepository.save(notification);

        return ResponseEntity.ok(new MessageResponse("Booking completed with photos successfully"));
    }

    @PutMapping("/{id}/payment")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestParam String paymentStatus) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setPaymentStatus(paymentStatus.toUpperCase());
        bookingRepository.save(booking);

        // Notify provider
        if (paymentStatus.equalsIgnoreCase("PAID")) {
            Notification notification = new Notification();
            notification.setUser(booking.getProvider().getUser());
            notification.setMessage("Payment of ₹" + booking.getFinalPrice() + " received from " + booking.getCustomer().getFullName());
            notificationRepository.save(notification);
        }

        return ResponseEntity.ok(new MessageResponse("Payment status updated to " + paymentStatus));
    }
}
