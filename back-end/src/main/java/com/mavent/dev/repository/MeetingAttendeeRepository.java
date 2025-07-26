package com.mavent.dev.repository;

import com.mavent.dev.dto.MeetingAttendeeDTO;
import com.mavent.dev.entity.MeetingAttendee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface MeetingAttendeeRepository extends JpaRepository<MeetingAttendee,MeetingAttendee.PK> {
    List<MeetingAttendee> findByMeetingId(Integer meetingId);
    void deleteByMeetingId(Integer meetingId);

    @Query(value = """
                SELECT 
                    ma.meeting_id AS meetingId,
                    a.account_id AS accountId,
                    a.username AS username,
                    a.email AS email,
                    a.full_name AS fullName,
                    a.avatar_url AS avatarUrl,
                    a.phone_number AS phoneNumber,
                    a.gender AS gender,
                    a.student_id AS studentId,
                    a.date_of_birth AS dateOfBirth,
                    ma.attendance_status AS attendaceStatus
                FROM meeting_attendees ma
                JOIN accounts a ON ma.account_id = a.account_id
                JOIN event_account_role ear ON ear.account_id = ma.account_id
                WHERE ma.meeting_id = :meetingId
                  AND ear.is_active = true
            """, nativeQuery = true)
    List<MeetingAttendeeDTO> findMeetingAttendees(@Param("meetingId") Integer meetingId);


    @Transactional
    @Modifying
    @Query(value = """
            DELETE FROM meeting_attendees
            WHERE meeting_id = :meetingId
              AND account_id NOT IN (:updatedAttendees)
            """, nativeQuery = true)
    void deleteOld(@Param("meetingId") Integer meetingId, @Param("updatedAttendees") List<Integer> updatedAttendees);

}
