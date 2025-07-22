package com.mavent.dev.repository;

import com.mavent.dev.entity.MeetingAttendee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingAttendeeRepository extends JpaRepository<MeetingAttendee,MeetingAttendee.PK> {
    List<MeetingAttendee> findByMeetingId(Integer meetingId);
    void deleteByMeetingId(Integer meetingId);
}
