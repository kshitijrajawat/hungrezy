package com.hungrezy.config;

import org.springframework.context.annotation.Configuration;

// Previously MongoConfig — replaced by JPA auto-configuration.
// Tables are created/updated automatically via:
//   spring.jpa.hibernate.ddl-auto=update  (in application.properties)
// No manual SQL or migration needed on first run.
@Configuration
public class JpaConfig {
    // Spring Boot auto-configures JPA/Hibernate with PostgreSQL
    // based on application.properties settings.
}
