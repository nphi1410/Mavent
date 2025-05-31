package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_account_role")
@Data
@IdClass(EventAccountRole.PK.class)
public class EventAccountRole {

    @Id
    @Column(name = "event_id")
    private Integer eventId;

    @Id
    @Column(name = "account_id")
    private Integer accountId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_role", nullable = false)
    private EventRole eventRole;

    @Column(name = "department_id")
    private Integer departmentId;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "assigned_by_account_id")
    private Integer assignedByAccountId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum EventRole {
        ADMIN, DEPARTMENT_MANAGER, MEMBER, PARTICIPANT, GUEST
    }

    @Data
    public static class PK implements Serializable {
        private Integer eventId;
        private Integer accountId;
    }
}