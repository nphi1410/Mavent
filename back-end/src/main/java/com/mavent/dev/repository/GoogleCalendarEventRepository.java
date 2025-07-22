package com.mavent.dev.repository;

import com.mavent.dev.entity.GoogleCalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoogleCalendarEventRepository
        extends JpaRepository<GoogleCalendarEvent, GoogleCalendarEvent.GoogleCalendarEventId> {

    List<GoogleCalendarEvent> findByIdMeetingId(Integer meetingId);
    Optional<GoogleCalendarEvent> findByIdMeetingIdAndIdAccountId(Integer meetingId, Integer accountId);
}

