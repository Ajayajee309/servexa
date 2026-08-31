package com.servexa.repository;

import com.servexa.model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {
    Optional<Provider> findByUserId(Long userId);
    
    List<Provider> findByServiceCategoryContainingIgnoreCaseAndIsAvailableTrueAndIsApprovedByAdminTrue(String serviceCategory);
    
    List<Provider> findByServiceCategoryContainingIgnoreCaseAndServiceAreaContainingIgnoreCaseAndIsAvailableTrueAndIsApprovedByAdminTrue(String serviceCategory, String serviceArea);
    
    List<Provider> findByIsAvailableTrueAndIsApprovedByAdminTrue();
}
