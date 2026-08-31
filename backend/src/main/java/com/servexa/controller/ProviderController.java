package com.servexa.controller;

import com.servexa.model.Provider;
import com.servexa.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderRepository providerRepository;

    @GetMapping("/search")
    public ResponseEntity<List<Provider>> searchProviders(
            @RequestParam(required = false) String service,
            @RequestParam(required = false) String location) {
        
        if (service != null && !service.isEmpty() && location != null && !location.isEmpty()) {
            // Extract the city name before the comma (e.g., "Coimbatore, Tamil Nadu" -> "Coimbatore")
            String city = location.split(",")[0].trim();
            return ResponseEntity.ok(providerRepository.findByServiceCategoryContainingIgnoreCaseAndServiceAreaContainingIgnoreCaseAndIsAvailableTrueAndIsApprovedByAdminTrue(service, city));
        } else if (service != null && !service.isEmpty()) {
            return ResponseEntity.ok(providerRepository.findByServiceCategoryContainingIgnoreCaseAndIsAvailableTrueAndIsApprovedByAdminTrue(service));
        }
        
        return ResponseEntity.ok(providerRepository.findByIsAvailableTrueAndIsApprovedByAdminTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProviderById(@org.springframework.web.bind.annotation.PathVariable Long id) {
        return providerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
