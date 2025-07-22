package com.mavent.dev.service.implement;

import com.mavent.dev.dto.sponsorship.SponsorshipDTO;
import com.mavent.dev.entity.EventSponsorship;
import com.mavent.dev.entity.Sponsor;
import com.mavent.dev.repository.EventSponsorshipRepository;
import com.mavent.dev.service.EventSponsorshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventSponsorshipImplement implements EventSponsorshipService {

    @Autowired
    private EventSponsorshipRepository eventSponsorshipRepository;

    @Override
    public List<SponsorshipDTO> getAll(Integer eventId) {
        return eventSponsorshipRepository.findSponsorshipByEventId(eventId);
    }

    @Override
    public List<Sponsor> getByEventId(Integer eventId) {
        return eventSponsorshipRepository.findByEventId(eventId);
    }

    @Override
    public EventSponsorship save(EventSponsorship sponsorship) {
        return eventSponsorshipRepository.save(sponsorship);
    }

    @Override
    public void delete(Integer id) {
        eventSponsorshipRepository.deleteById(id);
    }
}
