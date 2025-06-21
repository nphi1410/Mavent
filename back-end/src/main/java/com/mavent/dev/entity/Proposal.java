package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "proposals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Proposal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "proposal_id")
    private int proposalId;

    @Column(name = "event_id", nullable = false)
    private int eventId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "proposal_link", nullable = false)
    private String proposalLink;

    @Column(name = "notes")
    private String notes;

    @Column(name = "created_by_account_id")
    private Integer createdByAccountId;

    @Column(name = "defense_date")
    private Date defenseDate;

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
