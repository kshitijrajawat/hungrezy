package com.hungrezy.repositories;

import com.hungrezy.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndAnswer(String email, String answer);
}
