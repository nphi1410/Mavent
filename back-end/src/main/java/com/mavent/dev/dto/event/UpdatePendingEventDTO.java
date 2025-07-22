package com.mavent.dev.dto.event;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class UpdatePendingEventDTO {
    private Integer eventId;
    private String status;
    private String message;
    // account to send email to
    private Integer accountId;


}
