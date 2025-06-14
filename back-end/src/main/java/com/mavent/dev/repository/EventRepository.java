package com.mavent.dev.repository;

import com.mavent.dev.dto.FilterEventDTO;
import com.mavent.dev.entity.Event;
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
    long countByIsDeletedFalse(); //Dem tong so event dang hoat dong
    long countByStatusAndIsDeletedFalse(Event.EventStatus status);
    @Query(value = """
        SELECT 
            e.*,
            AVG(f.rating) AS avgRating,
            COUNT(DISTINCT er.account_id) AS total_participants
        FROM events e
        LEFT JOIN event_tags et ON e.event_id = et.event_id
        LEFT JOIN event_feedback f ON e.event_id = f.event_id
        LEFT JOIN event_account_role er ON e.event_id = er.event_id
        WHERE (:name IS NULL OR e.name LIKE CONCAT('%', :name, '%'))
          AND (:status IS NULL OR e.status = :status)
          AND (:type IS NULL OR (
            (:type = 'upcoming' AND e.start_datetime > NOW()) OR
            (:type = 'recently' AND e.end_datetime < NOW()) OR
            (:type = 'ongoing' AND e.start_datetime < NOW() AND e.end_datetime > NOW())
          ))
          AND (:tagCheck = FALSE OR et.tag_id IN (:tagIds))
        GROUP BY e.event_id
        ORDER BY
         CASE WHEN :isTrending = TRUE THEN total_participants ELSE NULL END DESC,
         CASE WHEN :sortType = 'START_DATE_ASC' THEN e.start_datetime END ASC,
         CASE WHEN :sortType = 'START_DATE_DESC' THEN e.start_datetime END DESC,
         CASE WHEN :sortType = 'END_DATE_ASC' THEN e.end_datetime END ASC,
         CASE WHEN :sortType = 'END_DATE_DESC' THEN e.end_datetime END DESC,
         CASE WHEN :sortType = 'RATING_ASC' THEN AVG(f.rating) END ASC,
         CASE WHEN :sortType = 'RATING_DESC' THEN AVG(f.rating) END DESC,
         CASE WHEN :sortType = 'SCALE_ASC' THEN COUNT(DISTINCT er.account_id) END ASC,
         CASE WHEN :sortType = 'SCALE_DESC' THEN COUNT(DISTINCT er.account_id) END DESC
        """, nativeQuery = true)
    Page<FilterEventDTO> findAllUnified(
            @Param("name") String name,
            @Param("status") String status,
            @Param("type") String type,
            @Param("tagCheck") Boolean tagCheck,
            @Param("tagIds") List<Integer> tagIds,
            @Param("isTrending") Boolean isTrending,
            @Param("sortType") String sortType,
            Pageable pageable
    );


}