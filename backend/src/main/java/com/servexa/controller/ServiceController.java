package com.servexa.controller;

import com.servexa.model.ServiceEntity;
import com.servexa.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceRepository serviceRepository;

    @GetMapping
    public ResponseEntity<List<ServiceEntity>> getServices(@RequestParam(required = false) Long categoryId) {
        if (categoryId != null) {
            return ResponseEntity.ok(serviceRepository.findByCategoryId(categoryId));
        }
        return ResponseEntity.ok(serviceRepository.findAll());
    }
}
