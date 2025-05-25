package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@ToString
public class Event {

    @Id
    @Column(name = "event_id", nullable = false, unique = true)
    private String eventId;

    @Column(name = "event_name")
    private String eventName;

    @Column(name = "event_description")
    private String eventDescription;

    @Column(name = "event_location")
    private String eventLocation;

    @Column(name = "event_start_date")
    private LocalDate eventStartDate;

    @Column(name = "event_end_date")
    private LocalDate eventEndDate;

    @Column(name = "event_status")
    private String eventStatus;

    @Column(name = "event_d_day_info")
    private String eventDDayInfo;

    @Column(name = "event_max_member")
    private int eventMaxMember;

    @Column(name = "event_max_participant")
    private int eventMaxParticipant;
}
