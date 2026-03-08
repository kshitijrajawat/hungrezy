package com.hungrezy.repositories;

import com.hungrezy.models.Category;
import com.hungrezy.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, String>,
        JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlug(String slug);

    List<Product> findByCategory(Category category);

    List<Product> findByCategory_IdAndIdNot(String categoryId, String productId);

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchByKeyword(@Param("keyword") String keyword);


    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category WHERE " +
            "(:categoryIds IS NULL OR p.category.id IN :categoryIds) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    List<Product> findByFilters(
            @Param("categoryIds") List<String> categoryIds,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice);
}
