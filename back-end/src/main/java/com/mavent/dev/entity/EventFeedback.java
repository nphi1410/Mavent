package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(EventFeedback.PK.class)
public class EventFeedback {

    @Id
    private Integer eventId;

    @Id
    private Integer accountId;

    private Integer rating;

    private String comment;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class PK implements Serializable {
        private Integer eventId;
        private Integer accountId;
    }
}
