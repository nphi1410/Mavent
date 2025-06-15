package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data

public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Integer taskId;

    @Column(name = "event_id")
    private Integer eventId;

    @Column(name = "department_id")
    private Integer departmentId;

    @Column(name = "title")
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "assigned_to_account_id")
    private Integer assignedToAccountId;

    @Column(name = "assigned_by_account_id")
    private Integer assignedByAccountId;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private Priority priority;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Status {
        TODO, DOING, DONE, FEEDBACK_NEEDED, REJECTED, CANCELLED
    }

    public enum Priority {
        OPTIONAL, LOW, MEDIUM, HIGH, CRITICAL
    }
}
