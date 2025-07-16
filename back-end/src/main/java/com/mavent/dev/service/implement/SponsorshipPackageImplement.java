package com.mavent.dev.service.implement;

import com.mavent.dev.entity.SponsorshipPackage;
import com.mavent.dev.repository.SponsorshipPackageRepository;
import com.mavent.dev.service.SponsorshipPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SponsorshipPackageImplement implements SponsorshipPackageService {

    @Autowired
    private SponsorshipPackageRepository repository;

    @Override
    public List<SponsorshipPackage> getAll() {
        return repository.findAll();
    }

    @Override
    public SponsorshipPackage getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public SponsorshipPackage save(SponsorshipPackage sponsor) {
        return repository.save(sponsor);
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
