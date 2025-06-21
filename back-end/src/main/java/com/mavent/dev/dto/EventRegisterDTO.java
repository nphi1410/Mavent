package com.mavent.dev.dto;

import com.mavent.dev.entity.EventAccountRole.EventRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRegisterDTO {
    private Integer eventId;
    private String username;
    private EventRole role;
    private Integer departmentId;
}
