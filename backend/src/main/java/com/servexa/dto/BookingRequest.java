package com.servexa.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingRequest {
    private Long providerId;
    private Long serviceId;
    private LocalDateTime bookingDate;
    private String serviceAddress;
    private Double latitude;
    private Double longitude;
    private String problemDescription;
    private java.util.List<String> customerPhotos;
    private String promoCode;
}
