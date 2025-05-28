package org.example.bitirmeprojesi.config.ratelimiting;


import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimitService rateLimitService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Kullanıcı kimliği ve rollerini al
        UUID userId = JwtUtil.getUserIdFromToken();
        Collection<String> roles = Collections.singleton(JwtUtil.getRoleFromToken());

        Bucket bucket = rateLimitService.resolveBucket(userId, roles);

        // Admin ise sınırsız
        if (bucket == null) {
            return true;
        }

        if (bucket.tryConsume(1)) {
            return true; // izin ver
        } else {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("Too many requests - try again later.");
            return false;
        }
    }

    private final Map<String, Bucket> ipCache = new ConcurrentHashMap<>();


}
