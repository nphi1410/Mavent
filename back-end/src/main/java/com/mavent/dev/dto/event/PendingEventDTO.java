package com.mavent.dev.dto.event;

import lombok.Data;

import java.util.List;

@Data
public class PendingEventDTO {
    private Integer id;
    private String name;
    private String description;
    private String status;
    private String startDate;
    private String endDate;
    private String createdAt;
    private String updatedAt;
    private String bannerUrl;
    private String posterUrl;
    private String location;
    private Integer locationId;
    private String ddayInfo;
    private Integer maxMembers;
    private Integer maxParticipants;

    private UserPendingEventDTO creator;

    private ProposalDTO proposal;

    private List<AgendaDTO> agendas;
    private List<TimelineDTO> timelines;


    // Additional fields can be added as needed
}

