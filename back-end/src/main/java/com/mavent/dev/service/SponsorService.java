package com.mavent.dev.service;

import com.mavent.dev.entity.Sponsor;

import java.util.List;

public interface SponsorService {
    List<Sponsor> getAll(Integer eventId);

    Sponsor getBySponsorId(Integer sponsorId);

    Sponsor save(Sponsor sponsor);

    void delete(Integer id);
}
