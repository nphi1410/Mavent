package com.mavent.dev.repository;

import com.mavent.dev.dto.sponsorship.SponsorshipDTO;
import com.mavent.dev.entity.EventSponsorship;
import com.mavent.dev.entity.Sponsor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventSponsorshipRepository extends JpaRepository<EventSponsorship, Integer> {

    @Query(value = "SELECT s.* FROM event_sponsorships es " +
            "JOIN sponsors s ON es.sponsor_id = s.sponsor_id " +
            "WHERE (:eventId IS NULL OR es.event_id = :eventId)",
            nativeQuery = true)
    List<Sponsor> findByEventId(@Param("eventId") Integer eventId);

    @Query(value = """
    SELECT es.*, 
           e.name AS eventName, 
           s.name AS sponsorName, 
           sp.name AS packageName, 
           a.full_name AS accountName
    FROM event_sponsorships es
    JOIN events e ON es.event_id = e.event_id
    JOIN sponsors s ON es.sponsor_id = s.sponsor_id
    LEFT JOIN sponsorship_packages sp ON es.package_id = sp.package_id
    JOIN accounts a ON es.main_contact_account_id = a.account_id
    WHERE es.event_id = :eventId
    """, nativeQuery = true)
    List<SponsorshipDTO> findSponsorshipByEventId(@Param("eventId") Integer eventId);


}
