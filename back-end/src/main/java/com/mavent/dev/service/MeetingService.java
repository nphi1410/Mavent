package com.mavent.dev.service;

import com.mavent.dev.entity.Meeting;

import java.util.List;
import java.util.Optional;

public interface MeetingService {

    Meeting createMeeting(Meeting meeting);

    Meeting updateMeeting(Integer meetingId, Meeting meeting);

    void deleteMeeting(Integer meetingId);

    Optional<Meeting> getMeetingById(Integer meetingId);

    List<Meeting> getAllMeetings();

    List<Meeting> getMeetingsByOrganizerAccountId(Integer organizerAccountId);

    List<Meeting> getMeetingsByDepartmentId(Integer departmentId);

    List<Meeting> getMeetingsByEventId(Integer eventId);

    List<Meeting> getMeetingsByStatus(Meeting.Status status);
}

