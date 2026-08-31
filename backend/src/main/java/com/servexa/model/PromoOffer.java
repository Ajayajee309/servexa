package com.servexa.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "promo_offers")
@Data
public class PromoOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(name = "promo_code", nullable = false, unique = true)
    private String promoCode;

    @Column(name = "discount_percentage", nullable = false)
    private Double discountPercentage;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
