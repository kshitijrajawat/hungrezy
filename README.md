# 🍔 Hungrezy — Premium Food Delivery Platform

[![Live Demo](https://img.shields.io/badge/Live-hungrezy.kshitijrajawat.in-orange?style=for-the-badge)](https://hungrezy.kshitijrajawat.in)
[![Backend](https://img.shields.io/badge/API-api.kshitijrajawat.in-blue?style=for-the-badge)](https://api.kshitijrajawat.in/api/v1/category/get-category)
[![Java](https://img.shields.io/badge/Java-21-red?style=for-the-badge&logo=java)](https://www.java.com)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-green?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org)
[![AWS](https://img.shields.io/badge/AWS-EC2_+_RDS_+_S3-orange?style=for-the-badge&logo=amazonaws)](https://aws.amazon.com)

A full-stack food delivery web application with complete e-commerce functionality including product browsing, cart management, real payment processing via Braintree, and a full admin panel — deployed on AWS with a custom domain.

---

## 🌐 Live URLs

| Service | URL |
|---|---|
| Frontend | https://hungrezy.kshitijrajawat.in |
| Backend API | https://api.kshitijrajawat.in/api/v1 |

---


## ✨ Features

### User Features
- Browse products by category with filters and search
- Paginated product listing (6 per page)
- Product detail page with quantity selector
- Add/remove items from cart with quantity management
- Recommended products on cart and product detail pages
- Real payment processing via **Braintree** (sandbox mode)
- Order history with payment status
- User registration, login, and JWT-based authentication
- Persistent cart (survives page refresh via localStorage)
- Out of stock indicators

### Admin Features
- Secure admin panel (role-based access control)
- Add, edit, and delete products with image upload to AWS S3
- Manage categories
- View and update all orders with status management
- Dashboard with order count overview

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Core language |
| Spring Boot | 3.3.5 | Backend framework |
| Spring Security | 6.x | Authentication & authorization |
| JWT (jjwt) | 0.12.x | Stateless token-based auth |
| Spring Data JPA | 3.x | ORM & database access |
| Hibernate | 6.5.x | JPA implementation |
| PostgreSQL Driver | 42.x | Database connectivity |
| HikariCP | 5.x | Connection pooling |
| AWS SDK v2 (S3) | 2.25.6 | Image storage |
| Braintree SDK | 3.x | Payment processing |
| Lombok | 1.18.x | Boilerplate reduction |
| Maven | 3.x | Build tool |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5.x | Build tool & dev server |
| Tailwind CSS | 3.x | Utility-first styling |
| React Router | v6 | Client-side routing |
| Axios | 1.x | HTTP client |
| Framer Motion | 11.x | Animations |
| React Toastify | 10.x | Toast notifications |
| React Icons | 5.x | Icon library |
| braintree-web-drop-in-react | 1.x | Payment UI |
| Context API | built-in | Global state management |

### Infrastructure
| Service | Purpose |
|---|---|
| AWS EC2 (t2.micro) | Backend hosting — Mumbai region |
| AWS RDS PostgreSQL | Managed database — Mumbai region |
| AWS S3 | Image storage |
| Nginx | Reverse proxy + SSL termination |
| Let's Encrypt (Certbot) | Free SSL certificate |
| Vercel | Frontend hosting + CDN |
| GoDaddy | Domain registrar (kshitijrajawat.in) |
| Systemd | Backend auto-restart on EC2 |

---

## 🏗️ Architecture

```
                    ┌─────────────────────────────────────────┐
                    │         hungrezy.kshitijrajawat.in       │
                    │         (Vercel — React Frontend)        │
                    └────────────────┬────────────────────────┘
                                     │ HTTPS
                                     ▼
                    ┌─────────────────────────────────────────┐
                    │        api.kshitijrajawat.in             │
                    │    (AWS EC2 Mumbai — Nginx Proxy)        │
                    └────────────────┬────────────────────────┘
                                     │ localhost:8080
                                     ▼
                    ┌─────────────────────────────────────────┐
                    │      Spring Boot Application             │
                    │         (port 8080)                      │
                    └──────┬──────────────────┬───────────────┘
                           │                  │
              ┌────────────▼───┐    ┌─────────▼──────────┐
              │  AWS RDS       │    │    AWS S3           │
              │  PostgreSQL    │    │  (hungrezy-images)  │
              │  Mumbai        │    │  Image Storage      │
              └────────────────┘    └────────────────────┘
```

---

## 📁 Project Structure

```
Hungrezy/
├── hungrezy-backend/                   # Spring Boot Backend
│   ├── src/main/java/com/hungrezy/
│   │   ├── HungrezyApplication.java    # Entry point
│   │   ├── config/
│   │   │   ├── SecurityConfig.java     # JWT + CORS + role-based security
│   │   │   ├── BraintreeConfig.java    # Payment gateway config
│   │   │   └── S3Config.java           # AWS S3 client config
│   │   ├── controllers/
│   │   │   ├── AuthController.java     # Register, login, orders, admin
│   │   │   ├── ProductController.java  # Products, filters, payment, S3 upload
│   │   │   └── CategoryController.java # Category CRUD
│   │   ├── helpers/
│   │   │   ├── AuthHelper.java         # Password hashing
│   │   │   └── JwtHelper.java          # Token generation & validation
│   │   ├── middleware/
│   │   │   └── JwtAuthFilter.java      # JWT request filter
│   │   ├── models/
│   │   │   ├── User.java               # User entity (role 0=user, 1=admin)
│   │   │   ├── Product.java            # Product entity with S3 photoUrl
│   │   │   ├── Category.java           # Category entity
│   │   │   └── Order.java              # Order entity with ManyToMany products
│   │   └── repositories/
│   │       ├── UserRepository.java
│   │       ├── ProductRepository.java  # Custom queries (filters, search, related)
│   │       ├── CategoryRepository.java
│   │       └── OrderRepository.java
│   ├── src/main/resources/
│   │   └── application.properties.example   # Config template (never commit real one)
│   └── pom.xml
│
├── hungrezy-client/                    # React Frontend
│   ├── public/
│   │   └── favicon.png
│   ├── src/
│   │   ├── main.jsx                    # App entry point
│   │   ├── App.jsx                     # All routes defined here
│   │   ├── index.css                   # Global styles + Tailwind
│   │   ├── utils/
│   │   │   └── api.js                  # Axios instance + JWT interceptor + DIRECT_API
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # User auth state (persisted in localStorage)
│   │   │   └── CartContext.jsx         # Cart state with qty management
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx          # Responsive navbar with hover dropdown
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── ProductCard.jsx         # Card with qty selector when in cart
│   │   │   ├── Spinner.jsx
│   │   │   └── Routes.jsx              # PrivateRoute + AdminRoute guards
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── Products.jsx            # Paginated + filtered product listing
│   │       ├── ProductDetail.jsx       # Detail with qty selector + recommendations
│   │       ├── Categories.jsx
│   │       ├── CategoryProducts.jsx
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── ForgotPassword.jsx
│   │       ├── Cart.jsx                # Cart with qty, total, recommendations, payment
│   │       ├── Orders.jsx
│   │       ├── Dashboard.jsx
│   │       └── admin/
│   │           ├── AdminProfile.jsx
│   │           ├── AdminProducts.jsx   # Product CRUD with S3 image upload
│   │           ├── AdminCategories.jsx
│   │           └── AdminOrders.jsx
│   ├── vercel.json                     # Vercel proxy rewrites + SPA routing
│   └── vite.config.js
│
├── .gitignore
├── application.properties.example
└── README.md
```

---

## 🔑 API Endpoints

### Auth (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login and receive JWT |
| GET | `/user-auth` | User | Verify user token |
| GET | `/admin-auth` | Admin | Verify admin token |
| GET | `/orders` | User | Get logged-in user's orders |
| GET | `/all-orders` | Admin | Get all orders |
| PUT | `/order-status/:oid` | Admin | Update order status |

### Products (`/api/v1/product`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/get-product` | Public | Get all products (latest 12) |
| GET | `/get-product/:slug` | Public | Get single product |
| GET | `/product-list/:page` | Public | Paginated products |
| GET | `/product-count` | Public | Total product count |
| POST | `/product-filters` | Public | Filter by category + price |
| GET | `/search/:keyword` | Public | Search products |
| GET | `/related-product/:pid/:cid` | Public | 3 random related products |
| GET | `/product-category/:slug` | Public | Products by category |
| POST | `/create-product` | Admin | Create product with image |
| PUT | `/update-product/:pid` | Admin | Update product with image |
| DELETE | `/delete-product/:pid` | Admin | Delete product |
| GET | `/braintree/token` | Public | Get Braintree client token |
| POST | `/braintree/payment` | User | Process payment + create order |

### Categories (`/api/v1/category`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/get-category` | Public | Get all categories |
| GET | `/single-category/:id` | Public | Get single category |
| POST | `/create-category` | Admin | Create category |
| PUT | `/update-category/:id` | Admin | Update category |
| DELETE | `/delete-category/:id` | Admin | Delete category |

---

## 🚀 Local Development Setup

### Prerequisites
- Java 21
- Maven 3.x
- Node.js 18+
- PostgreSQL (local or Supabase)
- AWS account (for S3)
- Braintree sandbox account

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/kshitijrajawat/hungrezy.git
cd hungrezy/hungrezy-backend

# Copy example properties
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Fill in your values in application.properties
# Then run
./mvnw spring-boot:run
```

### Frontend Setup

```bash
cd hungrezy/hungrezy-client

# Install dependencies
npm install

# Run dev server
npm run dev
```

Open `http://localhost:5173`

---

## ⚙️ Environment Configuration

Copy `application.properties.example` to `application.properties` and fill in:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/hungrezy
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD

# JWT
jwt.secret=YOUR_SUPER_SECRET_KEY_MIN_32_CHARS

# Braintree
braintree.merchant.id=YOUR_MERCHANT_ID
braintree.public.key=YOUR_PUBLIC_KEY
braintree.private.key=YOUR_PRIVATE_KEY
braintree.environment=SANDBOX

# AWS S3
aws.access.key=YOUR_ACCESS_KEY
aws.secret.key=YOUR_SECRET_KEY
aws.s3.bucket=YOUR_BUCKET_NAME
aws.s3.region=ap-south-1
```

---

## ☁️ Deployment Architecture

### Backend (AWS EC2 + RDS)
- EC2 t2.micro — Ubuntu 24.04 LTS — ap-south-1 (Mumbai)
- RDS PostgreSQL 16 — db.t3.micro — ap-south-1 (Mumbai)
- Nginx as reverse proxy with SSL via Let's Encrypt
- Systemd service for auto-restart on reboot
- 1GB swap space configured for memory management

### Frontend (Vercel)
- Auto-deploys on every GitHub push to `main`
- Global CDN for fast loading
- `vercel.json` proxies `/api/v1/*` to EC2 backend
- SPA routing handled via rewrites

### Images (AWS S3)
- Bucket: `hungrezy-images` — ap-south-1 (Mumbai)
- Public read access via bucket policy
- Images uploaded directly from Spring Boot via AWS SDK v2
- URL format: `https://hungrezy-images.s3.ap-south-1.amazonaws.com/{filename}`

---

## 🔒 Security

- JWT tokens with 7-day expiration
- BCrypt password hashing
- Role-based access control (ROLE_USER / ROLE_ADMIN)
- CORS configured for specific allowed origins only
- `application.properties` excluded from Git via `.gitignore`
- AWS IAM user with minimal S3-only permissions
- RDS only accessible from EC2 security group (not public internet)
- HTTPS enforced via Nginx + Let's Encrypt on all API calls

---

## 💳 Payment Integration

Uses **Braintree** (by PayPal) in sandbox mode:

1. Frontend requests client token from backend
2. Braintree Drop-In UI renders payment form
3. User submits card details → Braintree returns nonce
4. Frontend sends nonce + cart to backend
5. Backend processes payment via Braintree SDK
6. On success → Order saved to DB → Stock reduced

**Test card:** `4111 1111 1111 1111` · Any future expiry · Any CVV

---

## 🧑‍💻 Author

**Kshitij Rajawat**
- GitHub: [@kshitijrajawat](https://github.com/kshitijrajawat)
- Live Project: [hungrezy.kshitijrajawat.in](https://hungrezy.kshitijrajawat.in)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
