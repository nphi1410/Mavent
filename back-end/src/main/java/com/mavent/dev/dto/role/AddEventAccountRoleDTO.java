package com.mavent.dev.dto.role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddEventAccountRoleDTO {
    private Integer eventId;
    private Integer accountId;
    private String eventRole;
    private Integer assignedByAccountId;
}
