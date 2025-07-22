package com.mavent.dev.dto.department;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEventInfoDTO {
    private Integer eventId;
    private Integer departmentId;
    private Boolean sponsorManageable;
//    private String departmentName;
    private Integer accountId;
    private String username;
    private String role;
}
