package com.hungrezy.config;

import com.hungrezy.middleware.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.hungrezy.repositories.UserRepository;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Autowired private UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username)
                .map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole() == 1 ? "ADMIN" : "USER")
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public
                        .requestMatchers("/api/v1/auth/register", "/api/v1/auth/login", "/api/v1/auth/forgot-password").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/v1/product/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/product/product-filters").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/v1/category/get-category").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/v1/category/single-category/**").permitAll()
                        // Admin
                        .requestMatchers("/api/v1/auth/test", "/api/v1/auth/admin-auth", "/api/v1/auth/all-orders", "/api/v1/auth/order-status/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,   "/api/v1/category/create-category").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/api/v1/category/update-category/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/category/delete-category/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,   "/api/v1/product/create-product").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/api/v1/product/update-product/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/product/delete-product/**").hasRole("ADMIN")
                        // Authenticated
                        .anyRequest().authenticated()
                )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
    	CorsConfiguration configuration = new CorsConfiguration();
    	configuration.setAllowedOrigins(Arrays.asList(
    	    	"http://localhost:5173",
        	"https://hungrezy-iota.vercel.app"
    ));
   	 configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    	 configuration.setAllowedHeaders(Arrays.asList("*"));
   	 configuration.setAllowCredentials(true);
    	 UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    	 source.registerCorsConfiguration("/**", configuration);
    	return source;
    }
}
