package com.mavent.dev.dto.role;

import com.mavent.dev.dto.superadmin.AccountDTO;
import com.mavent.dev.entity.EventAccountRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRoleDTO {
    private Integer accountId;
    private Integer eventId;
    private EventAccountRole.EventRole role;
    private Integer assignedByAccountId;
//    private AccountDTO accountDTO;
    private String username;
    private String email;
    private String avatarUrl;

}

