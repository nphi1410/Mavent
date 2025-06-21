package com.mavent.dev.service.implement;

import com.mavent.dev.entity.Meeting;
import com.mavent.dev.repository.MeetingRepository;
import com.mavent.dev.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MeetingImplement implements MeetingService {

    @Autowired
    private MeetingRepository meetingRepository;

    @Override
    public Meeting createMeeting(Meeting meeting) {
        return meetingRepository.save(meeting);
    }

    @Override
    public Meeting updateMeeting(Integer meetingId, Meeting updatedMeeting) {
        return meetingRepository.findById(meetingId)
                .map(existing -> {
                    updatedMeeting.setMeetingId(meetingId);
                    return meetingRepository.save(updatedMeeting);
                })
                .orElseThrow(() -> new RuntimeException("Meeting not found with ID: " + meetingId));
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

