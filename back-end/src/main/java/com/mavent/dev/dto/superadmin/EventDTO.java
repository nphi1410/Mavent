package com.mavent.dev.dto.superadmin;

import com.mavent.dev.entity.Event.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Integer eventId;
    private String name;
    private String description;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
    private String location;
    private String ddayInfo;
    private Integer maxMemberNumber;
    private Integer maxParticipantNumber;
    private EventStatus status;
    private Integer createdBy;
    private Boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}