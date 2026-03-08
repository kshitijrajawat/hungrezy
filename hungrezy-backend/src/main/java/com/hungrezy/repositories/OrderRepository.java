package com.hungrezy.repositories;

import com.hungrezy.models.Order;
import com.hungrezy.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByBuyer(User buyer);
    List<Order> findAllByOrderByCreatedAtDesc();
}
