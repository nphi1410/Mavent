package com.mavent.dev.service.implement;

import com.mavent.dev.entity.Sponsor;
import com.mavent.dev.repository.SponsorRepository;
import com.mavent.dev.service.SponsorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SponsorImplement implements SponsorService {
    @Autowired
    private SponsorRepository repository;

    @Override
    public Page<Sponsor> filterSponsor(String name, String industry, Pageable pageable) {
        return repository.findByFilter(name, industry, pageable);
    }

    @Override
    public List<Sponsor> getAll(Integer eventId) {
        return repository.findSponsorsNotInEvent(eventId);
    }

    @Override
    public Sponsor getBySponsorId(Integer sponsorId) {
        return repository.findBySponsorId(sponsorId);
    }

    @Override
    public Sponsor save(Sponsor sponsor) {
        if (sponsor.getSponsorId() == null){
            sponsor.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        }
        sponsor.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));
        return repository.save(sponsor);
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }
}

