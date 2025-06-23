package com.mavent.dev.dto.task;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskFeedbackDTO {
    private Integer id;
    private Integer taskId;
    private Integer feedbackByAccountId;
    private String comment;
    private LocalDateTime createdAt;
    // getters and setters
}