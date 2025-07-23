package com.mavent.dev.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public interface RequestDTO {
    Integer getRequestId();
    Integer getEventId();
    Integer getRequestTypeId();
    String getRequestType();
    Integer getDepartmentId();
    String getDepartment();
    Integer getTaskId();
    String getTask();
    Integer getRequestByAccountId();
    String getRequestByUsername();
    String getTitle();
    String getContent();
    String getStatus();
    String getResponseContent();
    Integer getResponseByAccountId();
    String getResponseByUsername();
    String getCreatedAt();
    String getUpdatedAt();
}

