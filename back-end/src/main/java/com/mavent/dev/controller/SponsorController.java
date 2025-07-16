package com.mavent.dev.controller;

import com.mavent.dev.entity.Sponsor;
import com.mavent.dev.service.SponsorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sponsors")
public class SponsorController {
    @Autowired
    private SponsorService service;

    @GetMapping
    public List<Sponsor> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Sponsor getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public Sponsor create(@RequestBody Sponsor sponsor) {
        return service.save(sponsor);
    }

    @PutMapping("/{id}")
    public Sponsor update(@PathVariable Integer id, @RequestBody Sponsor sponsor) {
        sponsor.setSponsorId(id);
        return service.save(sponsor);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}

