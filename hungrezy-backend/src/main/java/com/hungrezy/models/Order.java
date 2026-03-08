package com.hungrezy.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    // Many-to-many: one order has multiple products
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "order_products",
        joinColumns = @JoinColumn(name = "order_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> products;

    // Store Braintree payment result as JSON string
    @Column(columnDefinition = "TEXT")
    private String payment;

    // Many orders belong to one buyer
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @Column(nullable = false)
    private String status = "Not Process";

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum OrderStatus {
        NOT_PROCESS("Not Process"),
        PROCESSING("Processing"),
        SHIPPED("Shipped"),
        DELIVERED("deliverd"),
        CANCEL("cancel");

        private final String value;
        OrderStatus(String value) { this.value = value; }
        public String getValue() { return value; }
    }
}
