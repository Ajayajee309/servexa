package com.servexa.repository;

import com.servexa.model.PromoOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromoOfferRepository extends JpaRepository<PromoOffer, Long> {
    List<PromoOffer> findByIsActiveTrue();
    Optional<PromoOffer> findByPromoCodeAndIsActiveTrue(String promoCode);
}
