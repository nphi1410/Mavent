package com.mavent.dev.repository;

import com.mavent.dev.dto.MeetingDTO;
import com.mavent.dev.entity.Meeting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Integer> {
    List<Meeting> findByOrganizerAccountId(Integer organizerAccountId);
    List<Meeting> findByDepartmentId(Integer departmentId);
    List<Meeting> findByEventId(Integer eventId);
    List<Meeting> findByStatus(Meeting.Status status);

    @Query(value = """
            SELECT 
                ma.account_id AS attendee,
                e.name AS eventName,
                d.name AS departmentName,
                a.full_name AS organizerName,
                m.meeting_id AS meetingId,
                m.title,
                m.notes,
                m.meeting_link AS meetingLink,
                m.meeting_datetime AS meetingDatetime,
                m.end_datetime AS endDatetime,
                m.location,
                m.description,
                m.status,
                m.organizer_account_id AS organizerAccountId,
                m.event_id AS eventId,
                m.department_id AS departmentId,
                m.created_at AS createdAt,
                m.updated_at AS updatedAt
            FROM meeting_attendees ma
            JOIN meetings m ON ma.meeting_id = m.meeting_id
            JOIN events e ON e.event_id = m.event_id
            LEFT JOIN departments d ON d.department_id = m.department_id
            JOIN accounts a ON a.account_id = m.organizer_account_id
            WHERE ma.account_id = :accountId
              AND (:searchTitle IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :searchTitle, '%')))
              AND m.status = 'SCHEDULED'
              AND (:eventId IS NULL OR m.event_id = :eventId)
            ORDER BY m.meeting_datetime DESC
            """,
            countQuery = """
                    SELECT COUNT(*) 
                    FROM meeting_attendees ma
                    JOIN meetings m ON ma.meeting_id = m.meeting_id
                    WHERE ma.account_id = :accountId
                      AND (:searchTitle IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :searchTitle, '%')))
                    """,
            nativeQuery = true
    )
    Page<MeetingDTO> findByAccountIdAndTitle(
            @Param("accountId") Integer accountId,
            @Param("searchTitle") String searchTitle,
            @Param("eventId") Integer eventId,
            Pageable pageable
    );

}


