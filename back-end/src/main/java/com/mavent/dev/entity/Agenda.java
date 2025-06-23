package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "agenda")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Agenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "agenda_item_id")
    private int agendaItemId;

    @Column(name = "event_id", nullable = false)
    private int eventId;

    @Column(name = "title", nullable = false)
    private String agendaTitle;

    @Column(name = "description", nullable = false)
    private String agendaDescription;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime agendaStartTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime agendaEndTime;

    @Column(name = "created_by_account_id")
    private Integer createdByAccountId;

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
