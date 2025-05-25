package com.mavent.dev.dto.member;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Member management in event context.
 * Combines Account and EventAccountRole information for member listing and management.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberDetailsDTO {

    // Account Information
    private Integer accountId;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;
    
    @Size(max = 20, message = "Student ID must not exceed 20 characters")
    private String studentId;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    
    @Size(max = 15, message = "Phone number must not exceed 15 characters")
    private String phoneNumber;
    
    private String gender; // MALE, FEMALE, OTHER
    private String avatarUrl;
    private String systemRole; // USER, SUPER_ADMIN
    
    // Event Role Information
    private Integer eventId;
    private String eventRole; // ADMIN, DEPARTMENT_MANAGER, MEMBER, PARTICIPANT, GUEST
    private Integer departmentId;
    private String departmentName;
    private Boolean isActive;
    
    private Integer assignedByAccountId;
    private String assignedByName;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime joinedAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
