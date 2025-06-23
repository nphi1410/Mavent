package com.mavent.dev.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Table(name = "meeting_attendees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(MeetingAttendee.PK.class)
public class MeetingAttendee {


    @Id
    @Column(name = "meeting_id")
    private Integer meetingId;

    @Id
    @Column(name = "account_id")
    private Integer accountId;

    /**
     * Enum representing possible attending status in a meeting
     */
    public enum Status{
        ATTENDED, ABSENT
    }

    /**
     * Composite primary key class for MeetingAttendee
     */
    @Data
    public static class PK implements Serializable {
        private Integer meetingId;
        private Integer accountId;
    }
}
