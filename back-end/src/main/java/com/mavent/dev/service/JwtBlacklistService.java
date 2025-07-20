package com.mavent.dev.service;

import java.util.Set;

public interface JwtBlacklistService {

    // Interfaces should not contain instance fields, removed blacklistedTokens

    public void blacklistToken(String token);

    public boolean isTokenBlacklisted(String token);
}
