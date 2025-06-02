package com.mavent.dev.repository;

import com.mavent.dev.DTO.FilterEventDTO;
import com.mavent.dev.entity.Event;
import com.mavent.dev.entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    Event findByEventId(Integer eventId);

    @Query(
            value = """
    SELECT 
        e.event_id AS eventId,
        e.name AS name,
        e.description AS description,
        e.start_datetime AS startDatetime,
        e.end_datetime AS endDatetime,
        e.location AS location,
        e.dday_info AS ddayInfo,
        e.max_member_number AS maxMemberNumber,
        e.max_participant_number AS maxParticipantNumber,
        e.status AS status,
        e.created_by_account_id AS createdBy,
        e.is_deleted AS isDeleted,
        e.created_at AS createdAt,
        e.updated_at AS updatedAt,
        AVG(f.rating) AS avgRating
    FROM events e
    JOIN event_tags et ON e.event_id = et.event_id
    LEFT JOIN event_feedback f ON e.event_id = f.event_id
    WHERE (:name IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%')))
      AND (:status IS NULL OR e.status = :status)
      AND et.tag_id IN (:tagIds)
    GROUP BY e.event_id
    """,
            countQuery = """
    SELECT COUNT(DISTINCT e.event_id)
    FROM events e
    JOIN event_tags et ON e.event_id = et.event_id
    WHERE (:name IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%')))
      AND (:status IS NULL OR e.status = :status)
      AND et.tag_id IN (:tagIds)
    """,
            nativeQuery = true
    )
    Page<FilterEventDTO> findAllFiltered(
            @Param("name") String name,
            @Param("status") String status,
            @Param("tagIds") List<Integer> tagIds,
            Pageable pageable
    );

    @Query(
            value = """
    SELECT 
        e.event_id AS eventId,
        e.name AS name,
        e.description AS description,
        e.start_datetime AS startDatetime,
        e.end_datetime AS endDatetime,
        e.location AS location,
        e.dday_info AS ddayInfo,
        e.max_member_number AS maxMemberNumber,
        e.max_participant_number AS maxParticipantNumber,
        e.status AS status,
        e.created_by_account_id AS createdBy,
        e.is_deleted AS isDeleted,
        e.created_at AS createdAt,
        e.updated_at AS updatedAt,
        AVG(f.rating) AS avgRating
    FROM events e
    LEFT JOIN event_tags et ON e.event_id = et.event_id
    LEFT JOIN event_feedback f ON e.event_id = f.event_id
    WHERE (:name IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%')))
      AND (:status IS NULL OR e.status = :status)
    GROUP BY e.event_id
    """,
            countQuery = """
    SELECT COUNT(DISTINCT e.event_id)
    FROM events e
    LEFT JOIN event_tags et ON e.event_id = et.event_id
    WHERE (:name IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%')))
      AND (:status IS NULL OR e.status = :status)
    """,
            nativeQuery = true
    )
    Page<FilterEventDTO> findAllFilteredNoTags(
            @Param("name") String name,
            @Param("status") String status,
            Pageable pageable
    );




}