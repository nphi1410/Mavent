package com.mavent.dev.dto;

import com.mavent.dev.entity.Event.EventStatus;

import java.time.LocalDateTime;

public interface FilterEventDTO {
    Integer getEventId();

    String getName();

    String getDescription();

    LocalDateTime getStartDatetime();

    LocalDateTime getEndDatetime();

    Integer getLocationId();

    String getLocationName();

    String getDdayInfo();

    Integer getMaxMemberNumber();

    Integer getMaxParticipantNumber();

    EventStatus getStatus();

    Integer getCreatedByAccountId();

    String getCreatedByAvatar();

    String getCreatedByName();

    Boolean getIsDeleted();

    LocalDateTime getCreatedAt();

    LocalDateTime getUpdatedAt();

    Double getAvgRating();

    String getBannerUrl();

    String getPosterUrl();

    Integer getTotalParticipants();
}


