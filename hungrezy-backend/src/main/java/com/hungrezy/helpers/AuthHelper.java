package com.hungrezy.helpers;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AuthHelper {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    // mirrors: hashPassword(password)
    public String hashPassword(String password) {
        return encoder.encode(password);
    }

    // mirrors: comparePassword(password, hashedPassword)
    public boolean comparePassword(String rawPassword, String hashedPassword) {
        return encoder.matches(rawPassword, hashedPassword);
    }
}
