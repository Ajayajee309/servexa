package com.servexa.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long providerId;
    private Long bookingId;
    private Integer rating;
    private String comment;
}
