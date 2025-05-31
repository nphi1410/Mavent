package com.mavent.dev.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private long totalEvents;
    private long totalAccounts;
    private long totalUpcomingEvents;
    private long totalOngoingEvents;

}
