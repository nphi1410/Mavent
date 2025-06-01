package com.mavent.dev.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
    private String eventName;
    private String departmentName;

    public TaskDTO(Integer taskId, Integer eventId, Integer departmentId, String title,
                   String description, Integer assignedToAccountId, Integer assignedByAccountId,
                   LocalDateTime dueDate, com.mavent.dev.entity.Task.Status status,
                   com.mavent.dev.entity.Task.Priority priority,
                   String eventName, String departmentName) {
        this.taskId = taskId;
        this.eventId = eventId;
        this.departmentId = departmentId;
        this.title = title;
        this.description = description;
        this.assignedToAccountId = assignedToAccountId;
        this.assignedByAccountId = assignedByAccountId;
        this.dueDate = dueDate;
        this.status = status.name();
        this.priority = priority.name();
        this.eventName = eventName;
        this.departmentName = departmentName;
    }
}
