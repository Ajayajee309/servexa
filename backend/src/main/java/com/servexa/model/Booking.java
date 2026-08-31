package com.servexa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private Provider provider;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private ServiceEntity service;

    private LocalDateTime bookingDate;

    private String serviceAddress;

    private Double latitude;

    private Double longitude;

    @Column(columnDefinition = "TEXT")
    private String problemDescription;

    private Double estimatedPrice;
    
    private Double finalPrice;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private String paymentStatus;

    @ElementCollection
    @CollectionTable(name = "booking_customer_photos", joinColumns = @JoinColumn(name = "booking_id"))
    @Column(name = "photo_url")
    private List<String> customerPhotos;

    @ElementCollection
    @CollectionTable(name = "booking_provider_photos", joinColumns = @JoinColumn(name = "booking_id"))
    @Column(name = "photo_url")
    private List<String> providerPhotos;

    private String appliedPromoCode;

    private Double discountPercentage;

    private Long customRequestId;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
