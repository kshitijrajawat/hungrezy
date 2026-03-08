package com.hungrezy.repositories;

import com.hungrezy.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> findByName(String name);
    Optional<Category> findBySlug(String slug);
}
