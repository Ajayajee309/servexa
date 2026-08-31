package com.servexa.dto;

import lombok.Data;

@Data
public class ProviderProfileUpdateDto {
    private String fullName;
    private String phone;
    private String address;
    private String profileImageUrl;
    
    private String serviceCategory;
    private Integer experienceYears;
    private String serviceArea;
    private Double startingPrice;
    private String description;
    private String workingHours;
}
