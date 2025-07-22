package com.mavent.dev.repository;

import com.mavent.dev.entity.Sponsor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SponsorRepository extends JpaRepository<Sponsor, Integer> {
    @Query(value = """
    SELECT * FROM sponsors
    WHERE sponsor_id NOT IN (
        SELECT sponsor_id FROM event_sponsorships
        WHERE event_id = :eventId
    )
    """, nativeQuery = true)
    List<Sponsor> findSponsorsNotInEvent(@Param("eventId") Integer eventId);

    Sponsor findBySponsorId(Integer sponsorId);
}
