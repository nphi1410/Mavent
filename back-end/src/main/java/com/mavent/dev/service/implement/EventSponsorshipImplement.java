package com.mavent.dev.service.implement;

import com.mavent.dev.dto.sponsorship.SponsorshipDTO;
import com.mavent.dev.entity.EventSponsorship;
import com.mavent.dev.entity.Income;
import com.mavent.dev.entity.Sponsor;
import com.mavent.dev.entity.SponsorshipPackage;
import com.mavent.dev.repository.EventSponsorshipRepository;
import com.mavent.dev.repository.IncomeRepository;
import com.mavent.dev.repository.SponsorRepository;
import com.mavent.dev.repository.SponsorshipPackageRepository;
import com.mavent.dev.service.EventSponsorshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EventSponsorshipImplement implements EventSponsorshipService {

    @Autowired
    private EventSponsorshipRepository eventSponsorshipRepository;
    @Autowired
    private IncomeRepository incomeRepository;
    @Autowired
    private SponsorRepository sponsorRepository;
    @Autowired
    private SponsorshipPackageRepository sponsorshipPackageRepository;

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
        EventSponsorship saved = eventSponsorshipRepository.save(sponsorship);

        if (!sponsorship.getStatus().equals(EventSponsorship.Status.PAID)) {
            return saved;
        }

        Income income = incomeRepository.findBySourceId(saved.getEventSponsorshipId());
        if (income == null) {
            income = new Income();
            income.setSourceId(saved.getEventSponsorshipId());
        }

        income.setEventId(saved.getEventId());
        income.setAmount(saved.getAmount());
        income.setNotes(saved.getNotes());
        income.setReceivedDate(LocalDate.now());
        income.setSourceType(Income.SourceType.SPONSOR);
        Sponsor sponsor = sponsorRepository.findBySponsorId(saved.getSponsorId());
        SponsorshipPackage sponsorshipPackage = sponsorshipPackageRepository.findByPackageId(saved.getPackageId());
        String title = "Sponsorship - " + sponsor.getName();
        if (sponsorshipPackage != null) {
            title += " - " + sponsorshipPackage.getName();
        }
        income.setTitle(title);
        incomeRepository.save(income);

        return saved;
    }


    @Override
    public void delete(Integer id) {
        eventSponsorshipRepository.deleteById(id);
    }
}
