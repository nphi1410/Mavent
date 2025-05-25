package com.mavent.dev.dto.member;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

/**
 * DTO for member role updates and management operations.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateMemberRoleDTO {

    @NotNull(message = "Event ID is required")
    private Integer eventId;
    
    @NotNull(message = "Account ID is required")
    private Integer accountId;
    
    @NotNull(message = "Event role is required")
    @Pattern(regexp = "^(ADMIN|DEPARTMENT_MANAGER|MEMBER|PARTICIPANT|GUEST)$", 
             message = "Event role must be one of: ADMIN, DEPARTMENT_MANAGER, MEMBER, PARTICIPANT, GUEST")
    private String eventRole;
    
    private Integer departmentId;
    
    @NotNull(message = "Active status is required")
    private Boolean isActive;
    
    private Integer assignedByAccountId;
    
    @Size(max = 500, message = "Reason must not exceed 500 characters")
    private String reason; // Reason for role change/ban
}
