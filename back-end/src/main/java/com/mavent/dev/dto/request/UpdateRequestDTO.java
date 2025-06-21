package com.mavent.dev.dto.request;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateRequestDTO {
    Integer requestId;
    Integer responseByAccountId;
    String status;
    String responseContent;
}
