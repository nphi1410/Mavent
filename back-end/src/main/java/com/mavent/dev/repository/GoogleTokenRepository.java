package com.mavent.dev.repository;

import com.mavent.dev.entity.GoogleToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoogleTokenRepository extends JpaRepository<GoogleToken, Integer> {
}
