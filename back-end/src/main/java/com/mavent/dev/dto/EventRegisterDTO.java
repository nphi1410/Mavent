package com.mavent.dev.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRegisterDTO {
    private Integer eventId;
    private Integer accountId;

}
