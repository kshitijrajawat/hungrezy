package com.hungrezy.controllers;

import com.braintreegateway.BraintreeGateway;
import com.braintreegateway.Result;
import com.braintreegateway.Transaction;
import com.braintreegateway.TransactionRequest;
import com.hungrezy.models.Category;
import com.hungrezy.models.Order;
import com.hungrezy.models.Product;
import com.hungrezy.models.User;
import com.hungrezy.repositories.CategoryRepository;
import com.hungrezy.repositories.OrderRepository;
import com.hungrezy.repositories.ProductRepository;
import com.hungrezy.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/v1/product")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String awsRegion;

    @Autowired
    private BraintreeGateway braintreeGateway;

    private String slugify(String name) {
        return name.toLowerCase().trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
    }

    // Strip photo bytes before returning (same as .select("-photo") in Mongoose)
    private String uploadToS3(MultipartFile file, String productId) throws Exception {
        String key = "products/" + productId + "-" + file.getOriginalFilename();
        s3Client.putObject(
                software.amazon.awssdk.services.s3.model.PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(file.getContentType())
                        .build(),
                software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes())
        );
        return "https://" + bucketName + ".s3." + awsRegion + ".amazonaws.com/" + key;
    }

    // POST /api/v1/product/create-product (admin)
    @PostMapping(value = "/create-product", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProduct(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam String category,
            @RequestParam Integer quantity,
            @RequestParam(required = false) Boolean shipping,
            @RequestParam(required = false) MultipartFile photo) {
        try {
            if (name == null || name.isBlank()) return ResponseEntity.status(500).body(Map.of("error", "Name is Required"));
            if (description == null || description.isBlank()) return ResponseEntity.status(500).body(Map.of("error", "Description is Required"));
            if (price == null) return ResponseEntity.status(500).body(Map.of("error", "Price is Required"));
            if (category == null || category.isBlank()) return ResponseEntity.status(500).body(Map.of("error", "Category is Required"));
            if (quantity == null) return ResponseEntity.status(500).body(Map.of("error", "Quantity is Required"));
            if (photo != null && photo.getSize() > 1_000_000) return ResponseEntity.status(500).body(Map.of("error", "Photo should be less than 1MB"));

            Category cat = categoryRepository.findById(category).orElseThrow();
            Product product = new Product();
            product.setName(name);
            product.setSlug(slugify(name));
            product.setDescription(description);
            product.setPrice(price);
            product.setCategory(cat);
            product.setQuantity(quantity);
            product.setShipping(shipping);

            Product saved = productRepository.save(product);

            if (photo != null && !photo.isEmpty()) {
                String url = uploadToS3(photo, saved.getId().toString());
                saved.setPhotoUrl(url);
                productRepository.save(saved);
            }

            return ResponseEntity.status(201).body(Map.of(
                    "success", true,
                    "message", "Product Created Successfully",
                    "products", saved
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Error creating product", "error", e.getMessage()));
        }
    }

    // PUT /api/v1/product/update-product/:pid (admin)
    @PutMapping(value = "/update-product/{pid}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduct(
            @PathVariable String pid,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam String category,
            @RequestParam Integer quantity,
            @RequestParam(required = false) Boolean shipping,
            @RequestParam(required = false) MultipartFile photo) {
        try {
            if (photo != null && photo.getSize() > 1_000_000) return ResponseEntity.status(500).body(Map.of("error", "Photo should be less than 1MB"));

            Category cat = categoryRepository.findById(category).orElseThrow();
            Product product = productRepository.findById(pid).orElseThrow();

            product.setName(name);
            product.setSlug(slugify(name));
            product.setDescription(description);
            product.setPrice(price);
            product.setCategory(cat);
            product.setQuantity(quantity);
            product.setShipping(shipping);

            Product saved = productRepository.save(product);

            if (photo != null && !photo.isEmpty()) {
                String url = uploadToS3(photo, saved.getId().toString());
                saved.setPhotoUrl(url);
                productRepository.save(saved);
            }

            return ResponseEntity.status(201).body(Map.of(
                    "success", true,
                    "message", "Product Updated Successfully",
                    "products", saved
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Error updating product", "error", e.getMessage()));
        }
    }

    // GET /api/v1/product/get-product
    @GetMapping("/get-product")
    public ResponseEntity<?> getProducts() {
        try {
            List<Product> products = productRepository.findAll(
                    PageRequest.of(0, 12, Sort.by(Sort.Direction.DESC, "createdAt"))
            ).getContent();
//            products.forEach(this::stripPhoto);
            return ResponseEntity.ok(Map.of("success", true, "countTotal", products.size(), "message", "All Products", "products", products));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Error getting products", "error", e.getMessage()));
        }
    }

    // GET /api/v1/product/get-product/:slug
    @GetMapping("/get-product/{slug}")
    public ResponseEntity<?> getSingleProduct(@PathVariable String slug) {
        try {
            Optional<Product> product = productRepository.findBySlug(slug);
//            product.ifPresent(this::stripPhoto);
            return ResponseEntity.ok(Map.of("success", true, "message", "Single Product Fetched", "product", product.orElse(null)));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Error getting product", "error", e.getMessage()));
        }
    }


    // DELETE /api/v1/product/delete-product/:pid (admin)
    @DeleteMapping("/delete-product/{pid}")
    public ResponseEntity<?> deleteProduct(@PathVariable String pid) {
        try {
            productRepository.deleteById(pid);
            return ResponseEntity.ok(Map.of("success", true, "message", "Product Deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Error deleting product", "error", e.getMessage()));
        }
    }

    // POST /api/v1/product/product-filters
    @PostMapping("/product-filters")
    public ResponseEntity<?> filterProducts(@RequestBody Map<String, Object> body) {
        try {
            List<String> checked = (List<String>) body.get("checked");

            List<Number> radio = (List<Number>) body.get("radio");
            Double minPrice = (radio != null && radio.size() == 2) ? radio.get(0).doubleValue() : null;
            Double maxPrice = (radio != null && radio.size() == 2) ? radio.get(1).doubleValue() : null;

            List<String> categoryIds = (checked != null && !checked.isEmpty()) ? checked : null;

            List<Product> products = productRepository.findByFilters(categoryIds, minPrice, maxPrice);
//            products.forEach(this::stripPhoto);

            return ResponseEntity.ok(Map.of("success", true, "products", products));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", "Error filtering products", "error", e.getMessage()));
        }
    }

    // GET /api/v1/product/product-count
    @GetMapping("/product-count")
    public ResponseEntity<?> productCount() {
        try {
            long total = productRepository.count();
            return ResponseEntity.ok(Map.of("success", true, "total", total));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", "Error in product count", "error", e.getMessage()));
        }
    }

    // GET /api/v1/product/product-list/:page
    @GetMapping("/product-list/{page}")
    public ResponseEntity<?> productList(@PathVariable int page, @RequestParam(defaultValue = "6") int perPage) {
        try {
            List<Product> products = productRepository.findAll(
                    PageRequest.of(page - 1, perPage, Sort.by(Sort.Direction.DESC, "createdAt"))
            ).getContent();
//            products.forEach(this::stripPhoto);
            return ResponseEntity.ok(Map.of("success", true, "products", products));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", "Error in pagination", "error", e.getMessage()));
        }
    }

    // GET /api/v1/product/search/:keyword
    @GetMapping("/search/{keyword}")
    public ResponseEntity<?> searchProduct(@PathVariable String keyword) {
        try {
            List<Product> results = productRepository.searchByKeyword(keyword);
//            results.forEach(this::stripPhoto);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", "Error in Search", "error", e.getMessage()));
        }
    }

    // GET /api/v1/product/related-product/:pid/:cid
    @GetMapping("/related-product/{pid}/{cid}")
    public ResponseEntity<?> relatedProducts(@PathVariable String pid, @PathVariable String cid) {
        try {
            List<Product> products = productRepository.findByCategory_IdAndIdNot(cid, pid)
                    .stream().limit(3).toList();
//            products.forEach(this::stripPhoto);
            return ResponseEntity.ok(Map.of("success", true, "products", products));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", "Error getting related products", "error", e.getMessage()));
        }
    }

    // GET /api/v1/product/product-category/:slug
    @GetMapping("/product-category/{slug}")
    public ResponseEntity<?> productByCategory(@PathVariable String slug) {
        try {
            Category category = categoryRepository.findBySlug(slug).orElseThrow();
            List<Product> products = productRepository.findByCategory(category);
//            products.forEach(this::stripPhoto);
            return ResponseEntity.ok(Map.of("success", true, "category", category, "products", products));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", "Error getting products by category", "error", e.getMessage()));
        }
    }

    // GET /api/v1/product/braintree/token
    @GetMapping("/braintree/token")
    public ResponseEntity<?> braintreeToken() {
        try {
            String token = braintreeGateway.clientToken().generate();
            return ResponseEntity.ok(Map.of("clientToken", token));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/v1/product/braintree/payment (authenticated)
    @PostMapping("/braintree/payment")
    public ResponseEntity<?> braintreePayment(@AuthenticationPrincipal User currentUser,
                                              @RequestBody Map<String, Object> body) {
        try {
            String nonce = (String) body.get("nonce");
            List<Map<String, Object>> cart = (List<Map<String, Object>>) body.get("cart");

            double total = cart.stream()
                    .mapToDouble(item -> ((Number) item.get("price")).doubleValue())
                    .sum();

            TransactionRequest request = new TransactionRequest()
                    .amount(BigDecimal.valueOf(total))
                    .paymentMethodNonce(nonce)
                    .options().submitForSettlement(true).done();

            Result<Transaction> result = braintreeGateway.transaction().sale(request);

            if (result.isSuccess()) {
                List<Product> products = new ArrayList<>();
                for (Map<String, Object> item : cart) {
                    String pid = (String) item.get("id");
                    productRepository.findById(pid).ifPresent(products::add);
                }
                Order order = new Order();
                order.setProducts(products);
                order.setPayment(result.getTarget().getId()); // store transaction ID
                order.setBuyer(currentUser);
                orderRepository.save(order);
                // Reduce stock for each product
                for (Product p : products) {
                    int orderedQty = cart.stream()
                            .filter(c -> c.get("id").toString().equals(p.getId().toString()))
                            .mapToInt(c -> ((Number) c.getOrDefault("qty", 1)).intValue())
                            .findFirst().orElse(1);
                    p.setQuantity(p.getQuantity() - orderedQty);
                    productRepository.save(p);
                }
                return ResponseEntity.ok(Map.of("ok", true));
            } else {
                return ResponseEntity.status(500).body(result.getMessage());
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
