package com.mavent.dev.service;

import com.mavent.dev.dto.MeetingDTO;
import com.mavent.dev.entity.Meeting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface MeetingService {

    Meeting createMeeting(Meeting meeting, List<String> attendeeIds);

    Meeting updateMeeting(Meeting meeting);

    void deleteMeeting(Integer meetingId);

    Optional<Meeting> getMeetingById(Integer meetingId);

    Page<MeetingDTO> getMeetingByAccountId(Integer accountId, String searchTitle,Integer eventId, Pageable pageable);

    List<Meeting> getAllMeetings();

    List<Meeting> getMeetingsByOrganizerAccountId(Integer organizerAccountId);

    List<Meeting> getMeetingsByDepartmentId(Integer departmentId);

    List<Meeting> getMeetingsByEventId(Integer eventId);

    List<Meeting> getMeetingsByStatus(Meeting.Status status);
}

