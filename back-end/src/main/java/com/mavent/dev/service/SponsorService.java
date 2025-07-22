package com.mavent.dev.service;

import com.mavent.dev.entity.Sponsor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SponsorService {

    Page<Sponsor> filterSponsor(String name, String industry, Pageable pageable);

    List<Sponsor> getAll(Integer eventId);

    Sponsor getBySponsorId(Integer sponsorId);

    Sponsor save(Sponsor sponsor);

    void delete(Integer id);
}
