package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Represents the relationship between a user account and an event with their role.
 * Maps to the 'event_account_role' table in the database.
 */
@Entity
@Table(name = "event_account_role", indexes = {
    @Index(name = "idx_event_role", columnList = "event_role"),
    @Index(name = "idx_is_active", columnList = "is_active"),
    @Index(name = "idx_department_id", columnList = "department_id"),
    @Index(name = "idx_assigned_by", columnList = "assigned_by_account_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(EventAccountRole.PK.class)  // Giữ chiến lược ID của team
public class EventAccountRole {

    @Id
    @Column(name = "event_id")
    private Integer eventId;

    @Id
    @Column(name = "account_id")
    private Integer accountId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_role", nullable = false, length = 20)
    @Builder.Default
    private EventRole eventRole = EventRole.GUEST;

    @Column(name = "department_id")
    private Integer departmentId;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "assigned_by_account_id")
    private Integer assignedByAccountId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Commented out to fix circular dependency - từ code của bạn
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "department_id")
    // private Department department;

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "assigned_by_account_id")
    // private Account assignedBy;

    // @ManyToOne(fetch = FetchType.LAZY)
    // @MapsId("eventId")
    // @JoinColumn(name = "event_id", nullable = false)
    // private Event event;

    // @ManyToOne(fetch = FetchType.LAZY)
    // @MapsId("accountId")
    // @JoinColumn(name = "account_id", nullable = false)
    // private Account account;

    /**
     * Enum representing possible roles in an event
     */
    public enum EventRole {
        ADMIN, DEPARTMENT_MANAGER, MEMBER, PARTICIPANT, GUEST
    }

    /**
     * Composite primary key class for EventAccountRole
     */
    @Data
    public static class PK implements Serializable {
        private Integer eventId;
        private Integer accountId;
    }
}