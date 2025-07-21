package com.mavent.dev.dto.request;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.apache.qpid.proton.amqp.UnsignedInteger;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateExpenseRequestDTO {
    int eventId;
    int accountId;
    int departmentId;
    int requestTypeId;
    String title;
    String content;
    String evidenceUrl;
    UnsignedInteger amount;


}
