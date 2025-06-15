package com.mavent.dev.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgendaItemDTO {
    private int eventId;
    private String agendaTitle;
    private String agendaDescription;
    private LocalDateTime agendaStartTime;
    private LocalDateTime agendaEndTime;
//    private int createdByAccountId;
}

