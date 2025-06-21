package com.mavent.dev.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEventDTO {
    private Integer eventId;
    private String eventName;
    private String description;
    private String status;
    private String role;
    private String departmentName; // Chỉ có nếu role là MEMBER
    private String bannerUrl;
}
