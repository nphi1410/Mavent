package com.mavent.dev.dto.member;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

/**
 * DTO for adding new member to event.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddMemberDTO {
    
    @NotNull(message = "Event ID is required")
    private Integer eventId;
    
    @NotNull(message = "Account ID is required")
    private Integer accountId;
    
    @NotNull(message = "Event role is required")
    @Pattern(regexp = "^(ADMIN|DEPARTMENT_MANAGER|MEMBER|PARTICIPANT|GUEST)$", 
             message = "Event role must be one of: ADMIN, DEPARTMENT_MANAGER, MEMBER, PARTICIPANT, GUEST")
    private String eventRole;
    
    private Integer departmentId;
    
    @Size(max = 500, message = "Invitation message must not exceed 500 characters")
    private String invitationMessage;
    
    private Integer invitedByAccountId;
}
