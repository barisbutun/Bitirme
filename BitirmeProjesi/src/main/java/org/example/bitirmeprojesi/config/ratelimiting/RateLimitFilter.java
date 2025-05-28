package org.example.bitirmeprojesi.config.ratelimiting;

import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.UUID;
import java.util.stream.Collectors;

public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitService rateLimitService;

    public RateLimitFilter(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated()) {
            UUID userId = UUID.fromString(auth.getName());
            Collection<String> roles = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            Bucket bucket = rateLimitService.resolveBucket(userId, roles);

            if (bucket != null && !bucket.tryConsume(1)) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("Too many requests - try again later.");
                return;
            }
        } else {
            String ip = request.getRemoteAddr();

            Bucket ipBucket;

            if (path.equals("/api/auth/v1/login") || path.equals("/api/auth/v1/register")) {
                ipBucket = rateLimitService.resolveLoginBucket(ip); // Daha toleranslı limit
            } else {
                ipBucket = rateLimitService.resolveIpBucket(ip); // Normal limit
            }

            if (!ipBucket.tryConsume(1)) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("Too many unauthenticated requests from this IP.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
