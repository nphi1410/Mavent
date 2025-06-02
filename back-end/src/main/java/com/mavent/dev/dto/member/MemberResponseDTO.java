package com.mavent.dev.dto.member;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Member response data.
 * Combines Account and EventAccountRole information for member listing.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberResponseDTO {

    // Account Information
    private Integer accountId;
    private String username;
    private String email;
    private String fullName;
    private String studentId;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    
    private String phoneNumber;
    private String gender;
    private String avatarUrl;
    private String systemRole;
    
    // Event Role Information
    private Integer eventId;
    private String eventRole;
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
