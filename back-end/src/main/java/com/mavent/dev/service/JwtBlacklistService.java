package com.mavent.dev.service;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public interface JwtBlacklistService {

    final Set<String> blacklistedTokens = Set.of();

    public void blacklistToken(String token);

    public boolean isTokenBlacklisted(String token);
}
