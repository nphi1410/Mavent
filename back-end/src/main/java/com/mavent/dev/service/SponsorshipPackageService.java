package com.mavent.dev.service;

import com.mavent.dev.entity.SponsorshipPackage;

import java.util.List;

public interface SponsorshipPackageService {
    List<SponsorshipPackage> getAll();

    List<SponsorshipPackage> getByEventId(Integer eventId);

    SponsorshipPackage save(SponsorshipPackage pkg);

    void delete(Integer id);
}
