package com.mavent.dev.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskDTO {
    private Integer taskId;
    private Integer eventId;
    private Integer departmentId;
    private String title;
    private String description;
    private Integer assignedToAccountId;
    private Integer assignedByAccountId;
    private LocalDateTime dueDate;
    private String status;
    private String priority;
}
