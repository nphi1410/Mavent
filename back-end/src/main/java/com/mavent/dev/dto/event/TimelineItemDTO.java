package com.mavent.dev.DTO.event;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimelineItemDTO {
    private int eventId;
    private LocalDateTime timelineDatetime;
    private String timelineTitle;
    private String timelineDescription;
//    private int createdByAccountId;
}
