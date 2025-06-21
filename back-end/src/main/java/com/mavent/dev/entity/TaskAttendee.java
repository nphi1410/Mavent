package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity
@Table(name = "task_attendees")
@IdClass(TaskAttendee.PK.class)
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

    @Data
    public static class PK implements Serializable {
        private Integer taskId;
        private Integer accountId;
    }
}
