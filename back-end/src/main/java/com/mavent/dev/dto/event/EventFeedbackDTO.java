package com.mavent.dev.dto.event;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventFeedbackDTO {
    private Integer accountId;
    private Integer rating;
    private String comment;
    private LocalDateTime submittedAt;
}
