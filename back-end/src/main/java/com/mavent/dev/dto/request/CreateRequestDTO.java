package com.mavent.dev.dto.request;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
public class CreateRequestDTO {
    private int accountId;
    private int eventId;
    private Integer taskId;
    private int departmentId;
    private int requestTypeId;
    private String content;
    private String title;
}
