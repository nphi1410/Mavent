package com.mavent.dev.repository;

import com.mavent.dev.entity.SponsorshipPackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SponsorshipPackageRepository extends JpaRepository<SponsorshipPackage, Integer> {
    List<SponsorshipPackage> findByEventId(Integer eventId);
    List<SponsorshipPackage> findByEventIdAndIsActive(Integer eventId,Boolean isActive);
    SponsorshipPackage findByPackageId(Integer packageId);
}
