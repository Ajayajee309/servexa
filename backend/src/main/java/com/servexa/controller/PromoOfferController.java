package com.servexa.controller;

import com.servexa.dto.MessageResponse;
import com.servexa.model.PromoOffer;
import com.servexa.repository.PromoOfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class PromoOfferController {

    private final PromoOfferRepository promoOfferRepository;

    // Public endpoint to get active offers (for banners)
    @GetMapping("/active")
    public ResponseEntity<List<PromoOffer>> getActiveOffers() {
        return ResponseEntity.ok(promoOfferRepository.findByIsActiveTrue());
    }

    // Public endpoint to validate a promo code
    @GetMapping("/validate")
    public ResponseEntity<?> validatePromoCode(@RequestParam String code) {
        Optional<PromoOffer> offerOpt = promoOfferRepository.findByPromoCodeAndIsActiveTrue(code.toUpperCase());
        if (offerOpt.isPresent()) {
            return ResponseEntity.ok(offerOpt.get());
        }
        return ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired promo code"));
    }

    // Admin endpoints
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PromoOffer>> getAllOffers() {
        return ResponseEntity.ok(promoOfferRepository.findAll());
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createOffer(@RequestBody PromoOffer offer) {
        offer.setPromoCode(offer.getPromoCode().toUpperCase());
        promoOfferRepository.save(offer);
        return ResponseEntity.ok(new MessageResponse("Promo offer created successfully"));
    }

    @PutMapping("/admin/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleOfferStatus(@PathVariable Long id, @RequestParam boolean isActive) {
        PromoOffer offer = promoOfferRepository.findById(id).orElseThrow(() -> new RuntimeException("Offer not found"));
        offer.setActive(isActive);
        promoOfferRepository.save(offer);
        return ResponseEntity.ok(new MessageResponse("Offer status updated successfully"));
    }
}
