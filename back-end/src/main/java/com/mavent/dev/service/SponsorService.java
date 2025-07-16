package com.mavent.dev.service;

import com.mavent.dev.entity.Sponsor;

import java.util.List;

public interface SponsorService {
    List<Sponsor> getAll();

    Sponsor getById(Integer id);

    Sponsor save(Sponsor sponsor);

    void delete(Integer id);
}
