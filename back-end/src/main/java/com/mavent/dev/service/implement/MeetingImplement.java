package com.mavent.dev.service.implement;

import com.mavent.dev.dto.MeetingDTO;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.entity.Meeting;
import com.mavent.dev.entity.MeetingAttendee;
import com.mavent.dev.repository.EventAccountRoleRepository;
import com.mavent.dev.repository.MeetingAttendeeRepository;
import com.mavent.dev.repository.MeetingRepository;
import com.mavent.dev.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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

    @Override
    public Meeting createMeeting(Meeting meeting) {
        Meeting savedMeeting = meetingRepository.save(meeting);

        List<MeetingAttendee> attendees = new ArrayList<>();

        // Add the organizer
        attendees.add(new MeetingAttendee(savedMeeting.getMeetingId(), meeting.getOrganizerAccountId()));

        // Add other attendees by department or event
        List<EventAccountRole> eventAccountRoles;
        if (meeting.getDepartmentId() == null) {
            eventAccountRoles = eventAccountRoleRepository.findByEventId(meeting.getEventId());
        } else {
            eventAccountRoles = eventAccountRoleRepository.findByDepartmentId(meeting.getDepartmentId());
        }

        for (EventAccountRole acc : eventAccountRoles) {
            attendees.add(new MeetingAttendee(savedMeeting.getMeetingId(), acc.getAccountId()));
        }

        meetingAttendeeRepository.saveAll(attendees);

        return savedMeeting;
    }


    @Override
    public Meeting updateMeeting(Integer meetingId, Meeting updatedMeeting) {
        // Ensure the meeting exists
        return meetingRepository.findById(meetingId).map(existing -> {
            // Preserve ID
            updatedMeeting.setMeetingId(meetingId);

            // Build attendee list (organizer + all event accounts)
            List<MeetingAttendee> attendees = new ArrayList<>();

            // Add the organizer as an attendee
            MeetingAttendee organizerAttendee = new MeetingAttendee(meetingId, updatedMeeting.getOrganizerAccountId());
            attendees.add(organizerAttendee);

            // Add all related event accounts as attendees
            List<EventAccountRole> eventAccountRoles;
            if (updatedMeeting.getDepartmentId() == null) {
                eventAccountRoles = eventAccountRoleRepository.findByEventId(updatedMeeting.getEventId());
            } else {
                eventAccountRoles = eventAccountRoleRepository.findByDepartmentId(updatedMeeting.getDepartmentId());
            }

            for (EventAccountRole acc : eventAccountRoles) {
                MeetingAttendee attendee = new MeetingAttendee(meetingId, acc.getAccountId());
                attendees.add(attendee);
            }

            // Save attendees
            meetingAttendeeRepository.saveAll(attendees);

            // Save updated meeting
            return meetingRepository.save(updatedMeeting);
        }).orElseThrow(() -> new RuntimeException("Meeting not found with ID: " + meetingId));
    }


    @Override
    public void deleteMeeting(Integer meetingId) {
        if (!meetingRepository.existsById(meetingId)) {
            throw new RuntimeException("Meeting not found with ID: " + meetingId);
        }
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

