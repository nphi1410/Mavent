package com.mavent.dev.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a department within an event.
 * Maps to the 'departments' table in the database.
 */
@Entity
@Table(name = "departments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "department_id")
    private Integer departmentId;    // Commented out to fix circular dependency
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "event_id", nullable = false)
    // @NotNull(message = "Event is required")
    // private Event event;
    
    // Use event_id field instead
    @Column(name = "event_id", nullable = false)
    @NotNull(message = "Event ID is required")
    private Integer eventId;

    @Column(name = "name", nullable = false)
    @NotBlank(message = "Department name is required")
    @Size(max = 100, message = "Department name must not exceed 100 characters")
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;    // Commented out to fix circular dependency
    // @OneToMany(mappedBy = "department")
    // private List<EventAccountRole> members = new ArrayList<>();


}

