package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.sql.Timestamp;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "meetings")
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meeting_id")
    private Integer meetingId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "enum('SCHEDULED','CANCELLED','COMPLETED','POSTPONED') default 'SCHEDULED'")
    private Status status = Status.SCHEDULED;

    @Column(name = "organizer_account_id", nullable = false)
    private Integer organizerAccountId;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "meeting_link", length = 255)
    private String meetingLink;

    @Column(name = "meeting_datetime", nullable = false)
    private LocalDateTime meetingDatetime;

    @Column(name = "location", length = 255)
    private String location;

    @Column(name = "event_id", nullable = false)
    private Integer eventId;

    @Column(name = "end_datetime")
    private LocalDateTime endDatetime;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "department_id")
    private Integer departmentId;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Timestamp createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private Timestamp updatedAt;

    public enum Status {
        SCHEDULED,
        CANCELLED,
        COMPLETED,
        POSTPONED
    }
}

