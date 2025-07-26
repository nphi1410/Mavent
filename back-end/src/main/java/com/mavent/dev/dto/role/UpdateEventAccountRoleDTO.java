package com.mavent.dev.dto.role;

import com.mavent.dev.entity.EventAccountRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEventAccountRoleDTO {
    private Integer assignedByAccountId;
    private EventAccountRole.EventRole newRole;
    private Integer eventId;
    private Integer accountId;
}
