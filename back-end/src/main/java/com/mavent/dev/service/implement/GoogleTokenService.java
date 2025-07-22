package com.mavent.dev.service.implement;

import com.google.api.client.googleapis.auth.oauth2.GoogleRefreshTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.mavent.dev.entity.GoogleToken;
import com.mavent.dev.repository.GoogleTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;

@Service
public class GoogleTokenService {
    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.client.secret}")
    private String clientSecret;

    @Autowired
    private GoogleTokenRepository repository;

    public String getValidAccessToken(Integer accountId) throws IOException {
        GoogleToken token = repository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Google token not found"));

        if (token.getExpiryTime() != null && token.getExpiryTime().isAfter(Instant.now())) {
            return token.getAccessToken();
        }

        if (token.getRefreshToken() == null) {
            throw new RuntimeException("Refresh token missing");
        }

        // Refresh token
        GoogleTokenResponse response = new GoogleRefreshTokenRequest(
                new NetHttpTransport(),
                JacksonFactory.getDefaultInstance(),
                token.getRefreshToken(),
                clientId,
                clientSecret
        ).execute();

        token.setAccessToken(response.getAccessToken());
        token.setExpiryTime(Instant.now().plusSeconds(response.getExpiresInSeconds()));
        repository.save(token);

        return token.getAccessToken();
    }
}

