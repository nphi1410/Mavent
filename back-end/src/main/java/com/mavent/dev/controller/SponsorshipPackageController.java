package com.mavent.dev.controller;

import com.mavent.dev.entity.SponsorshipPackage;
import com.mavent.dev.service.SponsorshipPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sponsorship/package")
public class SponsorshipPackageController {
    @Autowired
    private SponsorshipPackageService service;

    @GetMapping
    public List<SponsorshipPackage> getAll() {
        return service.getAll();
    }

    @GetMapping("/{eventId}")
    public List<SponsorshipPackage> getByEventId(
            @PathVariable Integer eventId,
            @RequestParam(value = "isActive", required = false) Boolean isActive) {
        return service.getByEventId(eventId,isActive);
    }

    @PostMapping
    public SponsorshipPackage create(@RequestBody SponsorshipPackage sponsor) {
        return service.save(sponsor);
    }

    @PutMapping("/{id}")
    public SponsorshipPackage update(@PathVariable Integer id, @RequestBody SponsorshipPackage sponsor) {
        sponsor.setPackageId(id);
        return service.save(sponsor);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
