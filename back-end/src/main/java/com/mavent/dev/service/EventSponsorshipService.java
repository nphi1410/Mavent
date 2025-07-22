package com.mavent.dev.service;

import com.mavent.dev.dto.sponsorship.SponsorshipDTO;
import com.mavent.dev.entity.EventSponsorship;
import com.mavent.dev.entity.Sponsor;

import java.util.List;

public interface EventSponsorshipService {
    List<SponsorshipDTO> getAll(Integer eventId);

    List<Sponsor> getByEventId(Integer eventId);

    EventSponsorship save(EventSponsorship sponsorship);

    void delete(Integer id);
}