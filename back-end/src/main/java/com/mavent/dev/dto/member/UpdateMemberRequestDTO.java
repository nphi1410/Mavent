package com.mavent.dev.dto.member;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * dto for updating member role and department.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class UpdateMemberRequestDTO {

    @NotNull(message = "Event ID is required")
    private Integer eventId;

    @NotNull(message = "Account ID is required")
    private Integer accountId;

    @NotNull(message = "Event role is required")
    @Pattern(regexp = "^(ADMIN|DEPARTMENT_MANAGER|MEMBER|PARTICIPANT|GUEST)$",
            message = "Event role must be one of: ADMIN, DEPARTMENT_MANAGER, MEMBER, PARTICIPANT, GUEST")
    private String eventRole;

    private Integer departmentId;

    @Size(max = 500, message = "Reason must not exceed 500 characters")
    private String reason;

    // Field to handle active/inactive status
    private Boolean isActive;
}
