package com.mavent.dev.mapper;

import com.mavent.dev.dto.role.AddEventAccountRoleDTO;
import com.mavent.dev.dto.role.UserRoleDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.EventAccountRole;
import org.springframework.stereotype.Component;

@Component
public class EventAccountRoleMapper {
    public static EventAccountRole toEntity(AddEventAccountRoleDTO dto) {
        return dto == null ? null : EventAccountRole.builder()
                .eventId(dto.getEventId())
                .accountId(dto.getAccountId())
                .eventRole(EventAccountRole.EventRole.valueOf(dto.getEventRole()))
                .assignedByAccountId(dto.getAssignedByAccountId())
                .build();
    }

    public static UserRoleDTO toUserRoleDTO(EventAccountRole entity, Account account) {
        return (entity == null || account == null) ? null : UserRoleDTO.builder()
                .accountId(entity.getAccountId())
                .eventId(entity.getEventId())
                .role(entity.getEventRole())
                .assignedByAccountId(entity.getAssignedByAccountId())
                .username(account.getUsername())
                .email(account.getEmail())
                .avatarUrl(account.getAvatarUrl())
                .build();
    }
}
