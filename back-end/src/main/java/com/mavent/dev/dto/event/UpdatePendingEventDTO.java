package com.mavent.dev.dto.event;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class UpdatePendingEventDTO {
    private Integer eventId;
    private String status;
    private String note;
    private String eventName;
    private Integer accountId;  // account to send email to
    private Integer assignedByAccountId; // account that assigned the role
    private String assignedByAccountName; // name of the account that assigned the role


}
