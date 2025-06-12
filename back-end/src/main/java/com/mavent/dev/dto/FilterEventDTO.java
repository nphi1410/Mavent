package com.mavent.dev.dto;

import com.mavent.dev.entity.Event.EventStatus;

import java.time.LocalDateTime;

public interface FilterEventDTO {
    Integer getEventId();

    String getName();

    String getDescription();

    LocalDateTime getStartDatetime();

    LocalDateTime getEndDatetime();

    String getLocation();

    String getDdayInfo();

    Integer getMaxMemberNumber();

    Integer getMaxParticipantNumber();

    EventStatus getStatus();

    Integer getCreatedBy();

    Boolean getIsDeleted();

    LocalDateTime getCreatedAt();

    LocalDateTime getUpdatedAt();

    Double getAvgRating();

    String getBannerUrl();

    String getPosterUrl();

    Integer getTotalParticipants();
}


