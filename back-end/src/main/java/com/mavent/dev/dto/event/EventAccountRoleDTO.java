package com.mavent.dev.dto.event;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public interface EventAccountRoleDTO {
    Integer getDepartmentId();

    String getEventRole();

    Boolean getIsActive();

    Timestamp getRoleUpdatedAt();

    Integer getEventId();

    String getName();

    LocalDateTime getStartDatetime();

    LocalDateTime getEndDatetime();

    String getStatus();

    Integer getCreatedByAccountId();

    String getBannerUrl();

    String getPosterUrl();

    Integer getLocationId();
}
