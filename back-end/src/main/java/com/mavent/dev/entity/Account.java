package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Account entity representing user accounts in the system.
 * Maps to the 'accounts' table in the database.
 */
@Entity
@Table(name = "accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {
    public Account(String username, String email, String encodedPassword) {
        this.username = username;
        this.email = email;
        this.passwordHash = encodedPassword;
    }

    public enum SystemRole {
        SUPER_ADMIN, USER
    }

    public enum Gender {
        MALE, FEMALE, OTHER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Integer accountId;

    @Column(name = "username", unique = true, nullable = false, length = 50)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "student_id", unique = true, length = 20)
    private String studentId;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "system_role", nullable = false, length = 20)
    private SystemRole systemRole = SystemRole.USER;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    @Column(name = "avatar_url", length = 255)
    private String avatarUrl;

    @Column(name = "phone_number", unique = true, length = 15)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 10)
    @Builder.Default
    private Gender gender = Gender.OTHER;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Relationships
//    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
//    private List<EventAccountRole> eventRoles;

//    @OneToMany(mappedBy = "createdBy", fetch = FetchType.LAZY)
//    private List<Event> createdEvents;

//    @OneToMany(mappedBy = "assignedBy", fetch = FetchType.LAZY)
//    private List<EventAccountRole> assignedRoles;    // Enums
    public enum SystemRole {
        SUPER_ADMIN, USER
    }

    public enum Gender {
        MALE, FEMALE, OTHER
    }
}
