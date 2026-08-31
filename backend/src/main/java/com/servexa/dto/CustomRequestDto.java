package com.servexa.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CustomRequestDto {
    private String requestedService;
    private String location;
    private LocalDate preferredDate;
    private LocalTime preferredTime;
}
