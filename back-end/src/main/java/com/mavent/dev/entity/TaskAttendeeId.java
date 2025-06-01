package com.mavent.dev.entity;

import lombok.EqualsAndHashCode;

import java.io.Serializable;

@EqualsAndHashCode
public class TaskAttendeeId implements Serializable {
    private Integer taskId;
    private Integer accountId;
}
