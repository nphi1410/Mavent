package com.mavent.dev.mapper;

import com.mavent.dev.dto.role.AddEventAccountRoleDTO;
import com.mavent.dev.entity.EventAccountRole;
import org.springframework.stereotype.Component;

@Component
public class EventAccountRoleMapper {
    public static EventAccountRole toEntity(AddEventAccountRoleDTO dto) {
        if (dto == null) {
            return null;
        }
        EventAccountRole entity = new EventAccountRole();
        entity.setEventId(dto.getEventId());
        entity.setAccountId(dto.getAccountId());
        entity.setEventRole(EventAccountRole.EventRole.valueOf(dto.getEventRole()));
        entity.setAssignedByAccountId(dto.getAssignedByAccountId());
        return entity;
    }
}
