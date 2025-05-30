package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "event_account_role")
@Data
public class EventAccountRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_account_role_id")
    private Integer id;

    @Column(name = "event_id", nullable = false)
    private Integer eventId;

    @Column(name = "account_id", nullable = false)
    private Integer accountId;

    @Column(name = "event_role", nullable = false)
    private String eventRole;

    @Column(name = "department_id")
    private Integer departmentId;
}
