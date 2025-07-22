package com.mavent.dev.repository;

import com.mavent.dev.entity.Sponsor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SponsorRepository extends JpaRepository<Sponsor, Integer> {

    @Query(value = """
        SELECT * FROM sponsors
        WHERE (:name IS NULL OR name LIKE CONCAT('%', :name, '%'))
          AND (:industry IS NULL OR industry LIKE CONCAT('%', :industry, '%'))
        """,
        countQuery = """
                SELECT COUNT(*) FROM sponsors
                WHERE (:name IS NULL OR name LIKE CONCAT('%', :name, '%'))
                  AND (:industry IS NULL OR industry LIKE CONCAT('%', :industry, '%'))
                """,
        nativeQuery = true)
    Page<Sponsor> findByFilter(
            @Param("name") String name,
            @Param("industry") String industry,
            Pageable pageable);

    @Query(value = """
    SELECT * FROM sponsors
    WHERE sponsor_id NOT IN (
        SELECT sponsor_id FROM event_sponsorships
        WHERE event_id = :eventId
    )
    AND is_deleted = false
    """, nativeQuery = true)
    List<Sponsor> findSponsorsNotInEvent(@Param("eventId") Integer eventId);

    Sponsor findBySponsorId(Integer sponsorId);
}
