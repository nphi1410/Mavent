package com.mavent.dev.dto.member;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * dto for member ban/unban operations.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class BanMemberRequestDTO {
    
    @NotNull(message = "Event ID is required")
    private Integer eventId;
    
    @NotNull(message = "Account ID is required")
    private Integer accountId;
    
    @NotNull(message = "Ban status is required")
    private Boolean isBanned;
    
    @NotBlank(message = "Reason is required")
    @Size(max = 500, message = "Reason must not exceed 500 characters")
    private String reason;
}
