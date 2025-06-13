package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "timeline_items")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TimelineItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "timeline_item_id")
    private int timelineItemId;

    @Column(name = "event_id", nullable = false)
    private int eventId;

    @Column(name = "item_datetime", nullable = false)
    private LocalDateTime timelineDatetime;

    @Column(name = "title", nullable = false)
    private String timelineTitle;

    @Column(name = "description", nullable = false)
    private String timelineDescription;

    @Column(name = "created_by_account_id")
    private int createdByAccountId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
