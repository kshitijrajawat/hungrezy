package com.hungrezy.controllers;

import com.hungrezy.models.Category;
import com.hungrezy.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/category")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // Slugify helper (mirrors: slugify(name))
    private String slugify(String name) {
        return name.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
    }

    // POST /api/v1/category/create-category (admin only)
    @PostMapping("/create-category")
    public ResponseEntity<?> createCategory(@RequestBody Map<String, String> body) {
        try {
            String name = body.get("name");
            if (name == null || name.isBlank()) {
                return ResponseEntity.status(401).body(Map.of("message", "Name is required"));
            }

            Optional<Category> existing = categoryRepository.findByName(name);
            if (existing.isPresent()) {
                return ResponseEntity.ok(Map.of(
                        "success", false,
                        "message", "Category Already Exists"
                ));
            }

            Category category = new Category();
            category.setName(name);
            category.setSlug(slugify(name));
            Category saved = categoryRepository.save(category);

            return ResponseEntity.status(201).body(Map.of(
                    "success", true,
                    "message", "new category created",
                    "category", saved
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Error in Category",
                    "error", e.getMessage()
            ));
        }
    }

    // PUT /api/v1/category/update-category/:id (admin only)
    @PutMapping("/update-category/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable String id,
                                             @RequestBody Map<String, String> body) {
        try {
            String name = body.get("name");
            Category category = categoryRepository.findById(id).orElseThrow();
            category.setName(name);
            category.setSlug(slugify(name));
            Category updated = categoryRepository.save(category);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Category Updated Successfully",
                    "category", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Error while updating category",
                    "error", e.getMessage()
            ));
        }
    }

    // GET /api/v1/category/get-category
    @GetMapping("/get-category")
    public ResponseEntity<?> getAllCategories() {
        try {
            List<Category> categories = categoryRepository.findAll();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "All Categories List",
                    "category", categories
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Error while getting all categories",
                    "error", e.getMessage()
            ));
        }
    }

    // GET /api/v1/category/single-category/:slug
    @GetMapping("/single-category/{slug}")
    public ResponseEntity<?> getSingleCategory(@PathVariable String slug) {
        try {
            Optional<Category> category = categoryRepository.findBySlug(slug);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Get Single Category Successfully",
                    "category", category.orElse(null)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Error while getting single Category",
                    "error", e.getMessage()
            ));
        }
    }

    // DELETE /api/v1/category/delete-category/:id (admin only)
    @DeleteMapping("/delete-category/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable String id) {
        try {
            categoryRepository.deleteById(id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Category Deleted Successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "error while deleting category",
                    "error", e.getMessage()
            ));
        }
    }
}
