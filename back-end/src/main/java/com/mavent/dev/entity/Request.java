package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "requests")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Integer requestId;

    @Column(name = "request_by_account_id", nullable = false)
    private Integer requestByAccountId;

    @Column(name = "event_id")
    private Integer eventId;

    @Column(name = "task_id")
    private Integer taskId;

    @Column(name = "department_id")
    private Integer departmentId;

    @Column(name = "request_type_id", nullable = false)
    private Integer requestTypeId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING'")
    private Status status = Status.PENDING;

    @Column(name = "response_by_account_id")
    private Integer responseByAccountId;

    @Column(name = "response_content", columnDefinition = "TEXT")
    private String responseContent;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enum for status
    public enum Status {
        PENDING,
        APPROVED,
        REJECTED,
        CANCELLED
    }
}
