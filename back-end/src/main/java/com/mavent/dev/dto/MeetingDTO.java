package com.mavent.dev.dto;

import com.mavent.dev.entity.Meeting;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

public interface MeetingDTO {

    Integer getMeetingId();

    String getTitle();

    Meeting.Status getStatus();

    Integer getOrganizerAccountId();

    String getOrganizerName();

    String getNotes();

    String getMeetingLink();

    LocalDateTime getMeetingDatetime();

    String getLocation();

    Integer getEventId();

    String getEventName();

    LocalDateTime getEndDatetime();

    String getDescription();

    Integer getDepartmentId();

    String getDepartmentName();

    Timestamp getCreatedAt();

    Timestamp getUpdatedAt();

}

