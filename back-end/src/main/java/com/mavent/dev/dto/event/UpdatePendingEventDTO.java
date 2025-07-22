package com.mavent.dev.dto.event;

import org.springframework.stereotype.Component;

@Component
public class UpdatePendingEventDTO {
    private Integer eventId;
    private String status;
    private String message;

}
