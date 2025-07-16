package com.mavent.dev.service.implement;

import com.mavent.dev.entity.EventSponsorship;
import com.mavent.dev.repository.EventSponsorshipRepository;
import com.mavent.dev.service.EventSponsorshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventSponsorshipImplement implements EventSponsorshipService {

    @Autowired
    private EventSponsorshipRepository repository;

    @Override
    public List<EventSponsorship> getAll() {
        return repository.findAll();
    }

    @Override
    public EventSponsorship getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public EventSponsorship save(EventSponsorship sponsorship) {
        return repository.save(sponsorship);
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
