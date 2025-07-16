package com.mavent.dev.repository;

import com.mavent.dev.entity.Sponsor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SponsorRepository extends JpaRepository<Sponsor, Integer> {
}
