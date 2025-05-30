package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "departments")
@Data
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "department_id")
    private Integer departmentId;

    @Column(name = "event_id", nullable = false)
    private Integer eventId;

    @Column(name = "name", nullable = false)
    private String name;
}
