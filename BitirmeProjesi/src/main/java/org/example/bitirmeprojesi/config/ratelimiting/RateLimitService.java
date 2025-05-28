package org.example.bitirmeprojesi.config.ratelimiting;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    public Bucket resolveBucket(UUID userId, Collection<String> roles) {
        if (roles.contains("ROLE_ADMIN")) {
            return null; // admin sınırsız
        }

        return cache.computeIfAbsent(userId.toString(), key -> {
            Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofSeconds(1)));
            return Bucket4j.builder()
                    .addLimit(limit)
                    .build();
        });
    }

    private final Map<String, Bucket> ipCache = new ConcurrentHashMap<>();

    public Bucket resolveIpBucket(String ip) {
        return ipCache.computeIfAbsent(ip, key -> {
            Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofSeconds(1)));
            return Bucket4j.builder().addLimit(limit).build();
        });
    }
    private final Map<String, Bucket> loginCache = new ConcurrentHashMap<>();
    public Bucket resolveLoginBucket(String ip) {
        return loginCache.computeIfAbsent(ip, key -> {
            Bandwidth limit = Bandwidth.classic(10, Refill.intervally(10, Duration.ofSeconds(10)));
            return Bucket4j.builder()
                    .addLimit(limit)
                    .build();
        });
    }




}
