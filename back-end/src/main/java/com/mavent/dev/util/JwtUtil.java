package com.mavent.dev.util;

import com.mavent.dev.config.JwtProperties;
import com.mavent.dev.entity.Account;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class JwtUtil {

    // 🔐 Must be at least 256 bits (32 bytes) for HS256
//    private static final String SECRET_KEY = "th1s!sma5eNt$ecre7KeytH@T!$Sup3rs3curedAnd$ecr3t";
    private final JwtProperties jwtProperties;

    public JwtUtil(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Account account) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", List.of("ROLE_" + account.getSystemRole().name()));

        return Jwts.builder()
                .claims(claims) // <- use builder-style claim setting
                .subject(account.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration()))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    // ✅ Extract username
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    //  Extract roles
    public List<String> extractRoles(String token) {
//        return extractAllClaims(token).get("roles", List.class);
        Claims claims = extractAllClaims(token);
        Object raw = claims.get("roles");
        if (raw instanceof List<?> rolesRaw) {
            return rolesRaw.stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .toList();
        }
        return Collections.emptyList();
    }

    // Validate token
    public boolean isTokenValid(String token, Account account) {
        final String username = extractUsername(token);
        return username.equals(account.getUsername()) && !isTokenExpired(token);
    }

    // Check if token is expired
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // ✅ Extract claims without deprecated APIs
    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
