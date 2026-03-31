package com.hungrezy.controllers;

import com.hungrezy.helpers.AuthHelper;
import com.hungrezy.helpers.JwtHelper;
import com.hungrezy.models.Order;
import com.hungrezy.models.User;
import com.hungrezy.repositories.OrderRepository;
import com.hungrezy.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AuthHelper authHelper;

    @Autowired
    private JwtHelper jwtHelper;

    // POST /api/v1/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        try {
            String name = (String) body.get("name");
            String email = (String) body.get("email");
            String password = (String) body.get("password");
            String phone = (String) body.get("phone");
            Object address = body.get("address");
            String answer = (String) body.get("answer");

            if (name == null || name.isBlank()) return ResponseEntity.status(400).body(Map.of("message", "Name is Required"));
            if (email == null || email.isBlank()) return ResponseEntity.status(400).body(Map.of("message", "Email is Required"));
            if (password == null || password.isBlank()) return ResponseEntity.status(400).body(Map.of("message", "Password is Required"));
            if (phone == null || phone.isBlank()) return ResponseEntity.status(400).body(Map.of("message", "Phone no is Required"));
            if (address == null || address.toString().isBlank()) return ResponseEntity.status(400).body(Map.of("message", "Address is Required"));
            if (answer == null || answer.isBlank()) return ResponseEntity.status(400).body(Map.of("message", "Answer is Required"));

            Optional<User> existingUser = userRepository.findByEmail(email);
            if (existingUser.isPresent()) {
                return ResponseEntity.status(400).body(Map.of(
                        "success", false,
                        "message", "Already Register please login"
                ));
            }

            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPhone(phone);
            user.setAddress(address.toString());
            user.setPassword(authHelper.hashPassword(password));
            user.setAnswer(answer);

            User saved = userRepository.save(user);

            return ResponseEntity.status(201).body(Map.of(
                    "success", true,
                    "message", "User Register Successfully",
                    "user", saved
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Error in Registration",
                    "error", e.getMessage()
            ));
        }
    }

    // POST /api/v1/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String password = body.get("password");

            if (email == null || password == null) {
                return ResponseEntity.status(404).body(Map.of(
                        "success", false,
                        "message", "Invalid email or password"
                ));
            }

            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of(
                        "success", false,
                        "message", "Email is not registered"
                ));
            }

            User user = userOpt.get();
            if (!authHelper.comparePassword(password, user.getPassword())) {
                return ResponseEntity.ok(Map.of(
                        "success", false,
                        "message", "Invalid Password"
                ));
            }

            String token = jwtHelper.generateToken(user.getId());

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("_id", user.getId());
            userMap.put("name", user.getName());
            userMap.put("email", user.getEmail());
            userMap.put("phone", user.getPhone());
            userMap.put("address", user.getAddress());
            userMap.put("role", user.getRole());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "login successfully",
                    "user", userMap,
                    "token", token
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Error in login",
                    "error", e.getMessage()
            ));
        }
    }

    // POST /api/v1/auth/forgot-password
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String answer = body.get("answer");
            String newPassword = body.get("newPassword");

            if (email == null) return ResponseEntity.status(400).body(Map.of("message", "Email is required"));
            if (answer == null) return ResponseEntity.status(400).body(Map.of("message", "answer is required"));
            if (newPassword == null) return ResponseEntity.status(400).body(Map.of("message", "New Password is required"));

            Optional<User> userOpt = userRepository.findByEmailAndAnswer(email, answer);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of(
                        "success", false,
                        "message", "Wrong Email Or Answer"
                ));
            }

            User user = userOpt.get();
            user.setPassword(authHelper.hashPassword(newPassword));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Password Reset Successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Something went wrong",
                    "error", e.getMessage()
            ));
        }
    }

    // GET /api/v1/auth/test (admin only)
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("Protected Routes");
    }

    // GET /api/v1/auth/user-auth
    @GetMapping("/user-auth")
    public ResponseEntity<?> userAuth() {
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // GET /api/v1/auth/admin-auth
    @GetMapping("/admin-auth")
    public ResponseEntity<?> adminAuth() {
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // PUT /api/v1/auth/profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal User currentUser,
                                            @RequestBody Map<String, Object> body) {
        try {
            String name = (String) body.get("name");
            String password = (String) body.get("password");
            String phone = (String) body.get("phone");
            Object address = body.get("address");

            if (password != null && password.length() < 6) {
                return ResponseEntity.ok(Map.of("error", "Password is required and 6 characters long"));
            }

            User user = userRepository.findById(currentUser.getId()).orElseThrow();
            if (name != null) user.setName(name);
            if (phone != null) user.setPhone(phone);
            if (address != null) user.setAddress(address.toString());
            if (password != null) user.setPassword(authHelper.hashPassword(password));

            User updated = userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Profile Updated Successfully",
                    "updatedUser", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "message", "Error while updating profile",
                    "error", e.getMessage()
            ));
        }
    }

    // GET /api/v1/auth/orders
    @Transactional
    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(@AuthenticationPrincipal User currentUser) {
        try {
            List<Order> orders = orderRepository.findByBuyer(currentUser);
            return ResponseEntity.ok(Map.of("success", true, "orders", orders));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Error while getting Orders",
                    "error", e.getMessage()
            ));
        }
    }


    // GET /api/v1/auth/all-orders (admin only)
    @GetMapping("/all-orders")
    public ResponseEntity<?> getAllOrders() {
        try {
            List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
            return ResponseEntity.ok(Map.of("success", true, "orders", orders));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Error while getting Orders",
                    "error", e.getMessage()
            ));
        }
    }

    // PUT /api/v1/auth/order-status/:orderId (admin only)
    @PutMapping("/order-status/{orderId}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String orderId,
                                                @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            Order order = orderRepository.findById(orderId).orElseThrow();
            order.setStatus(status);
            Order updated = orderRepository.save(order);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Error while updating Order",
                    "error", e.getMessage()
            ));
        }
    }
}
