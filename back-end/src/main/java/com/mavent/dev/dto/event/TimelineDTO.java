package com.mavent.dev.dto.event;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimelineDTO {
    private int eventId;
    private LocalDateTime timelineDatetime;
    private String timelineTitle;
    private String timelineDescription;
//    private int createdByAccountId;
}
