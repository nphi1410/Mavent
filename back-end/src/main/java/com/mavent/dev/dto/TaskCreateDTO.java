package com.mavent.dev.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskCreateDTO {
    private Integer eventId;
    private Integer departmentId;
    private String title;
    private String description;
    private Integer assignedToAccountId;
    private LocalDateTime dueDate;
    private String priority; // OPTIONAL, LOW, MEDIUM, HIGH, CRITICAL
    private List<Integer> taskAttendees; // List of account IDs
}
