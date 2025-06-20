package com.mavent.dev.dto.task;

import lombok.Data;

@Data
public class TaskAttendeeDTO {
    private Integer taskId;
    private Integer accountId;
    private String accountName;
    private String email;
    private String avatarUrl;
    private String status; // INVITED, ACCEPTED, DECLINED, ATTENDED
}