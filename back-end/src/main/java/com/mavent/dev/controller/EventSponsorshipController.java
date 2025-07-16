package com.mavent.dev.controller;

import com.mavent.dev.entity.EventSponsorship;
import com.mavent.dev.service.EventSponsorshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-sponsorship")
public class EventSponsorshipController {
    @Autowired
    private EventSponsorshipService service;

    @GetMapping
    public List<EventSponsorship> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public EventSponsorship getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public EventSponsorship create(@RequestBody EventSponsorship sponsor) {
        return service.save(sponsor);
    }

    @PutMapping("/{id}")
    public EventSponsorship update(@PathVariable Integer id, @RequestBody EventSponsorship sponsor) {
        sponsor.setEventSponsorshipId(id);
        return service.save(sponsor);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
