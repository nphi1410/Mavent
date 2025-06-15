package com.mavent.dev.util;

import com.mavent.dev.entity.Account;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.*;

@Component
public class JwtUtil {

    // 🔐 Your secret key must be at least 256 bits (32 bytes) for HS256
    private static final String SECRET_KEY = "super-secret-key-that-is-at-least-32-bytes-long";

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    // ✅ Generate JWT from Account
    public String generateToken(Account account) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", List.of("ROLE_" + account.getSystemRole().name())); // Optional for frontend/client

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(account.getUsername()) // used as identity
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 /2)) // 30mins
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Extract username from token
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ✅ Extract roles from token
    public List<String> extractRoles(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("roles", List.class); // returns List<String>
    }

    // ✅ Validate token matches account
    public boolean isTokenValid(String token, Account account) {
        final String username = extractUsername(token);
        return username.equals(account.getUsername()) && !isTokenExpired(token);
    }

    // ✅ Check expiration
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // ✅ Safely extract claims
    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
