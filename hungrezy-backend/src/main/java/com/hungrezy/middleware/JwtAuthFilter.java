package com.hungrezy.middleware;

import com.hungrezy.helpers.JwtHelper;
import com.hungrezy.models.User;
import com.hungrezy.repositories.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

// Mirrors: requireSignIn + isAdmin middleware from authMiddleware.js
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && !authHeader.isBlank()) {
            // Support both "Bearer <token>" and raw token
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

            if (jwtHelper.validateToken(token)) {
                String userId = jwtHelper.getUserIdFromToken(token);
                Optional<User> userOpt = userRepository.findById(userId);

                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    List<SimpleGrantedAuthority> authorities = user.getRole() == 1
                            ? List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                            : List.of(new SimpleGrantedAuthority("ROLE_USER"));

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(user, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
