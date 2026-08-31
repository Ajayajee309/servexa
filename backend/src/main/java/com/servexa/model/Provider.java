package com.servexa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "providers")
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String serviceCategory;

    private Integer experienceYears;

    private String serviceArea;

    private Double startingPrice;

    private Double averageRating;

    private Integer completedJobs;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String idDocumentUrl;

    private boolean isVerified;
    
    private boolean isApprovedByAdmin;
    
    @Builder.Default
    private boolean isAvailable = true;

    private String workingHours;
    
    private String documentUrl;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
