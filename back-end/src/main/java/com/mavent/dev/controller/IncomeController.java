package com.mavent.dev.controller;

import com.mavent.dev.entity.Income;
import com.mavent.dev.service.EventSponsorshipService;
import com.mavent.dev.service.IncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
public class IncomeController {
    @Autowired
    private IncomeService service;

    @GetMapping
    public List<Income> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Income getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public Income create(@RequestBody Income sponsor) {
        return service.save(sponsor);
    }

    @PutMapping("/{id}")
    public Income update(@PathVariable Integer id, @RequestBody Income sponsor) {
        sponsor.setIncomeId(id);
        return service.save(sponsor);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
