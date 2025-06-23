package com.mavent.dev.dto;

import lombok.Data;

@Data
public class EventMemberDTO {
    private Integer accountId;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String role;  // EVENT_ADMIN, EVENT_MANAGER, EVENT_MEMBER
    private Boolean isActive;
}