package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "task_attendees")
@IdClass(TaskAttendeeId.class)
@Data
public class TaskAttendee {

    @Id
    private Integer taskId;

    @Id
    private Integer accountId;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status {
        INVITED, ACCEPTED, DECLINED, ATTENDED
    }
}
