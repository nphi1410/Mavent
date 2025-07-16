package com.mavent.dev.service;

import com.mavent.dev.entity.EventSponsorship;

import java.util.List;

public interface EventSponsorshipService {
    List<EventSponsorship> getAll();

    EventSponsorship getById(Integer id);

    EventSponsorship save(EventSponsorship sponsorship);

    void delete(Integer id);
}