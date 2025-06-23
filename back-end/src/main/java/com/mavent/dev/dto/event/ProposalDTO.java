package com.mavent.dev.dto.event;

import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalDTO {
    private int eventId;
    private String title;
    private String proposalLink;
    private String notes;
    private Date defenseDate;
//    private int createdByAccountId;
}
