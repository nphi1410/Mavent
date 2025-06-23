package com.mavent.dev.dto.request;

import com.mavent.dev.dto.account.AccountDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestDTO {
    private Integer requestId;
    private Integer eventId;
    private Integer requestTypeId;
    private Integer departmentId;
    private Integer taskId;
    private Integer requestByAccountId;
    private String requestByUsername;
    private String requestContent;
    private String status;
    private String responseContent;
    private Integer responseByAccountId;
    private String responseByUsername;
    private String createdAt;
    private String updatedAt;
}
