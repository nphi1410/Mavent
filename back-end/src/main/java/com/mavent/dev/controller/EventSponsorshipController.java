package com.mavent.dev.controller;

import com.mavent.dev.dto.sponsorship.SponsorshipDTO;
import com.mavent.dev.entity.EventSponsorship;
import com.mavent.dev.entity.Sponsor;
import com.mavent.dev.service.EventSponsorshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event/sponsorship")
public class EventSponsorshipController {
    @Autowired
    private EventSponsorshipService eventSponsorshipService;

    @GetMapping("/manage/{eventId}")
    public List<SponsorshipDTO> getAll(@PathVariable Integer eventId) {
        return eventSponsorshipService.getAll(eventId);
    }

    @GetMapping("/public/{eventId}")
    public List<Sponsor> getByEventId(@PathVariable Integer eventId) {
        return eventSponsorshipService.getByEventId(eventId);
    }

    @PostMapping
    public EventSponsorship create(@RequestBody EventSponsorship sponsor) {
        return eventSponsorshipService.save(sponsor);
    }

    @PutMapping("/{id}")
    public EventSponsorship update(@PathVariable Integer id, @RequestBody EventSponsorship sponsor) {
        sponsor.setEventSponsorshipId(id);
        return eventSponsorshipService.save(sponsor);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        eventSponsorshipService.delete(id);
    }
}
