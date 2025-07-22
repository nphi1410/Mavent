package com.mavent.dev.dto;

import com.mavent.dev.entity.Meeting;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class MeetingRequest {
    private Integer meetingId;
    private String title;
    private Meeting.Status status;
    private Integer organizerAccountId;
    private String notes;
    private String meetingLink;
    private LocalDateTime meetingDatetime;
    private String location;
    private Integer eventId;
    private LocalDateTime endDatetime;
    private String description;
    private Integer departmentId;
    private List<Integer> attendees;
}


