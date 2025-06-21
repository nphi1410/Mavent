package com.mavent.dev.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Data
@Setter
public class CreateRequestDTO {
    private int accountId;
    private int eventId;
    private int taskId;
    private int departmentId;
    private int requestTypeId;
    private String content;
    private String status;
}
