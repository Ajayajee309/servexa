package com.servexa.controller;

import com.servexa.dto.MessageResponse;
import com.servexa.dto.ReviewRequest;
import com.servexa.model.Booking;
import com.servexa.model.Provider;
import com.servexa.model.Review;
import com.servexa.model.User;
import com.servexa.repository.BookingRepository;
import com.servexa.repository.ProviderRepository;
import com.servexa.repository.ReviewRepository;
import com.servexa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final ProviderRepository providerRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> submitReview(@RequestBody ReviewRequest request, Authentication authentication) {
        String email = authentication.getName();
        User customer = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Provider provider = providerRepository.findById(request.getProviderId()).orElseThrow(() -> new RuntimeException("Provider not found"));
        Booking booking = request.getBookingId() != null ? bookingRepository.findById(request.getBookingId()).orElse(null) : null;

        Review review = Review.builder()
                .customer(customer)
                .provider(provider)
                .booking(booking)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        reviewRepository.save(review);
        
        // Update average rating of provider
        List<Review> providerReviews = reviewRepository.findByProviderIdOrderByCreatedAtDesc(provider.getId());
        double avg = providerReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        provider.setAverageRating(avg);
        providerRepository.save(provider);

        return ResponseEntity.ok(new MessageResponse("Review submitted successfully"));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Review>> getProviderReviews(@PathVariable Long providerId) {
        return ResponseEntity.ok(reviewRepository.findByProviderIdOrderByCreatedAtDesc(providerId));
    }
}
