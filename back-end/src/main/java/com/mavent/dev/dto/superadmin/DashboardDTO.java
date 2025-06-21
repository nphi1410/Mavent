package com.mavent.dev.dto.superadmin;

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
