package com.servexa.controller;

import com.servexa.dto.MessageResponse;
import com.servexa.model.Category;
import com.servexa.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryRepository categoryRepository;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        if (categoryRepository.findAll().stream().anyMatch(c -> c.getName().equalsIgnoreCase(category.getName()))) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Category already exists!"));
        }
        categoryRepository.save(category);
        return ResponseEntity.ok(new MessageResponse("Category created successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Category not found"));
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Category deleted successfully"));
    }
}
