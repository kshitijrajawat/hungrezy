# Hungrezy - Spring Boot Backend

Converted from Node.js/Express to Java/Spring Boot.

## Tech Stack
- **Java 17**
- **Spring Boot 3.2**
- **Spring Security + JWT**
- **MongoDB** (Spring Data MongoDB)
- **Braintree** (payments)
- **Lombok**

## Project Structure
```
src/main/java/com/hungrezy/
├── HungrezyApplication.java        # Main entry (replaces server.js)
├── config/
│   ├── SecurityConfig.java         # CORS + JWT security (replaces server.js middleware)
│   ├── BraintreeConfig.java        # Braintree gateway setup
│   └── MongoConfig.java            # MongoDB auditing
├── controllers/
│   ├── AuthController.java         # replaces authController.js
│   ├── CategoryController.java     # replaces categoryController.js
│   └── ProductController.java      # replaces productController.js
├── helpers/
│   ├── AuthHelper.java             # replaces authHelper.js (bcrypt)
│   └── JwtHelper.java              # replaces jsonwebtoken
├── middleware/
│   └── JwtAuthFilter.java          # replaces authMiddleware.js
├── models/
│   ├── User.java                   # replaces userModel.js
│   ├── Category.java               # replaces categoryModel.js
│   ├── Product.java                # replaces productModel.js
│   └── Order.java                  # replaces orderModel.js
└── repositories/
    ├── UserRepository.java
    ├── CategoryRepository.java
    ├── ProductRepository.java
    └── OrderRepository.java
```

## API Routes (identical to original)

### Auth — `/api/v1/auth`
| Method | Route | Access |
|--------|-------|--------|
| POST | `/register` | Public |
| POST | `/login` | Public |
| POST | `/forgot-password` | Public |
| GET | `/user-auth` | User |
| GET | `/admin-auth` | Admin |
| PUT | `/profile` | User |
| GET | `/orders` | User |
| GET | `/all-orders` | Admin |
| PUT | `/order-status/:orderId` | Admin |

### Category — `/api/v1/category`
| Method | Route | Access |
|--------|-------|--------|
| POST | `/create-category` | Admin |
| PUT | `/update-category/:id` | Admin |
| GET | `/get-category` | Public |
| GET | `/single-category/:slug` | Public |
| DELETE | `/delete-category/:id` | Admin |

### Product — `/api/v1/product`
| Method | Route | Access |
|--------|-------|--------|
| POST | `/create-product` | Admin |
| PUT | `/update-product/:pid` | Admin |
| GET | `/get-product` | Public |
| GET | `/get-product/:slug` | Public |
| GET | `/product-photo/:pid` | Public |
| DELETE | `/delete-product/:pid` | Admin |
| POST | `/product-filters` | Public |
| GET | `/product-count` | Public |
| GET | `/product-list/:page` | Public |
| GET | `/search/:keyword` | Public |
| GET | `/related-product/:pid/:cid` | Public |
| GET | `/product-category/:slug` | Public |
| GET | `/braintree/token` | Public |
| POST | `/braintree/payment` | User |

## Setup

### 1. Prerequisites
- Java 17+
- Maven 3.8+
- MongoDB running locally or MongoDB Atlas URI

### 2. Configure Environment
Copy `.env.example` and set your values in `src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/hungrezy
jwt.secret=your_jwt_secret_min_32_chars
braintree.merchant.id=your_merchant_id
braintree.public.key=your_public_key
braintree.private.key=your_private_key
```

### 3. Run the Backend
```bash
./mvnw spring-boot:run
```
Server starts on **http://localhost:8080**

### 4. React Frontend
Your existing React frontend works **without any changes** — all API endpoints are identical (`/api/v1/...`).

Just update your React `.env`:
```
REACT_APP_API=http://localhost:8080
```

## Key Conversion Notes

| JS Concept | Java Equivalent |
|---|---|
| `JWT.sign()` / `JWT.verify()` | `JwtHelper.generateToken()` / `validateToken()` |
| `bcrypt.hash()` / `bcrypt.compare()` | `AuthHelper.hashPassword()` / `comparePassword()` |
| `requireSignIn` middleware | `JwtAuthFilter` (Spring Security filter) |
| `isAdmin` middleware | `@PreAuthorize("hasRole('ADMIN')")` via `SecurityConfig` |
| `express-formidable` | `@RequestParam MultipartFile photo` |
| `mongoose.Schema` | `@Document` + `MongoRepository` |
| `slugify(name)` | `slugify()` method in each controller |
| `dotenv` | `application.properties` + `@Value` |
