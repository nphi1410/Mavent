package com.mavent.dev.service.implement;

import com.mavent.dev.entity.Sponsor;
import com.mavent.dev.repository.SponsorRepository;
import com.mavent.dev.service.SponsorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SponsorImplement implements SponsorService {
    @Autowired
    private SponsorRepository repository;

    @Override
    public List<Sponsor> getAll() {
        return repository.findAll();
    }

    @Override
    public Sponsor getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Sponsor save(Sponsor sponsor) {
        return repository.save(sponsor);
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }
}

