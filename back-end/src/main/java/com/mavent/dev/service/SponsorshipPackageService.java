package com.mavent.dev.service;

import com.mavent.dev.entity.SponsorshipPackage;

import java.util.List;

public interface SponsorshipPackageService {
    List<SponsorshipPackage> getAll();

    SponsorshipPackage getById(Integer id);

    SponsorshipPackage save(SponsorshipPackage pkg);

    void delete(Integer id);
}
