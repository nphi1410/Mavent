package com.mavent.dev.dto.event;

import lombok.Data;

@Data
public class UserPendingEventDTO {
        private Integer id;
        private String username;
        private String avatarUrl;
}
