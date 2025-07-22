package com.mavent.dev.service.implement;

import com.mavent.dev.dto.MeetingDTO;
import com.mavent.dev.entity.*;
import com.mavent.dev.repository.*;
import com.mavent.dev.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MeetingImplement implements MeetingService {

    @Autowired
    private MeetingRepository meetingRepository;
    @Autowired
    private MeetingAttendeeRepository meetingAttendeeRepository;
    @Autowired
    private EventAccountRoleRepository eventAccountRoleRepository;
    @Autowired
    private GoogleCalendarService calendarService;
    @Autowired
    private GoogleTokenService tokenService;
    @Autowired
    private GoogleTokenRepository tokenRepository;
    @Autowired
    private GoogleCalendarEventRepository calendarEventRepository;

    @Override
    public Meeting createMeeting(Meeting meeting, List<String> attendeeIds) {
        // 1. Save the meeting first
        Meeting savedMeeting = meetingRepository.save(meeting);

        // 2. Save meeting attendees from passed list
        List<MeetingAttendee> attendees = new ArrayList<>();
        for (String attendeeIdStr : attendeeIds) {
            Integer attendeeId = Integer.parseInt(attendeeIdStr);
            attendees.add(new MeetingAttendee(savedMeeting.getMeetingId(), attendeeId));
        }
        meetingAttendeeRepository.saveAll(attendees);

        // 3. For each attendee, sync Google Calendar if connected
        for (MeetingAttendee attendee : attendees) {
            Integer accountId = attendee.getAccountId();

            Optional<GoogleToken> tokenOpt = tokenRepository.findById(accountId);
            if (tokenOpt.isEmpty()) continue;

            try {
                String accessToken = tokenService.getValidAccessToken(accountId);

                // Check if already synced (should not happen on create, but safe check)
                Optional<GoogleCalendarEvent> existingEvent = calendarEventRepository
                        .findByIdMeetingIdAndIdAccountId(savedMeeting.getMeetingId(), accountId);

                if (existingEvent.isPresent()) {
                    calendarService.updateMeetingEvent(accessToken, savedMeeting, existingEvent.get().getGoogleEventId());
                } else {
                    String googleEventId = calendarService.addMeetingEvent(accessToken, savedMeeting);

                    // Save event mapping
                    GoogleCalendarEvent calendarEvent = new GoogleCalendarEvent(
                            savedMeeting.getMeetingId(), accountId, googleEventId
                    );
                    calendarEventRepository.save(calendarEvent);
                }
            } catch (Exception e) {
                e.printStackTrace();
                // optionally log: failed to sync calendar for accountId
            }
        }

        return savedMeeting;
    }

    @Override
    public Meeting updateMeeting(Meeting updatedMeeting) {
        Meeting updated = meetingRepository.save(updatedMeeting);

        // Sync Google Calendar for each attendee
        List<MeetingAttendee> attendees = meetingAttendeeRepository.findByMeetingId(updated.getMeetingId());

        for (MeetingAttendee attendee : attendees) {
            Integer accountId = attendee.getAccountId();

            Optional<GoogleToken> tokenOpt = tokenRepository.findById(accountId);
            if (tokenOpt.isEmpty()) continue;

            try {
                String accessToken = tokenService.getValidAccessToken(accountId);

                Optional<GoogleCalendarEvent> calEventOpt = calendarEventRepository
                        .findByIdMeetingIdAndIdAccountId(updated.getMeetingId(), accountId);

                if (calEventOpt.isPresent()) {
                    calendarService.updateMeetingEvent(accessToken, updated, calEventOpt.get().getGoogleEventId());
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return updated;
    }

    @Override
    public void deleteMeeting(Integer meetingId) {
        if (!meetingRepository.existsById(meetingId)) {
            throw new RuntimeException("Meeting not found with ID: " + meetingId);
        }

        // 1. Delete Google Calendar Events for each attendee
        List<MeetingAttendee> attendees = meetingAttendeeRepository.findByMeetingId(meetingId);

        for (MeetingAttendee attendee : attendees) {
            Integer accountId = attendee.getAccountId();

            Optional<GoogleToken> tokenOpt = tokenRepository.findById(accountId);
            if (tokenOpt.isEmpty()) continue;

            try {
                String accessToken = tokenService.getValidAccessToken(accountId);

                Optional<GoogleCalendarEvent> calEventOpt = calendarEventRepository
                        .findByIdMeetingIdAndIdAccountId(meetingId, accountId);

                if (calEventOpt.isPresent()) {
                    calendarService.deleteMeetingEvent(accessToken, calEventOpt.get().getGoogleEventId());
                    calendarEventRepository.delete(calEventOpt.get());
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // 2. Delete attendees and meeting
        meetingAttendeeRepository.deleteByMeetingId(meetingId);
        meetingRepository.deleteById(meetingId);
    }


    @Override
    public Optional<Meeting> getMeetingById(Integer meetingId) {
        return meetingRepository.findById(meetingId);
    }

    @Override
    public Page<MeetingDTO> getMeetingByAccountId(Integer accountId, String searchTitle, Integer eventId, Pageable pageable) {
        Page<MeetingDTO> result = meetingRepository.findByAccountIdAndTitle(accountId, searchTitle, eventId, pageable);
        return result;
    }

    @Override
    public List<Meeting> getAllMeetings() {
        return meetingRepository.findAll();
    }

    @Override
    public List<Meeting> getMeetingsByOrganizerAccountId(Integer organizerAccountId) {
        return meetingRepository.findByOrganizerAccountId(organizerAccountId);
    }

    @Override
    public List<Meeting> getMeetingsByDepartmentId(Integer departmentId) {
        return meetingRepository.findByDepartmentId(departmentId);
    }

    @Override
    public List<Meeting> getMeetingsByEventId(Integer eventId) {
        return meetingRepository.findByEventId(eventId);
    }

    @Override
    public List<Meeting> getMeetingsByStatus(Meeting.Status status) {
        return meetingRepository.findByStatus(status);
    }
}

