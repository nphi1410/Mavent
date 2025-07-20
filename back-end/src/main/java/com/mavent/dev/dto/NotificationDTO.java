package com.mavent.dev.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Integer notificationId;
    private Integer recipientAccountId;
    private Integer eventId;
    private Integer requestId;
    private Integer taskId;
    private String type;
    private String message;
    private LocalDateTime createdAt;
    private Boolean isRead;
}